'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import ConnectionStatus from './ConnectionStatus'
import { socket } from '@/lib/socket'

export default function StartTextChatPage() {
  const [connectionTime, setConnectionTime] = useState(0)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [commonInterests, setCommonInterests] = useState<string[]>([])
  const [status, setStatus] =
    useState<'searching' | 'connected'>('searching')
  const [interests, setInterests] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  // ✅ LOAD INTERESTS ON PAGE LOAD
  useEffect(() => {
    const saved = localStorage.getItem('omegle_interests')
    if (saved) {
      try {
        setInterests(JSON.parse(saved))
      } catch {}
    }
  }, [])

  // 🔌 SOCKET INIT + MATCHMAKING
  useEffect(() => {
    if (!socket.connected) socket.connect()

    socket.emit('find', { interests })

    const onMatched = ({
      roomId,
      commonInterests,
    }: {
      roomId: string
      commonInterests: string[]
    }) => {
      setRoomId(roomId)
      setCommonInterests(commonInterests || [])
      setMessages(['Stranger connected'])
      setStatus('connected')
    }

    const onMessage = (msg: string) => {
      setMessages((prev) => [...prev, `Stranger: ${msg}`])
    }

    const onStrangerLeft = () => {
      restartSearch()
    }

    socket.on('matched', onMatched)
    socket.on('message', onMessage)
    socket.on('stranger_left', onStrangerLeft)

    return () => {
      socket.off('matched', onMatched)
      socket.off('message', onMessage)
      socket.off('stranger_left', onStrangerLeft)
    }
  }, [interests])

  // ⏱️ TIMER
  useEffect(() => {
    if (status !== 'searching') return

    setConnectionTime(0)
    const timer = setInterval(() => {
      setConnectionTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [status])

  const restartSearch = () => {
    setStatus('searching')
    setRoomId(null)
    setMessages([])
    setCommonInterests([])
    setConnectionTime(0)
    socket.emit('find', { interests })
  }

  const sendMessage = () => {
    if (!roomId || !inputRef.current) return
    const text = inputRef.current.value.trim()
    if (!text) return
    inputRef.current.value = ''
    socket.emit('message', { roomId, message: text })
    setMessages((prev) => [...prev, `You: ${text}`])
  }

  const handleSkip = () => {
    if (roomId) socket.emit('leave', { roomId })
    restartSearch()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border rounded-lg p-6 space-y-4">

        <h1 className="text-xl font-bold text-center">
          {status === 'connected'
            ? 'Chatting with Stranger'
            : 'Finding a Stranger'}
        </h1>

        <ConnectionStatus
          status={status}
          connectionTime={connectionTime}
        />

        {status === 'connected' && (
          <div className="bg-muted/50 rounded-md p-3 text-sm text-muted-foreground">
            {commonInterests.length > 0 ? (
              <p>
                You both are interested in{' '}
                <span className="font-medium">
                  {commonInterests.join(', ')}
                </span>
              </p>
            ) : (
              <p>No common interests</p>
            )}
          </div>
        )}

        {status === 'connected' && (
          <>
            <div className="h-40 border rounded p-2 overflow-y-auto space-y-1">
              {messages.map((m, i) => (
                <div key={i}>{m}</div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                ref={inputRef}
                className="flex-1 border p-2 rounded"
                placeholder="Type a message"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      </div>
    </div>
  )
}

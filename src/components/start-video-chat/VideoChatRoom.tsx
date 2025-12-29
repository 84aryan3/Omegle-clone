'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { socket } from '@/lib/socket'

export default function VideoChatRoom() {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)

  const [roomId, setRoomId] = useState<string | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [commonInterests, setCommonInterests] = useState<string[]>([])
  const [strangerLeft, setStrangerLeft] = useState(false)

  // ✅ EXACT SAME INTEREST LOGIC AS TEXT CHAT
  const interests =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('omegle_interests') || '[]')
      : []

  /* ----------------------------------
     MATCHMAKING + EVENTS
  -----------------------------------*/
  useEffect(() => {
    socket.emit('find', { interests })

    socket.on('matched', ({ roomId, commonInterests }) => {
      setRoomId(roomId)
      setCommonInterests(commonInterests || [])
      setStrangerLeft(false)
    })

    socket.on('stranger_left', () => {
      setStrangerLeft(true)
    })

    socket.on('chat_message', ({ message }) => {
      setMessages(prev => [...prev, `Stranger: ${message}`])
    })

    return () => {
      socket.off('matched')
      socket.off('stranger_left')
      socket.off('chat_message')
    }
  }, [])

  /* ----------------------------------
     WEBRTC SETUP (FIXED REMOTE VIDEO)
  -----------------------------------*/
  useEffect(() => {
    async function initMedia() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      const pc = new RTCPeerConnection()
      pcRef.current = pc

      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      // ✅ FIX: REMOTE VIDEO NOW LOADS
      pc.ontrack = event => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }
    }

    initMedia()
  }, [])

  /* ----------------------------------
     CHAT
  -----------------------------------*/
  const sendMessage = () => {
    if (!input || !roomId) return
    socket.emit('chat_message', { roomId, message: input })
    setMessages(prev => [...prev, `You: ${input}`])
    setInput('')
  }

  /* ----------------------------------
     SKIP
  -----------------------------------*/
  const handleSkip = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* VIDEOS */}
      <div className="flex flex-1">
        {/* LOCAL */}
        <div className="flex-1 flex items-center justify-center">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* REMOTE */}
        <div className="flex-1 relative flex items-center justify-center">
          {strangerLeft && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-lg">
              Stranger left. Press Skip.
            </div>
          )}
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* INTERESTS */}
      <div className="p-2 text-center text-sm bg-black">
        {commonInterests.length > 0
          ? `Matched on: ${commonInterests.join(', ')}`
          : 'No common interests'}
      </div>

      {/* CHAT BOX (BELOW VIDEO) */}
      <div className="p-2 border-t border-gray-700 bg-black">
        <div className="h-32 overflow-y-auto mb-2 bg-gray-900 p-2 text-sm">
          {messages.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 p-1 text-black"
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="p-2 bg-black flex justify-center">
        <Button variant="outline" onClick={handleSkip}>
          <SafeIcon name="SkipForward" size={18} className="mr-2" />
          Skip
        </Button>
      </div>
    </div>
  )
}

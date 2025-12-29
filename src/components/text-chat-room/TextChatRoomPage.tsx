'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import SafetyBanner from '@/components/common/SafetyBanner'
import ChatStatusIndicator from '@/components/common/ChatStatusIndicator'
import ChatMessageList from './ChatMessageList'
import ChatInputForm from './ChatInputForm'
import ReportUserModal from './ReportUserModal'
import SafetyTipsModal from './SafetyTipsModal'
import { socket } from '@/lib/socket'
import type { ChatMessageModel } from '@/data/chat'

export default function TextChatRoomPage() {
  const [messages, setMessages] = useState<ChatMessageModel[]>([])
  const [chatStatus, setChatStatus] =
    useState<'connected' | 'connecting' | 'disconnected'>('connecting')

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isSafetyTipsOpen, setIsSafetyTipsOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ✅ get roomId from URL
  const roomId =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('roomId')
      : null

  // scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 🔌 SOCKET EVENTS
  useEffect(() => {
    if (!roomId) return

    setChatStatus('connected')

    const onMessage = (message: string) => {
      const msg: ChatMessageModel = {
        id: Date.now(),
        senderRole: 'Stranger',
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setMessages((prev) => [...prev, msg])
    }

    const onStrangerLeft = () => {
      setChatStatus('disconnected')

      const systemMsg: ChatMessageModel = {
        id: Date.now(),
        senderRole: 'System',
        content: 'Stranger disconnected.',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setMessages((prev) => [...prev, systemMsg])
    }

    socket.on('message', onMessage)
    socket.on('stranger_left', onStrangerLeft)

    return () => {
      socket.off('message', onMessage)
      socket.off('stranger_left', onStrangerLeft)
    }
  }, [roomId])

  // ✉️ SEND MESSAGE
  const handleSendMessage = (content: string) => {
    if (!content.trim() || !roomId || chatStatus !== 'connected') return

    const userMessage: ChatMessageModel = {
      id: Date.now(),
      senderRole: 'You',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    socket.emit('message', { roomId, message: content.trim() })
  }

  // ⏭️ SKIP (FIX 3)
  const handleSkip = () => {
    if (roomId) {
      socket.emit('leave', { roomId })
    }

    window.location.href = './start-text-chat.html'
  }

  const handleDisconnect = () => {
    if (roomId) {
      socket.emit('leave', { roomId })
    }
    window.location.href = './home-page.html'
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4 sticky top-16 z-40">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <SafeIcon name="User" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Stranger</span>
              <ChatStatusIndicator status={chatStatus} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSafetyTipsOpen(true)}
              className="gap-2"
            >
              <SafeIcon name="Shield" size={18} />
              <span className="hidden sm:inline">Safety Tips</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReportModalOpen(true)}
              className="gap-2 text-destructive"
            >
              <SafeIcon name="Flag" size={18} />
              <span className="hidden sm:inline">Report</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSkip}
              className="gap-2"
            >
              <SafeIcon name="SkipForward" size={18} />
              <span className="hidden sm:inline">Skip</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="px-4 py-3 bg-accent/5 border-b">
        <SafetyBanner variant="compact" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ChatMessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-card p-4 sticky bottom-0">
        <ChatInputForm
          onSendMessage={handleSendMessage}
          isConnected={chatStatus === 'connected'}
        />
      </div>

      {/* Modals */}
      <ReportUserModal
        isOpen={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
      />

      <SafetyTipsModal
        isOpen={isSafetyTipsOpen}
        onOpenChange={setIsSafetyTipsOpen}
      />

      <button
        onClick={handleDisconnect}
        className="hidden"
        aria-label="Disconnect"
      />
    </div>
  )
}

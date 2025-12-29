
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import SafeIcon from '@/components/common/SafeIcon'

interface ChatInputFormProps {
  onSendMessage: (message: string) => void
  isConnected: boolean
}

export default function ChatInputForm({ onSendMessage, isConnected }: ChatInputFormProps) {
  const [message, setMessage] = useState('')
  const [isClient, setIsClient] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setIsClient(false)
    const timer = setTimeout(() => {
      setIsClient(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && isConnected) {
      onSendMessage(message)
      setMessage('')
      // Focus back on textarea after sending
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (but not Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isConnected ? 'Type a message... (Enter to send, Shift+Enter for new line)' : 'Disconnected'}
        disabled={!isConnected || !isClient}
        className="resize-none min-h-12 max-h-24"
        rows={1}
      />
      <Button
        type="submit"
        disabled={!message.trim() || !isConnected || !isClient}
        size="icon"
        className="flex-shrink-0 h-12"
      >
        <SafeIcon name="Send" size={20} />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}

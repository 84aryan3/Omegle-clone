'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Mic, MicOff, Smile, Paperclip } from 'lucide-react'

type Message = {
  id: string
  text: string
  sender: 'you' | 'stranger'
  timestamp: Date
}

interface ChatBoxProps {
  messages: Message[]
  onSendMessage: (text: string) => void
  isConnected: boolean
  strangerLeft?: boolean
}

export default function ChatBox({ 
  messages, 
  onSendMessage, 
  isConnected,
  strangerLeft = false 
}: ChatBoxProps) {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const send = () => {
    if (!input.trim() || !isConnected || strangerLeft) return
    onSendMessage(input)
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const dateKey = message.timestamp.toDateString()
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(message)
    return groups
  }, {})

  return (
    <Card className="h-full flex flex-col border-gray-800 bg-gray-900/50">
      <CardHeader className="pb-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">
            Chat
            {strangerLeft && (
              <Badge variant="destructive" className="ml-2">
                Disconnected
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="px-2 py-1">
              {isConnected ? '● Connected' : '○ Disconnected'}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          {strangerLeft 
            ? "Stranger has left. You can still review the chat history."
            : "Chat with your matched stranger"
          }
        </p>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              <div className="flex justify-center my-4">
                <Badge variant="outline" className="px-3 py-1 text-xs bg-gray-800/50">
                  {formatDate(new Date(dateKey))}
                </Badge>
              </div>
              
              {dateMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%]">
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'you'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-800 text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{message.text}</p>
                      <div className={`text-xs mt-2 flex items-center ${
                        message.sender === 'you' ? 'text-blue-200 justify-end' : 'text-gray-400 justify-start'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        <span className="mx-2">•</span>
                        <span>{message.sender === 'you' ? 'You' : 'Stranger'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <Smile className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-center">
                {strangerLeft 
                  ? "Stranger left before any messages were sent"
                  : "No messages yet. Say hello to start the conversation!"
                }
              </p>
              {!strangerLeft && (
                <p className="text-sm text-gray-500 mt-2">
                  Tip: Be respectful and follow community guidelines
                </p>
              )}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4">
          {strangerLeft ? (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-4">Stranger has left the chat</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/start-video-chat'}
              >
                Find New Stranger
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full border-gray-700"
                  disabled={!isConnected}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full ${isRecording ? 'bg-red-500/20 border-red-500/30' : 'border-gray-700'}`}
                  disabled={!isConnected}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4 text-red-400" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isConnected ? "Type a message..." : "Disconnected"}
                  disabled={!isConnected}
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500"
                />
                
                <Button 
                  onClick={send} 
                  disabled={!input.trim() || !isConnected}
                  className="rounded-full bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Press Enter to send • Shift+Enter for new line
                </span>
                <span>
                  {input.length}/500
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
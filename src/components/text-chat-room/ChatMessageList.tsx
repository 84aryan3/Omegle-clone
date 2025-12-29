
import type { ChatMessageModel } from '@/data/chat'
import { cn } from '@/lib/utils'

interface ChatMessageListProps {
  messages: ChatMessageModel[]
}

export default function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
            message.senderRole === 'You' && 'flex-row-reverse'
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold',
              message.senderRole === 'You'
                ? 'bg-primary text-primary-foreground'
                : message.senderRole === 'System'
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-secondary text-secondary-foreground'
            )}
          >
            {message.senderRole === 'You' ? 'Y' : message.senderRole === 'System' ? 'S' : 'S'}
          </div>

          {/* Message Bubble */}
          <div
            className={cn(
              'flex flex-col gap-1 max-w-xs sm:max-w-md',
              message.senderRole === 'You' && 'items-end'
            )}
          >
            <div
              className={cn(
                'px-4 py-2 rounded-lg break-words',
                message.senderRole === 'You'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : message.senderRole === 'System'
                    ? 'bg-muted text-muted-foreground italic text-sm'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
              )}
            >
              {message.content}
            </div>
            <span className="text-xs text-muted-foreground px-2">{message.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

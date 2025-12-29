'use client'

import SafeIcon from './SafeIcon'
import { cn } from '@/lib/utils'

export type ChatStatus =
  | 'searching'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'

interface ChatStatusIndicatorProps {
  status: ChatStatus
}

export default function ChatStatusIndicator({ status }: ChatStatusIndicatorProps) {
  const config: Record<
    ChatStatus,
    { label: string; icon: string; spin?: boolean }
  > = {
    searching: {
      label: 'Searching',
      icon: 'Loader2',
      spin: true,
    },
    connecting: {
      label: 'Connecting',
      icon: 'Loader2',
      spin: true,
    },
    connected: {
      label: 'Connected',
      icon: 'CheckCircle',
    },
    disconnected: {
      label: 'Disconnected',
      icon: 'XCircle',
    },
    error: {
      label: 'Error',
      icon: 'AlertCircle',
    },
  }

  const { label, icon, spin } = config[status]

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <SafeIcon
        name={icon}
        size={16}
        className={cn(spin ? 'animate-spin' : '')}
      />
      <span>{label}</span>
    </div>
  )
}

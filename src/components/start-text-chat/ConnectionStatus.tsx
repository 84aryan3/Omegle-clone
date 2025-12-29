
import SafeIcon from '@/components/common/SafeIcon'

interface ConnectionStatusProps {
  status: 'searching' | 'connecting' | 'connected'
  connectionTime?: number
}

export default function ConnectionStatus({ 
  status = 'searching',
  connectionTime = 0 
}: ConnectionStatusProps) {
  const statusConfig = {
    searching: {
      label: 'Searching for a match...',
      icon: 'Search',
      color: 'text-blue-500',
      animate: true,
    },
    connecting: {
      label: 'Connecting...',
      icon: 'Loader2',
      color: 'text-amber-500',
      animate: true,
    },
    connected: {
      label: 'Connected!',
      icon: 'CheckCircle2',
      color: 'text-green-500',
      animate: false,
    },
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <SafeIcon 
        name={config.icon}
        size={20}
        className={`${config.color} ${config.animate ? 'animate-spin' : ''}`}
      />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  )
}

'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Wifi, WifiOff, Users, MessageSquare } from 'lucide-react'

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'waiting'
  commonInterests: string[]
  strangerLeft?: boolean
}

export default function ConnectionStatus({ 
  status, 
  commonInterests,
  strangerLeft = false 
}: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="h-4 w-4 text-green-500" />,
          text: 'Connected',
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          description: 'You are now connected with a stranger'
        }
      case 'connecting':
        return {
          icon: <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />,
          text: 'Connecting...',
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          description: 'Establishing connection'
        }
      case 'disconnected':
        return {
          icon: <WifiOff className="h-4 w-4 text-red-500" />,
          text: strangerLeft ? 'Stranger Left' : 'Disconnected',
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          description: strangerLeft 
            ? 'The other person has disconnected' 
            : 'Connection lost'
        }
      default:
        return {
          icon: <Users className="h-4 w-4 text-blue-500" />,
          text: 'Searching...',
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          description: 'Looking for someone to chat with'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.color}`}>
              {config.icon}
            </div>
            <div>
              <h3 className="font-medium text-white">{config.text}</h3>
              <p className="text-sm text-gray-400">{config.description}</p>
            </div>
          </div>
          
          {commonInterests.length > 0 && status === 'connected' && (
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Common interests:</span>
                <div className="flex gap-1">
                  {commonInterests.slice(0, 2).map((interest, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                    >
                      {interest}
                    </Badge>
                  ))}
                  {commonInterests.length > 2 && (
                    <Badge variant="outline" className="text-gray-400">
                      +{commonInterests.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {commonInterests.length > 0 && status === 'connected' && (
          <div className="mt-3 pt-3 border-t border-gray-800 md:hidden">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Common interests:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonInterests.map((interest, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {commonInterests.length === 0 && status === 'connected' && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">No common interests found</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
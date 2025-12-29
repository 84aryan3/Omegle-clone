
import { Card, CardContent } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface ConnectionFeedbackProps {
  status: 'searching' | 'connecting' | 'connected' | 'error'
}

export default function ConnectionFeedback({ status }: ConnectionFeedbackProps) {
  const feedbackConfig = {
    searching: {
      title: 'Finding a Stranger',
      description: 'Looking for someone to chat with...',
      icon: 'Search',
      animate: true,
      tips: [
        'Tip: Adding interests helps us find better matches',
        'Tip: Most connections happen within 10-30 seconds',
      ],
    },
    connecting: {
      title: 'Establishing Connection',
      description: 'Setting up your video stream...',
      icon: 'Loader2',
      animate: true,
      tips: [
        'Tip: Make sure your camera and microphone are working',
        'Tip: Check your internet connection speed',
      ],
    },
    connected: {
      title: 'Connected!',
      description: 'You are now connected with a stranger',
      icon: 'CheckCircle2',
      animate: false,
      tips: ['Tip: Be respectful and have fun!'],
    },
    error: {
      title: 'Connection Error',
      description: 'Unable to establish connection',
      icon: 'AlertCircle',
      animate: false,
      tips: ['Tip: Check your internet connection and try again'],
    },
  }

  const config = feedbackConfig[status]

  return (
    <Card className="mb-6 border-accent/20 bg-accent/5">
      <CardContent className="pt-6">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <SafeIcon
              name={config.icon}
              size={48}
              className={`${
                status === 'connected'
                  ? 'text-green-500'
                  : status === 'error'
                    ? 'text-destructive'
                    : 'text-primary'
              } ${config.animate ? 'animate-spin' : ''}`}
            />
          </div>

          {/* Title and Description */}
          <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
          <p className="text-sm text-muted-foreground mb-6">{config.description}</p>

          {/* Tips */}
          <div className="space-y-2">
            {config.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                <SafeIcon name="Lightbulb" size={14} className="mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          {(status === 'searching' || status === 'connecting') && (
            <div className="mt-6">
              <div className="flex gap-1 justify-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

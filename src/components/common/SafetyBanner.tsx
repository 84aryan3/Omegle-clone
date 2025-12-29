
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon'

interface SafetyBannerProps {
  variant?: 'default' | 'compact'
  className?: string
}

export default function SafetyBanner({ variant = 'default', className = '' }: SafetyBannerProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <SafeIcon name="Shield" size={16} className="text-accent" />
        <span>Chats are monitored. Keep it clean.</span>
      </div>
    )
  }

  return (
    <Alert className={`border-accent/50 bg-accent/5 ${className}`}>
      <SafeIcon name="Shield" size={18} className="text-accent" />
      <AlertDescription className="ml-2">
        <strong>Chats are monitored.</strong> Our AI + human moderation team watches for inappropriate behavior 24/7. 
        Keep conversations respectful and follow our{' '}
        <a href="./terms-of-service.html" className="underline hover:text-accent">
          community guidelines
        </a>
        .
      </AlertDescription>
    </Alert>
  )
}


'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { LIVE_CHAT_SAFETY_TIPS } from '@/data/chat'

interface SafetyTipsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function SafetyTipsModal({ isOpen, onOpenChange }: SafetyTipsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SafeIcon name="Shield" size={24} className="text-accent" />
            Safety Tips
          </DialogTitle>
          <DialogDescription>
            Keep yourself safe while chatting with strangers online.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {LIVE_CHAT_SAFETY_TIPS.map((tip) => (
            <div key={tip.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 mt-1">
                <SafeIcon name={tip.iconName} size={20} className="text-accent" />
              </div>
              <p className="text-sm text-foreground">{tip.tip}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

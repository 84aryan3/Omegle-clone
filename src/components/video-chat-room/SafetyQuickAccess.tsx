
'use client'

import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SafetyQuickAccessProps {
  onSafetyTips: () => void
}

export default function SafetyQuickAccess({ onSafetyTips }: SafetyQuickAccessProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onSafetyTips}
            size="icon"
            variant="outline"
            className="rounded-full border-white/30 hover:bg-white/10 bg-black/60 backdrop-blur"
            title="View safety tips"
          >
            <SafeIcon name="Shield" size={20} color="white" />
            <span className="sr-only">Safety tips</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-black/90 border-white/20">
          <p>Safety Tips</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

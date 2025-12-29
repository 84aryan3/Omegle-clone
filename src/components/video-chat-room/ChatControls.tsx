
'use client'

import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface ChatControlsProps {
  isAudioMuted: boolean
  isVideoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onSkip: () => void
  onReport: () => void
  isConnected: boolean
}

export default function ChatControls({
  isAudioMuted,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onSkip,
  onReport,
  isConnected,
}: ChatControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {/* Mute/Unmute Audio */}
        <Button
          onClick={onToggleAudio}
          disabled={!isConnected}
          size="lg"
          className={`rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all ${
            isAudioMuted
              ? 'bg-destructive hover:bg-destructive/90'
              : 'bg-primary hover:bg-primary/90'
          }`}
          title={isAudioMuted ? 'Unmute audio' : 'Mute audio'}
        >
          <SafeIcon
            name={isAudioMuted ? 'MicOff' : 'Mic'}
            size={24}
            color="white"
          />
        </Button>

        {/* Toggle Video */}
        <Button
          onClick={onToggleVideo}
          disabled={!isConnected}
          size="lg"
          className={`rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all ${
            !isVideoEnabled
              ? 'bg-destructive hover:bg-destructive/90'
              : 'bg-primary hover:bg-primary/90'
          }`}
          title={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
        >
          <SafeIcon
            name={isVideoEnabled ? 'Video' : 'VideoOff'}
            size={24}
            color="white"
          />
        </Button>

        {/* Skip Button */}
        <Button
          onClick={onSkip}
          disabled={!isConnected}
          size="lg"
          variant="outline"
          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-white/30 hover:bg-white/10"
          title="Skip to next stranger"
        >
          <SafeIcon name="SkipForward" size={24} color="white" />
        </Button>

        {/* Report Button */}
        <Button
          onClick={onReport}
          disabled={!isConnected}
          size="lg"
          variant="outline"
          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-destructive/50 hover:bg-destructive/10"
          title="Report user"
        >
          <SafeIcon name="Flag" size={24} color="hsl(0 84% 60%)" />
        </Button>
      </div>

      {/* Secondary Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white"
          onClick={() => window.location.href = './home-page.html'}
        >
          <SafeIcon name="Home" size={16} className="mr-1" />
          <span className="hidden sm:inline">Home</span>
        </Button>
        <span className="text-white/30">•</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white"
          onClick={() => window.location.href = './faq-page.html'}
        >
          <SafeIcon name="HelpCircle" size={16} className="mr-1" />
          <span className="hidden sm:inline">FAQ</span>
        </Button>
      </div>
    </div>
  )
}

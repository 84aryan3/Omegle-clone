
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface PermissionRequestProps {
  cameraPermission: 'idle' | 'requesting' | 'granted' | 'denied'
  micPermission: 'idle' | 'requesting' | 'granted' | 'denied'
  onRequestPermissions: () => void
  isLoading: boolean
}

export default function PermissionRequest({
  cameraPermission,
  micPermission,
  onRequestPermissions,
  isLoading,
}: PermissionRequestProps) {
  const getPermissionIcon = (status: string) => {
    switch (status) {
      case 'granted':
        return <SafeIcon name="CheckCircle2" size={20} className="text-green-500" />
      case 'denied':
        return <SafeIcon name="XCircle" size={20} className="text-destructive" />
      case 'requesting':
        return <SafeIcon name="Loader2" size={20} className="text-primary animate-spin" />
      default:
        return <SafeIcon name="Circle" size={20} className="text-muted-foreground" />
    }
  }

  const getPermissionLabel = (status: string) => {
    switch (status) {
      case 'granted':
        return 'Granted'
      case 'denied':
        return 'Denied'
      case 'requesting':
        return 'Requesting...'
      default:
        return 'Not requested'
    }
  }

  return (
    <Card className="mb-6 border-accent/20 bg-accent/5">
      <CardHeader>
        <CardTitle className="text-lg">Camera & Microphone Access</CardTitle>
        <CardDescription>
          We need permission to access your camera and microphone for video chat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Permission */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
          <div className="flex items-center gap-3">
            <SafeIcon name="Camera" size={20} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Camera</p>
              <p className="text-xs text-muted-foreground">Video input device</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getPermissionIcon(cameraPermission)}
            <span className="text-xs font-medium text-muted-foreground w-16 text-right">
              {getPermissionLabel(cameraPermission)}
            </span>
          </div>
        </div>

        {/* Microphone Permission */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
          <div className="flex items-center gap-3">
            <SafeIcon name="Mic" size={20} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Microphone</p>
              <p className="text-xs text-muted-foreground">Audio input device</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getPermissionIcon(micPermission)}
            <span className="text-xs font-medium text-muted-foreground w-16 text-right">
              {getPermissionLabel(micPermission)}
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 bg-background rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Privacy:</strong> Your camera and microphone are only active during the chat. 
            We don't record or store your video/audio.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

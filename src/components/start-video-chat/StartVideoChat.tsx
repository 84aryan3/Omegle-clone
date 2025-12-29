'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from '@/components/common/SafeIcon'
import ChatStatusIndicator from '@/components/common/ChatStatusIndicator'
import SafetyBanner from '@/components/common/SafetyBanner'
import PermissionRequest from '@/components/start-video-chat/PermissionRequest'
import ConnectionFeedback from '@/components/start-video-chat/ConnectionFeedback'
import { socket } from '@/lib/socket'

type PermissionStatus = 'idle' | 'requesting' | 'granted' | 'denied'
type ConnectionStatus = 'searching' | 'connecting' | 'connected' | 'error'

export default function StartVideoChat() {
  const [isClient, setIsClient] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>('idle')
  const [micPermission, setMicPermission] = useState<PermissionStatus>('idle')
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('searching')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [interests, setInterests] = useState<string[]>([])

  // 🔹 Load interests from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('omegle_interests')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          // Clean and validate interests
          const cleanedInterests = parsed
            .map((interest: string) => interest.trim())
            .filter((interest: string) => interest.length > 0)
            .slice(0, 10) // Limit to 10 interests
          
          setInterests(cleanedInterests)
          console.log('Loaded interests:', cleanedInterests)
        }
      } catch (error) {
        console.error('Failed to parse interests:', error)
        setInterests([])
      }
    } else {
      console.log('No interests found in localStorage')
    }
    setIsClient(true)
  }, [])

  // 🔌 SOCKET MATCHMAKING
  useEffect(() => {
    if (!permissionsGranted) return
    
    if (!socket.connected) {
      socket.connect()
    }

    setConnectionStatus('searching')

    // Send interests for matching
    socket.emit('find', {
      interests: interests,
      mode: 'video',
    })

    const onMatched = ({ roomId, commonInterests }: { roomId: string, commonInterests: string[] }) => {
      console.log('Matched! Room:', roomId, 'Common interests:', commonInterests)
      setConnectionStatus('connected')

      // Store common interests in session for display
      sessionStorage.setItem('current_match_interests', JSON.stringify(commonInterests))

      // Redirect to video chat room
      setTimeout(() => {
        window.location.href = `/video-chat-room`
      }, 1500)
    }

    socket.on('matched', onMatched)

    return () => {
      socket.off('matched', onMatched)
    }
  }, [permissionsGranted, interests])

  const handleRequestPermissions = async () => {
    try {
      setCameraPermission('requesting')
      setMicPermission('requesting')

      // Request both permissions together for better UX
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: { 
          echoCancellation: true, 
          noiseSuppression: true,
          autoGainControl: true
        },
      })

      setCameraPermission('granted')
      setMicPermission('granted')

      // Stop tracks immediately after permission check
      stream.getTracks().forEach(track => track.stop())

      setPermissionsGranted(true)
      setConnectionStatus('searching')
    } catch (error) {
      const err = error as Error
      console.error('Permission error:', err)
      
      // Check which permission was denied
      try {
        // Try to get video only
        await navigator.mediaDevices.getUserMedia({ video: true })
        setCameraPermission('granted')
        setMicPermission('denied')
      } catch (videoError) {
        setCameraPermission('denied')
        
        // Try to get audio only
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true })
          setMicPermission('granted')
        } catch (audioError) {
          setMicPermission('denied')
        }
      }

      setErrorMessage(
        'Camera and/or microphone access is required for video chat. ' +
        'Please enable permissions in your browser settings and try again.'
      )
      setConnectionStatus('error')
    }
  }

  const handleCancel = () => {
    if (socket.connected) {
      socket.disconnect()
    }
    window.location.href = '/'
  }

  const showPermissionRequest =
    !permissionsGranted && (isClient || cameraPermission === 'idle')
  const showConnectionFeedback =
    permissionsGranted || (isClient && connectionStatus !== 'error')
  const showError = connectionStatus === 'error' && isClient

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <SafeIcon name="Video" size={32} color="white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Start Video Chat</h1>
          <p className="text-muted-foreground">
            Connect with strangers for live video conversations
          </p>
          
          {/* Display interests if available */}
          {interests.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Your interests:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {interests.slice(0, 5).map((interest, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {interest}
                  </span>
                ))}
                {interests.length > 5 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    +{interests.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Safety Banner */}
        <div className="mb-6">
          <SafetyBanner variant="compact" />
        </div>

        {/* Permission Request */}
        {(showPermissionRequest || !isClient) && (
          <PermissionRequest
            cameraPermission={cameraPermission}
            micPermission={micPermission}
            onRequestPermissions={handleRequestPermissions}
            isLoading={
              cameraPermission === 'requesting' ||
              micPermission === 'requesting'
            }
          />
        )}

        {/* Connection Feedback */}
        {showConnectionFeedback && permissionsGranted && (
          <ConnectionFeedback status={connectionStatus} />
        )}

        {/* Error State */}
        {showError && (
          <Alert variant="destructive" className="mb-6">
            <SafeIcon name="AlertCircle" size={18} />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Status Indicator */}
        {(showConnectionFeedback || !isClient) && (
          <div className="flex justify-center mb-6">
            <ChatStatusIndicator status={connectionStatus} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            disabled={connectionStatus === 'connecting' && isClient}
          >
            <SafeIcon name="X" size={18} className="mr-2" />
            Cancel
          </Button>

          {!permissionsGranted && (
            <Button
              onClick={handleRequestPermissions}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={
                cameraPermission === 'requesting' ||
                micPermission === 'requesting'
              }
            >
              {cameraPermission === 'requesting' ||
              micPermission === 'requesting' ? (
                <>
                  <SafeIcon
                    name="Loader2"
                    size={18}
                    className="mr-2 animate-spin"
                  />
                  Requesting...
                </>
              ) : (
                <>
                  <SafeIcon name="Camera" size={18} className="mr-2" />
                  Allow Camera & Mic
                </>
              )}
            </Button>
          )}
        </div>

        {/* Info Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> 
            {interests.length > 0 
              ? ` You'll be matched with people who share interests like: ${interests.slice(0, 3).join(', ')}${interests.length > 3 ? '...' : ''}`
              : ' No interests selected. You will be randomly matched.'}
          </p>
          <p className="text-xs text-blue-600 mt-2">
            You can set interests in text chat mode first if you want specific matches.
          </p>
        </div>

        {/* Browser Support Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Browser Support:</strong> Works best on Chrome, Firefox, Safari, or Edge.
            Make sure your camera and microphone are properly connected.
          </p>
        </div>
      </div>
    </div>
  )
}
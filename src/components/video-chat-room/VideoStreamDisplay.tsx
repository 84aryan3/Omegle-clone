'use client'

import { useEffect, useRef } from 'react'

interface VideoStreamDisplayProps {
  stream?: MediaStream | null
  isMuted?: boolean
  label?: string
  videoRef?: React.RefObject<HTMLVideoElement>
}

export default function VideoStreamDisplay({
  stream,
  isMuted = false,
  label = 'Stranger',
  videoRef,
}: VideoStreamDisplayProps) {
  const internalVideoRef = useRef<HTMLVideoElement>(null)
  const actualVideoRef = videoRef || internalVideoRef

  useEffect(() => {
    const videoElement = actualVideoRef.current
    if (!videoElement || !stream) return

    // Clean up previous stream
    if (videoElement.srcObject) {
      const oldStream = videoElement.srcObject as MediaStream
      oldStream.getTracks().forEach(track => {
        if (track.readyState === 'live') {
          track.stop()
        }
      })
    }

    // Set new stream
    videoElement.srcObject = stream
    
    // Handle video loading
    const handleLoadedMetadata = () => {
      console.log(`${label} video loaded successfully`)
      videoElement.play().catch(e => console.error(`Play error for ${label}:`, e))
    }

    const handleError = (e: Event) => {
      console.error(`${label} video error:`, e)
    }

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoElement.addEventListener('error', handleError)

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoElement.removeEventListener('error', handleError)
    }
  }, [stream, label, actualVideoRef])

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {stream ? (
        <video
          ref={actualVideoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="text-center">
            <div className="text-4xl mb-4">
              {label === 'Stranger' ? '👤' : '📹'}
            </div>
            <p className="text-gray-400">
              {label === 'Stranger' ? 'Waiting for stranger...' : 'Your camera'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import SafetyBanner from '@/components/common/SafetyBanner'
import SafetyQuickAccess from '@/components/video-chat-room/SafetyQuickAccess'
import { socket } from '@/lib/socket'
import { Video, VideoOff, Mic, MicOff, SkipForward, Flag, MessageSquare, PhoneOff } from 'lucide-react'

type ConnectionStatusType = 'connecting' | 'connected' | 'disconnected' | 'waiting'

type Message = {
  id: string
  text: string
  sender: 'you' | 'stranger'
  timestamp: Date
}

export default function VideoChatContainer() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatusType>('waiting')

  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const [roomId, setRoomId] = useState<string | null>(null)
  const [commonInterests, setCommonInterests] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [strangerLeft, setStrangerLeft] = useState(false)

  const messageInputRef = useRef<HTMLInputElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 🎥 INITIALIZE MEDIA (Camera & Mic)
  const initializeMedia = useCallback(async () => {
    try {
      console.log('Requesting media permissions...')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      console.log('Media stream obtained:', stream)
      setLocalStream(stream)

      // Attach stream to video element immediately
      if (localVideoRef.current) {
        console.log('Attaching local stream to video element')
        localVideoRef.current.srcObject = stream
        localVideoRef.current.muted = true
        localVideoRef.current.play().catch(e => console.error('Error playing local video:', e))
      }

      // Initialize WebRTC Peer Connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ]
      })
      pcRef.current = pc

      // Add local tracks to peer connection
      stream.getTracks().forEach(track => {
        console.log('Adding track:', track.kind)
        pc.addTrack(track, stream)
      })

      // Handle remote stream
      pc.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind)
        if (event.streams && event.streams[0]) {
          const remoteStream = event.streams[0]
          setRemoteStream(remoteStream)
          
          if (remoteVideoRef.current) {
            console.log('Attaching remote stream to video element')
            remoteVideoRef.current.srcObject = remoteStream
            remoteVideoRef.current.play().catch(e => console.error('Error playing remote video:', e))
          }
        }
      }

      // ICE Candidate handling
      pc.onicecandidate = (event) => {
        if (event.candidate && roomId) {
          socket.emit('webrtc_ice', {
            roomId,
            candidate: event.candidate,
          })
        }
      }

      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState)
      }

      pc.onconnectionstatechange = () => {
        console.log('Peer connection state:', pc.connectionState)
      }

    } catch (error) {
      console.error('Error accessing media devices:', error)
      alert('Unable to access camera/microphone. Please check permissions.')
    }
  }, [roomId])

  // Initialize media on component mount
  useEffect(() => {
    initializeMedia()

    return () => {
      // Cleanup
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
      if (pcRef.current) {
        pcRef.current.close()
      }
    }
  }, [])

  // 🔌 SOCKET CONNECTION AND MATCHMAKING
  useEffect(() => {
    if (!socket.connected) socket.connect()

    const handleMatched = async ({ roomId, commonInterests }: { roomId: string, commonInterests: string[] }) => {
      console.log('Matched! Room:', roomId, 'Interests:', commonInterests)
      setRoomId(roomId)
      setCommonInterests(commonInterests || [])
      setConnectionStatus('connected')
      setStrangerLeft(false)

      // Join the room
      socket.emit('join_room', { roomId })

      // Create and send offer
      if (pcRef.current) {
        try {
          const offer = await pcRef.current.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          })
          await pcRef.current.setLocalDescription(offer)
          socket.emit('webrtc_offer', { roomId, offer })
        } catch (error) {
          console.error('Error creating offer:', error)
        }
      }
    }

    const handleWebRTCOffer = async (offer: RTCSessionDescriptionInit) => {
      if (!pcRef.current) return
      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await pcRef.current.createAnswer()
        await pcRef.current.setLocalDescription(answer)
        socket.emit('webrtc_answer', { roomId, answer })
      } catch (error) {
        console.error('Error handling offer:', error)
      }
    }

    const handleWebRTCAnswer = async (answer: RTCSessionDescriptionInit) => {
      try {
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(answer))
      } catch (error) {
        console.error('Error handling answer:', error)
      }
    }

    const handleWebRTCIce = (candidate: RTCIceCandidateInit) => {
      try {
        pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate))
      } catch (error) {
        console.error('Error adding ICE candidate:', error)
      }
    }

    const handleMessage = (msg: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: msg,
        sender: 'stranger',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, newMessage])
    }

    const handleStrangerLeft = () => {
      console.log('Stranger left the room')
      setStrangerLeft(true)
      setConnectionStatus('disconnected')
      
      // Stop remote stream
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop())
        setRemoteStream(null)
      }
      
      // Add system message
      const systemMessage: Message = {
        id: Date.now().toString(),
        text: 'Stranger has left the chat',
        sender: 'stranger',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, systemMessage])
    }

    // Start searching for a match
    const interests = JSON.parse(localStorage.getItem('omegle_interests') || '[]')
    socket.emit('find', { interests })
    setConnectionStatus('connecting')

    // Set up event listeners
    socket.on('matched', handleMatched)
    socket.on('webrtc_offer', handleWebRTCOffer)
    socket.on('webrtc_answer', handleWebRTCAnswer)
    socket.on('webrtc_ice', handleWebRTCIce)
    socket.on('message', handleMessage)
    socket.on('stranger_left', handleStrangerLeft)

    return () => {
      socket.off('matched', handleMatched)
      socket.off('webrtc_offer', handleWebRTCOffer)
      socket.off('webrtc_answer', handleWebRTCAnswer)
      socket.off('webrtc_ice', handleWebRTCIce)
      socket.off('message', handleMessage)
      socket.off('stranger_left', handleStrangerLeft)
    }
  }, [remoteStream])

  // Update local video when stream changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
      localVideoRef.current.muted = true
    }
  }, [localStream])

  // Update remote video when stream changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const handleToggleAudio = () => {
    if (!localStream) return
    const audioTracks = localStream.getAudioTracks()
    audioTracks.forEach(track => {
      track.enabled = isAudioMuted
    })
    setIsAudioMuted(!isAudioMuted)
  }

  const handleToggleVideo = () => {
    if (!localStream) return
    const videoTracks = localStream.getVideoTracks()
    videoTracks.forEach(track => {
      track.enabled = !isVideoEnabled
    })
    setIsVideoEnabled(!isVideoEnabled)
  }

  const handleSkip = () => {
    if (roomId) {
      socket.emit('leave', { roomId })
    }
    window.location.href = '/start-video-chat'
  }

  const handleReport = () => {
    window.location.href = '/report-user'
  }

  const handleSafetyTips = () => {
    window.location.href = '/safety-tips'
  }

  const sendMessage = () => {
    if (!roomId || !messageInputRef.current || strangerLeft) return
    const text = messageInputRef.current.value.trim()
    if (!text) return

    messageInputRef.current.value = ''
    socket.emit('message', { roomId, message: text })
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'you',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black">
      {/* Top Bar */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
              connectionStatus === 'disconnected' ? 'bg-red-500' :
              'bg-yellow-500 animate-pulse'
            }`} />
            <div>
              <h1 className="font-semibold text-white">Video Chat</h1>
              <p className="text-sm text-gray-400">
                {connectionStatus === 'connected' ? 'Connected with stranger' :
                 connectionStatus === 'disconnected' ? 'Disconnected' :
                 'Searching for someone...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {commonInterests.length > 0 ? (
              <>
                <span className="text-sm text-gray-300">Matched on:</span>
                <div className="flex gap-1">
                  {commonInterests.slice(0, 2).map((interest, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-0"
                    >
                      {interest}
                    </Badge>
                  ))}
                  {commonInterests.length > 2 && (
                    <Badge className="bg-gray-800 text-gray-300 border-0">
                      +{commonInterests.length - 2}
                    </Badge>
                  )}
                </div>
              </>
            ) : (
              <span className="text-sm text-gray-400">No common interests</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Video Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Stranger Video */}
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {!remoteStream && !strangerLeft && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-gray-400">Waiting for stranger's video...</p>
                      </div>
                    </div>
                  )}
                  
                  {strangerLeft && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 p-4">
                      <div className="text-center">
                        <PhoneOff className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Stranger has left
                        </h3>
                        <p className="text-gray-400 mb-6">
                          The other person has disconnected
                        </p>
                        <Button 
                          onClick={handleSkip} 
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <SkipForward className="mr-2 h-4 w-4" />
                          Skip & Find New Stranger
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-black/70 text-white border-0">
                      Stranger
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Video */}
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {!localStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="text-center">
                        <div className="text-4xl mb-4">📹</div>
                        <p className="text-gray-400">Your camera preview</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-black/70 text-white border-0">
                      You
                      {isAudioMuted && ' 🔇'}
                      {!isVideoEnabled && ' 📷❌'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-0">
              <div className="flex flex-col h-96">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-400" />
                      <h3 className="font-semibold text-white">Chat</h3>
                    </div>
                    <div className="text-sm text-gray-400">
                      {messages.length} message{messages.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-4">💬</div>
                        <p className="text-gray-400">
                          {strangerLeft 
                            ? "Stranger left before any messages were sent"
                            : "Say hello to start the conversation!"
                          }
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              msg.sender === 'you'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-800 text-gray-100 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <div className={`text-xs mt-1 ${
                              msg.sender === 'you' ? 'text-blue-200' : 'text-gray-400'
                            }`}>
                              {formatTime(msg.timestamp)}
                              <span className="mx-2">•</span>
                              {msg.sender === 'you' ? 'You' : 'Stranger'}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-gray-800 p-4">
                  {strangerLeft ? (
                    <div className="text-center py-3">
                      <p className="text-gray-400">Stranger has left. Find a new stranger to chat.</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        ref={messageInputRef}
                        type="text"
                        placeholder="Type a message..."
                        disabled={connectionStatus !== 'connected'}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={connectionStatus !== 'connected'}
                        className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 disabled:opacity-50"
                      >
                        Send
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="border-t border-gray-800 bg-gray-900/50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SafetyBanner variant="compact" />
              <SafetyQuickAccess onSafetyTips={handleSafetyTips} />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAudio}
                className={`rounded-full ${isAudioMuted ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}
              >
                {isAudioMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span className="ml-2">{isAudioMuted ? 'Unmute' : 'Mute'}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleVideo}
                className={`rounded-full ${!isVideoEnabled ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}
              >
                {!isVideoEnabled ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                <span className="ml-2">{!isVideoEnabled ? 'Show Video' : 'Hide Video'}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReport}
                className="rounded-full border-red-500/30 text-red-300 hover:bg-red-500/20"
              >
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleSkip}
                className="rounded-full bg-blue-500 hover:bg-blue-600"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Skip
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
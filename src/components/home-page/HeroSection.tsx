import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SafeIcon from '@/components/common/SafeIcon'
import SafetyBanner from '@/components/common/SafetyBanner'
import { SUGGESTED_INTERESTS } from '@/data/home'

export default function HeroSection() {
  const [isClient, setIsClient] = useState(true)
  const [interests, setInterests] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // ✅ LOAD SAVED INTERESTS
  useEffect(() => {
    const saved = localStorage.getItem('omegle_interests')
    if (saved) {
      try {
        setSelectedTags(JSON.parse(saved))
      } catch {}
    }
  }, [])

  // ✅ SAVE INTERESTS ON CHANGE
  useEffect(() => {
    localStorage.setItem('omegle_interests', JSON.stringify(selectedTags))
  }, [selectedTags])

  useEffect(() => {
    setIsClient(false)
    
    const timer = requestAnimationFrame(() => {
      setIsClient(true)
    })

    return () => cancelAnimationFrame(timer)
  }, [])

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  const handleAddCustomInterest = () => {
    if (interests.trim() && !selectedTags.includes(interests.trim())) {
      setSelectedTags([...selectedTags, interests.trim()])
      setInterests('')
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-12 md:py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main headline */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
            Talk to Strangers
            <span className="block text-transparent bg-clip-text bg-gradient-primary">
              Safely & Anonymously
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-6 text-balance max-w-2xl mx-auto">
            Welcome to Omegle Web - resurrected from the legendary Omegle. 
            Connect instantly through random video or text chat. Completely free, no registration, 
            with modern safety features and AI moderation.
          </p>

          <SafetyBanner variant="default" className="mb-8" />
        </div>

        {/* Chat type selection */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Button 
              asChild 
              size="lg" 
              className="h-14 text-base font-semibold gap-2"
            >
              <a href="./start-text-chat.html">
                <SafeIcon name="MessageCircle" size={20} />
                Text Chat
              </a>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="h-14 text-base font-semibold gap-2"
            >
              <a href="./start-video-chat.html">
                <SafeIcon name="Video" size={20} />
                Video Chat
              </a>
            </Button>
          </div>

          {/* Interest input section */}
          <div className="bg-card border rounded-lg p-6 shadow-soft">
            <label className="block text-sm font-semibold mb-3">
              Add your interests (optional)
            </label>

            <p className="text-sm text-muted-foreground mb-4">
              Type what you're into to get matched with people who vibe with that. 
              Better matches = better conversations!
            </p>

            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="e.g., anime, skateboarding, lofi hip hop..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCustomInterest()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleAddCustomInterest} variant="outline" size="sm">
                <SafeIcon name="Plus" size={18} />
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Popular interests:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_INTERESTS.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleAddTag(tag.name)}
                    className="px-3 py-1 text-sm rounded-full border border-primary/30 hover:bg-primary/10 transition-colors"
                  >
                    + {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {(selectedTags.length > 0 || isClient) && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive transition-colors"
                    >
                      <SafeIcon name="X" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              💡 Tip: Be specific! "lofi hip hop" gets better matches than just "music"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

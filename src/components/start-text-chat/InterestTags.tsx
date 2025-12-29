
import { Badge } from '@/components/ui/badge'

interface InterestsTagsProps {
  interests: string[]
}

export default function InterestsTags({ interests }: InterestsTagsProps) {
  if (!interests || interests.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Your interests:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {interests.map((interest, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {interest}
          </Badge>
        ))}
      </div>
    </div>
  )
}

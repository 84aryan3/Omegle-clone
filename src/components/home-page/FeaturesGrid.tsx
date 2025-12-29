
import FeatureCard from './FeatureCard'
import { PLATFORM_FEATURES } from '@/data/home'

export default function FeaturesGrid() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why We're Different (And Better)
          </h2>
          <p className="text-lg text-muted-foreground">
            We took what made Omegle legendary and actually made it safe without killing the vibe. 
            Think of us as Omegle's cooler younger sibling who learned from their mistakes.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

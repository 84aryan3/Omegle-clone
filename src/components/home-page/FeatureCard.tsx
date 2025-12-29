
import SafeIcon from '@/components/common/SafeIcon'
import type { FeatureCardModel } from '@/data/home'

interface FeatureCardProps {
  feature: FeatureCardModel
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:border-primary/50">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <SafeIcon 
            name={feature.iconName} 
            size={24} 
            className="text-primary"
          />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  )
}

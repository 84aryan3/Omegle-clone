
import SafeIcon from '@/components/common/SafeIcon'
import { GOOD_FOR_LIST } from '@/data/home'

export default function GoodForSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Good For:</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Whether you're looking to practice languages, meet people from around the world, 
            or just kill some boredom, Omegle Web has you covered.
          </p>

          {/* List items */}
          <div className="space-y-4">
            {GOOD_FOR_LIST.map((item, index) => {
              const [title, description] = item.split(' - ')
              return (
                <div 
                  key={index}
                  className="flex gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-primary">
                      <SafeIcon name="CheckCircle2" size={16} color="white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

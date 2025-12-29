
import SafeIcon from '@/components/common/SafeIcon'
import { USAGE_TIPS } from '@/data/home'

export default function TipsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pro Tips for Better Chats
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Want to have better conversations? Follow these tips to make the most of your Omegle Web experience.
          </p>

          {/* Tips grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {USAGE_TIPS.map((tip, index) => (
              <div 
                key={index}
                className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-soft hover:shadow-card transition-all duration-300 group"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Tip number */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary mb-4">
                    <span className="text-white font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>

                  {/* Tip text */}
                  <p className="text-foreground leading-relaxed">
                    {tip.tipText}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 p-8 rounded-lg border-2 border-primary/20 bg-primary/5 text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to Start Chatting?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              No sign-up, no download, no BS. Just click below and start talking to strangers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="./start-text-chat.html"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <SafeIcon name="MessageCircle" size={20} />
                Start Text Chat
              </a>
              <a 
                href="./start-video-chat.html"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
              >
                <SafeIcon name="Video" size={20} />
                Start Video Chat
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

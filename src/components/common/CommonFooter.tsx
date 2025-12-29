
import SafeIcon from '@/components/common/SafeIcon'

interface CommonFooterProps {
  variant?: 'full' | 'minimal'
}

export default function CommonFooter({ variant = 'full' }: CommonFooterProps) {
  const currentYear = new Date().getFullYear()

  const legalLinks = [
    { name: 'Terms of Service', href: './terms-of-service.html' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Community Guidelines', href: '#guidelines' },
  ]

  const resourceLinks = [
    { name: 'FAQ', href: './faq-page.html' },
    { name: 'Safety Tips', href: './safety-tips-modal.html' },
    { name: 'Parental Controls', href: 'https://www.connectsafely.org/controls/' },
  ]

  if (variant === 'minimal') {
    return (
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Omegle Web. Chats are monitored. Keep it clean.</p>
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <SafeIcon name="Video" size={20} color="white" />
              </div>
              <span className="font-bold text-xl">Omegle Web</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              Anonymous, free random chat - resurrected with modern safety features. 
              Connect instantly through video or text chat, completely free.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <SafeIcon name="Shield" size={16} className="text-accent" />
              <span className="text-muted-foreground">AI + Human moderation 24/7</span>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Omegle Web. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <SafeIcon name="Eye" size={16} />
              Chats are monitored. Keep it clean.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

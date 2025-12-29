
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

interface CommonHeaderProps {
  variant?: 'default' | 'minimal'
}

export default function CommonHeader({ variant = 'default' }: CommonHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: './home-page.html' },
    { name: 'FAQ', href: './faq-page.html' },
    { name: 'Safety', href: './safety-tips-modal.html' },
  ]

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : 'bg-background'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="./home-page.html" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <SafeIcon name="Video" size={20} color="white" />
          </div>
          <span className="font-bold text-xl">Omegle Web</span>
        </a>

        {/* Desktop Navigation */}
        {variant === 'default' && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Button asChild size="sm" className="ml-2">
              <a href="./home-page.html">Start Chatting</a>
            </Button>
          </nav>
        )}

        {/* Mobile Navigation */}
        {variant === 'default' && (
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <SafeIcon name="Menu" size={24} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <Button asChild className="mt-4">
                  <a href="./home-page.html">Start Chatting</a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  )
}

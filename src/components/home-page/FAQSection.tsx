
import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HOMEPAGE_FAQS } from '@/data/home'

export default function FAQSection() {
  const [isClient, setIsClient] = useState(true)

  useEffect(() => {
    setIsClient(false)
    
    const timer = requestAnimationFrame(() => {
      setIsClient(true)
    })

    return () => cancelAnimationFrame(timer)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Common Questions
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Got questions? We've got answers. Check out our FAQ or{' '}
            <a href="./faq-page.html" className="text-primary hover:underline">
              view all FAQs
            </a>
            .
          </p>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {HOMEPAGE_FAQS.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={`faq-${faq.id}`}
                className="border-b border-border/50"
              >
                <AccordionTrigger className="hover:text-primary transition-colors py-4">
                  <span className="text-left font-semibold">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* View all FAQs link */}
          <div className="mt-8 text-center">
            <a 
              href="./faq-page.html"
              className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
            >
              View all FAQs
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

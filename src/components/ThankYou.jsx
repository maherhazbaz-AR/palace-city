import { useEffect, useRef } from 'react'
import { animate } from 'motion'
import { Phone } from 'lucide-react'
import { AdityaramLogo } from './Logos'
import { RoyalOrn } from './Ornaments'
import ThemeToggle from './ThemeToggle'
import Footer from './Footer'
import { MEDIA } from '../data/content'
import { PHONE_LABEL, PHONE_TEL, btn, cx, wrap } from '../lib/ui'
import { useInternalLink } from '../lib/route'
import { prefersReducedMotion } from '../lib/site'

const STEPS = [
  { title: 'We call you', text: 'Our sales team phones you to confirm a time for your visit and answer your questions.' },
  { title: 'We share the details', text: 'You receive the price list, brochure, floor plans and the villas currently available.' },
  { title: 'You visit the show villa', text: 'Walk through a finished Palace City villa at Akkarai, East Coast Road, with our team.' },
]

/** Where visitors land after the lead form is accepted. Not indexed; it has its own URL for conversion tracking. */
export default function ThankYou() {
  const goHome = useInternalLink('/')
  const content = useRef(null)
  const firstName = (window.history.state?.name || '').trim().split(/\s+/)[0]

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Thank you | Adityaram Palace City'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.append(robots)
    return () => {
      document.title = previousTitle
      robots.remove()
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion() || !content.current) return
    animate(content.current.children, { opacity: [0, 1], y: [14, 0] }, { duration: 0.6, delay: (i) => i * 0.08, ease: [0.22, 1, 0.36, 1] })
  }, [])

  return (
    <>
      <header className="border-b border-line">
        <div className={cx(wrap, 'flex items-center justify-between py-4')}>
          <a href="/" onClick={goHome} aria-label="Adityaram Properties, Palace City home" className="block leading-[0]">
            <AdityaramLogo className="block aspect-[2476/647] h-10 w-auto max-md:h-8" />
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="bg-sand">
        <div className={cx(wrap, 'grid items-center gap-[clamp(2rem,6vw,5rem)] py-[clamp(3.5rem,9vw,7rem)] md:grid-cols-[1.1fr_.9fr]')}>
          <div ref={content}>
            <RoyalOrn />
            <h1 className="mt-1 text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] text-ink">
              {firstName ? `Thank you, ${firstName}.` : 'Thank you.'}
            </h1>
            <p className="mt-5 mb-0 max-w-[46ch] text-[1.15rem] text-muted">
              Your request has reached the Palace City team. We’ll be in touch shortly.
            </p>

            <ol className="mt-10 mb-0 max-w-[52ch] list-none p-0">
              {STEPS.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2.2rem_1fr] gap-x-3 border-t border-line py-4">
                  <span className="font-display text-[1.25rem] leading-[1.3] text-gold lining-nums">{i + 1}</span>
                  <div>
                    <h2 className="font-body text-[1rem] leading-[1.4] font-semibold text-ink">{step.title}</h2>
                    <p className="mt-1 mb-0 text-[.95rem] leading-[1.6] text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a className={btn('maroon', 'lg', 'max-phablet:w-full')} href={PHONE_TEL}>
                <Phone size={17} strokeWidth={1.8} aria-hidden="true" />
                Call {PHONE_LABEL}
              </a>
              <a className={btn('line', 'lg', 'max-phablet:w-full')} href="/" onClick={goHome}>
                Back to Palace City
              </a>
            </div>
          </div>

          <figure className="relative m-0 max-md:order-first">
            <img
              src={MEDIA.heroPoster}
              alt="A Palace City villa at Akkarai, East Coast Road"
              className="aspect-[4/5] w-full rounded object-cover max-md:aspect-[16/10]"
            />
            <span className="pointer-events-none absolute inset-[10px] rounded-[2px] border border-[rgba(240,214,140,.6)]" />
          </figure>
        </div>
      </main>
      <Footer />
    </>
  )
}

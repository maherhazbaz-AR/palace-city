import { useEffect } from 'react'
import { animate, inView, stagger } from 'motion'
import { prefersReducedMotion } from '../lib/site'

const easeRoyal = [0.22, 1, 0.36, 1]

/**
 * Page-wide Motion effects (motion.dev):
 *  - hero entrance            [data-hero-item], [data-hero-bar]
 *  - scroll reveals           [data-reveal]  (only for elements below the fold)
 *  - count-up for "72%"       [data-countup]
 *  - pulsing map marker       [data-pulse]
 * Everything is skipped when the visitor prefers reduced motion.
 */
export function useMotionEffects() {
  useEffect(() => {
    const root = document.documentElement
    const done = () => root.classList.remove('mp')
    if (prefersReducedMotion()) {
      done()
      return
    }
    const $$ = (s) => Array.from(document.querySelectorAll(s))
    const stops = []

    // Hero entrance: the words settle in, then the trust bar fades up
    animate($$('[data-hero-item]'), { opacity: [0, 1], y: [12, 0], filter: ['blur(4px)', 'blur(0px)'] }, {
      duration: 0.5,
      delay: stagger(0.1, { startDelay: 0.25 }),
      ease: 'easeOut',
    })
    animate('[data-hero-bar]', { opacity: [0, 1] }, { duration: 0.6, delay: 0.8, ease: 'easeOut' })
    requestAnimationFrame(done)

    // Scroll reveals: hide what is below the fold, reveal it as it enters
    $$('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) return // already on screen: leave it
      el.style.opacity = '0'
      stops.push(
        inView(
          el,
          () => {
            const sibs = el.parentElement ? Array.from(el.parentElement.children) : [el]
            const i = Math.max(0, sibs.indexOf(el))
            animate(el, { opacity: [0, 1], y: [12, 0], filter: ['blur(4px)', 'blur(0px)'] }, {
              duration: 0.45,
              delay: Math.min(i, 6) * 0.1,
              ease: 'easeOut',
            })
          },
          { amount: 0.15 },
        ),
      )
    })

    // Count-up for percentage figures
    $$('[data-countup]').forEach((dt) => {
      const m = dt.textContent.match(/^(\d+)%$/)
      if (!m) return
      const end = +m[1]
      stops.push(
        inView(
          dt,
          () => {
            animate(0, end, { duration: 1.4, ease: easeRoyal, onUpdate: (v) => (dt.textContent = Math.round(v) + '%') })
          },
          { amount: 0.6 },
        ),
      )
    })

    // Pulsing marker on the map
    const ring = document.querySelector('[data-pulse]')
    const pulse = ring && animate(ring, { scale: [1, 1.9], opacity: [0.9, 0] }, { duration: 2.2, repeat: Infinity, ease: 'easeOut' })

    return () => {
      stops.forEach((s) => s())
      pulse?.stop()
    }
  }, [])
}

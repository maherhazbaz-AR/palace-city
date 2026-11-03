import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'motion'
import { AdityaramLogo } from './Logos'
import ThemeToggle from './ThemeToggle'
import { NAV_LINKS } from '../data/content'
import { btn, cx } from '../lib/ui'
import { prefersReducedMotion, useJump, useSite } from '../lib/site'

const easeRoyal = [0.22, 1, 0.36, 1]
const easeClass = 'ease-[cubic-bezier(.22,1,.36,1)]'
const HIDE_AFTER = 320 // px scrolled before the nav may tuck away on scroll-down
const HIDE_DISTANCE = 24 // continuous downward travel before the nav tucks away
const SHOW_DISTANCE = 12 // continuous upward travel before the nav comes back
const PEEK_ENTER = 80 // pointer this close to the top edge reveals a tucked nav
const PEEK_LEAVE = 140 // ...and must move this far down before it tucks again

const bar = cx(
  'absolute top-1/2 left-[11px] h-px w-[22px] bg-current transition-transform duration-300',
  easeClass,
)

/** scrollY clamped to the real scroll range, so rubber-band overscroll (iOS, trackpads) reads as no movement. */
function clampedScrollY() {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  return Math.min(Math.max(window.scrollY, 0), max)
}

/**
 * Tracks "scrolled past the hero" and whether the nav should tuck away.
 * Hiding and showing are driven by continuous travel in one direction (reset whenever the
 * direction flips), not by a single frame's delta, so slow scrolls and jitter behave the same.
 */
function useScrollState() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = clampedScrollY()
    let travel = 0 // signed: positive = down, negative = up
    let frame = 0

    const update = () => {
      frame = 0
      const y = clampedScrollY()
      const delta = y - lastY
      lastY = y
      setScrolled(y > 40)

      if (y <= HIDE_AFTER) {
        travel = 0
        setHidden(false)
        return
      }
      if (delta === 0) return

      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta
      if (travel >= HIDE_DISTANCE) setHidden(true)
      else if (travel <= -SHOW_DISTANCE) setHidden(false)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return { scrolled, hidden }
}

/** On mouse/trackpad devices, reveals the nav while the pointer sits near the top edge of the window. */
function usePointerPeek() {
  const [peek, setPeek] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = (e) => {
      if (e.clientY < PEEK_ENTER) setPeek(true)
      else if (e.clientY > PEEK_LEAVE) setPeek(false)
    }
    // relatedTarget is null only when the pointer leaves the document itself.
    const onOut = (e) => {
      if (!e.relatedTarget) setPeek(false)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return peek
}

/** Highlights the nav link whose section sits in the middle of the viewport. */
function useActiveSection(ids) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [ids])

  return active
}

const linkIds = NAV_LINKS.map((l) => l.id)

export default function Nav() {
  const { menuOpen, setMenuOpen } = useSite()
  const jumpTo = useJump()
  const menuBtn = useRef(null)
  const list = useRef(null)
  const { scrolled, hidden } = useScrollState()
  const active = useActiveSection(linkIds)
  const peek = usePointerPeek()

  const solid = scrolled || menuOpen
  const tucked = hidden && !menuOpen && !peek

  // Escape closes the mobile menu and returns focus to the toggle.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuBtn.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, setMenuOpen])

  // Lock page scroll behind the full-height mobile menu.
  useEffect(() => {
    if (!menuOpen) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = prev
    }
  }, [menuOpen])

  // Staggered reveal of menu items.
  useEffect(() => {
    if (menuOpen && list.current && !prefersReducedMotion()) {
      animate(
        list.current.children,
        { opacity: [0, 1], y: [18, 0] },
        { duration: 0.55, delay: stagger(0.06, { startDelay: 0.08 }), ease: easeRoyal },
      )
    }
  }, [menuOpen])

  return (
    <header
      id="nav"
      className={cx(
        'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)]',
        'transition-[background-color,box-shadow,translate] duration-500 motion-reduce:transition-none',
        easeClass,
        // Only keyboard focus pins the nav open: a mouse click leaves focus on the link, and
        // focus-within would then keep the bar on screen until something else took focus.
        tucked ? '-translate-y-full has-[:focus-visible]:translate-y-0' : 'translate-y-0',
        // Over the hero photo the nav stays transparent with fixed dark text; once solid it follows the theme.
        solid
          ? 'bg-ground/80 text-ink shadow-[0_10px_30px_-24px_var(--color-shadow)] backdrop-blur-xl backdrop-saturate-150'
          : 'bg-transparent text-black',
      )}
    >
      <div
        className={cx(
          'mx-auto flex max-w-[1240px] items-center gap-8 px-6 transition-[padding] duration-500 max-nav:gap-4',
          easeClass,
          scrolled ? 'py-3' : 'py-[1.35rem]',
        )}
      >
        <a
          className="block shrink-0 leading-[0]"
          aria-label="Adityaram Properties, Palace City home"
          {...jumpTo('top', '#top')}
        >
          <AdityaramLogo
            className={cx(
              'block aspect-[2476/647] h-11 w-auto origin-left transition-transform duration-500 max-md:h-9 max-mini:h-[30px]',
              easeClass,
              scrolled && 'scale-[.86]',
            )}
          />
        </a>

        <ul
          id="navLinks"
          ref={list}
          className={cx(
            'ml-auto flex list-none items-center gap-[2.4rem] p-0',
            // Mobile: full-height sheet under the bar
            'max-nav:absolute max-nav:inset-x-0 max-nav:top-full max-nav:ml-0 max-nav:min-h-[calc(100dvh-4.5rem)]',
            'max-nav:flex-col max-nav:items-stretch max-nav:gap-0 max-nav:overflow-y-auto',
            'max-nav:bg-ground max-nav:px-[clamp(1.25rem,4vw,2.5rem)] max-nav:pt-6 max-nav:pb-[max(2rem,env(safe-area-inset-bottom))] max-md:px-5',
            menuOpen
              ? 'max-nav:visible max-nav:opacity-100 max-nav:[transition:opacity_.3s]'
              : 'max-nav:invisible max-nav:opacity-0 max-nav:[transition:opacity_.25s,visibility_0s_.25s]',
          )}
        >
          {NAV_LINKS.map((l, i) => {
            const isActive = active === l.id
            return (
              <li key={l.id}>
                <a
                  className={cx(
                    'group relative inline-flex min-h-11 items-center text-inherit no-underline transition-opacity duration-300',
                    // Desktop: small caps-style tracked labels
                    'text-[.74rem] font-medium tracking-[.16em] uppercase',
                    isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100 focus-visible:opacity-100',
                    // Mobile: large editorial rows with an index number
                    'max-nav:flex max-nav:w-full max-nav:items-baseline max-nav:gap-4 max-nav:border-b max-nav:border-line',
                    'max-nav:py-5 max-nav:text-[1.65rem] max-nav:font-light max-nav:tracking-[-.01em] max-nav:normal-case max-nav:opacity-100',
                  )}
                  aria-current={isActive ? 'location' : undefined}
                  {...jumpTo(l.id, `#${l.id}`)}
                >
                  <span className="hidden text-[.72rem] font-medium tracking-[.14em] text-accent tabular-nums max-nav:inline">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative">
                    {l.label}
                    <span
                      aria-hidden
                      className={cx(
                        'absolute -bottom-1.5 left-0 h-px w-full origin-left bg-current transition-transform duration-500 max-nav:hidden',
                        easeClass,
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100',
                      )}
                    />
                  </span>
                </a>
              </li>
            )
          })}

          {/* The header CTA is hidden on small screens, so surface it inside the sheet instead. */}
          <li className="mt-auto hidden pt-10 max-sm:block">
            <a className={btn('maroon', 'md', 'w-full justify-center')} {...jumpTo('lead', '#enquire')}>
              Book a private tour 
            </a>
          </li>
        </ul>

        <span aria-hidden className="h-5 w-px bg-current opacity-20 max-nav:hidden" />

        <div className="flex items-center gap-3 max-nav:ml-auto">
          <a
            className={btn(
              'maroon',
              'md',
              'tracking-[.04em] shadow-[0_8px_20px_-12px_var(--color-shadow)] transition-[transform,box-shadow] duration-300 hover:-translate-y-px active:translate-y-0 max-sm:hidden max-md:min-h-10 max-md:px-[.9rem] max-md:py-[.55rem] max-md:text-[.85rem] rounded-lg',
            )}
            {...jumpTo('lead', '#enquire')}
          >
            <span className="max-md:hidden">Book a private tour</span>
            <span className="hidden max-md:inline">Book a visit</span>
          </a>

          <ThemeToggle />

          <button
            ref={menuBtn}
            type="button"
            className="relative hidden size-11 cursor-pointer border-0 bg-transparent p-0 text-inherit max-nav:block"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="navLinks"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={cx(bar, menuOpen ? '[transform:rotate(45deg)]' : '[transform:translateY(-4px)]')} />
            <span className={cx(bar, menuOpen ? '[transform:rotate(-45deg)]' : '[transform:translateY(4px)]')} />
          </button>
        </div>
      </div>

      {/* Hairline accent rule that fades in once the bar turns solid */}
      <span
        aria-hidden
        className={cx(
          'pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-500',
          '[background:linear-gradient(90deg,transparent,var(--color-accent),transparent)]',
          solid ? 'opacity-40' : 'opacity-0',
        )}
      />
    </header>
  )
}
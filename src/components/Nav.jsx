import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'motion'
import { AdityaramLogo } from './Logos'
import ThemeToggle from './ThemeToggle'
import { NAV_LINKS } from '../data/content'
import { btn, cx } from '../lib/ui'
import { prefersReducedMotion, useJump, useSite } from '../lib/site'

const easeRoyal = [0.22, 1, 0.36, 1]
const bar = 'my-[5px] block h-[1.5px] bg-current transition-[transform,opacity] duration-[250ms] ease-[ease]'

export default function Nav() {
  const { menuOpen, setMenuOpen } = useSite()
  const jumpTo = useJump()
  const menuBtn = useRef(null)
  const list = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || menuOpen

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

  useEffect(() => {
    if (menuOpen && !prefersReducedMotion()) {
      animate(list.current.children, { opacity: [0, 1], x: [-14, 0] }, { duration: 0.4, delay: stagger(0.05), ease: easeRoyal })
    }
  }, [menuOpen])

  return (
    <header
      id="nav"
      className={cx(
        'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,box-shadow] duration-300 ease-[ease]',
        // Over the hero photo the nav stays transparent with fixed dark text; once solid it follows the theme.
        solid
          ? 'bg-ground/90 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-md'
          : 'bg-transparent text-black',
      )}
    >
      <div className="mx-auto flex max-w-[1240px] items-center gap-8 px-6 py-[1.1rem] max-nav:gap-4">
        <a className="block leading-[0]" aria-label="Adityaram Properties, Palace City home" {...jumpTo('top', '#top')}>
          <AdityaramLogo className="block aspect-[2476/647] h-11 w-auto max-md:h-9 max-mini:h-[30px]" />
        </a>

        <ul
          id="navLinks"
          ref={list}
          className={cx(
            'ml-auto flex list-none gap-[2.2rem] p-0',
            'max-nav:absolute max-nav:inset-x-0 max-nav:top-full max-nav:ml-0 max-nav:flex-col max-nav:gap-0',
            'max-nav:bg-ground/98 max-nav:px-[clamp(1.25rem,4vw,2.5rem)] max-nav:pt-2 max-nav:pb-5 max-md:px-5',
            'max-nav:shadow-[0_18px_30px_-20px_color-mix(in_srgb,var(--color-shadow)_40%,transparent)]',
            menuOpen
              ? 'max-nav:visible max-nav:opacity-100 max-nav:[transform:none] max-nav:[transition:opacity_.2s,transform_.2s]'
              : 'max-nav:invisible max-nav:opacity-0 max-nav:[transform:translateY(-8px)] max-nav:[transition:opacity_.2s,transform_.2s,visibility_0s_.2s]',
          )}
        >
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                className={cx(
                  'inline-flex min-h-11 items-center py-2 text-[.92rem] font-normal text-inherit no-underline hover:text-accent hover:underline',
                  'max-nav:flex max-nav:border-t max-nav:border-line max-nav:py-[.85rem] max-nav:text-[1.05rem] max-md:block',
                )}
                {...jumpTo(l.id, `#${l.id}`)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          className={btn(
            'maroon',
            'md',
            'max-nav:ml-auto max-sm:hidden max-md:min-h-10 max-md:px-[.9rem] max-md:py-[.55rem] max-md:text-[.85rem]',
          )}
          {...jumpTo('lead', '#enquire')}
        >
          <span className="max-md:hidden">Book a private tour</span>
          <span className="hidden max-md:inline">Book a visit</span>
        </a>

        <ThemeToggle className="max-sm:ml-auto" />

        <button
          ref={menuBtn}
          type="button"
          className="hidden size-11 cursor-pointer border-0 bg-transparent p-[10px] text-inherit max-nav:block"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="navLinks"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={cx(bar, menuOpen && '[transform:translateY(6.5px)_rotate(45deg)]')} />
          <span className={cx(bar, menuOpen && 'opacity-0')} />
          <span className={cx(bar, menuOpen && '[transform:translateY(-6.5px)_rotate(-45deg)]')} />
        </button>
      </div>
    </header>
  )
}
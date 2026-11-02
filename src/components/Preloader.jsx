import { useEffect, useState } from 'react'
import { MEDIA } from '../data/content'
import { cx } from '../lib/ui'
import { prefersReducedMotion } from '../lib/site'

/* Same markup and classes as the splash in index.html (styles live there), so the hand-off
   from the static splash to this component is invisible. */
const FLEUR =
  'M20 2C14 10 14 18 20 24 26 18 26 10 20 2ZM18 22C10 24 4 18 6 12 9 15 13 16 16 15 14 18 15 21 18 22ZM22 22C30 24 36 18 34 12 31 15 27 16 24 15 26 18 25 21 22 22ZM11 24H29V27H11ZM17 28C17 32 14 35 12 37H28C26 35 23 32 23 28Z'

const MAX_WAIT_MS = 5000
const FADE_MS = 600

/** Resolves when the web fonts are ready, ignoring failures. */
const fontsReady = () => (document.fonts?.ready ?? Promise.resolve()).catch(() => {})

/** Resolves when the hero poster has loaded (or failed: the page should still open). */
const heroReady = () =>
  new Promise((resolve) => {
    const image = new Image()
    image.onload = image.onerror = resolve
    image.src = MEDIA.heroPoster
  })

/**
 * Loading screen shown until the fonts and hero image are ready (never longer than MAX_WAIT_MS).
 * `onReady` fires as soon as the page can be revealed, `onDone` once the fade-out has finished.
 */
export default function Preloader({ onReady, onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    let cancelled = false
    let fadeTimer

    const reveal = () => {
      if (cancelled) return
      cancelled = true
      document.documentElement.style.overflow = ''
      onReady()
      if (prefersReducedMotion()) return onDone()
      setLeaving(true)
      fadeTimer = setTimeout(onDone, FADE_MS)
    }

    const failsafe = setTimeout(reveal, MAX_WAIT_MS)
    Promise.all([fontsReady(), heroReady()]).then(reveal)

    return () => {
      cancelled = true
      clearTimeout(failsafe)
      clearTimeout(fadeTimer)
      document.documentElement.style.overflow = ''
    }
  }, [onReady, onDone])

  return (
    <div id="boot" className={cx('boot', leaving && 'boot--out')} role="status" aria-live="polite" aria-label="Loading Adityaram Palace City">
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path fill="currentColor" d={FLEUR} />
      </svg>
      <p className="boot-name">Palace City</p>
      <div className="boot-bar" />
    </div>
  )
}

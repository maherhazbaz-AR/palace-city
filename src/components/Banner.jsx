import { cx, wrap } from '../lib/ui'
import { useJump } from '../lib/site'

/*
 * Palace-themed announcement banner.
 *
 * Mobile / desktop switch: 768px. The layout (stacked vs side by side) and the two images all
 * flip at this one width, using the complementary pair `min-[768px]:` / its absence, so they can
 * never disagree. (The site's "phablet" breakpoint is 621px, so it is not used here.)
 *
 * Visual language: maroon ground with a faint gold jali (lattice) screen, images set in a
 * gilded double frame with filigree corners, and the text on a framed "royal plaque" crowned
 * by a lotus medallion. All ornaments are inline SVG, so there are no extra requests.
 */

/** Artwork sizes the WordPress banner images are made at (desktop/tablet 12:5, mobile 3:4); they reserve space while loading. */
const DESKTOP_SIZE = { width: 1920, height: 800 }
const MOBILE_SIZE = { width: 768, height: 1024 }

/** Faint repeating jali lattice drawn in gold, used as the section's background texture. */
const JALI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg fill='none' stroke='%23E9CD7B' stroke-width='.8'%3E%3Cpath d='M28 4 52 28 28 52 4 28Z'/%3E%3Cpath d='M28 16a12 12 0 0 1 12 12 12 12 0 0 1-12 12 12 12 0 0 1-12-12 12 12 0 0 1 12-12Z'/%3E%3Cpath d='M28 22l6 6-6 6-6-6Z'/%3E%3Cpath d='M0 0l8 8M56 0l-8 8M0 56l8-8M56 56l-8-8'/%3E%3C/g%3E%3C/svg%3E\")"

/** Links to another site open in a new tab; same-site, tel: and mailto: links stay in the page. */
const isExternal = (href) => {
  try {
    const url = new URL(href, window.location.href)
    return /^https?:$/.test(url.protocol) && url.origin !== window.location.origin
  } catch {
    return false
  }
}

/* ---------- Ornaments ---------- */

const CORNER_POSITIONS = {
  tl: 'top-0 left-0',
  tr: 'top-0 right-0 -scale-x-100',
  bl: 'bottom-0 left-0 -scale-y-100',
  br: 'bottom-0 right-0 -scale-100',
}

/** Gilded filigree bracket for a frame corner. */
function Corner({ at, className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={cx('pointer-events-none absolute text-[#E9CD7B]', CORNER_POSITIONS[at], className)}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M3 61V24Q3 3 24 3h37" strokeWidth="1.6" />
        <path d="M10 61V28Q10 10 28 10h33" strokeWidth=".8" opacity=".7" />
        <path d="M17 17q9-2 12 6-8 3-12-6Z" strokeWidth="1" />
        <path d="M17 17q-2 9 6 12 3-8-6-12Z" strokeWidth="1" />
      </g>
      <path d="M17 13l4 4-4 4-4-4Z" fill="currentColor" />
      <circle cx="61" cy="3" r="1.6" fill="currentColor" />
      <circle cx="3" cy="61" r="1.6" fill="currentColor" />
    </svg>
  )
}

/** Four corners at once. */
function Corners({ className }) {
  return ['tl', 'tr', 'bl', 'br'].map((at) => <Corner key={at} at={at} className={className} />)
}

/** Small lotus used in the crest and dividers. */
function Lotus({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 24" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
        <path d="M20 2c4 5 4 12 0 20-4-8-4-15 0-20Z" />
        <path d="M20 22c-3-6-9-10-16-10 2 6 8 10 16 10Z" />
        <path d="M20 22c3-6 9-10 16-10-2 6-8 10-16 10Z" />
      </g>
      <circle cx="20" cy="22" r="1.4" fill="currentColor" />
    </svg>
  )
}

/** Gold rule with a central diamond, used under the title. */
function Divider({ className }) {
  return (
    <div aria-hidden="true" className={cx('flex items-center gap-3 text-[#E9CD7B]', className)}>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-current" />
      <svg viewBox="0 0 12 12" className="size-2.5">
        <path d="M6 0l6 6-6 6-6-6Z" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-current opacity-80" />
      <svg viewBox="0 0 12 12" className="size-2.5">
        <path d="M6 0l6 6-6 6-6-6Z" fill="none" stroke="currentColor" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-current" />
    </div>
  )
}

/** Gilded double frame laid over an image. */
function GildedFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-3 border border-[rgba(233,205,123,.7)] min-[768px]:inset-5" />
      <div className="absolute inset-[18px] border border-[rgba(233,205,123,.3)] min-[768px]:inset-[28px]" />
      <div className="absolute inset-3 min-[768px]:inset-5">
        <Corners className="size-10 -translate-px min-[768px]:size-16" />
      </div>
      {/* soft vignette so the frame reads on light artwork */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(40,6,10,.45)]" />
    </div>
  )
}

/* ---------- Banner ---------- */

/**
 * Announcement banner. WordPress (Dashboard > Banner) controls everything; there is no built-in text.
 * Renders nothing while loading, if the request failed, if the banner is switched off, or if it is empty.
 *
 * - `image` (desktop and tablet) shows from 768px up; `imageMobile` shows below 768px.
 *   Neither stands in for the other: if one is missing, that screen size shows no image.
 *   Each image is full width at its own proportions, never cropped, and only the one in range is downloaded.
 * - Tag, title and text appear only when filled in, on a framed plaque under the image.
 * - The button appears only when the link has a label. A link with an address opens it; without one it scrolls to the enquiry form.
 */
export default function Banner({ status, wp }) {
  const jumpTo = useJump()
  if (status !== 'ready' || !wp || wp.enabled === false) return null

  const { tag, title, text, image, imageMobile, imageAlt } = wp
  const label = wp.link?.label
  const href = wp.link?.href
  const hasCopy = Boolean(tag || title || text)
  const showStrip = Boolean(hasCopy || label)
  if (!showStrip && !image && !imageMobile) return null

  const external = href && isExternal(href)
  const linkProps = href
    ? { href, ...(external && { target: '_blank', rel: 'noopener' }) }
    : jumpTo('lead', '#enquire')

  return (
    <section
      id="banner"
      aria-label="Announcement"
      // Hide the whole banner at screen sizes where it would have nothing to show (e.g. only a mobile image on desktop).
      className={cx(
        'relative isolate overflow-hidden bg-maroon text-[#FBF3E4]',
        !(imageMobile || showStrip) && 'hidden min-[768px]:block',
        !(image || showStrip) && 'min-[768px]:hidden',
      )}
    >
      {/* Jali screen + warm glow behind everything */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[.07]" style={{ backgroundImage: JALI }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(233,205,123,.18),transparent_60%),radial-gradient(ellipse_at_50%_100%,rgba(0,0,0,.35),transparent_65%)]"
      />
      {/* Gold edge bands, like palace cornices */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,transparent,#E9CD7B_20%,#F6E7B4_50%,#E9CD7B_80%,transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-[linear-gradient(90deg,transparent,#E9CD7B_20%,#F6E7B4_50%,#E9CD7B_80%,transparent)]" />

      {image && (
        <figure data-reveal className="relative m-0 mx-auto hidden max-w-[1920px] min-[768px]:block">
          <img
            className="block h-auto w-full"
            src={image}
            {...DESKTOP_SIZE}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
          />
          <GildedFrame />
        </figure>
      )}
      {imageMobile && (
        <figure data-reveal className="relative m-0 min-[768px]:hidden">
          <img className="block h-auto w-full" src={imageMobile} {...MOBILE_SIZE} alt={imageAlt} loading="lazy" decoding="async" />
          <GildedFrame />
        </figure>
      )}

      {showStrip && (
        <div className="relative px-4 py-[clamp(3rem,6vw,4.5rem)]">
          <div className={cx(wrap, 'relative')}>
            {/* The plaque */}
            <div
              className={cx(
                'relative border border-[rgba(233,205,123,.6)] bg-[linear-gradient(180deg,rgba(60,8,14,.55),rgba(40,4,10,.35))]',
                'px-6 pt-12 pb-9 shadow-[0_30px_60px_-30px_rgba(0,0,0,.6),inset_0_0_0_6px_rgba(110,20,28,.6),inset_0_0_0_7px_rgba(233,205,123,.28)]',
                'min-[768px]:px-14 min-[768px]:pt-14 min-[768px]:pb-12',
              )}
            >
              <Corners className="size-9 min-[768px]:size-12" />

              {/* Lotus crest sitting on the top border */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(233,205,123,.7)] bg-maroon text-[#E9CD7B] shadow-[0_0_0_5px_var(--color-maroon,#6E141C),0_0_0_6px_rgba(233,205,123,.35)]"
              >
                <Lotus className="w-8" />
              </div>

              <div
                className={cx(
                  'flex flex-col items-center gap-x-12 gap-y-8 text-center',
                  'min-[768px]:flex-row min-[768px]:items-center min-[768px]:text-left',
                  !hasCopy && 'min-[768px]:justify-center',
                )}
              >
                {hasCopy && (
                  <div data-reveal className="max-w-[46rem] min-w-0 flex-1">
                    {tag && (
                      <p className="mt-0 mb-3 inline-flex items-center gap-3 font-display text-[.8rem] font-semibold tracking-[.32em] text-gold-soft uppercase">
                        <span aria-hidden="true" className="h-px w-6 bg-current opacity-70" />
                        {tag}
                        <span aria-hidden="true" className="h-px w-6 bg-current opacity-70 min-[768px]:hidden" />
                      </p>
                    )}
                    {title && (
                      <h2 className="bg-[linear-gradient(180deg,#FFF6DD_0%,#F3DE9C_55%,#D9B65F_100%)] bg-clip-text text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.1] text-balance text-transparent">
                        {title}
                      </h2>
                    )}
                    {title && (text || tag) && <Divider className="mt-4 justify-center min-[768px]:justify-start" />}
                    {text && <p className="mt-4 mb-0 text-[1.02rem] leading-relaxed text-pretty text-[rgba(251,243,228,.85)]">{text}</p>}
                  </div>
                )}

                {label && (
                  <a
                    data-reveal
                    {...linkProps}
                    className={cx(
                      'group relative inline-flex w-full shrink-0 items-center justify-center gap-3 overflow-hidden min-[768px]:w-auto',
                      'bg-[linear-gradient(135deg,#F6E7B4_0%,#D9B65F_45%,#B98E3A_70%,#E9CD7B_100%)] px-9 py-4',
                      'font-display text-[.95rem] font-semibold tracking-[.18em] text-maroon uppercase no-underline',
                      'shadow-[0_10px_30px_-10px_rgba(233,205,123,.55),inset_0_1px_0_rgba(255,255,255,.5)]',
                      'transition-[transform,box-shadow] duration-300 ease-out',
                      'hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(233,205,123,.75),inset_0_1px_0_rgba(255,255,255,.5)] active:scale-[.97]',
                      'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6E7B4]',
                      // inner hairline border
                      'before:pointer-events-none before:absolute before:inset-[4px] before:border before:border-[rgba(110,20,28,.35)]',
                      // light sweep on hover
                      'after:pointer-events-none after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:skew-x-[-20deg] after:bg-white/40 after:opacity-0',
                      'after:transition-[left,opacity] after:duration-700 hover:after:left-[120%] hover:after:opacity-100',
                      'motion-reduce:transition-none motion-reduce:after:hidden motion-reduce:hover:translate-y-0',
                    )}
                  >
                    <span aria-hidden="true" className="text-[.7em]">◆</span>
                    <span className="relative">{label}</span>
                    <span aria-hidden="true" className="text-[.7em]">◆</span>
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
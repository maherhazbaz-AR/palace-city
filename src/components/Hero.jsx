import { PalaceCityLogo } from './Logos'
import { RoyalOrn } from './Ornaments'
import { MEDIA, RERA, TRUST } from '../data/content'
import { btn, cx, wrap } from '../lib/ui'
import { prefersReducedMotion, useJump } from '../lib/site'

/*
 * The film is mostly cream marble and white facades, so a flat overlay either
 * dulls it or leaves the copy unreadable. The scrim is shaped instead: an
 * ellipse of shade behind the centred copy, a band at the top so the nav reads
 * on bright frames, and a lift at the bottom for the trust bar.
 * Class strings are written out in full so Tailwind can detect them.
 */
const scrim = cx(
  'pointer-events-none absolute inset-0',
  'bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,color-mix(in_srgb,var(--color-ink-deep)_62%,transparent),transparent_100%),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-ink-deep)_45%,transparent),transparent_22%),linear-gradient(to_top,color-mix(in_srgb,var(--color-ink-deep)_78%,transparent),transparent_35%)]',
  'max-md:bg-[radial-gradient(ellipse_90%_45%_at_50%_52%,color-mix(in_srgb,var(--color-ink-deep)_66%,transparent),transparent_100%),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-ink-deep)_45%,transparent),transparent_20%),linear-gradient(to_top,color-mix(in_srgb,var(--color-ink-deep)_85%,transparent),transparent_40%)]',
)

const legible = '[text-shadow:0_1px_2px_rgba(0,0,0,.35)]'
const enter = 'mp:opacity-0'

export default function Hero() {
  const jumpTo = useJump()
  const heroBtn = 'min-w-[196px] max-md:w-full max-md:min-w-0 short-land:min-h-11 short-land:px-[1.3rem] short-land:py-[.7rem]'

  return (
    <section
      id="top"
      className={cx(
        'relative grid min-h-svh grid-rows-[1fr_auto] overflow-hidden text-center text-cream',
        'bg-sand-deep bg-cover bg-center bg-no-repeat',
        // gilt picture-frame hairline, inset from the viewport edge
        'before:pointer-events-none before:absolute before:inset-4 before:z-[2] before:border before:border-gold-soft/30 max-md:before:inset-2',
        'pt-[calc(env(safe-area-inset-top,0px)_+_76px)] max-tablet:pt-[calc(env(safe-area-inset-top,0px)_+_6.5rem)] max-md:pt-[calc(env(safe-area-inset-top,0px)_+_64px)]',
      )}
      style={{ backgroundImage: `url(${MEDIA.heroPoster})` }}
    >
      {!prefersReducedMotion() && (
        <video
          className="absolute inset-0 size-full object-cover"
          src={MEDIA.heroFilm}
          poster={MEDIA.heroPoster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
        />
      )}

      <div aria-hidden="true" className={scrim} />

      {/* Grid row 1 (1fr) holds the stack; place-items-center centres it both ways. */}
      <div className={cx(wrap, 'relative z-[1] grid w-full place-items-center py-[clamp(2rem,6vh,4rem)] short-land:py-4')}>
        <div className="grid max-w-[720px] justify-items-center">
          <h1 data-hero-item className={cx('m-0 leading-none font-normal', enter)}>
            <PalaceCityLogo className="mx-auto block h-auto w-[min(690px,80vw)] [filter:drop-shadow(0_1px_1px_rgba(40,22,6,.55))_drop-shadow(0_6px_24px_rgba(20,10,4,.45))] max-md:w-[min(480px,90vw)] short-wide:w-[min(480px,56vw)] short-land:w-[min(340px,44vw)] " />
          </h1>

          <div data-hero-item className={cx('mt-[clamp(1.25rem,3vh,1.75rem)] short-land:hidden', enter)}>
            <RoyalOrn center tight />
          </div>

          <p
            data-hero-item
            className={cx(
              legible,
              enter,
              'm-0 max-w-[40ch] text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.6] font-medium text-balance text-cream',
              'short-land:mt-3 short-land:text-[.92rem]',
            )}
          >
            Neo-classical 4 and 5 BHK villas from <span className="font-bold whitespace-nowrap">₹5 Cr*</span> at Akkarai,
            East Coast Road, Chennai.
          </p>

          <div
            data-hero-item
            className={cx(
              enter,
              'mt-[clamp(1.75rem,4vh,2.25rem)] grid grid-cols-2 gap-3',
              'max-md:w-full max-md:max-w-[360px] max-md:grid-cols-1 short-land:mt-4',
            )}
          >
            <a className={btn('maroon', 'md', cx('rounded-lg', heroBtn))} {...jumpTo('lead', '#enquire')}>
              Book a private tour
            </a>
            <a className={btn('glass', 'md', cx('rounded-lg', heroBtn))} {...jumpTo('walkthrough', '#walkthrough')}>
              <svg className="size-[13px]" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
              </svg>
              Watch the walkthrough
            </a>
          </div>
        </div>
      </div>

      <div data-hero-bar className={cx('relative z-[1] pb-[calc(1.5rem_+_env(safe-area-inset-bottom,0px))]', enter)}>
        <div className={cx(wrap, 'w-full md:px-24')}>
          <div className="grid justify-items-center gap-3 border-t border-gold-soft/35 pt-5">
            <ul
              className={cx(
                legible,
                'm-0 flex list-none flex-wrap justify-center gap-x-8 gap-y-2 p-0 text-[.86rem] font-semibold tracking-[.01em] text-cream',
                'max-md:grid max-md:w-full max-md:grid-cols-2 max-md:text-left max-md:gap-x-4 max-md:text-[.8rem]',
              )}
            >
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-[.6rem] max-md:items-start max-md:before:mt-[.5em] before:size-[5px] before:flex-none before:rotate-45 before:bg-gold-soft">
                  {t}
                </li>
              ))}
            </ul>
            <p className={cx(legible, 'm-0 text-[.76rem] font-medium tracking-[.02em] text-cream/75 tabular-nums max-md:text-[.72rem]')}>
              {RERA}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

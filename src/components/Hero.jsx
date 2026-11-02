import { PalaceCityLogo } from './Logos'
import { MEDIA, RERA, TRUST } from '../data/content'
import { btn, cx, wrap } from '../lib/ui'
import { prefersReducedMotion, useJump } from '../lib/site'

const softGlow = '[text-shadow:0_1px_14px_rgba(0,0,0,.35)]'
const darkGlow = '[text-shadow:0_1px_10px_rgba(0,0,0,.4)]'

export default function Hero() {
  const jumpTo = useJump()
  const heroBtn = 'min-w-[236px] [text-shadow:none] max-md:w-full max-md:min-w-0 short-land:min-h-11 short-land:px-[1.3rem] short-land:py-[.7rem]'

  return (
    <section
      id="top"
      className={cx(
        'relative grid min-h-svh grid-rows-[1fr_auto] items-stretch justify-stretch overflow-hidden text-center text-ink',
        'bg-sand-deep bg-cover bg-center bg-no-repeat pb-0',
        'before:pointer-events-none before:absolute before:inset-4 before:z-[2] before:border before:border-[rgba(233,205,123,.5)] max-md:before:inset-2',
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

      {/* Scrim keeps text legible on any video frame; stronger at the bottom for the trust bar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-ink-deep)_38%,transparent),transparent_70%),linear-gradient(to_top,color-mix(in_srgb,var(--color-ink-deep)_62%,transparent),transparent_38%)]"
      />

      <div className={cx(wrap, 'relative z-[1] flex w-full items-center justify-center py-[clamp(2rem,6vh,4rem)] short-land:py-4')}>
        <div className="mx-auto flex max-w-[820px] flex-col items-center">
          <h1
            data-hero-item
            className="m-0 max-w-[14ch] text-[clamp(3rem,5.6vw,5.2rem)] leading-none font-normal tracking-display text-ink mp:opacity-0 max-md:text-[clamp(2.6rem,12vw,3.8rem)]"
          >
            <PalaceCityLogo className="mx-auto block h-auto w-[min(640px,84vw)] text-white [filter:drop-shadow(0_1px_1px_rgba(40,22,6,.6))_drop-shadow(0_2px_14px_rgba(30,16,4,.4))] max-md:w-[88vw] short-wide:w-[min(480px,60vw)] short-land:w-[min(320px,42vw)]" />
          </h1>
          <p
            data-hero-item
            className={cx(softGlow, "mt-[clamp(1.25rem,3vh,2rem)] mb-0 font-display text-[clamp(1.65rem,3.4vw,2.75rem)] leading-[1.15] font-semibold tracking-[.005em] text-cream italic [font-size-adjust:.47] mp:opacity-0 short-land:mt-[.8rem] short-land:text-[1.5rem]")}
          >
            Live in a palace by the sea
          </p>
          <p
            data-hero-item
            className={cx(softGlow, "mx-auto mt-[.85rem] mb-0 max-w-[44ch] text-[clamp(1rem,1.25vw,1.12rem)] leading-[1.65] font-medium text-white mp:opacity-0 short-land:mt-[.4rem] short-land:text-[.92rem]")}
          >
            Neo-classical 4 and 5 BHK villas from ₹5 Cr* at Akkarai, East Coast Road, Chennai.
          </p>
          <div
            data-hero-item
            className={cx(softGlow, "mt-[clamp(1.75rem,4vh,2.5rem)] flex flex-wrap items-center justify-center gap-4 mp:opacity-0 max-md:w-full max-md:max-w-[340px] max-md:flex-col max-md:items-stretch max-md:gap-3 short-land:mt-4")}
          >
            <a className={btn('maroon', 'lg', heroBtn)} {...jumpTo('lead', '#enquire')}>
              Book a private tour
            </a>
            <a className={btn('glass', 'lg', heroBtn)} {...jumpTo('walkthrough', '#walkthrough')}>
              <svg className="ml-[2px] size-[14px]" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
              </svg>
              Watch the walkthrough
            </a>
          </div>
        </div>
      </div>

      <div
        data-hero-bar
        className="relative z-[1] border-t border-[rgba(233,205,123,.75)] pt-4 pb-[calc(1rem_+_env(safe-area-inset-bottom,0px))] mp:opacity-0"
      >
        <div className={cx(wrap, 'relative z-[1] flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-3 md:pr-20 max-xl:justify-center max-xl:text-center')}>
          <ul
            className={cx(
              'm-0 flex list-none flex-wrap justify-start gap-x-8 gap-y-2 p-0 text-[.88rem] font-semibold text-white',
              darkGlow,
              'max-xl:justify-center max-md:gap-x-[1.1rem] max-md:gap-y-[.35rem] max-md:text-[.8rem]',
            )}
          >
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-[.55rem] before:size-[6px] before:rotate-45 before:bg-gold-soft before:shadow-[0_1px_3px_rgba(0,0,0,.4)]">
                {t}
              </li>
            ))}
          </ul>
          <p className={cx('m-0 text-[.8rem] font-semibold text-white', darkGlow, 'max-xl:w-full max-md:text-[.74rem]')}>{RERA}</p>
        </div>
      </div>
    </section>
  )
}

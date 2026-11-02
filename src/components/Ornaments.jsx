import { cx, h2Section } from '../lib/ui'

/** Gradients and the fleur symbol shared by every inline SVG on the page. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="apGoldDeep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7A5518" /><stop offset=".35" stopColor="#A7792C" /><stop offset=".55" stopColor="#C39A48" />
          <stop offset=".75" stopColor="#9A6E26" /><stop offset="1" stopColor="#7E5A1D" />
        </linearGradient>
        <linearGradient id="pcGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9A6E1F" /><stop offset=".22" stopColor="#E2BC63" /><stop offset=".4" stopColor="#FBE9AE" />
          <stop offset=".58" stopColor="#C99A3E" /><stop offset=".78" stopColor="#F1D486" /><stop offset="1" stopColor="#A57A28" />
        </linearGradient>
        <symbol id="fleur" viewBox="0 0 40 40">
          <path fill="currentColor" d="M20 2C14 10 14 18 20 24 26 18 26 10 20 2ZM18 22C10 24 4 18 6 12 9 15 13 16 16 15 14 18 15 21 18 22ZM22 22C30 24 36 18 34 12 31 15 27 16 24 15 26 18 25 21 22 22ZM11 24H29V27H11ZM17 28C17 32 14 35 12 37H28C26 35 23 32 23 28Z" />
        </symbol>
      </defs>
    </svg>
  )
}

export function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z" />
    </svg>
  )
}

const goldLine = 'h-px w-14'

/**
 * Fleur ornament above headings. Left-aligned by default (single trailing
 * rule); `center` adds the leading rule as well.
 */
export function RoyalOrn({ center = false, tight = false, ...rest }) {
  return (
    <div
      aria-hidden="true"
      className={cx('flex items-center gap-3 text-gold-bright', tight ? 'mb-4' : 'mb-[1.1rem]', center && 'justify-center')}
      {...rest}
    >
      <span className={cx(goldLine, 'bg-[linear-gradient(90deg,transparent,#C9A15A)]', center ? 'block' : 'hidden')} />
      <svg className="size-[22px] flex-none">
        <use href="#fleur" />
      </svg>
      <span className={cx(goldLine, 'bg-[linear-gradient(90deg,#C9A15A,transparent)]')} />
    </div>
  )
}

/** Section heading row: ornament + title on the left, intro text on the right (or stacked when centred). */
export function SectionHead({ title, text, center = false }) {
  if (center) {
    return (
      <div className="mb-[clamp(3rem,6vw,5rem)] flex flex-col flex-wrap items-center justify-between gap-x-16 gap-y-8 text-center">
        <RoyalOrn center data-reveal />
        <h2 data-reveal className={h2Section}>{title}</h2>
        <p data-reveal className="m-0 max-w-[52ch] text-muted">{text}</p>
      </div>
    )
  }
  return (
    <div className="mb-[clamp(3rem,6vw,5rem)] flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
      <div data-reveal>
        <RoyalOrn />
        <h2 className={cx(h2Section, 'max-w-[16ch]')}>{title}</h2>
      </div>
      <p data-reveal className="m-0 max-w-[40ch] text-muted">{text}</p>
    </div>
  )
}

/* ------------------------------------------------------------------
   Neo-classical columns framing some sections on very wide screens
   ------------------------------------------------------------------ */
function Pillar({ side }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute top-[clamp(2.5rem,5vw,4rem)] bottom-[clamp(2.5rem,5vw,4rem)] z-0 hidden w-16 flex-col text-[rgba(184,137,59,.62)] wide:flex',
        side === 'l' ? 'left-[clamp(10px,1.4vw,28px)]' : 'right-[clamp(10px,1.4vw,28px)]',
      )}
    >
      <svg className="block h-auto w-full flex-none" viewBox="0 0 84 112">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0 1h84M0 5h84M2 9h80" /><rect x="3" y="12" width="78" height="9" />
          <path d="M8 21c-2 3-2 9 2 13M76 21c2 3 2 9-2 13" />
          <circle cx="15" cy="30" r="9" /><circle cx="15" cy="30" r="5" /><circle cx="15" cy="30" r="1.6" />
          <circle cx="69" cy="30" r="9" /><circle cx="69" cy="30" r="5" /><circle cx="69" cy="30" r="1.6" />
          <path d="M15 21h54M15 39c8 6 46 6 54 0" />
          <path d="M27 30c0-3 3-5 3-5s3 2 3 5-3 5-3 5-3-2-3-5zM39 30c0-3 3-5 3-5s3 2 3 5-3 5-3 5-3-2-3-5zM51 30c0-3 3-5 3-5s3 2 3 5-3 5-3 5-3-2-3-5z" />
          <rect x="14" y="46" width="56" height="6" /><path d="M14 56h56M14 59h56" /><path d="M14 59v53M70 59v53" />
          <path d="M23 64v48M32 64v48M42 64v48M52 64v48M61 64v48" />
        </g>
      </svg>
      <div className="mx-auto w-[66.6%] flex-1 border-x-[1.2px] border-current bg-(image:--shaft-flutes) bg-[length:100%_100%]" />
      <svg className="block h-auto w-full flex-none" viewBox="0 0 84 72">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M14 0v6M70 0v6M23 0v4M32 0v4M42 0v4M52 0v4M61 0v4" /><path d="M12 6h60" />
          <rect x="9" y="8" width="66" height="10" rx="5" /><path d="M12 18c4 4 4 8 0 10h60c-4-2-4-6 0-10" />
          <rect x="6" y="28" width="72" height="12" rx="6" /><rect x="2" y="44" width="80" height="26" /><path d="M2 49h80" />
        </g>
      </svg>
    </div>
  )
}

export function Pillars() {
  return (
    <>
      <Pillar side="l" />
      <Pillar side="r" />
    </>
  )
}

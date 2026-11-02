/** Join class names, skipping falsy values. */
export const cx = (...parts) => parts.filter(Boolean).join(' ')

/** Centered page container. */
export const wrap = 'mx-auto max-w-[1200px] px-[clamp(1.25rem,4vw,2.5rem)] max-md:px-5'

/** Standard content section: generous vertical rhythm with a hairline on top. */
export const block = 'py-[clamp(5.5rem,11vw,9.5rem)] border-t border-line'

/** Section-sized heading (h2) used by most content sections. */
export const h2Section = 'text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-ink'

/** Sand background with the faint lotus pattern. */
export const royalPattern = 'bg-sand bg-(image:--pattern-royal) bg-[length:72px_72px]'

/** Telephone / WhatsApp details shared across the page. */
export const PHONE_TEL = 'tel:+919500461555'
export const PHONE_LABEL = '+91 95004 61555'
export const WA_LINK =
  'https://wa.me/919500461555?text=Hello%2C%20I%E2%80%99d%20like%20the%20price%20list%20for%20Adityaram%20Palace%20City.'

/* ------------------------------------------------------------------
   Buttons
   Base + one size + one variant. Utilities never overlap between the
   three groups, so the result does not depend on class order.
   ------------------------------------------------------------------ */
const btnBase =
  'relative inline-flex items-center justify-center gap-[.6rem] whitespace-nowrap rounded-[2px] border border-solid ' +
  'font-body font-semibold leading-none tracking-[.01em] no-underline cursor-pointer ' +
  'transition-[background-color,color,border-color,box-shadow,scale] duration-150 ease-[ease-out] ' +
  'active:scale-[.96] hover:shadow-[0_6px_18px_-8px_rgba(58,42,31,.45)]'

const btnSizes = {
  md: 'min-h-[46px] px-6 py-[.8rem] text-[.92rem]',
  lg: 'min-h-[54px] px-[1.9rem] py-4 text-[.98rem]',
}

/* inner hairline frame used on gold and ivory buttons */
const innerFrame = 'after:pointer-events-none after:absolute after:inset-[3px] after:border after:border-solid'

const btnVariants = {
  gold: `border-transparent bg-maroon text-white hover:bg-maroon-2 ${innerFrame} after:rounded-[1px] after:border-[rgba(240,214,140,.55)]`,
  ivory: `border-transparent bg-ground text-maroon hover:bg-white ${innerFrame} after:border-[rgba(184,137,59,.55)]`,
  line: 'border-[rgba(58,42,31,.35)] bg-transparent text-inherit hover:border-maroon hover:text-maroon',
  lineSolid: 'border-[rgba(58,42,31,.25)] bg-white text-ink',
  wa: 'border-transparent bg-wa text-[#0B2E1A] hover:bg-[#3BE07B] [&_svg]:size-[18px]',
  glass:
    'border-white/85 bg-black/12 text-white shadow-[0_2px_14px_rgba(0,0,0,.18)] hover:border-white hover:bg-white hover:text-ink',
}

export const btn = (variant = 'gold', size = 'md', extra = '') =>
  cx(btnBase, btnSizes[size], btnVariants[variant], extra)

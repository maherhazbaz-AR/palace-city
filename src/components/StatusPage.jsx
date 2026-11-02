import { Phone, RotateCw } from 'lucide-react'
import { AdityaramLogo } from './Logos'
import { RoyalOrn } from './Ornaments'
import ThemeToggle from './ThemeToggle'
import Footer from './Footer'
import { PHONE_LABEL, PHONE_TEL, btn, chamber, cx, wrap } from '../lib/ui'
import { useInternalLink } from '../lib/route'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * Full-page layout for "nothing to show" states (404, crash). A deep palace chamber with a large
 * foil mark, a short explanation and one clear way forward.
 */
function StatusPage({ title, mark, heading, text, primary, internalHome = true }) {
  const goHome = useInternalLink('/')
  usePageMeta({ title, noindex: true })

  return (
    <>
      <header className="border-b border-line">
        <div className={cx(wrap, 'flex items-center justify-between py-4')}>
          <a href="/" onClick={internalHome ? goHome : undefined} aria-label="Adityaram Properties, Palace City home" className="block leading-[0]">
            <AdityaramLogo className="block aspect-[2476/647] h-10 w-auto max-md:h-8" />
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className={cx(chamber, 'grid min-h-[min(46rem,calc(100svh-4.5rem))] place-items-center py-[clamp(4rem,10vw,8rem)]')}>
        <div className={cx(wrap, 'flex flex-col items-center text-center')}>
          <RoyalOrn center />
          <p aria-hidden="true" className="text-foil m-0 font-display text-[clamp(6.5rem,22vw,15rem)] leading-[.85] font-medium tracking-[-.03em] lining-nums">
            {mark}
          </p>
          <h1 className="mt-6 text-[clamp(1.9rem,4vw,3rem)] leading-[1.1] text-ink">{heading}</h1>
          <p className="mx-auto mt-4 mb-0 max-w-[46ch] text-[1.08rem] text-muted">{text}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 max-phablet:w-full max-phablet:flex-col">
            {primary(goHome)}
            <a className={btn('line', 'lg', 'max-phablet:w-full')} href={PHONE_TEL}>
              <Phone size={17} strokeWidth={1.8} aria-hidden="true" />
              Call {PHONE_LABEL}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

/** Shown for any address the site doesn't have. */
export function NotFound() {
  return (
    <StatusPage
      title="Page not found | Adityaram Palace City"
      mark="404"
      heading="This page isn’t part of the palace"
      text="The link may be broken or the page may have moved. Let us take you back to Palace City."
      primary={(goHome) => (
        <a className={btn('ivory', 'lg', 'max-phablet:w-full')} href="/" onClick={goHome}>
          Back to Palace City
        </a>
      )}
    />
  )
}

/** Shown by the error boundary when something unexpected breaks while rendering. */
export function ErrorPage() {
  return (
    <StatusPage
      title="Something went wrong | Adityaram Palace City"
      mark="Oops"
      heading="Something went wrong"
      text="An unexpected error stopped this page from showing. Please reload. If it keeps happening, call us and we’ll help right away."
      internalHome={false}
      primary={() => (
        <button type="button" className={btn('ivory', 'lg', 'max-phablet:w-full')} onClick={() => window.location.reload()}>
          <RotateCw size={17} strokeWidth={1.8} aria-hidden="true" />
          Reload page
        </button>
      )}
    />
  )
}

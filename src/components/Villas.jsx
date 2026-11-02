import { useEffect, useRef, useState } from 'react'
import { SectionHead, WhatsAppIcon } from './Ornaments'
import { VILLAS } from '../data/content'
import { WA_LINK, block, btn, cx, wrap } from '../lib/ui'
import { useJump, useSite } from '../lib/site'

const framedChamber = 'shadow-[inset_0_0_0_1px_rgba(226,188,99,.6),inset_0_0_0_6px_var(--color-chamber),inset_0_0_0_7px_rgba(226,188,99,.35)]'

const FADE_MS = 350

/** Full-screen viewer for one villa's 360 walkthrough, with a top close bar. */
function VillaFilm({ villa, onClose }) {
  const dialogRef = useRef(null)
  const [shown, setShown] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [current, setCurrent] = useState(villa)

  // open: mount, show the dialog, then fade in on the next frame
  useEffect(() => {
    const dialog = dialogRef.current
    if (villa) {
      setCurrent(villa)
      setLoaded(false)
      if (!dialog.open) dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
      const raf = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(raf)
    }
    // close: fade out, then really close
    setShown(false)
    const t = setTimeout(() => {
      if (dialog.open) dialog.close()
      document.documentElement.style.overflow = ''
      setCurrent(null)
    }, FADE_MS)
    return () => clearTimeout(t)
  }, [villa])

  useEffect(() => () => { document.documentElement.style.overflow = '' }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-label={current ? `${current.name} walkthrough` : 'Villa walkthrough'}
      data-shown={shown || undefined}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className="m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-ink-deep p-0 text-white opacity-0 transition-[opacity,scale] duration-350 ease-out [scale:.985] backdrop:bg-black data-shown:opacity-100 data-shown:[scale:1] motion-reduce:transition-none"
    >
      {current && (
        <div className="relative h-svh">
          <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-transparent px-3 py-2 pt-[max(.5rem,env(safe-area-inset-top))] [text-shadow:0_1px_8px_rgba(0,0,0,.7)]">
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="font-display text-[.95rem] font-semibold text-gold-soft italic">{current.numeral}</span>
              <h3 className="m-0 truncate font-body text-[.8rem] font-semibold tracking-[.02em] text-cream">{current.name}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="pointer-events-auto inline-flex min-h-7 cursor-pointer items-center gap-1.5 rounded-[2px] border-0 bg-transparent px-2.5 text-[.75rem] font-semibold text-cream transition-[background-color,color,scale] duration-150 hover:text-gold-soft active:scale-[.96]"
            >
              <span aria-hidden="true" className="text-[1rem] leading-none">×</span>
              Close
            </button>
          </header>
          <div className="absolute inset-0 bg-black">
            <div
              role="status"
              className={cx(
                'pointer-events-none absolute inset-0 grid place-items-center text-[.95rem] text-on-dark-muted transition-opacity duration-500',
                loaded && 'opacity-0',
              )}
            >
              Loading the walkthrough…
            </div>
            <iframe
              key={current.page}
              className={cx('absolute inset-0 size-full border-0 transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')}
              src={current.page}
              title={`${current.name} walkthrough`}
              allow="fullscreen; autoplay; gyroscope; accelerometer"
              allowFullScreen
              onLoad={() => setLoaded(true)}
            />
          </div>
        </div>
      )}
    </dialog>
  )
}
export default function Villas() {
  const { chooseVilla } = useSite()
  const jumpTo = useJump()
  const [playing, setPlaying] = useState(null)
  return (
    <section id="villas" className={block}>
      <div className={wrap}>
        <SectionHead
          title="Our signature villas"
          text="Four villa types, each with neo-classical architecture, Italian marble flooring, a landscaped garden, barbeque counter, outdoor lounge deck and Vaastu-compliant plans."
        />
        <ul className="m-0 list-none p-0">
          {VILLAS.map((v) => (
            <li
              key={v.name}
              data-reveal
              className="grid grid-cols-[5rem_1.3fr_1fr_auto] items-center gap-10 border-t border-line py-[2.6rem] transition-[background-color,box-shadow] duration-300 ease-[ease] *:min-w-0 last:border-b hover:bg-sand hover:[box-shadow:-20px_0_0_var(--color-sand),20px_0_0_var(--color-sand)] max-lg:grid-cols-[3.5rem_1fr] max-lg:gap-y-[.6rem]"
            >
              <svg className="size-20 rounded-full border border-gold-bright/55 p-[1.15rem] text-gold-bright max-lg:row-span-3 max-lg:size-14 max-lg:p-3" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
                {v.icon.map((d) => <path key={d} d={d} />)}
              </svg>
              <div>
                <span className="mb-[.5rem] block font-display text-[1.45rem] leading-none font-semibold text-gold italic lining-nums tabular-nums">{v.numeral}</span>
                <h3 className="text-[clamp(1.8rem,3.3vw,2.8rem)] leading-[1.05] text-ink">{v.name}</h3>
                <p className="mt-[.55rem] mb-0 text-[.78rem] font-semibold tracking-[.2em] text-gold uppercase">{v.area}</p>
              </div>
              <p className="m-0 text-muted">{v.text}</p>
              <div className="flex flex-col gap-3 max-lg:flex-row max-lg:flex-wrap max-md:flex-col">
                {v.page && (
                  <button className={btn('maroon', 'md', 'max-md:w-full')} type="button" onClick={() => setPlaying(v)}>
                    Watch walkthrough
                  </button>
                )}
                <button className={btn('line', 'md', 'max-md:w-full')} type="button" onClick={() => chooseVilla(v.name)}>
                  Get the floor plan
                </button>
              </div>
            </li>
          ))}
        </ul>
        <VillaFilm villa={playing} onClose={() => setPlaying(null)} />

        <div
          data-reveal
          className={cx('tone-palace relative mt-14 flex flex-wrap items-center justify-between gap-6 rounded bg-chamber px-9 py-9 max-phablet:flex-col max-phablet:items-start', framedChamber)}
        >
          <p className="m-0 font-display text-[1.5rem]">Brochure, master layout and floor plans for every villa type</p>
          <a className={btn('maroon', 'md', 'max-phablet:w-full')} {...jumpTo('lead', '#top', 'Brochure, master layout and floor plans')}>
            Request the brochure
          </a>
        </div>
      </div>
    </section>
  )
}

export function PriceBand() {
  const jumpTo = useJump()
  return (
    <section
      aria-label="Price list"
      className="tone-palace bg-[linear-gradient(100deg,#3A1019_0%,#6B1E30_55%,#3A1019_100%)] py-[clamp(3.5rem,7vw,5.5rem)] shadow-[inset_0_1px_0_rgba(226,188,99,.6),inset_0_-1px_0_rgba(226,188,99,.6)]"
    >
      <div className={cx(wrap, 'flex flex-wrap items-center justify-between gap-x-12 gap-y-6 max-lg:flex-col max-lg:items-start')}>
        <div>
          <h2 className="text-foil text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] font-semibold lining-nums tabular-nums">
            Villas from ₹5 Cr*
          </h2>
          <p className="mt-2 mb-0 text-muted">Get the full price list and today’s available villas.</p>
        </div>
        <div className="flex flex-wrap gap-[.8rem] max-lg:w-full max-phablet:flex-col">
          <a className={btn('ivory', 'lg', 'max-lg:flex-1')} {...jumpTo('lead', '#enquire', 'Price list and available villas')}>
            Get the price list
          </a>
          <a className={btn('wa', 'lg', 'max-lg:flex-1')} href={WA_LINK} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}





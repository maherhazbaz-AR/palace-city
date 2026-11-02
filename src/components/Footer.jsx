import { useEffect, useState } from 'react'
import { AdityaramLogo, PalaceCityLogo } from './Logos'
import { RoyalOrn, WhatsAppIcon } from './Ornaments'
import { RERA } from '../data/content'
import { PHONE_TEL, WA_LINK, btn, cx, wrap } from '../lib/ui'
import { useJump } from '../lib/site'

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(226,188,99,.35)] bg-[color-mix(in_srgb,var(--color-chamber)_72%,black)] pt-14 pb-[calc(2.5rem_+_env(safe-area-inset-bottom,0px))] text-[.88rem] text-[#E2D5C4] max-md:pb-[calc(5.5rem_+_env(safe-area-inset-bottom,0px))]">
      <div className={cx(wrap, 'mb-8 flex flex-col flex-wrap items-center justify-between gap-8 border-b border-[rgba(201,161,90,.3)] pb-8 max-md:pb-0')}>
        <PalaceCityLogo className="block h-auto w-[min(320px,70vw)]" />
        <RoyalOrn center />
        <p className="mt-1 mb-[-.5rem] text-[.8rem] text-[#C9B9A6]">Developed by</p>
        <AdityaramLogo tone="light" className="block aspect-[2476/647] h-10 w-auto" />
      </div>
      <div className={cx(wrap, 'flex flex-wrap justify-between gap-8')}>
        <p className="m-0 max-w-[60ch]">
          © 2026 Adityaram Properties Pvt. Ltd. Adityaram Palace City, ECR, Chennai.
          <br />
          CMDA &amp; RERA approved. {RERA} (rera.tn.gov.in).
        </p>
        <p className="m-0 max-w-[60ch]">*Prices are indicative and subject to change. Images are representational. Please confirm details with our sales team.</p>
      </div>
    </footer>
  )
}

/** Mobile quick-contact bar: slides up whenever no lead form or the hero is on screen. */
export function Dock() {
  const jumpTo = useJump()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const vis = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => vis.set(x.target, x.isIntersecting))
        setShow(![...vis.values()].some(Boolean))
      },
      { threshold: 0.05 },
    )
    ;['top', 'enquire', 'visit'].forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const dockBtn = 'flex-1 max-md:px-2 max-md:text-[.86rem] max-tiny:min-h-11 max-tiny:py-[.6rem]'

  return (
    <div
      className={cx(
        'fixed inset-x-0 bottom-0 z-40 hidden gap-[.6rem] bg-ground/97 px-4 pt-[.6rem] pb-[calc(.6rem_+_env(safe-area-inset-bottom,0px))]',
        'shadow-[0_-1px_0_color-mix(in_srgb,var(--color-shadow)_12%,transparent)] transition-transform duration-300 ease-[ease] max-md:flex',
        show ? '[transform:none]' : '[transform:translateY(110%)]',
      )}
    >
      <a className={btn('lineSolid', 'md', dockBtn)} href={PHONE_TEL}>Call</a>
      <a className={btn('wa', 'md', cx(dockBtn, 'max-tiny:[&_svg]:hidden'))} href={WA_LINK} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        WhatsApp
      </a>
      <a className={btn('maroon', 'md', dockBtn)} {...jumpTo('lead', '#enquire')}>Book a visit</a>
    </div>
  )
}

export function WhatsAppFloat() {
  return (
    <a
      className="fixed right-5 bottom-[calc(1.25rem_+_env(safe-area-inset-bottom,0px))] z-[45] flex size-[58px] items-center justify-center rounded-full bg-wa text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,.35)] transition-[transform,box-shadow,scale] duration-150 ease-[ease-out] active:scale-[.96] max-md:hidden"
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}

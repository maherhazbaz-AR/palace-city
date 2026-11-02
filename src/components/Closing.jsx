import { useRef } from 'react'
import { animate } from 'motion'
import LeadForm from './LeadForm'
import { RoyalOrn } from './Ornaments'
import { callLink } from './Enquire'
import { FAQS } from '../data/content'
import { PHONE_LABEL, PHONE_TEL, block, chamber, cx, h2Section, royalPattern, wrap } from '../lib/ui'
import { prefersReducedMotion } from '../lib/site'

export function Developer() {
  return (
    <section id="developer" className={cx(block, royalPattern)}>
      <div className={cx(wrap, 'grid grid-cols-[1fr_1.2fr] gap-[clamp(2rem,6vw,6rem)] *:min-w-0 max-lg:grid-cols-1')}>
        <div data-reveal>
          <RoyalOrn />
          <h2 className={cx(h2Section, 'max-w-[12ch]')}>The vision behind Palace City</h2>
        </div>
        <div data-reveal>
          <p className="mt-0 mb-5 max-w-[56ch] font-display text-[1.7rem] text-ink">
            Mr. Adityaram
            <span className="mt-[.2rem] block font-body text-[.92rem] text-gold">Founder, Chairman and Managing Director, Adityaram Group</span>
          </p>
          <p className="mt-0 mb-4 max-w-[56ch] text-muted">
            A first-generation entrepreneur, Mr. Adityaram built one of South India’s most respected real estate enterprises, delivering
            landmark communities along ECR and OMR. Palace City is the realisation of his vision for royal living with timeless architecture.
          </p>
          <p className="mt-0 mb-4 max-w-[56ch] text-muted">
            Developed by Adityaram Properties Pvt. Ltd., the flagship real estate arm of the Adityaram Group, whose businesses also span film
            production, hospitality and entertainment infrastructure.
          </p>
        </div>
      </div>
    </section>
  )
}

const easeRoyal = [0.22, 1, 0.36, 1]

/** Native <details> with an animated open/close. */
function FaqItem({ q, a }) {
  const details = useRef(null)
  const answer = useRef(null)

  function toggle(e) {
    if (prefersReducedMotion()) return // let the browser toggle instantly
    e.preventDefault()
    const d = details.current
    const p = answer.current
    if (d.open) {
      animate(p, { height: [p.offsetHeight + 'px', '0px'], opacity: [1, 0] }, { duration: 0.35, ease: easeRoyal }).then(() => {
        d.open = false
        p.style.height = ''
        p.style.opacity = ''
      })
    } else {
      d.open = true
      const h = p.offsetHeight
      animate(p, { height: ['0px', h + 'px'], opacity: [0, 1] }, { duration: 0.45, ease: easeRoyal }).then(() => {
        p.style.height = ''
      })
    }
  }

  return (
    <details ref={details} data-reveal className="group border-t border-[rgba(201,161,90,.4)] last:border-b">
      <summary
        onClick={toggle}
        className={cx(
          'relative box-content min-h-11 cursor-pointer list-none py-6 pr-12 pl-0 font-display text-[1.45rem] leading-[1.3] font-medium transition-colors duration-200 hover:text-accent',
          "after:absolute after:top-1/2 after:right-1 after:text-[1.5rem] after:text-gold-bright after:content-['+']",
          'after:[transform:translateY(-50%)] after:transition-transform after:duration-200 after:ease-[ease] group-open:after:[transform:translateY(-50%)_rotate(45deg)]',
        )}
      >
        {q}
      </summary>
      <p ref={answer} className="m-0 max-w-[60ch] overflow-hidden pb-5 text-muted">{a}</p>
    </details>
  )
}

export function Faq() {
  return (
    <section id="faq" className={cx(block, 'bg-ground')}>
      <div className={cx(wrap, 'grid grid-cols-[1fr_1.6fr] gap-[clamp(2rem,6vw,6rem)] *:min-w-0 max-lg:grid-cols-1')}>
        <div className="self-start lg:sticky lg:top-28">
          <RoyalOrn />
          <h2 className={cx(h2Section, 'max-w-[10ch]')}>Frequently asked questions</h2>
        </div>
        <div>
          {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </div>
    </section>
  )
}

export function Visit() {
  return (
    <section id="visit" className={cx(block, chamber)}>
      <div className={cx(wrap, 'grid grid-cols-[1fr_minmax(320px,440px)] items-center gap-[clamp(2rem,6vw,6rem)] max-tablet:grid-cols-1')}>
        <div data-reveal>
          <RoyalOrn />
          <h2 className="text-foil text-[clamp(2.4rem,5.2vw,4.4rem)] leading-[1.04]">Visit your palace</h2>
          <p className="my-[1em] max-w-[40ch] text-muted">Schedule a private tour of the show villa and experience palace living firsthand.</p>
          <a className={cx(callLink, 'mt-6')} href={PHONE_TEL}>{PHONE_LABEL}</a>
          <dl className="mt-6 mb-0">
            <div className="border-t border-line py-3">
              <dt className="text-[.85rem] text-muted">Email</dt>
              <dd className="mx-0 mt-[.15rem] mb-0 text-ink">
                <a className="text-ink underline" href="mailto:support@adityaramproperties.com">support@adityaramproperties.com</a>
              </dd>
            </div>
            <div className="border-t border-line py-3">
              <dt className="text-[.85rem] text-muted">Address</dt>
              <dd className="mx-0 mt-[.15rem] mb-0 text-ink">No. 50, East Coast Road, Adityaram Nagar, Panaiyur, Chennai 600119</dd>
            </div>
          </dl>
        </div>
        <LeadForm
          idPrefix="v"
          heading="Get the price list"
          intro="Plus the brochure, floor plans and available villas."
          submitLabel="Send me the price list"
          askWhen={false}
          className="tone-ivory"
        />
      </div>
    </section>
  )
}

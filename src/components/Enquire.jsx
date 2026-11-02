import LeadForm from './LeadForm'
import { Pillars, RoyalOrn } from './Ornaments'
import { PERKS } from '../data/content'
import { PHONE_LABEL, PHONE_TEL, cx, royalPattern, wrap } from '../lib/ui'
import { useSite } from '../lib/site'

export const callLink = 'inline-block font-display text-[clamp(1.6rem,3vw,2.3rem)] text-maroon no-underline lining-nums tabular-nums'

export default function Enquire() {
  const { enquiryVilla, setEnquiryVilla } = useSite()
  return (
    <section id="enquire" className={cx('relative overflow-hidden py-[clamp(5.5rem,11vw,9.5rem)] text-ink', royalPattern)}>
      <Pillars />
      <div className={cx(wrap, 'relative z-[1] grid grid-cols-[1fr_minmax(320px,440px)] items-center gap-[clamp(2.5rem,7vw,7rem)] *:min-w-0 max-tablet:grid-cols-1')}>
        <div data-reveal>
          <RoyalOrn tight />
          <h2 className="max-w-[13ch] text-[clamp(2.4rem,5vw,4.2rem)] leading-none tracking-[-.02em] text-ink">See your palace in person</h2>
          <p className="mt-[1.4rem] mb-0 max-w-[42ch] text-muted">
            Walk the show villa on ECR with our team, and leave with everything you need to decide.
          </p>
          <ul className="mt-8 mb-0 max-w-[420px] list-none p-0">
            {PERKS.map((p) => (
              <li
                key={p}
                data-reveal
                className="flex items-baseline gap-4 border-t border-line py-[.95rem] before:size-[6px] before:flex-none before:bg-gold-bright before:[transform:rotate(45deg)_translateY(-2px)] last:border-b"
              >
                {p}
              </li>
            ))}
          </ul>
          <a className={cx(callLink, 'mt-8')} href={PHONE_TEL}>{PHONE_LABEL}</a>
        </div>

        <LeadForm
          idPrefix="h"
          heading="Book a private tour"
          intro="Get the price list, brochure, floor plans and a private tour of the show villa."
          submitLabel="Get price list and book visit"
          sentText="Press send in WhatsApp to confirm your visit. If WhatsApp didn’t open, call us and we’ll book it for you."
          villa={enquiryVilla}
          onVillaChange={setEnquiryVilla}
          tightHeading
        />
      </div>
    </section>
  )
}

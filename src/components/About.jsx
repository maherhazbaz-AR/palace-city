import { RoyalOrn } from './Ornaments'
import { FACTS } from '../data/content'
import { block, chamber, cx, wrap } from '../lib/ui'

/** Column dividers for the facts row, matching each breakpoint's column count. */
function factCell(i) {
  return cx(
    'pt-[1.8rem] pr-6 pb-0',
    i > 0 && 'border-l border-[rgba(201,161,90,.35)] pl-6',
    i === 3 && 'lg:max-desk:border-l-0 lg:max-desk:pl-0', // 3 columns: 4th item starts a row
    i % 2 === 1 ? 'max-lg:pl-5' : i > 0 && 'max-lg:border-l-0 max-lg:pl-0', // 2 columns
  )
}

export default function About() {
  return (
    <section id="about" className={cx(block, chamber)}>
      <div className={wrap}>
        <div className="grid grid-cols-[1.1fr_1fr] items-end gap-[clamp(2rem,6vw,6rem)] *:min-w-0 max-lg:grid-cols-1">
          <div data-reveal>
            <RoyalOrn />
            <h2 className="text-foil text-[clamp(2.5rem,5.6vw,4.8rem)] leading-[1.02]">Where heritage meets modern luxury</h2>
          </div>
          <div data-reveal>
            <p className="mt-0 mb-4 max-w-[46ch] text-muted first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[4.4rem] first-letter:leading-[.78] first-letter:text-gold">
              Inspired by the neo-classical palaces of Europe and the royal heritage of Rajasthan, Palace City is South India’s first
              palace-themed villa community, on the Akkarai stretch of ECR.
            </p>
            <p className="mt-0 mb-4 max-w-[46ch] text-muted">
              Inside, double-height living rooms with crystal chandeliers, Italian marble floors and smart home technology bring palace
              grandeur to everyday life.
            </p>
          </div>
        </div>

        <dl className="mt-[clamp(3.5rem,7vw,6rem)] mb-0 grid grid-cols-[repeat(5,1fr)] border-t border-line lg:max-desk:grid-cols-[repeat(3,1fr)] max-lg:grid-cols-[repeat(2,1fr)]">
          {FACTS.map((f, i) => (
            <div key={f.label} data-reveal className={factCell(i)}>
              <dt data-countup className="font-display text-[clamp(1.5rem,2.2vw,2.05rem)] whitespace-nowrap text-accent lining-nums tabular-nums">
                {f.value}
              </dt>
              <dd className="mx-0 mt-[.2rem] mb-0 text-[.95rem] text-muted">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

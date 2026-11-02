import { RoyalOrn } from './Ornaments'
import { LOCATION_FACTS, SCHOOLS } from '../data/content'
import { block, cx, h2Section, wrap } from '../lib/ui'

const label = 'font-body fill-ink [font-size:15px]'
const sub = 'font-body fill-muted [font-size:13px]'
const INK = '#3A2A1F'
const GOLD = '#94692A'
const MUTED = '#6F5F51'
const SEA = '#7A2335'

function SchematicMap() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 560 480"
      role="img"
      aria-label="Schematic map: Palace City on ECR between Akkarai and Panaiyur, with the ECR–OMR link road, the elevated corridor and the proposed sea link"
    >
      <rect x="440" y="0" width="120" height="480" fill={SEA} opacity=".18" />
      <text x="505" y="250" className={sub} transform="rotate(90 505 250)">Bay of Bengal</text>
      <path d="M420 0 C428 140 412 300 426 480" stroke={GOLD} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M402 20 C410 150 394 300 406 460" stroke={GOLD} strokeWidth="2" strokeDasharray="8 6" fill="none" opacity=".8" />
      <path d="M455 10 C470 60 455 110 436 140" stroke={SEA} strokeWidth="2.5" strokeDasharray="4 5" fill="none" />
      <path d="M210 0 C205 160 222 320 210 480" stroke={MUTED} strokeWidth="4" fill="none" opacity=".7" />
      <text x="170" y="470" className={sub}>OMR</text>
      <text x="440" y="470" className={sub}>ECR</text>
      <path d="M215 250 L418 228" stroke={MUTED} strokeWidth="3" strokeDasharray="6 6" fill="none" />
      <text x="232" y="222" className={sub}>ECR–OMR link road</text>
      <circle cx="421" cy="30" r="6" fill={INK} /><text x="300" y="35" className={label}>Thiruvanmiyur</text>
      <circle cx="425" cy="140" r="6" fill={INK} /><text x="310" y="145" className={label}>Neelankarai</text>
      <circle cx="420" cy="228" r="6" fill={INK} /><text x="342" y="210" className={label}>Akkarai</text>
      <circle cx="418" cy="290" r="11" fill={GOLD} />
      <circle data-pulse className="origin-center [transform-box:fill-box]" cx="418" cy="290" r="20" fill="none" stroke={GOLD} strokeWidth="1.5" />
      <text x="248" y="296" className={label}>Palace City</text>
      <circle cx="418" cy="350" r="6" fill={INK} /><text x="330" y="355" className={label}>Panaiyur</text>
      <circle cx="424" cy="440" r="6" fill={INK} /><text x="350" y="445" className={label}>Uthandi</text>
      <text x="20" y="40" className={sub}>— — Elevated corridor (upcoming)</text>
      <text x="20" y="62" className={sub}>· · · Sea link (proposed)</text>
      <text x="20" y="470" className={sub}>Not to scale</text>
    </svg>
  )
}

export default function Location() {
  return (
    <section id="location" className={block}>
      <div className={cx(wrap, 'grid grid-cols-[1fr_1.1fr] items-center gap-[clamp(3rem,7vw,7rem)] *:min-w-0 max-lg:grid-cols-1')}>
        <div>
          <RoyalOrn data-reveal />
          <h2 data-reveal className={h2Section}>On the coast, connected to the city</h2>
          <p data-reveal className="mt-4 mb-[1em] max-w-[42ch] text-muted">
            Palace City sits between Akkarai and Panaiyur on ECR, a short walk from the beach and close to schools, hospitals and the OMR IT corridor.
          </p>
          <dl data-reveal className="mt-8 mb-0">
            {LOCATION_FACTS.map((f) => (
              <div key={f.label} className="flex justify-between gap-4 border-t border-line py-[1.1rem] max-xs:flex-col max-xs:gap-[.2rem]">
                <dt className="text-muted">{f.label}</dt>
                <dd className="m-0 max-w-[30ch] text-right font-medium [overflow-wrap:anywhere] max-xs:text-left">{f.value}</dd>
              </div>
            ))}
          </dl>
          <h3 data-reveal className="mt-8 text-[1.3rem]">Schools nearby</h3>
          <p data-reveal className="mt-4 mb-0 max-w-[42ch] text-[.95rem] text-muted">{SCHOOLS}</p>
        </div>
        <figure
          data-reveal
          className="relative m-0 rounded bg-sand p-6 shadow-[inset_0_0_0_1px_rgba(201,161,90,.45),inset_0_0_0_6px_#F4EBDD,inset_0_0_0_7px_rgba(201,161,90,.3)]"
        >
          <SchematicMap />
        </figure>
      </div>
    </section>
  )
}

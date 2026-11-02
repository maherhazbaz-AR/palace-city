import { Pillars, SectionHead } from './Ornaments'
import { ADVANTAGES, AMENITIES, SAMPLE_TESTIMONIALS } from '../data/content'
import { block, cx, royalPattern, wrap } from '../lib/ui'

export function Advantages() {
  return (
    <section id="advantages" className={cx(block, royalPattern)}>
      <div className={wrap}>
        <SectionHead title="Why Palace City stands apart" text="An approved, freehold address on Chennai’s most sought-after coastal stretch." />
        <ul className="m-0 grid max-w-[1000px] list-none grid-cols-2 gap-x-20 gap-y-[3.25rem] p-0 max-lg:grid-cols-[repeat(2,1fr)] max-lg:gap-10 max-sm:grid-cols-1">
          {ADVANTAGES.map((a) => (
            <li
              key={a.title}
              data-reveal
              className="relative border-t border-[rgba(201,161,90,.55)] pt-[1.4rem] before:absolute before:-top-1 before:left-0 before:size-[7px] before:rotate-45 before:bg-gold-bright"
            >
              <h3 className="text-[1.6rem] leading-[1.2]">{a.title}</h3>
              <p className="mt-[.7rem] mb-0 text-[1rem] text-muted">{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Amenities() {
  return (
    <section id="amenities" className={block}>
      <div className={wrap}>
        <SectionHead title="Everything within the palace walls" text="20+ amenities for every generation, behind a grand entrance arch." />
        <ul className="m-0 grid list-none grid-cols-[repeat(4,1fr)] gap-x-10 p-0 max-lg:grid-cols-[repeat(2,1fr)] max-xs:grid-cols-1">
          {AMENITIES.map((a, i) => (
            <li key={a.title} data-reveal className={cx('border-b border-line py-8', i < 4 && 'border-t')}>
              <h3 className="text-[1.35rem]">{a.title}</h3>
              <p className="mt-[.3rem] mb-0 text-[.95rem] text-muted">{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Testimonials({ items, hidden }) {
  const list = items || SAMPLE_TESTIMONIALS
  return (
    <section id="testimonials" hidden={hidden} className={cx('relative overflow-hidden bg-sand', block)}>
      <Pillars />
      <div className={cx(wrap, 'relative z-[1]')}>
        <SectionHead center title="Words from our families" text="What residents and visitors say about life at Palace City." />
        <ul className="m-0 grid list-none grid-cols-3 gap-[clamp(1.5rem,3vw,2.25rem)] p-0 max-tablet:grid-cols-2 max-phablet:grid-cols-1">
          {list.map((t, i) => (
            <li
              key={i}
              data-reveal
              className={cx(
                'relative flex flex-col rounded bg-white px-8 pt-[2.6rem] pb-8 shadow-[0_22px_50px_-32px_rgba(58,42,31,.45)]',
                'before:pointer-events-none before:absolute before:inset-2 before:rounded-[2px] before:border before:border-[rgba(201,161,90,.45)]',
                "after:absolute after:top-[.2rem] after:left-[1.6rem] after:font-quote after:text-[4.5rem] after:leading-none after:text-gold-bright after:content-['“']",
                t.placeholder && 'border border-dashed border-[rgba(184,137,59,.6)] opacity-75',
              )}
            >
              <blockquote className="m-0 flex-1">
                <p className="m-0 font-quote text-[1.3rem] leading-[1.5] text-ink">{t.quote}</p>
              </blockquote>
              <p className="mt-6 mb-0 text-[.95rem] font-bold text-ink">
                {t.name}
                {t.tag && <span className="block text-[.85rem] font-medium text-muted">{t.tag}</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

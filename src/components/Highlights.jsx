import { Pillars, SectionHead } from './Ornaments'
import { HIGHLIGHTS } from '../data/content'
import { block, cx, wrap } from '../lib/ui'

export default function Highlights({ items }) {
  const list = items || HIGHLIGHTS
  return (
    <section id="highlights" className={cx('relative overflow-hidden', block)}>
      <Pillars />
      <div className={cx(wrap, 'relative z-[1]')}>
        <SectionHead center title="Project highlights" text="The details that make every Palace City villa feel like a palace." />
        <ul className="m-0 grid list-none grid-cols-3 gap-x-[clamp(1.5rem,3vw,2.5rem)] gap-y-[clamp(2.5rem,5vw,4rem)] p-0 max-tablet:grid-cols-2 max-phablet:grid-cols-1">
          {list.map((h) => (
            <li key={h.title} data-reveal className="group text-center tablet:[&:nth-child(3n+2)]:mt-16">
              {h.img && (
                <figure className="mx-0 mt-0 mb-[1.5rem] aspect-[4/5] overflow-hidden rounded-t-full bg-surface p-[7px] shadow-[inset_0_0_0_1px_rgba(201,161,90,.75),0_28px_50px_-30px_color-mix(in_srgb,var(--color-shadow)_55%,transparent)]">
                  <img
                    className="block size-full rounded-t-full object-cover transition-transform duration-700 ease-[ease-out] group-hover:scale-[1.05]"
                    src={h.img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              )}
              <h3 className="text-[1.7rem] leading-[1.2]">{h.title}</h3>
              <p className="mx-auto mt-2 mb-0 max-w-[34ch] text-[.98rem] text-muted">{h.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

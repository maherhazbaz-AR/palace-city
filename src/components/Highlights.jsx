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
        <ul className="m-0 grid list-none grid-cols-3 gap-x-[clamp(1.5rem,3vw,2.5rem)] gap-y-[clamp(2rem,4vw,3.5rem)] p-0 max-tablet:grid-cols-2 max-phablet:grid-cols-1">
          {list.map((h) => (
            <li key={h.title} data-reveal className="group">
              {h.img && (
                <figure className="mx-0 mt-0 mb-[1.2rem] aspect-[4/3] overflow-hidden bg-white p-[6px] shadow-[inset_0_0_0_1px_rgba(201,161,90,.6),0_18px_40px_-26px_rgba(58,42,31,.5)]">
                  <img
                    className="block size-full object-cover outline outline-black/8 -outline-offset-1 transition-transform duration-600 ease-[ease-out] group-hover:scale-[1.04]"
                    src={h.img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              )}
              <h3 className="text-[1.55rem] leading-[1.2]">{h.title}</h3>
              <p className="mt-2 mb-0 text-[.98rem] text-muted">{h.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

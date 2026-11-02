import { btn, cx, wrap } from '../lib/ui'
import { useJump } from '../lib/site'

/** Announcement strip. Content can be overridden from WordPress (see useWordPress). */
export default function Banner({ wp }) {
  const jumpTo = useJump()
  const tag = wp ? wp.tag : 'Now open'
  const link = wp?.link
  const external = link && /^https?:/i.test(link.href)
  const buttonProps = link
    ? { href: link.href, ...(external && { target: '_blank', rel: 'noopener' }) }
    : jumpTo('lead', '#enquire')

  return (
    <section
      id="banner"
      aria-label="Announcement"
      className="relative bg-maroon py-[clamp(2.5rem,5vw,3.5rem)] text-[#FBF3E4] before:pointer-events-none before:absolute before:inset-2 before:border before:border-[rgba(233,205,123,.55)]"
    >
      <div className={cx(wrap, 'flex flex-wrap items-center gap-x-12 gap-y-8 max-phablet:flex-col max-phablet:items-start')}>
        <figure data-reveal hidden={!wp?.image} className="m-0 aspect-[4/3] w-[180px] overflow-hidden border border-[rgba(233,205,123,.6)]">
          {wp?.image && <img className="block size-full object-cover" src={wp.image} alt="" />}
        </figure>
        <div data-reveal className="min-w-[260px] flex-1">
          <p hidden={!tag} className="mt-0 mb-[.35rem] font-display text-[1.2rem] font-semibold text-[#E9CD7B] italic">
            {tag}
          </p>
          <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.12] text-[#FFF7E6]">
            {wp?.title || 'The show villa is open for private tours'}
          </h2>
          <p className="mt-2 mb-0 text-[rgba(251,243,228,.85)]">
            {wp?.text || 'Book a slot and walk through a finished Palace City villa at Akkarai, ECR.'}
          </p>
        </div>
        <a data-reveal className={btn('ivory', 'lg', 'max-phablet:w-full')} {...buttonProps}>
          {link?.label || 'Book your slot'}
        </a>
      </div>
    </section>
  )
}

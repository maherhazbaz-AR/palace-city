import { useEffect, useRef, useState } from 'react'
import { animate } from 'motion'
import { VILLA_OPTIONS, VISIT_OPTIONS } from '../data/content'
import { PHONE_LABEL, PHONE_TEL, btn, cx } from '../lib/ui'
import { prefersReducedMotion, useSite } from '../lib/site'

const field = 'mb-[1.15rem]'
const label = 'mb-[.3rem] block text-[.88rem] text-muted'
const control =
  'min-h-12 w-full rounded border border-line bg-ground px-[.9rem] py-[.7rem] text-ink transition-[border-color,box-shadow] duration-150 ease-[ease-out] ' +
  'focus:border-transparent focus:outline-2 focus:outline-offset-1 focus:outline-gold'
const err = 'mt-[.3rem] mb-0 text-[.85rem] text-[#A3361C]'

/**
 * Lead card that opens WhatsApp with the visitor's details filled in.
 * `idPrefix` keeps input ids unique ("h" = main enquiry, "v" = visit section).
 */
export default function LeadForm({
  idPrefix,
  heading,
  intro,
  submitLabel,
  sentText,
  askWhen = true,
  villa: controlledVilla,
  onVillaChange,
  tightHeading = false,
  className,
}) {
  const { askFor } = useSite()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [localVilla, setLocalVilla] = useState(VILLA_OPTIONS[0])
  const [when, setWhen] = useState(askWhen ? VISIT_OPTIONS[0] : 'Just send me the details')
  const [errors, setErrors] = useState({ name: '', phone: '' })
  const [done, setDone] = useState(false)
  const nameRef = useRef(null)
  const phoneRef = useRef(null)
  const sentRef = useRef(null)

  const villa = controlledVilla ?? localVilla
  const setVilla = onVillaChange ?? setLocalVilla

  useEffect(() => {
    if (done && !prefersReducedMotion()) {
      animate(sentRef.current, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    }
  }, [done])

  function submit(e) {
    e.preventDefault()
    let digits = phone.replace(/\D/g, '')
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
    const next = {
      name: name.trim() ? '' : 'Enter your name.',
      phone: /^[6-9]\d{9}$/.test(digits) ? '' : 'Enter a valid 10-digit mobile number.',
    }
    setErrors(next)
    if (next.name) return nameRef.current.focus()
    if (next.phone) return phoneRef.current.focus()

    const msg = `Hello, I’m interested in Adityaram Palace City.\nName: ${name.trim()}\nMobile: +91 ${digits}\nInterested in: ${villa}\nVisit: ${when}\nPlease share: ${askFor.current}.`
    window.open(`https://wa.me/919500461555?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
    setDone(true)
  }

  const h2 = cx('text-[1.75rem] leading-[1.15]', tightHeading && 'tracking-[-.01em]')

  return (
    <div
      className={cx(
        'relative rounded-lg bg-white p-[clamp(1.75rem,3.5vw,2.5rem)] text-ink shadow-[0_30px_70px_-35px_rgba(58,42,31,.35)]',
        'before:pointer-events-none before:absolute before:inset-[9px] before:rounded before:border before:border-[rgba(201,161,90,.5)]',
        'max-tablet:max-w-[560px]',
        className,
      )}
      data-reveal
    >
      {!done ? (
        <form noValidate onSubmit={submit}>
          <h2 className={h2}>{heading}</h2>
          <p className="my-[1em]">{intro}</p>

          <div className={field}>
            <label className={label} htmlFor={`${idPrefix}Name`}>Your name</label>
            <input ref={nameRef} className={control} id={`${idPrefix}Name`} name="name" autoComplete="name" required
              value={name} onChange={(e) => setName(e.target.value)} />
            <p className={err} aria-live="polite">{errors.name}</p>
          </div>

          <div className={field}>
            <label className={label} htmlFor={`${idPrefix}Phone`}>Mobile number</label>
            <div className="flex items-stretch">
              <span className="flex items-center rounded-l border border-r-0 border-line bg-white px-3 text-[.95rem] text-muted">+91</span>
              <input ref={phoneRef} className={cx(control, 'rounded-l-none')} id={`${idPrefix}Phone`} name="phone" type="tel"
                inputMode="numeric" autoComplete="tel-national" maxLength={14} required
                value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ''))} />
            </div>
            <p className={err} aria-live="polite">{errors.phone}</p>
          </div>

          <div className={field}>
            <label className={label} htmlFor={`${idPrefix}Villa`}>Interested in</label>
            <select className={control} id={`${idPrefix}Villa`} name="villa" value={villa} onChange={(e) => setVilla(e.target.value)}>
              {VILLA_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          {askWhen && (
            <div className={field}>
              <label className={label} htmlFor={`${idPrefix}When`}>When would you like to visit?</label>
              <select className={control} id={`${idPrefix}When`} name="when" value={when} onChange={(e) => setWhen(e.target.value)}>
                {VISIT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          )}

          <button className={btn('gold', 'lg', 'mt-[.35rem] w-full')} type="submit">{submitLabel}</button>
          <p className="mt-[.8rem] mb-0 text-[.82rem] text-muted">
            Opens WhatsApp with your details filled in. By submitting, you agree to be contacted by Adityaram Properties about this project.
          </p>
        </form>
      ) : (
        <div ref={sentRef} role="status" className="text-left">
          <h2 className={h2}>One last step</h2>
          <p className="mt-2 mb-4 text-muted">{sentText}</p>
          <a className={btn('gold', 'lg', 'w-full')} href={PHONE_TEL}>Call {PHONE_LABEL}</a>
        </div>
      )}
    </div>
  )
}

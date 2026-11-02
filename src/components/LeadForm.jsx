import { useEffect, useRef, useState } from 'react'
import { animate } from 'motion'
import { VILLA_OPTIONS, VISIT_OPTIONS } from '../data/content'
import { MessageCircle } from 'lucide-react'
import { PHONE_LABEL, PHONE_TEL, btn, cx } from '../lib/ui'
import { prefersReducedMotion, useSite } from '../lib/site'
import { preloadRecaptcha, submitLead } from '../lib/cf7'
import { THANK_YOU_PATH, navigate } from '../lib/route'

/** Set to the Privacy Policy page URL and the consent line below becomes a link. */
const PRIVACY_URL = ''

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const field = 'mb-[1.15rem]'
const label = 'mb-[.3rem] block text-[.88rem] text-muted'
const control =
  'min-h-12 w-full rounded border border-line bg-ground px-[.9rem] py-[.7rem] text-ink transition-[border-color,box-shadow] duration-150 ease-[ease-out] ' +
  'focus:border-transparent focus:outline-2 focus:outline-offset-1 focus:outline-gold'
const err = 'mt-[.3rem] mb-0 text-[.85rem] text-danger'

/**
 * Lead card. Submitting sends the details to Contact Form 7 (WordPress) and waits for the
 * result. On success the visitor goes to the thank-you page. WhatsApp is never opened
 * automatically; it is only a fallback button if the submission fails.
 * `idPrefix` keeps input ids unique ("h" = main enquiry, "v" = visit section).
 */
export default function LeadForm({
  idPrefix,
  heading,
  intro,
  submitLabel,
  askWhen = true,
  villa: controlledVilla,
  onVillaChange,
  tightHeading = false,
  className,
}) {
  const { askFor } = useSite()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [localVilla, setLocalVilla] = useState(VILLA_OPTIONS[0])
  const [when, setWhen] = useState(askWhen ? VISIT_OPTIONS[0] : 'Just send me the details')
  const [errors, setErrors] = useState({ name: '', phone: '', email: '' })
  const [status, setStatus] = useState('idle') // idle | sending | failed
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const nameRef = useRef(null)
  const phoneRef = useRef(null)
  const emailRef = useRef(null)
  const sentRef = useRef(null)

  const villa = controlledVilla ?? localVilla
  const setVilla = onVillaChange ?? setLocalVilla

  useEffect(() => {
    if (status === 'failed' && !prefersReducedMotion()) {
      animate(sentRef.current, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    }
  }, [status])

  async function submit(e) {
    e.preventDefault()
    if (status === 'sending') return
    let digits = phone.replace(/\D/g, '')
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
    const next = {
      name: name.trim() ? '' : 'Enter your name.',
      phone: /^[6-9]\d{9}$/.test(digits) ? '' : 'Enter a valid 10-digit mobile number.',
      email: EMAIL_PATTERN.test(email.trim()) ? '' : 'Enter a valid email address.',
    }
    setErrors(next)
    if (next.name) return nameRef.current.focus()
    if (next.phone) return phoneRef.current.focus()
    if (next.email) return emailRef.current.focus()

    const msg = `Hello, I’m interested in Adityaram Palace City.\nName: ${name.trim()}\nMobile: +91 ${digits}\nInterested in: ${villa}\nVisit: ${when}\nPlease share: ${askFor.current}.`
    setWhatsappUrl(`https://wa.me/919500461555?text=${encodeURIComponent(msg)}`)
    setStatus('sending')
    const { ok } = await submitLead({ name: name.trim(), phone: digits, email: email.trim(), villa, visit: when, note: askFor.current })
    if (ok) return navigate(THANK_YOU_PATH, { name: name.trim() })
    setStatus('failed')
  }

  const h2 = cx('text-[1.75rem] leading-[1.15]', tightHeading && 'tracking-[-.01em]')

  return (
    <div
      className={cx(
        'tone-palace relative rounded-lg bg-surface p-[clamp(1.75rem,3.5vw,2.5rem)] text-ink shadow-[0_30px_70px_-35px_color-mix(in_srgb,var(--color-shadow)_35%,transparent)]',
        'before:pointer-events-none before:absolute before:inset-[9px] before:rounded before:border before:border-[rgba(201,161,90,.5)]',
        'max-tablet:max-w-[560px]',
        className,
      )}
      data-reveal
    >
      {status === 'idle' || status === 'sending' ? (
        <form noValidate onSubmit={submit} onFocus={preloadRecaptcha} aria-busy={status === 'sending'}>
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
              <span className="flex items-center rounded-l border border-r-0 border-line bg-surface px-3 text-[.95rem] text-muted">+91</span>
              <input ref={phoneRef} className={cx(control, 'rounded-l-none')} id={`${idPrefix}Phone`} name="phone" type="tel"
                inputMode="numeric" autoComplete="tel-national" maxLength={14} required
                value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ''))} />
            </div>
            <p className={err} aria-live="polite">{errors.phone}</p>
          </div>

          <div className={field}>
            <label className={label} htmlFor={`${idPrefix}Email`}>Email</label>
            <input ref={emailRef} className={control} id={`${idPrefix}Email`} name="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className={err} aria-live="polite">{errors.email}</p>
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

          <button className={btn('maroon', 'lg', 'mt-[.35rem] w-full disabled:cursor-progress disabled:opacity-70')} type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : submitLabel}
          </button>
          <p className="mt-[.8rem] mb-0 text-[.82rem] text-muted">
            Your enquiry goes straight to our team. By submitting this, I accept the{' '}
            {PRIVACY_URL ? <a className="text-accent underline" href={PRIVACY_URL} target="_blank" rel="noreferrer">Privacy Policy</a> : 'Privacy Policy'}
            {' '}and authorise contact for relevant updates, overriding DNC/NDNC preferences.
          </p>
        </form>
      ) : (
        <div ref={sentRef} role="status" className="text-left">
          <h2 className={h2}>Almost there</h2>
          <p className="mt-2 mb-5 text-muted">
            We couldn’t send your details online just now. Please message us on WhatsApp or call, and we’ll take it from there.
          </p>
          <div className="flex flex-col gap-3">
            <a
              className={btn('wa', 'lg', 'w-full')}
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" strokeWidth={1.8} />
              Send on WhatsApp
            </a>
            <a className={btn('line', 'lg', 'w-full')} href={PHONE_TEL}>Call {PHONE_LABEL}</a>
          </div>
        </div>
      )}
    </div>
  )
}

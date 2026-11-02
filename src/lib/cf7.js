import { WP_SITE } from '../hooks/useWordPress'

/* ============================================================
   CONTACT FORM 7
   Leads are posted to the Contact Form 7 form on the WordPress site
   (REST endpoint: /wp-json/contact-form-7/v1/contact-forms/{id}/feedback).
   Field names must match the tags in that CF7 form.
   ============================================================ */
export const CF7_FORM_ID = 7

/** Fixed values the CF7 form carries as hidden fields (CRM tagging). */
const CRM_FIELDS = {
  'lead-status': 'Incoming',
  'lead-source': 'Website',
  'lead-medium': 'Digital',
  'lead-sub-source': 'Microsite',
  project: 'Adityaram Palace City',
}

const SUBMIT_TIMEOUT_MS = 12000

/* ============================================================
   reCAPTCHA v3
   The CF7 form on the WordPress site rejects any submission without a reCAPTCHA token
   (status "spam"), so the token is fetched here and sent as `_wpcf7_recaptcha_response`.
   Google only issues tokens on domains listed for this key in the reCAPTCHA admin console:
   every domain this site is served from (Vercel production URL, custom domain) must be added there.
   Same key as the WordPress site (it is public in that page's source); override with
   VITE_RECAPTCHA_SITE_KEY, or set it empty to skip the token.
   ============================================================ */
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '6LdkjgwuAAAAADY0osR9vAdB8LGI1uaV9IHxyo3Y'
const RECAPTCHA_ACTION = 'contactform'
const RECAPTCHA_TIMEOUT_MS = 6000

let recaptchaLoading = null

/** Loads Google's script once, on demand. Resolves to `grecaptcha`; rejects if it can't load (blocked, offline). */
const loadRecaptcha = () => {
  if (!RECAPTCHA_SITE_KEY) return Promise.reject(new Error('reCAPTCHA is switched off'))
  if (recaptchaLoading) return recaptchaLoading
  recaptchaLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    script.onload = () => window.grecaptcha.ready(() => resolve(window.grecaptcha))
    script.onerror = () => {
      recaptchaLoading = null
      script.remove()
      reject(new Error('reCAPTCHA script failed to load'))
    }
    document.head.append(script)
  })
  return recaptchaLoading
}

/** Warms the script up (e.g. when the visitor first touches the form) so submitting isn't delayed by it. */
export const preloadRecaptcha = () => {
  loadRecaptcha().catch(() => {})
}

/** A fresh token (valid ~2 minutes), or '' when none can be had; CF7 then answers "spam" and the form shows its fallback. */
const getRecaptchaToken = async () => {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('reCAPTCHA timed out')), RECAPTCHA_TIMEOUT_MS)
  })
  try {
    const grecaptcha = await Promise.race([loadRecaptcha(), timeout])
    return await Promise.race([grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: RECAPTCHA_ACTION }), timeout])
  } catch (error) {
    console.warn('[lead] No reCAPTCHA token:', error?.message || error)
    return ''
  } finally {
    clearTimeout(timer)
  }
}

const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid']
const STORAGE_KEY = 'attribution'

const readStored = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

/** Remembers UTM/gclid values from the landing URL for the rest of the visit. */
const captureAttribution = () => {
  const params = new URLSearchParams(window.location.search)
  const found = Object.fromEntries(ATTRIBUTION_KEYS.filter((k) => params.get(k)).map((k) => [k, params.get(k)]))
  if (!Object.keys(found).length) return readStored()
  const merged = { ...readStored(), ...found }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  } catch {
    /* storage unavailable: attribution still applies to this page view */
  }
  return merged
}

if (typeof window !== 'undefined') captureAttribution()

/**
 * Sends a lead to Contact Form 7. Resolves to `{ ok, status }` and never throws; the form
 * shows a WhatsApp/phone fallback when `ok` is false.
 * `villa` and `visit` are sent as extra fields: they reach the inbox once
 * `[text villa]` / `[text visit-time]` tags exist in the CF7 form.
 */
export async function submitLead({ name, phone, email, villa, visit, note }) {
  if (!WP_SITE) return { ok: false, status: 'disabled' }

  const attribution = readStored()
  const recaptchaToken = await getRecaptchaToken()
  const body = new FormData()
  body.set('_wpcf7', String(CF7_FORM_ID))
  body.set('_wpcf7_unit_tag', `wpcf7-f${CF7_FORM_ID}-o1`)
  body.set('_wpcf7_container_post', '0')
  body.set('_wpcf7_locale', 'en_US')
  body.set('_wpcf7_recaptcha_response', recaptchaToken)
  body.set('last-name', name)
  body.set('your-phone', `+91 ${phone}`)
  body.set('your-email', email)
  body.set('villa', villa)
  body.set('visit-time', visit)
  body.set('enquiry-note', note)
  Object.entries(CRM_FIELDS).forEach(([key, value]) => body.set(key, value))
  ATTRIBUTION_KEYS.forEach((key) => body.set(key.replace('_', '-'), attribution[key] || ''))

  try {
    const url = `${WP_SITE.replace(/\/+$/, '')}/wp-json/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`
    const response = await fetch(url, { method: 'POST', body, signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS) })
    const result = await response.json()
    // Anything but "mail_sent" shows the visitor the fallback; the real reason (spam, mail_failed, ...) goes to the console.
    if (result.status !== 'mail_sent') console.warn('[lead] Contact Form 7 returned:', result.status, result.message)
    return { ok: result.status === 'mail_sent', status: result.status }
  } catch {
    return { ok: false, status: 'network_error' }
  }
}

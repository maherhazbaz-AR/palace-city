import { useEffect, useState } from 'react'
import { WP_SITE, safeUrl, text } from './useWordPress'

/* ============================================================
   WORDPRESS ANNOUNCEMENT BANNER
   WordPress (Dashboard > Banner) fully controls the banner. The site shows exactly
   what is saved there and has no built-in banner text of its own.

     GET {VITE_WP_URL}/wp-json/site/v1/banner
     {
       "enabled": true,
       "tag": "Now open",
       "title": "...", "text": "...",
       "link": { "href": "https://..." | null, "label": "..." } | null,
       "image": "desktop and tablet image URL" | null,
       "imageMobile": "mobile image URL" | null,
       "imageAlt": "..."
     }

   useBanner() returns { status, banner }:
     status 'loading' -> waiting for the first answer
     status 'ready'   -> WordPress answered; `banner` holds its content
     status 'error'   -> WordPress could not be reached, timed out or sent something
                         unusable (also when VITE_WP_URL is empty); `banner` is null
   <Banner> renders nothing unless the status is 'ready' and there is something to show.

   The request runs in the browser with `cache: 'no-store'`, so an edit in WordPress shows
   on the next page load (and when the visitor returns to the tab). The host itself may
   cache the endpoint for about a minute.
   ============================================================ */
const ENDPOINT = '/wp-json/site/v1/banner'

const TIMEOUT_MS = 6000 // an unanswered request counts as an error
const REFRESH_AFTER_MS = 30_000 // minimum time between refreshes when the visitor comes back to the tab

/** Plain text: decodes entities and strips any markup. */
const str = (value) => (typeof value === 'string' ? text(value) : '')

/**
 * Link URL. Not parsed as HTML (that would corrupt query strings such as "&region="); only the
 * escaped-ampersand forms WordPress can emit (&amp; &#038; &#x26;) are turned back into "&".
 */
const linkUrl = (value) =>
  typeof value === 'string' ? safeUrl(value.trim().replace(/&(?:amp|#0*38|#x0*26);/gi, '&')) : ''

/** Images must be absolute http(s) URLs. */
const imageUrl = (value) => (typeof value === 'string' && /^https?:\/\//i.test(value.trim()) ? value.trim() : '')

/**
 * Turns the endpoint's JSON into what <Banner> expects (empty strings for anything missing).
 * Returns null when the answer is not a JSON object, which the hook treats as an error.
 */
export function normalizeBanner(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null

  const rawLink = data.link && typeof data.link === 'object' ? data.link : null

  return {
    enabled: data.enabled !== false,
    tag: str(data.tag),
    title: str(data.title),
    text: str(data.text),
    link: { href: rawLink ? linkUrl(rawLink.href) : '', label: rawLink ? str(rawLink.label) : '' },
    image: imageUrl(data.image),
    imageMobile: imageUrl(data.imageMobile),
    imageAlt: str(data.imageAlt),
  }
}

/** Banner content from WordPress and the state of the request (see the notes at the top of this file). */
export function useBanner() {
  // With WordPress switched off (empty VITE_WP_URL) there is nothing to wait for.
  const [state, setState] = useState({ status: WP_SITE ? 'loading' : 'error', banner: null })

  useEffect(() => {
    if (!WP_SITE) return
    let stopped = false
    let loaded = false
    let inFlight = false
    let lastLoad = 0
    let controller
    let timer

    const fail = () => {
      // Once a banner has been shown, a failed refresh keeps it rather than blanking the page.
      if (!stopped && !loaded) setState({ status: 'error', banner: null })
    }

    const load = () => {
      inFlight = true
      controller = new AbortController()
      timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
      lastLoad = performance.now()

      fetch(WP_SITE + ENDPOINT, { signal: controller.signal, cache: 'no-store' })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          const banner = normalizeBanner(data)
          if (stopped) return
          if (!banner) return fail()
          loaded = true
          setState({ status: 'ready', banner })
        })
        .catch(fail) // offline, blocked, timed out or not JSON
        .finally(() => {
          inFlight = false
          clearTimeout(timer)
        })
    }

    // Pick up dashboard edits (or recover from an error) when the visitor comes back to this tab or window.
    const refresh = () => {
      if (document.visibilityState === 'visible' && !inFlight && performance.now() - lastLoad > REFRESH_AFTER_MS) load()
    }

    load()
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)

    return () => {
      stopped = true
      controller?.abort()
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  return state
}

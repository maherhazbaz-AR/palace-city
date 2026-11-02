import { useCallback, useEffect, useState } from 'react'

/* A tiny history-based router: the site is one page plus a /thank-you page, so a full
   router isn't needed. The host must serve index.html for /thank-you (see README). */
export const THANK_YOU_PATH = '/thank-you'

const currentPath = () => window.location.pathname.replace(/\/+$/, '') || '/'

/** Current path, kept in sync with the Back/Forward buttons. */
export function usePath() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const onPop = () => setPath(currentPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return path
}

/** Moves to `to` without a reload. `state` is stored in the history entry, so it survives a refresh. */
export function navigate(to, state = null) {
  window.history.pushState(state, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

/** Click handler for same-site links: keeps a real href but avoids a reload. */
export const useInternalLink = (to) =>
  useCallback(
    (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      navigate(to)
    },
    [to],
  )

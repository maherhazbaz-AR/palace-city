import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SiteContext = createContext(null)

/**
 * Page-wide actions: in-page jumps (which also close the mobile menu),
 * the "what to send me" note for WhatsApp, and the villa picked from the
 * villa list for the main enquiry form.
 */
export function SiteProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [enquiryVilla, setEnquiryVilla] = useState('Not sure yet')
  const askFor = useRef('Price list and floor plans')

  const goLead = useCallback(() => {
    const reduce = prefersReducedMotion()
    document.getElementById('enquire')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    setTimeout(() => document.getElementById('hName')?.focus({ preventScroll: true }), reduce ? 0 : 650)
  }, [])

  const jump = useCallback(
    (id) => {
      setMenuOpen(false)
      const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
      if (id === 'lead') return goLead()
      if (id === 'top') return window.scrollTo({ top: 0, behavior })
      document.getElementById(id)?.scrollIntoView({ behavior })
    },
    [goLead],
  )

  const value = useMemo(
    () => ({
      menuOpen,
      setMenuOpen,
      jump,
      askFor,
      enquiryVilla,
      setEnquiryVilla,
      chooseVilla: (name) => {
        setEnquiryVilla(name)
        goLead()
      },
    }),
    [menuOpen, jump, goLead, enquiryVilla],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)

/**
 * Props for an in-page link: keeps a real href for no-JS / open-in-new-tab,
 * but scrolls smoothly on click. `ask` sets what the WhatsApp message requests.
 */
export function useJump() {
  const { jump, askFor } = useSite()
  return (target, href, ask) => ({
    href,
    onClick: (e) => {
      e.preventDefault()
      if (ask) askFor.current = ask
      jump(target)
    },
  })
}

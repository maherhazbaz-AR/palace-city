import { useEffect } from 'react'

/** Sets the document title (and optionally `noindex`) while a page is mounted, then restores both. */
export function usePageMeta({ title, noindex = false }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title
    let robots
    if (noindex) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      robots.content = 'noindex'
      document.head.append(robots)
    }
    return () => {
      document.title = previousTitle
      robots?.remove()
    }
  }, [title, noindex])
}

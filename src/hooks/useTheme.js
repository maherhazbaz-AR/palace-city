import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'
const root = () => document.documentElement

const readStored = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

const systemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

/** Light/dark theme. Follows the OS until the visitor picks one; the choice is remembered. */
export function useTheme() {
  const [theme, setTheme] = useState(() => root().dataset.theme || readStored() || systemTheme())

  useEffect(() => {
    root().dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (!readStored()) setTheme(query.matches ? 'dark' : 'light')
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* private mode: the choice just won't persist */
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (document.startViewTransition && !reduce) {
      document.startViewTransition(() => {
        root().dataset.theme = next
        setTheme(next)
      })
    } else {
      setTheme(next)
    }
  }, [theme])

  return { theme, toggle }
}

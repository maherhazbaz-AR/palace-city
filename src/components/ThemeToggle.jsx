import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { cx } from '../lib/ui'

// Both icons stay mounted and cross-fade with a small rotation, so the swap is interruptible.
const icon = 'col-start-1 row-start-1 transition-[opacity,rotate,scale] duration-200 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none'
const shown = 'opacity-100 rotate-0 scale-100'
const hidden = 'opacity-0 scale-75'

export default function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cx(
        'inline-grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-inherit',
        'transition-[background-color,scale] duration-150 ease-[ease-out] hover:bg-ink/10 active:scale-[.92]',
        className,
      )}
    >
      <Sun size={19} strokeWidth={1.6} aria-hidden="true" className={cx(icon, isDark ? shown : cx(hidden, '-rotate-45'))} />
      <Moon size={19} strokeWidth={1.6} aria-hidden="true" className={cx(icon, isDark ? cx(hidden, 'rotate-45') : shown)} />
    </button>
  )
}

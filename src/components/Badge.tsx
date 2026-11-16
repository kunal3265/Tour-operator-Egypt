import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type BadgeTone = 'peach' | 'brand' | 'ink' | 'success' | 'danger' | 'glass' | 'neutral'

const tones: Record<BadgeTone, string> = {
  peach: 'bg-peach text-ink',
  brand: 'bg-brand-soft text-brand-2',
  ink: 'bg-ink text-white',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  glass: 'bg-white/90 text-ink backdrop-blur',
  neutral: 'bg-sand text-ink',
}

export function Badge({ tone = 'neutral', children, className, icon }: { tone?: BadgeTone; children: ReactNode; className?: string; icon?: ReactNode }) {
  return (
    <span className={cx('inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium whitespace-nowrap', tones[tone], className)}>
      {icon}
      {children}
    </span>
  )
}

/** Toggle chip used by the filters. */
export function Chip({ active, children, className, ...rest }: { active?: boolean; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(
        'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)] disabled:pointer-events-none disabled:opacity-45',
        active ? 'border-ink bg-ink text-white hov:bg-ink-2' : 'border-line-strong bg-surface text-ink hov:border-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

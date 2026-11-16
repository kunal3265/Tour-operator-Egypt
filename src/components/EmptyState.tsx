import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function EmptyState({ icon, title, body, action, className }: { icon: ReactNode; title: string; body: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center gap-4 rounded-[var(--radius-md)] border border-dashed border-line-strong bg-surface/60 px-6 py-14 text-center', className)}>
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-peach text-ink">{icon}</span>
      <h3 className="font-sans text-[18px] font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-[14px] leading-relaxed text-body">{body}</p>
      {action}
    </div>
  )
}

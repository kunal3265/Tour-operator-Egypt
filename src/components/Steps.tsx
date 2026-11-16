import { Check } from 'lucide-react'

import { cx } from '../lib/cx'

export function Steps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Booking progress">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={s} className="flex items-center gap-2 sm:gap-4" aria-current={active ? 'step' : undefined}>
            <span className="flex items-center gap-2.5">
              <span
                className={cx(
                  'inline-flex size-8 items-center justify-center rounded-full text-[13px] font-semibold transition-colors',
                  done && 'bg-ink text-white',
                  active && 'bg-brand text-white',
                  !done && !active && 'border border-line-strong bg-surface text-body',
                )}
              >
                {done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className={cx('hidden text-[14px] sm:inline', active ? 'font-semibold text-ink' : 'text-body')}>{s}</span>
              <span className="sr-only">{done ? '(done)' : active ? '(current)' : ''}</span>
            </span>
            {i < steps.length - 1 && <span className="h-px w-6 bg-line-strong sm:w-12" aria-hidden />}
          </li>
        )
      })}
    </ol>
  )
}

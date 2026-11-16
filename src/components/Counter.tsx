import { Minus, Plus } from 'lucide-react'

import { cx } from '../lib/cx'
import { IconButton } from './Button'

/** Labelled +/- number control (adults, children). */
export function Counter({ label, note, value, min = 0, max = 99, onChange, error }: { label: string; note?: string; value: number; min?: number; max?: number; onChange: (n: number) => void; error?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-[15px] font-medium text-ink" id={`ctr-${label}`}>
          {label}
        </p>
        {note && <p className="text-[13px] text-body">{note}</p>}
      </div>
      <div className={cx('flex items-center gap-3', error && 'text-danger')} role="group" aria-labelledby={`ctr-${label}`}>
        <IconButton size="sm" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
          <Minus className="size-4" aria-hidden />
        </IconButton>
        <output aria-live="polite" className="w-6 text-center text-[17px] font-semibold text-ink tabular-nums">
          {value}
        </output>
        <IconButton size="sm" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          <Plus className="size-4" aria-hidden />
        </IconButton>
      </div>
    </div>
  )
}

import { Star } from 'lucide-react'
import { useId, useState } from 'react'

import { cx } from '../lib/cx'

export function Stars({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-0.5', className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden style={{ width: size, height: size }} className={i <= Math.round(value) ? 'fill-sun text-sun' : 'fill-line text-line'} />
      ))}
    </span>
  )
}

/** Radio-group star picker for the review form. */
export function StarInput({ value, onChange, invalid, describedBy }: { value: number; onChange: (n: number) => void; invalid?: boolean; describedBy?: string }) {
  const name = useId()
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div role="radiogroup" aria-label="Rating" aria-invalid={invalid || undefined} aria-describedby={describedBy} className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <label key={i} className="relative cursor-pointer rounded-md p-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand" onMouseEnter={() => setHover(i)}>
          <input type="radio" name={name} value={i} checked={value === i} onChange={() => onChange(i)} className="sr-only" aria-label={`${i} star${i > 1 ? 's' : ''}`} />
          <Star aria-hidden className={cx('size-8 transition-colors', i <= shown ? 'fill-sun text-sun' : 'fill-transparent text-line-strong')} />
        </label>
      ))}
    </div>
  )
}

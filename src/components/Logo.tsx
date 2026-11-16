import { Link } from 'react-router'

import { BRAND } from '../data'
import { cx } from '../lib/cx'

/** Wordmark with a small sun-over-dune mark. `light` for use on photography. */
export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" aria-label={`${BRAND.fullName}, home`} className={cx('inline-flex min-h-10 items-center gap-2 rounded-md', light ? 'text-white on-dark' : 'text-ink', className)}>
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
        <circle cx="20.5" cy="7.5" r="3.2" fill="currentColor" opacity="0.85" />
        <path d="M2 23 11 8l9 15z" fill="currentColor" />
        <path d="M14.5 23 20 14l6 9z" fill="currentColor" opacity="0.7" />
      </svg>
      <span className="font-sans text-[21px] font-semibold tracking-[-0.01em]">{BRAND.name}</span>
    </Link>
  )
}

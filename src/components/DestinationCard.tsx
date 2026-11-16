import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

import type { Destination } from '../data'
import { cx } from '../lib/cx'
import { Photo } from './Photo'

/** Tall photo card with the name over a gradient, used for destinations. */
export function DestinationCard({ d, tours, className }: { d: Destination; tours: number; className?: string }) {
  return (
    <Link to={`/destinations/${d.slug}`} className={cx('group relative isolate flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[var(--radius-md)] bg-ink p-6 text-white on-dark', className)}>
      <Photo name={d.photo} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hov:scale-[1.06]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_35%,rgb(29_26_22/0.82)_100%)]" />
      <span className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full border border-white/80 transition-colors group-hov:bg-white group-hov:text-ink">
        <ArrowUpRight className="size-5" aria-hidden />
      </span>
      <p className="eyebrow text-white">{d.region} · {tours} {tours === 1 ? 'tour' : 'tours'}</p>
      <h3 className="display mt-2 text-[2rem] text-white">{d.name}</h3>
      <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-white">{d.summary}</p>
    </Link>
  )
}

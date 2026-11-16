import { Clock, Heart, Users } from 'lucide-react'
import { Link } from 'react-router'

import type { Tour } from '../data'
import { cx } from '../lib/cx'
import { useStore } from '../lib/store'
import { money } from '../shared/departures'
import { Badge } from './Badge'
import { useToast } from './Toast'
import { Photo } from './Photo'
import { Stars } from './Stars'

export function SaveButton({ slug, title, className }: { slug: string; title: string; className?: string }) {
  const { isSaved, toggleSaved } = useStore()
  const toast = useToast()
  const on = isSaved(slug)
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Remove ${title} from saved tours` : `Save ${title}`}
      onClick={(e) => {
        e.preventDefault()
        toggleSaved(slug)
        toast(on ? 'Removed from your saved tours' : 'Saved to My trips')
      }}
      className={cx('inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-[transform,background-color] hov:bg-white pressed:scale-90', className)}
    >
      <Heart className={cx('size-[18px] transition-colors', on && 'fill-danger text-danger')} aria-hidden />
    </button>
  )
}

export function TourCard({ tour, className, priority }: { tour: Tour; className?: string; priority?: boolean }) {
  return (
    <article className={cx('group relative flex flex-col gap-4', className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-sand">
        <Photo name={tour.photo} alt="" loading={priority ? 'eager' : 'lazy'} className="size-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hov:scale-[1.05]" />
        {tour.badge && <Badge tone="glass" className="absolute top-3 left-3">{tour.badge}</Badge>}
        <SaveButton slug={tour.slug} title={tour.title} className="absolute top-3 right-3 z-10" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-medium tracking-wide text-body uppercase">{tour.route}</p>
        <h3 className="font-sans text-[18px] leading-snug font-semibold text-ink">
          <Link to={`/tours/${tour.slug}`} className="after:absolute after:inset-0 after:rounded-[var(--radius-md)] focus-visible:outline-none [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-offset-4 [&:focus-visible]:after:outline-brand">
            {tour.title}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-body">
          <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" aria-hidden />{tour.days} days</span>
          <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" aria-hidden />Max {tour.groupMax}</span>
          <span className="inline-flex items-center gap-1.5"><Stars value={tour.rating} size={13} />{tour.rating.toFixed(1)} ({tour.reviews})</span>
        </div>
        <p className="mt-1 text-[14px] text-body">
          From <span className="text-[18px] font-semibold text-ink">{money(tour.price)}</span> per person
        </p>
      </div>
    </article>
  )
}

export function TourCardSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <div className="skeleton aspect-[4/3] rounded-[var(--radius-md)]" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-5 w-4/5 rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  )
}

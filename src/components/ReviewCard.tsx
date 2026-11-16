import { Quote } from 'lucide-react'
import { Link } from 'react-router'

import { TOURS } from '../data'
import { cx } from '../lib/cx'
import { formatDate } from '../shared/departures'
import { Badge } from './Badge'
import { Stars } from './Stars'

export type ReviewLike = { id: string; name: string; from: string; tour: string; rating: number; title: string; body: string; date: string; mine?: boolean }

export function ReviewCard({ review, className, showTour = true }: { review: ReviewLike; className?: string; showTour?: boolean }) {
  const tour = TOURS.find((t) => t.slug === review.tour)
  const initials = review.name.split(/\s|&/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('')
  return (
    <article className={cx('flex h-full flex-col gap-4 rounded-[var(--radius-md)] bg-surface p-7 shadow-card', className)}>
      <div className="flex items-center justify-between">
        <Stars value={review.rating} />
        {review.mine ? <Badge tone="brand">Your review</Badge> : <Quote className="size-6 text-peach-2" aria-hidden />}
      </div>
      <h3 className="font-sans text-[17px] leading-snug font-semibold text-ink">{review.title}</h3>
      <p className="flex-1 text-[14px] leading-relaxed text-body">{review.body}</p>
      <div className="flex items-center gap-3 border-t border-line pt-4">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-peach text-[13px] font-semibold text-ink" aria-hidden>
          {initials}
        </span>
        <div className="min-w-0 text-[13px]">
          <p className="font-semibold text-ink">{review.name} <span className="font-normal text-body">· {review.from}</span></p>
          <p className="text-body">
            {showTour && tour ? (
              <Link to={`/tours/${tour.slug}`} className="relative z-10 underline-offset-2 hov:text-ink hov:underline">
                {tour.title}
              </Link>
            ) : null}
            {showTour && tour ? ' · ' : ''}
            {formatDate(review.date, { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </article>
  )
}

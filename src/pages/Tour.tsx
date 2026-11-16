import { Check, Clock, Gauge, MapPin, MessageCircle, Minus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { Counter } from '../components/Counter'
import { Modal } from '../components/Modal'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { ReviewCard } from '../components/ReviewCard'
import { SectionHeading } from '../components/SectionHeading'
import { Stars } from '../components/Stars'
import { SaveButton, TourCard } from '../components/TourCard'
import { DESTINATIONS, REVIEWS, TOURS } from '../data'
import { cx } from '../lib/cx'
import { IMAGE_ALT, type PhotoKey } from '../lib/images'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { addDays, formatDate, money, type Departure } from '../shared/departures'
import { NotFound } from './NotFound'

/** Loads the next departures from the Worker; shows skeleton rows meanwhile. */
export function useDepartures(slug: string | undefined) {
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; list: Departure[] }>({ status: 'loading', list: [] })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (!slug) return
    let live = true
    setState({ status: 'loading', list: [] })
    fetch(`/api/tours/${slug}/departures`)
      .then((r) => (r.ok ? (r.json() as Promise<{ departures: Departure[] }>) : Promise.reject(r.status)))
      .then((j: { departures: Departure[] }) => live && setState({ status: 'ready', list: j.departures }))
      .catch(() => live && setState({ status: 'error', list: [] }))
    return () => {
      live = false
    }
  }, [slug, attempt])
  return { ...state, retry: () => setAttempt((a) => a + 1) }
}

export function DepartureTable({ slug, days, selected, onSelect }: { slug: string; days: number; selected?: string; onSelect: (d: Departure) => void }) {
  const { status, list, retry } = useDepartures(slug)
  if (status === 'error')
    return (
      <div role="alert" className="flex flex-col items-start gap-3 rounded-[var(--radius-md)] bg-danger-soft p-5 text-[14px] text-danger">
        We could not load the departure dates.
        <Button variant="outline" size="sm" onClick={retry}>Try again</Button>
      </div>
    )
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] bg-surface shadow-card">
      <table className="w-full text-left text-[14px]">
        <caption className="sr-only">Departure dates and prices per person</caption>
        <thead className="bg-sand/60 text-[12px] tracking-wide text-ink uppercase">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Dates</th>
            <th scope="col" className="hidden px-5 py-3 font-semibold sm:table-cell">Season</th>
            <th scope="col" className="px-5 py-3 font-semibold">Availability</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">From</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {status === 'loading'
            ? Array.from({ length: 5 }, (_, i) => (
                <tr key={i} aria-hidden>
                  <td className="px-5 py-4" colSpan={4}><div className="skeleton h-5 rounded" /></td>
                </tr>
              ))
            : list.slice(0, 8).map((d) => {
                const full = d.seatsLeft === 0
                const isSel = selected === d.date
                return (
                  <tr key={d.date} className={cx('transition-colors', isSel && 'bg-brand-soft/60', !full && 'hover:bg-sand/40')}>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        disabled={full}
                        aria-pressed={isSel}
                        onClick={() => onSelect(d)}
                        className="flex min-h-10 flex-col items-start text-left disabled:cursor-not-allowed"
                      >
                        <span className={cx('font-semibold', full ? 'text-body line-through' : 'text-ink')}>{formatDate(d.date, { day: 'numeric', month: 'short' })} – {formatDate(addDays(d.date, days - 1))}</span>
                        <span className="text-[12px] text-body">{isSel ? 'Selected' : full ? 'Full' : 'Choose this date'}</span>
                      </button>
                    </td>
                    <td className="hidden px-5 py-3 text-body sm:table-cell">{d.season}</td>
                    <td className="px-5 py-3">
                      {full ? <Badge tone="danger">Full</Badge> : d.seatsLeft <= 3 ? <Badge tone="peach">{d.seatsLeft} left</Badge> : <Badge tone="success">Available</Badge>}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-ink">{money(d.price)}</td>
                  </tr>
                )
              })}
        </tbody>
      </table>
    </div>
  )
}

function Gallery({ photos }: { photos: PhotoKey[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const shown = photos.slice(0, 3)
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {shown.map((p, i) => (
          <button key={p} type="button" onClick={() => setOpen(i)} className={cx('group overflow-hidden rounded-[var(--radius-sm)]', i === 0 && 'col-span-2 sm:col-span-1')} aria-label={`Open photo: ${IMAGE_ALT[p]}`}>
            <Photo name={p} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hov:scale-105" />
          </button>
        ))}
      </div>
      <Modal open={open !== null} onClose={() => setOpen(null)} title={open !== null ? IMAGE_ALT[shown[open]] : ''}>
        {open !== null && (
          <div className="flex flex-col gap-4">
            <Photo name={shown[open]} alt="" className="w-full rounded-[var(--radius-sm)]" />
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setOpen((open + shown.length - 1) % shown.length)}>Previous</Button>
              <span className="self-center text-[13px] text-body">{open + 1} of {shown.length}</span>
              <Button variant="outline" size="sm" onClick={() => setOpen((open + 1) % shown.length)}>Next</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export function TourPage() {
  const { slug } = useParams()
  const tour = TOURS.find((t) => t.slug === slug)
  useDocumentTitle(tour?.title ?? 'Tour not found')
  const navigate = useNavigate()
  const { trips } = useStore()
  const [date, setDate] = useState<Departure | null>(null)
  const [adults, setAdults] = useState(2)
  if (!tour) return <NotFound />

  const reviews = REVIEWS.filter((r) => r.tour === tour.slug)
  const related = TOURS.filter((t) => t.slug !== tour.slug && t.destinations.some((d) => tour.destinations.includes(d))).slice(0, 3)
  const booked = trips.find((t) => t.tour === tour.slug && t.status === 'Requested')
  const book = () => navigate(`/book/${tour.slug}?${new URLSearchParams({ ...(date ? { date: date.date } : {}), adults: String(adults) })}`)

  return (
    <>
      <PageHero photo={tour.photo} title={tour.title} lead={tour.summary} crumbs={[{ label: 'Home', to: '/' }, { label: 'Tours', to: '/tours' }, { label: tour.title }]}>
        <div className="mt-2 flex flex-wrap gap-2">
          {tour.badge && <Badge tone="peach">{tour.badge}</Badge>}
          <Badge tone="glass" icon={<Clock className="size-3.5" aria-hidden />}>{tour.days} days</Badge>
          <Badge tone="glass" icon={<Users className="size-3.5" aria-hidden />}>Max {tour.groupMax}</Badge>
          <Badge tone="glass" icon={<Gauge className="size-3.5" aria-hidden />}>{tour.pace} pace</Badge>
          <Badge tone="glass"><Stars value={tour.rating} size={12} /> {tour.rating.toFixed(1)} · {tour.reviews} reviews</Badge>
        </div>
      </PageHero>

      <div className="mx-auto mt-14 grid max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 lg:px-12">
        <div className="flex min-w-0 flex-col gap-16">
          <section aria-labelledby="t-over" className="flex flex-col gap-6">
            <SectionHeading eyebrow="Overview" title={<span id="t-over">The route</span>} size="md" />
            <p className="flex items-center gap-2 text-[15px] text-ink"><MapPin className="size-4 text-brand" aria-hidden />{tour.route}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {tour.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 rounded-[var(--radius-sm)] bg-surface p-4 text-[14px] text-ink shadow-card">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-peach"><Check className="size-3" aria-hidden /></span>
                  {h}
                </li>
              ))}
            </ul>
            <Gallery photos={tour.gallery} />
          </section>

          <section aria-labelledby="t-days" className="flex flex-col gap-6">
            <SectionHeading eyebrow="Day by day" title={<span id="t-days">Itinerary</span>} size="md" />
            <Accordion items={tour.itinerary.map((d, i) => ({ meta: `Day ${i + 1}`, title: d.title, body: d.body }))} />
          </section>

          <section aria-labelledby="t-inc" className="grid gap-6 sm:grid-cols-2">
            <h2 id="t-inc" className="sr-only">What is included</h2>
            <div className="rounded-[var(--radius-md)] bg-surface p-6 shadow-card">
              <h3 className="font-sans text-[17px] font-semibold">Included</h3>
              <ul className="mt-4 flex flex-col gap-3 text-[14px] text-ink">
                {tour.included.map((x) => <li key={x} className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{x}</li>)}
              </ul>
            </div>
            <div className="rounded-[var(--radius-md)] bg-sand/70 p-6">
              <h3 className="font-sans text-[17px] font-semibold">Not included</h3>
              <ul className="mt-4 flex flex-col gap-3 text-[14px] text-ink">
                {tour.excluded.map((x) => <li key={x} className="flex gap-3"><Minus className="mt-0.5 size-4 shrink-0 text-body" aria-hidden />{x}</li>)}
              </ul>
            </div>
          </section>

          <section aria-labelledby="t-dates" className="flex flex-col gap-6" id="dates">
            <SectionHeading eyebrow="Dates & prices" title={<span id="t-dates">Upcoming departures</span>} size="md" lead="Prices are per person sharing. Children under 12 travel at 75% of the adult price." />
            <DepartureTable slug={tour.slug} days={tour.days} selected={date?.date} onSelect={setDate} />
          </section>

          {reviews.length > 0 && (
            <section aria-labelledby="t-rev" className="flex flex-col gap-6">
              <SectionHeading eyebrow="Reviews" title={<span id="t-rev">What travellers said</span>} size="md" />
              <div className="grid gap-5 md:grid-cols-2">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} showTour={false} />)}
              </div>
            </section>
          )}
        </div>

        <aside aria-label="Book this tour" className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex flex-col gap-5 rounded-[var(--radius-md)] bg-surface p-6 shadow-lift">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] text-body">From</p>
                <p className="display text-[2.4rem] text-ink">{money(date?.price ?? tour.price)}</p>
                <p className="text-[13px] text-body">per person</p>
              </div>
              <SaveButton slug={tour.slug} title={tour.title} className="border border-line shadow-none" />
            </div>
            <div className="rounded-[var(--radius-sm)] bg-paper p-4 text-[14px]">
              {date ? (
                <p className="text-ink"><span className="font-semibold">{formatDate(date.date)}</span> to {formatDate(addDays(date.date, tour.days - 1))}</p>
              ) : (
                <p className="text-body">Choose a date in <a href="#dates" className="font-medium text-ink underline underline-offset-2">Upcoming departures</a>, or pick one on the next step.</p>
              )}
            </div>
            <div className="border-y border-line">
              <Counter label="Adults" value={adults} min={1} max={8} onChange={setAdults} />
            </div>
            <Button onClick={book} size="lg" className="w-full">Book this tour</Button>
            {booked && (
              <p className="rounded-[var(--radius-sm)] bg-success-soft px-4 py-3 text-[13px] text-success">
                You already requested this tour ({booked.reference}). <Link to="/trips" className="font-semibold underline">View in My trips</Link>
              </p>
            )}
            <ButtonLink to={`/contact?tour=${tour.slug}`} variant="ghost" icon={<MessageCircle className="size-4" aria-hidden />}>Ask a planner</ButtonLink>
            <p className="text-center text-[12px] text-body">No payment now. A planner confirms within 24 hours.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tour.destinations.map((d) => {
              const dest = DESTINATIONS.find((x) => x.slug === d)!
              return <Link key={d} to={`/destinations/${d}`} className="inline-flex h-10 items-center rounded-full bg-sand px-4 text-[13px] font-medium text-ink hov:bg-peach">{dest.name}</Link>
            })}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:px-12" aria-labelledby="t-rel">
          <SectionHeading eyebrow="You might also like" title={<span id="t-rel">Similar journeys</span>} size="md" />
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => <Reveal key={t.slug}><TourCard tour={t} /></Reveal>)}
          </div>
        </section>
      )}
    </>
  )
}

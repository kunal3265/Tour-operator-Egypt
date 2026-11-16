import { CalendarDays, Heart, Luggage, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Badge } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { Segmented } from '../components/Segmented'
import { useToast } from '../components/Toast'
import { TourCard } from '../components/TourCard'
import { TOURS } from '../data'
import { useStore, type Trip } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { addDays, formatDate, money } from '../shared/departures'

function TripCard({ trip, onCancel }: { trip: Trip; onCancel: () => void }) {
  const tour = TOURS.find((t) => t.slug === trip.tour)
  if (!tour) return null
  const cancelled = trip.status === 'Cancelled'
  const party = trip.adults + trip.children
  return (
    <article className="grid overflow-hidden rounded-[var(--radius-md)] bg-surface shadow-card sm:grid-cols-[240px_1fr]">
      <Photo name={tour.photo} alt="" className="aspect-[16/9] h-full w-full object-cover sm:aspect-auto" />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={cancelled ? 'neutral' : 'success'}>{cancelled ? 'Cancelled' : 'Awaiting confirmation'}</Badge>
          <span className="text-[13px] text-body">Ref {trip.reference}</span>
        </div>
        <h3 className="font-sans text-[18px] font-semibold"><Link to={`/tours/${tour.slug}`} className="hov:underline">{tour.title}</Link></h3>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-body">
          <li className="flex items-center gap-2"><CalendarDays className="size-4" aria-hidden />{formatDate(trip.date)} – {formatDate(addDays(trip.date, tour.days - 1))}</li>
          <li className="flex items-center gap-2"><Users className="size-4" aria-hidden />{party} {party === 1 ? 'traveller' : 'travellers'}</li>
        </ul>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-[14px] text-body">Total <span className="text-[17px] font-semibold text-ink">{money(trip.total)}</span> · deposit {money(trip.deposit)}</p>
          {!cancelled && <Button variant="ghost" size="sm" onClick={onCancel} className="text-danger">Cancel request</Button>}
        </div>
      </div>
    </article>
  )
}

export function Trips() {
  useDocumentTitle('My trips')
  const { trips, saved, cancelTrip } = useStore()
  const toast = useToast()
  const [tab, setTab] = useState<'booked' | 'saved'>(trips.length || !saved.length ? 'booked' : 'saved')
  const [cancel, setCancel] = useState<Trip | null>(null)
  const savedTours = TOURS.filter((t) => saved.includes(t.slug))
  return (
    <>
      <PageHero photo="dahabiya" size="sm" eyebrow="Your account on this device" title="My trips" crumbs={[{ label: 'Home', to: '/' }, { label: 'My trips' }]} />
      <section className="mx-auto mt-12 max-w-[1400px] px-5 sm:px-8 lg:px-12" aria-label="Trips and saved tours">
        <Segmented
          label="Show"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'booked', label: `Requested (${trips.length})` },
            { value: 'saved', label: `Saved (${saved.length})` },
          ]}
        />
        <div className="mt-8">
          {tab === 'booked' ? (
            trips.length ? (
              <div className="flex flex-col gap-5">
                {trips.map((t) => <TripCard key={t.reference} trip={t} onCancel={() => setCancel(t)} />)}
              </div>
            ) : (
              <EmptyState icon={<Luggage className="size-6" aria-hidden />} title="No trips requested yet" body="When you request a departure it appears here, with its reference and price." action={<ButtonLink to="/tours">Browse tours</ButtonLink>} />
            )
          ) : savedTours.length ? (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {savedTours.map((t) => <TourCard key={t.slug} tour={t} />)}
            </div>
          ) : (
            <EmptyState icon={<Heart className="size-6" aria-hidden />} title="Nothing saved yet" body="Tap the heart on any tour to keep it here while you decide." action={<ButtonLink to="/tours">Find a tour</ButtonLink>} />
          )}
        </div>
      </section>
      <Modal open={!!cancel} onClose={() => setCancel(null)} title="Cancel this request?" description="Your places are released and the planner is told. You can request the tour again at any time.">
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="ghost" onClick={() => setCancel(null)} data-autofocus>Keep it</Button>
          <Button
            variant="ink"
            className="bg-danger hov:bg-danger/90"
            onClick={() => {
              if (cancel) cancelTrip(cancel.reference)
              setCancel(null)
              toast('Request cancelled')
            }}
          >
            Cancel request
          </Button>
        </div>
      </Modal>
    </>
  )
}

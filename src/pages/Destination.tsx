import { CalendarDays, Plane } from 'lucide-react'
import { useParams } from 'react-router'

import { ButtonLink } from '../components/Button'
import { DestinationCard } from '../components/DestinationCard'
import { EmptyState } from '../components/EmptyState'
import { FeatureCard } from '../components/FeatureCard'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TourCard } from '../components/TourCard'
import { DESTINATIONS, TOURS } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { NotFound } from './NotFound'

export function DestinationPage() {
  const { slug } = useParams()
  const d = DESTINATIONS.find((x) => x.slug === slug)
  useDocumentTitle(d ? `${d.name}, Egypt` : 'Destination not found')
  if (!d) return <NotFound />
  const tours = TOURS.filter((t) => t.destinations.includes(d.slug))
  const others = DESTINATIONS.filter((x) => x.slug !== d.slug).slice(0, 3)
  return (
    <>
      <PageHero photo={d.photo} eyebrow={d.region} title={d.name} lead={d.summary} crumbs={[{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations' }, { label: d.name }]} />
      <section className="mx-auto mt-16 grid max-w-[1600px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:px-12" aria-labelledby="d-intro">
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow="Why go" title={<span id="d-intro">{`About ${d.name}`}</span>} size="md" />
          <p className="max-w-2xl text-[17px] leading-relaxed text-ink">{d.intro}</p>
        </div>
        <dl className="flex flex-col gap-3 self-end">
          {[
            { icon: CalendarDays, k: 'Best time to visit', v: d.bestTime },
            { icon: Plane, k: 'Getting there', v: d.gettingThere },
          ].map((f) => (
            <div key={f.k} className="grid grid-cols-[auto_1fr] items-center gap-x-4 rounded-[var(--radius-sm)] bg-peach p-5">
              <dt className="contents">
                <span className="row-span-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink"><f.icon className="size-5" aria-hidden /></span>
                <span className="text-[12px] text-ink">{f.k}</span>
              </dt>
              <dd className="col-start-2 text-[15px] font-semibold text-ink">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="mx-auto mt-16 grid max-w-[1600px] gap-5 px-5 sm:px-8 md:grid-cols-3 lg:px-12" aria-label="Highlights">
        {d.highlights.map((h, i) => (
          <Reveal key={h.title} delay={i * 0.06}>
            <FeatureCard index={i + 1} title={h.title} body={h.body} className="h-full" />
          </Reveal>
        ))}
      </section>
      <section className="mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:px-12" aria-labelledby="d-tours">
        <SectionHeading eyebrow="Tours" title={<span id="d-tours">{`Journeys through ${d.name}`}</span>} size="md" action={<ButtonLink to={`/tours?destination=${d.slug}`} variant="outline" className="self-start md:self-auto">Filter all tours</ButtonLink>} />
        {tours.length ? (
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t) => <Reveal key={t.slug}><TourCard tour={t} /></Reveal>)}
          </div>
        ) : (
          <EmptyState className="mt-10" icon={<CalendarDays className="size-6" aria-hidden />} title="No scheduled tours yet" body="We run private trips here on request." action={<ButtonLink to="/contact?type=custom">Plan a private trip</ButtonLink>} />
        )}
      </section>
      <section className="mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:px-12" aria-labelledby="d-more">
        <SectionHeading eyebrow="Keep exploring" title={<span id="d-more">More of Egypt</span>} size="md" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {others.map((o) => <DestinationCard key={o.slug} d={o} tours={TOURS.filter((t) => t.destinations.includes(o.slug)).length} />)}
        </div>
      </section>
    </>
  )
}

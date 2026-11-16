import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { Button } from '../components/Button'
import { Chip } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { Input, Select } from '../components/Field'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { TourCard } from '../components/TourCard'
import { DESTINATIONS, TOUR_STYLES, TOURS } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const DURATIONS = [
  { value: '', label: 'Any length' },
  { value: 'short', label: 'Up to 5 days' },
  { value: 'mid', label: '6 to 9 days' },
  { value: 'long', label: '10 days or more' },
]
const SORTS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'days', label: 'Shortest first' },
]

export function Tours() {
  useDocumentTitle('Tours of Egypt')
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const style = params.get('style') ?? ''
  const duration = params.get('duration') ?? ''
  const dest = params.get('destination') ?? ''
  const sort = params.get('sort') ?? 'recommended'

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const clear = () => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })
  const filtered = !!(q || style || duration || dest)

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const out = TOURS.filter((t) => {
      if (needle && !`${t.title} ${t.summary} ${t.route}`.toLowerCase().includes(needle)) return false
      if (style && t.style !== style) return false
      if (dest && !t.destinations.includes(dest)) return false
      if (duration === 'short' && t.days > 5) return false
      if (duration === 'mid' && (t.days < 6 || t.days > 9)) return false
      if (duration === 'long' && t.days < 10) return false
      return true
    })
    const by = {
      recommended: () => 0,
      'price-asc': (a: (typeof TOURS)[0], b: (typeof TOURS)[0]) => a.price - b.price,
      'price-desc': (a: (typeof TOURS)[0], b: (typeof TOURS)[0]) => b.price - a.price,
      rating: (a: (typeof TOURS)[0], b: (typeof TOURS)[0]) => b.rating - a.rating || b.reviews - a.reviews,
      days: (a: (typeof TOURS)[0], b: (typeof TOURS)[0]) => a.days - b.days,
    }[sort as 'recommended']
    return by ? [...out].sort(by) : out
  }, [q, style, dest, duration, sort])

  return (
    <>
      <PageHero
        photo="felucca"
        eyebrow="All tours"
        title="Tours of Egypt"
        lead="Eight journeys, from a long weekend in Cairo to ten days down the Nile. Every one runs as a small group or privately for your party."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Tours' }]}
      />
      <section className="mx-auto mt-12 max-w-[1600px] px-5 sm:px-8 lg:px-12" aria-labelledby="tour-filters">
        <h2 id="tour-filters" className="sr-only">Filter tours</h2>
        <div className="flex flex-col gap-5 rounded-[var(--radius-md)] bg-surface p-5 shadow-card sm:p-6">
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div className="relative">
              <label htmlFor="tour-q" className="sr-only">Search tours</label>
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-body" aria-hidden />
              <Input id="tour-q" type="search" placeholder="Search pyramids, Nile, desert…" value={q} onChange={(e) => set('q', e.target.value)} className="pl-11" />
            </div>
            <div>
              <label htmlFor="tour-dest" className="sr-only">Destination</label>
              <Select id="tour-dest" value={dest} onChange={(e) => set('destination', e.target.value)}>
                <option value="">All destinations</option>
                {DESTINATIONS.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </Select>
            </div>
            <div>
              <label htmlFor="tour-len" className="sr-only">Length</label>
              <Select id="tour-len" value={duration} onChange={(e) => set('duration', e.target.value)}>
                {DURATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </Select>
            </div>
            <div>
              <label htmlFor="tour-sort" className="sr-only">Sort by</label>
              <Select id="tour-sort" value={sort} onChange={(e) => set('sort', e.target.value === 'recommended' ? '' : e.target.value)}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Travel style">
            <SlidersHorizontal className="mr-1 size-4 text-body" aria-hidden />
            <Chip active={!style} onClick={() => set('style', '')}>All styles</Chip>
            {TOUR_STYLES.map((s) => (
              <Chip key={s} active={style === s} onClick={() => set('style', style === s ? '' : s)}>{s}</Chip>
            ))}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-[14px] text-body" aria-live="polite">
            <span className="font-semibold text-ink">{list.length}</span> {list.length === 1 ? 'tour' : 'tours'}
            {filtered && ' match your filters'}
          </p>
          {filtered && (
            <Button variant="ghost" size="sm" onClick={clear} icon={<X className="size-4" aria-hidden />}>Clear filters</Button>
          )}
        </div>
        {list.length ? (
          <div className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {list.map((t, i) => (
              <Reveal key={t.slug} delay={(i % 3) * 0.05}>
                <TourCard tour={t} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-6"
            icon={<Search className="size-6" aria-hidden />}
            title="No tours match those filters"
            body="Try a different destination or length, or ask us to build a private route around your dates."
            action={<Button variant="outline" onClick={clear}>Clear all filters</Button>}
          />
        )}
      </section>
    </>
  )
}

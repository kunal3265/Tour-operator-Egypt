import { MessageSquarePlus, Star } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'

import { Button } from '../components/Button'
import { Chip } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { Field, FormMessage, Input, Select, Textarea } from '../components/Field'
import { Modal } from '../components/Modal'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { ReviewCard, type ReviewLike } from '../components/ReviewCard'
import { StarInput, Stars } from '../components/Stars'
import { useToast } from '../components/Toast'
import { RATING_SUMMARY, REVIEWS, TOURS } from '../data'
import { postJson } from '../lib/api'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { validateReview, type FieldErrors } from '../shared/validation'

const PAGE = 6
const EMPTY = { name: '', from: '', tour: '', rating: 0, title: '', body: '' }

function ReviewForm({ onDone }: { onDone: () => void }) {
  const { addReview } = useStore()
  const toast = useToast()
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const set = (k: keyof typeof EMPTY, v: string | number) => {
    setF((x) => ({ ...x, [k]: v }))
    if (errors[k]) setErrors(({ [k]: _g, ...rest }) => rest)
  }
  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validateReview(f)
    if (Object.keys(errs).length) {
      setErrors(errs)
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[role=dialog] [aria-invalid="true"], [role=dialog] [aria-invalid="true"] input')?.focus())
      return
    }
    setLoading(true)
    setServerError('')
    const res = await postJson<{ id: string }>('/api/reviews', f)
    setLoading(false)
    if (!res.ok) {
      setServerError(res.error)
      if (res.fieldErrors) setErrors(res.fieldErrors)
      return
    }
    addReview({ ...f, id: res.data.id, from: f.from.trim() || 'Traveller', date: new Date().toISOString().slice(0, 10) })
    toast('Thank you. Your review is published on this device.')
    onDone()
  }
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span id="rating-label" className="text-[13px] font-medium text-ink">Your rating</span>
        <StarInput value={f.rating} onChange={(n) => set('rating', n)} invalid={!!errors.rating} describedBy={errors.rating ? 'rating-err' : undefined} />
        {errors.rating && <p id="rating-err" className="text-[13px] text-danger">{errors.rating}</p>}
      </div>
      <Field label="Which tour?" error={errors.tour}>
        <Select value={f.tour} onChange={(e) => set('tour', e.target.value)}>
          <option value="">Choose a tour</option>
          {TOURS.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" error={errors.name}><Input data-autofocus autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
        <Field label="Where you’re from" optional><Input value={f.from} onChange={(e) => set('from', e.target.value)} placeholder="City, country" /></Field>
      </div>
      <Field label="Headline" error={errors.title}><Input value={f.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Your review" error={errors.body} hint="At least 20 characters"><Textarea value={f.body} onChange={(e) => set('body', e.target.value)} /></Field>
      {serverError && <FormMessage tone="error">{serverError}</FormMessage>}
      <Button type="submit" loading={loading} className="mt-2">Publish review</Button>
    </form>
  )
}

export function Reviews() {
  useDocumentTitle('Traveller reviews')
  const { reviews: mine } = useStore()
  const [tour, setTour] = useState('')
  const [rating, setRating] = useState(0)
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>('newest')
  const [shown, setShown] = useState(PAGE)
  const [writing, setWriting] = useState(false)

  const all: ReviewLike[] = useMemo(() => [...mine.map((r) => ({ ...r, mine: true })), ...REVIEWS], [mine])
  const list = useMemo(() => {
    const out = all.filter((r) => (!tour || r.tour === tour) && (!rating || r.rating === rating))
    return out.sort((a, b) => (sort === 'newest' ? b.date.localeCompare(a.date) : sort === 'highest' ? b.rating - a.rating : a.rating - b.rating))
  }, [all, tour, rating, sort])
  const max = Math.max(...RATING_SUMMARY.breakdown)

  return (
    <>
      <PageHero photo="temple" size="sm" eyebrow="Reviews" title="In travellers’ words" crumbs={[{ label: 'Home', to: '/' }, { label: 'Reviews' }]} position="center 30%" />
      <section className="mx-auto mt-12 grid max-w-[1600px] gap-8 px-5 sm:px-8 lg:grid-cols-[360px_1fr] lg:gap-14 lg:px-12" aria-label="Rating summary">
        <div className="flex flex-col gap-5 rounded-[var(--radius-md)] bg-peach p-7 lg:sticky lg:top-6 lg:self-start">
          <p className="display text-[4.5rem] leading-none text-ink">{RATING_SUMMARY.average.toFixed(1)}</p>
          <Stars value={RATING_SUMMARY.average} size={20} />
          <p className="text-[14px] text-ink">From {RATING_SUMMARY.total.toLocaleString('en-US')} verified reviews</p>
          <ul className="flex flex-col gap-2" aria-label="Rating breakdown">
            {RATING_SUMMARY.breakdown.map((n, i) => (
              <li key={i} className="flex items-center gap-3 text-[13px] text-ink">
                <span className="inline-flex w-8 items-center gap-1">{5 - i}<Star className="size-3 fill-ink" aria-hidden /></span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/70"><span className="block h-full rounded-full bg-ink" style={{ width: `${(n / max) * 100}%` }} /></span>
                <span className="w-12 text-right tabular-nums">{n.toLocaleString('en-US')}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => setWriting(true)} icon={<MessageSquarePlus className="size-4" aria-hidden />}>Write a review</Button>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by rating">
              <Chip active={!rating} onClick={() => { setRating(0); setShown(PAGE) }}>All ratings</Chip>
              {[5, 4, 3].map((n) => (
                <Chip key={n} active={rating === n} onClick={() => { setRating(rating === n ? 0 : n); setShown(PAGE) }}>{n} stars</Chip>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="min-w-0 flex-1 md:w-56">
                <label htmlFor="rv-tour" className="sr-only">Tour</label>
                <Select id="rv-tour" value={tour} onChange={(e) => { setTour(e.target.value); setShown(PAGE) }}>
                  <option value="">All tours</option>
                  {TOURS.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
                </Select>
              </div>
              <div className="w-40">
                <label htmlFor="rv-sort" className="sr-only">Sort</label>
                <Select id="rv-sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                  <option value="newest">Newest</option>
                  <option value="highest">Highest</option>
                  <option value="lowest">Lowest</option>
                </Select>
              </div>
            </div>
          </div>
          <p className="text-[14px] text-body" aria-live="polite"><span className="font-semibold text-ink">{list.length}</span> reviews shown</p>
          {list.length ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                {list.slice(0, shown).map((r) => <Reveal key={r.id} y={16}><ReviewCard review={r} /></Reveal>)}
              </div>
              {shown < list.length && (
                <Button variant="outline" className="self-center" onClick={() => setShown((s) => s + PAGE)}>Show more reviews ({list.length - shown})</Button>
              )}
            </>
          ) : (
            <EmptyState icon={<Star className="size-6" aria-hidden />} title="No reviews match" body="Try another tour or rating, or be the first to review this trip." action={<Button variant="outline" onClick={() => { setTour(''); setRating(0) }}>Show all reviews</Button>} />
          )}
        </div>
      </section>
      <Modal open={writing} onClose={() => setWriting(false)} title="Write a review" description="Reviews you write here are saved in this browser.">
        <ReviewForm onDone={() => setWriting(false)} />
      </Modal>
    </>
  )
}

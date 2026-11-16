import { ArrowLeft, ArrowRight, CalendarCheck, Check, Mail, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'

import { Badge } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { Counter } from '../components/Counter'
import { Checkbox, Field, FormMessage, Input, Select, Textarea } from '../components/Field'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { Steps } from '../components/Steps'
import { ADD_ONS, BRAND, COUNTRIES, ROOM_TYPES, TOURS } from '../data'
import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { useStore, type Trip } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { addDays, formatDate, money } from '../shared/departures'
import { MAX_PARTY, quote, validateBookingStep, type BookingInput, type FieldErrors } from '../shared/validation'
import { NotFound } from './NotFound'
import { useDepartures } from './Tour'

const STEPS = ['Trip', 'Travellers', 'Review']
const STEP_OF: Record<string, number> = { tour: 0, date: 0, adults: 0, children: 0, room: 0, addOns: 0, name: 1, email: 1, phone: 1, country: 1, notes: 1, terms: 2 }
const draftKey = (slug: string) => `sandline.draft.${slug}`

function loadDraft(slug: string): Partial<BookingInput> {
  try {
    return JSON.parse(localStorage.getItem(draftKey(slug)) ?? '{}') as Partial<BookingInput>
  } catch {
    return {}
  }
}

export function Book() {
  const { slug = '' } = useParams()
  const [params] = useSearchParams()
  const tour = TOURS.find((t) => t.slug === slug)
  useDocumentTitle(tour ? `Book ${tour.title}` : 'Tour not found')
  const { addTrip } = useStore()
  const deps = useDepartures(tour?.slug)

  const [form, setForm] = useState<BookingInput>(() => {
    const draft = loadDraft(slug)
    const adults = Number(params.get('adults'))
    return {
      tour: slug,
      date: params.get('date') ?? draft.date ?? '',
      adults: adults >= 1 && adults <= MAX_PARTY ? adults : (draft.adults ?? 2),
      children: draft.children ?? 0,
      room: draft.room ?? 'shared',
      addOns: draft.addOns ?? [],
      name: draft.name ?? '',
      email: draft.email ?? '',
      phone: draft.phone ?? '',
      country: draft.country ?? '',
      notes: draft.notes ?? '',
      terms: false,
    }
  })
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const [done, setDone] = useState<Trip | null>(null)
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (done) return
    const { terms: _t, ...rest } = form
    try {
      localStorage.setItem(draftKey(slug), JSON.stringify(rest))
    } catch {
      /* ignore */
    }
  }, [form, slug, done])

  const dep = deps.list.find((d) => d.date === form.date)
  const q = useMemo(() => (tour && dep ? quote(tour, dep.price, form) : null), [tour, dep, form])

  if (!tour) return <NotFound />

  const update = <K extends keyof BookingInput>(key: K, value: BookingInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(({ [key]: _gone, ...rest }) => rest)
  }

  const go = (n: number) => {
    setStep(n)
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const focusFirstError = (errs: FieldErrors) => {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>('[aria-invalid="true"]')
      el?.focus()
    })
    return errs
  }

  const next = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateBookingStep(step, form)
    if (Object.keys(errs).length) return setErrors(focusFirstError(errs))
    if (step < 2) return go(step + 1)
    void submit()
  }

  async function submit() {
    setStatus('loading')
    setServerError('')
    const res = await postJson<{ reference: string; total: number; deposit: number }>('/api/bookings', form)
    if (!res.ok) {
      setStatus('error')
      setServerError(res.error)
      if (res.fieldErrors) {
        setErrors(res.fieldErrors)
        const first = Math.min(...Object.keys(res.fieldErrors).map((k) => STEP_OF[k] ?? 2))
        if (first < step) go(first)
      }
      return
    }
    const { terms: _t, ...rest } = form
    const trip: Trip = { ...rest, reference: res.data.reference, total: res.data.total, deposit: res.data.deposit, createdAt: new Date().toISOString(), status: 'Requested' }
    addTrip(trip)
    try {
      localStorage.removeItem(draftKey(slug))
    } catch {
      /* ignore */
    }
    setStatus('idle')
    setDone(trip)
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const party = form.adults + form.children

  return (
    <>
      <PageHero
        size="sm"
        photo={tour.photo}
        eyebrow={done ? 'Request received' : `Step ${step + 1} of 3`}
        title={done ? 'Your journey is on hold' : `Book ${tour.title}`}
        crumbs={[{ label: 'Tours', to: '/tours' }, { label: tour.title, to: `/tours/${tour.slug}` }, { label: 'Book' }]}
      />
      <div ref={top} className="mx-auto mt-12 grid max-w-[1400px] scroll-mt-6 gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:px-12">
        {done ? (
          <section aria-labelledby="done-title" className="flex flex-col gap-8 rounded-[var(--radius-md)] bg-surface p-6 shadow-card sm:p-10">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-success-soft text-success"><Check className="size-7" aria-hidden /></span>
            <div className="flex flex-col gap-3" role="status">
              <h2 id="done-title" className="display text-[clamp(2rem,1.4rem+1.8vw,3rem)]">Thank you, {done.name.split(' ')[0]}.</h2>
              <p className="max-w-xl text-[15px] leading-relaxed text-body">
                We are holding {party} {party === 1 ? 'place' : 'places'} on the {formatDate(done.date)} departure. A planner will email {done.email} within 24 hours to confirm and take the deposit.
              </p>
            </div>
            <dl className="grid gap-4 rounded-[var(--radius-sm)] bg-paper p-5 sm:grid-cols-3">
              <div><dt className="text-[12px] text-body">Reference</dt><dd className="text-[18px] font-semibold text-ink">{done.reference}</dd></div>
              <div><dt className="text-[12px] text-body">Trip total</dt><dd className="text-[18px] font-semibold text-ink">{money(done.total)}</dd></div>
              <div><dt className="text-[12px] text-body">Deposit (20%)</dt><dd className="text-[18px] font-semibold text-ink">{money(done.deposit)}</dd></div>
            </dl>
            <ol className="flex flex-col gap-4 text-[14px] text-ink">
              {[
                { icon: Mail, t: 'Confirmation email', b: 'Your itinerary, hotel list and visa checklist, usually the same day.' },
                { icon: ShieldCheck, t: 'Secure your place', b: 'Pay the 20% deposit by card or bank transfer. The balance is due 60 days before departure.' },
                { icon: CalendarCheck, t: 'Pre-departure call', b: 'Two weeks before you fly, your guide calls to talk through the route.' },
              ].map((s) => (
                <li key={s.t} className="flex gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-peach"><s.icon className="size-4" aria-hidden /></span>
                  <div><p className="font-semibold">{s.t}</p><p className="text-body">{s.b}</p></div>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/trips">View My trips</ButtonLink>
              <ButtonLink to="/tours" variant="outline">Browse more tours</ButtonLink>
            </div>
          </section>
        ) : (
          <form onSubmit={next} noValidate className="flex min-w-0 flex-col gap-8" aria-labelledby="book-step">
            <Steps steps={STEPS} current={step} />
            <h2 id="book-step" className="sr-only">{STEPS[step]}</h2>

            {step === 0 && (
              <>
                <fieldset className="flex flex-col gap-3" aria-describedby={errors.date ? 'err-date' : undefined}>
                  <legend className="mb-3 font-sans text-[18px] font-semibold text-ink">Choose a departure</legend>
                  {deps.status === 'loading' && Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-[72px] rounded-[var(--radius-sm)]" aria-hidden />)}
                  {deps.status === 'loading' && <p className="sr-only" role="status">Loading departures</p>}
                  {deps.status === 'error' && (
                    <FormMessage tone="error">
                      We could not load departures. <button type="button" className="font-semibold underline" onClick={deps.retry}>Try again</button>
                    </FormMessage>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {deps.list.map((d) => {
                      const full = d.seatsLeft === 0
                      const checked = form.date === d.date
                      return (
                        <label
                          key={d.date}
                          className={cx(
                            'flex min-h-[72px] cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-sm)] border bg-surface px-4 py-3 transition-[border-color,box-shadow] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand',
                            checked ? 'border-brand shadow-[0_0_0_3px_rgb(62_91_147/0.15)]' : 'border-line hover:border-ink/40',
                            full && 'cursor-not-allowed opacity-55',
                            errors.date && !checked && 'border-danger/50',
                          )}
                        >
                          <input type="radio" name="date" value={d.date} checked={checked} disabled={full} onChange={() => update('date', d.date)} className="sr-only" />
                          <span className="flex flex-col">
                            <span className="text-[14px] font-semibold text-ink">{formatDate(d.date, { day: 'numeric', month: 'short' })} – {formatDate(addDays(d.date, tour.days - 1))}</span>
                            <span className="text-[12px] text-body">{d.season} season · {full ? 'Full' : `${d.seatsLeft} ${d.seatsLeft === 1 ? 'place' : 'places'} left`}</span>
                          </span>
                          <span className="text-right">
                            <span className="block text-[15px] font-semibold text-ink">{money(d.price)}</span>
                            {checked && <Badge tone="brand" className="mt-1 h-6">Selected</Badge>}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.date && <p id="err-date" role="alert" className="text-[13px] text-danger">{errors.date}</p>}
                </fieldset>

                <fieldset className="rounded-[var(--radius-md)] bg-surface px-5 py-2 shadow-card">
                  <legend className="sr-only">Travellers</legend>
                  <div className="divide-y divide-line">
                    <Counter label="Adults" note="Age 12 and over" value={form.adults} min={1} max={MAX_PARTY - form.children} onChange={(n) => update('adults', n)} />
                    <Counter label="Children" note="Age 2 to 11, 75% of the adult price" value={form.children} min={0} max={MAX_PARTY - form.adults} onChange={(n) => update('children', n)} />
                  </div>
                  {(errors.adults || errors.children) && <p role="alert" className="pb-3 text-[13px] text-danger">{errors.adults ?? errors.children}</p>}
                </fieldset>

                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-3 font-sans text-[18px] font-semibold text-ink">Room</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ROOM_TYPES.map((r) => (
                      <label key={r.id} className={cx('flex min-h-16 cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border bg-surface px-4 py-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand', form.room === r.id ? 'border-brand' : 'border-line hover:border-ink/40')}>
                        <input type="radio" name="room" value={r.id} checked={form.room === r.id} onChange={() => update('room', r.id)} className="size-4 accent-[var(--color-brand)]" />
                        <span><span className="block text-[14px] font-semibold text-ink">{r.label}</span><span className="text-[12px] text-body">{r.note}</span></span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="flex flex-col gap-1">
                  <legend className="mb-3 font-sans text-[18px] font-semibold text-ink">Extras</legend>
                  {ADD_ONS.map((a) => (
                    <Checkbox
                      key={a.id}
                      checked={form.addOns.includes(a.id)}
                      onChange={(e) => update('addOns', e.target.checked ? [...form.addOns, a.id] : form.addOns.filter((x) => x !== a.id))}
                      label={<>{a.label} <span className="text-body">· {money(a.price)} {a.id === 'guide' ? 'per day' : 'per person'}</span></>}
                    />
                  ))}
                </fieldset>
              </>
            )}

            {step === 1 && (
              <div className="grid gap-5 rounded-[var(--radius-md)] bg-surface p-5 shadow-card sm:grid-cols-2 sm:p-7">
                <Field label="Lead traveller’s full name" error={errors.name} className="sm:col-span-2">
                  <Input autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <Input type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                </Field>
                <Field label="Phone" hint="With country code, e.g. +44 7700 900123" error={errors.phone}>
                  <Input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                </Field>
                <Field label="Country of residence" error={errors.country} className="sm:col-span-2">
                  <Select value={form.country} onChange={(e) => update('country', e.target.value)}>
                    <option value="">Choose a country</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Anything we should know?" optional hint="Dietary needs, mobility, celebrations" error={errors.notes} className="sm:col-span-2">
                  <Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6">
                <dl className="grid gap-4 rounded-[var(--radius-md)] bg-surface p-6 shadow-card sm:grid-cols-2">
                  {[
                    ['Departure', dep ? `${formatDate(form.date)} – ${formatDate(addDays(form.date, tour.days - 1))}` : form.date, 0],
                    ['Travellers', `${form.adults} ${form.adults === 1 ? 'adult' : 'adults'}${form.children ? `, ${form.children} ${form.children === 1 ? 'child' : 'children'}` : ''}`, 0],
                    ['Room', ROOM_TYPES.find((r) => r.id === form.room)?.label ?? '', 0],
                    ['Extras', form.addOns.length ? ADD_ONS.filter((a) => form.addOns.includes(a.id)).map((a) => a.label).join(', ') : 'None', 0],
                    ['Lead traveller', `${form.name} · ${form.email}`, 1],
                    ['Phone & country', `${form.phone} · ${form.country}`, 1],
                  ].map(([k, v, s]) => (
                    <div key={k as string} className="flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                      <div><dt className="text-[12px] text-body">{k}</dt><dd className="text-[14px] font-medium text-ink">{v}</dd></div>
                      <button type="button" onClick={() => go(s as number)} className="min-h-10 shrink-0 text-[13px] font-medium text-brand underline-offset-2 hov:underline" aria-label={`Edit ${(k as string).toLowerCase()}`}>Edit</button>
                    </div>
                  ))}
                </dl>
                <Checkbox
                  checked={form.terms}
                  onChange={(e) => update('terms', e.target.checked)}
                  error={errors.terms}
                  label={<>I accept the booking conditions: a 20% deposit holds my place and is refundable up to 90 days before departure.</>}
                />
                {status === 'error' && serverError && <FormMessage tone="error">{serverError}</FormMessage>}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => go(step - 1)} icon={<ArrowLeft className="size-4" aria-hidden />}>Back</Button>
              ) : (
                <Link to={`/tours/${tour.slug}`} className="inline-flex min-h-10 items-center gap-2 text-[14px] font-medium text-ink hov:underline"><ArrowLeft className="size-4" aria-hidden />Tour details</Link>
              )}
              <Button type="submit" size="lg" loading={status === 'loading'} iconRight={step < 2 ? <ArrowRight className="size-4" aria-hidden /> : undefined}>
                {step < 2 ? `Continue to ${STEPS[step + 1].toLowerCase()}` : 'Request booking'}
              </Button>
            </div>
            <p className="text-[12px] text-body">Your answers are kept on this device until you send the request. No payment is taken on this site.</p>
          </form>
        )}

        <aside aria-label="Trip summary" className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-[var(--radius-md)] bg-surface shadow-lift">
            <Photo name={tour.photo} alt="" className="aspect-[16/9] w-full object-cover" />
            <div className="flex flex-col gap-4 p-6">
              <div>
                <p className="text-[12px] tracking-wide text-body uppercase">{tour.days} days · {tour.route}</p>
                <h2 className="mt-1 font-sans text-[18px] leading-snug font-semibold">{tour.title}</h2>
              </div>
              {q && dep ? (
                <dl className="flex flex-col gap-2 border-t border-line pt-4 text-[14px]">
                  <div className="flex justify-between"><dt className="text-body">{form.adults} × adult at {money(dep.price)}</dt><dd className="text-ink">{money(dep.price * form.adults)}</dd></div>
                  {form.children > 0 && <div className="flex justify-between"><dt className="text-body">{form.children} × child at {money(q.childPrice)}</dt><dd className="text-ink">{money(q.childPrice * form.children)}</dd></div>}
                  {q.supplement > 0 && <div className="flex justify-between"><dt className="text-body">Single room</dt><dd className="text-ink">{money(q.supplement)}</dd></div>}
                  {q.extras.map((x) => <div key={x.id} className="flex justify-between gap-3"><dt className="text-body">{x.label}</dt><dd className="text-ink">{money(x.total)}</dd></div>)}
                  <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3"><dt className="font-semibold text-ink">Total</dt><dd className="display text-[1.8rem] text-ink" aria-live="polite">{money(q.total)}</dd></div>
                  <div className="flex justify-between text-[13px]"><dt className="text-body">Deposit due on confirmation</dt><dd className="font-medium text-ink">{money(q.deposit)}</dd></div>
                </dl>
              ) : (
                <p className="border-t border-line pt-4 text-[14px] text-body">Choose a departure to see your price.</p>
              )}
              <p className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-paper p-3 text-[12px] text-body"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />Questions? Call {BRAND.phone}, {BRAND.hours}.</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

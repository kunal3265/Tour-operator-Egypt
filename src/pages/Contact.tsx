import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { Field, FormMessage, Input, Select, Textarea } from '../components/Field'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { SectionHeading } from '../components/SectionHeading'
import { BRAND, CONTACT, FAQ, TOURS } from '../data'
import { postJson } from '../lib/api'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { validateEnquiry, type FieldErrors } from '../shared/validation'

export function Contact() {
  useDocumentTitle('Contact a planner')
  const [params] = useSearchParams()
  const { hash } = useLocation()
  const presetTour = TOURS.find((t) => t.slug === params.get('tour'))
  const [f, setF] = useState({
    topic: params.get('type') === 'custom' ? CONTACT.topics[1] : presetTour ? CONTACT.topics[0] : '',
    tour: presetTour?.slug ?? '',
    name: '',
    email: '',
    phone: '',
    month: '',
    travellers: '2',
    budget: '',
    message: presetTour ? `I’d like to know more about ${presetTour.title}.` : '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const [sent, setSent] = useState<string | null>(null)
  useEffect(() => {
    if (hash === '#faq') document.getElementById('faq')?.scrollIntoView()
  }, [hash])

  const set = (k: keyof typeof f, v: string) => {
    setF((x) => ({ ...x, [k]: v }))
    if (errors[k]) setErrors(({ [k]: _g, ...rest }) => rest)
  }
  async function submit(e: FormEvent) {
    e.preventDefault()
    const payload = { ...f, travellers: f.travellers ? Number(f.travellers) : undefined }
    const errs = validateEnquiry(payload)
    if (Object.keys(errs).length) {
      setErrors(errs)
      requestAnimationFrame(() => document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus())
      return
    }
    setStatus('loading')
    setServerError('')
    const res = await postJson<{ reference: string }>('/api/enquiries', payload)
    if (!res.ok) {
      setStatus('error')
      setServerError(res.error)
      if (res.fieldErrors) setErrors(res.fieldErrors)
      return
    }
    setStatus('idle')
    setSent(res.data.reference)
  }

  return (
    <>
      <PageHero photo="cairo" size="sm" eyebrow={CONTACT.eyebrow} title={CONTACT.title} crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      <div className="mx-auto mt-12 grid max-w-[1600px] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16 lg:px-12">
        <section aria-labelledby="c-form" className="flex flex-col gap-6">
          <SectionHeading title={<span id="c-form">Send us a message</span>} size="md" lead={CONTACT.body} />
          {sent ? (
            <div className="flex flex-col items-start gap-4 rounded-[var(--radius-md)] bg-surface p-7 shadow-card">
              <FormMessage tone="success">
                <p className="font-semibold">Message sent. Your reference is {sent}.</p>
                <p>A planner will reply to {f.email} within one working day.</p>
              </FormMessage>
              <Button variant="outline" onClick={() => { setSent(null); setF((x) => ({ ...x, message: '' })) }}>Send another message</Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 rounded-[var(--radius-md)] bg-surface p-5 shadow-card sm:grid-cols-2 sm:p-7">
              <Field label="What is it about?" error={errors.topic}>
                <Select value={f.topic} onChange={(e) => set('topic', e.target.value)}>
                  <option value="">Choose a topic</option>
                  {CONTACT.topics.map((t) => <option key={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Tour" optional>
                <Select value={f.tour} onChange={(e) => set('tour', e.target.value)}>
                  <option value="">No particular tour</option>
                  {TOURS.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
                </Select>
              </Field>
              <Field label="Full name" error={errors.name}><Input autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
              <Field label="Email" error={errors.email}><Input type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} /></Field>
              <Field label="Phone" optional error={errors.phone}><Input type="tel" autoComplete="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
              <Field label="When would you travel?" optional error={errors.month}><Input type="month" value={f.month} onChange={(e) => set('month', e.target.value)} /></Field>
              <Field label="Travellers" error={errors.travellers}><Input type="number" min={1} max={40} inputMode="numeric" value={f.travellers} onChange={(e) => set('travellers', e.target.value)} /></Field>
              <Field label="Budget per person" optional>
                <Select value={f.budget} onChange={(e) => set('budget', e.target.value)}>
                  <option value="">Not sure yet</option>
                  {CONTACT.budgets.map((b) => <option key={b}>{b}</option>)}
                </Select>
              </Field>
              <Field label="Your message" error={errors.message} className="sm:col-span-2">
                <Textarea value={f.message} onChange={(e) => set('message', e.target.value)} placeholder="Dates, interests, who is travelling…" />
              </Field>
              {status === 'error' && serverError && <div className="sm:col-span-2"><FormMessage tone="error">{serverError}</FormMessage></div>}
              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                <p className="text-[12px] text-body">We reply within one working day.</p>
                <Button type="submit" size="lg" loading={status === 'loading'} iconRight={<Send className="size-4" aria-hidden />}>Send message</Button>
              </div>
            </form>
          )}
        </section>
        <aside aria-label="Our office" className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-[var(--radius-md)]">
            <Photo name="felucca" loading="lazy" className="aspect-[16/10] w-full object-cover" />
          </div>
          <ul className="flex flex-col gap-3 rounded-[var(--radius-md)] bg-peach p-6 text-[14px] text-ink">
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />{BRAND.address}</li>
            <li className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0" aria-hidden />{BRAND.hours}</li>
            <li><a href={`tel:${BRAND.phoneHref}`} className="inline-flex min-h-10 items-center gap-3 font-medium hov:underline"><Phone className="size-4" aria-hidden />{BRAND.phone}</a></li>
            <li><a href={`mailto:${BRAND.email}`} className="inline-flex min-h-10 items-center gap-3 font-medium hov:underline"><Mail className="size-4" aria-hidden />{BRAND.email}</a></li>
          </ul>
        </aside>
      </div>
      <section id="faq" className="mx-auto mt-28 max-w-[1100px] scroll-mt-8 px-5 sm:px-8" aria-labelledby="faq-title">
        <SectionHeading eyebrow="Before you go" title={<span id="faq-title">Frequently asked questions</span>} size="md" align="center" />
        <Accordion className="mt-10" items={FAQ.map((x) => ({ title: x.q, body: x.a }))} />
      </section>
    </>
  )
}

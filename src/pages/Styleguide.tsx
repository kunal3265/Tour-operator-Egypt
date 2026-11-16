import { ArrowRight, Heart, Mail, RotateCcw, Search } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { Accordion } from '../components/Accordion'
import { Badge, Chip, type BadgeTone } from '../components/Badge'
import { ArrowCircleLink, Button, IconButton, type ButtonVariant } from '../components/Button'
import { Counter } from '../components/Counter'
import { DestinationCard } from '../components/DestinationCard'
import { EmptyState } from '../components/EmptyState'
import { FeatureCard } from '../components/FeatureCard'
import { Checkbox, Field, FormMessage, Input, Select, Textarea } from '../components/Field'
import { Logo } from '../components/Logo'
import { Modal } from '../components/Modal'
import { NewsletterForm } from '../components/NewsletterForm'
import { PageHero } from '../components/PageHero'
import { ReviewCard } from '../components/ReviewCard'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Stat } from '../components/Stat'
import { StarInput, Stars } from '../components/Stars'
import { Steps } from '../components/Steps'
import { useToast } from '../components/Toast'
import { TourCard, TourCardSkeleton } from '../components/TourCard'
import { DESTINATIONS, REVIEWS, TOURS } from '../data'
import { cx } from '../lib/cx'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const COLORS = [
  { name: 'Paper', token: '--color-paper', hex: '#f7f5f1', use: 'Page background' },
  { name: 'Surface', token: '--color-surface', hex: '#ffffff', use: 'Cards, inputs' },
  { name: 'Sand', token: '--color-sand', hex: '#efe9e0', use: 'Hover fill, image wells' },
  { name: 'Line', token: '--color-line', hex: '#e4ded4', use: 'Hairlines' },
  { name: 'Line strong', token: '--color-line-strong', hex: '#cfc7ba', use: 'Control borders' },
  { name: 'Ink', token: '--color-ink', hex: '#36425e', use: 'Headlines, strong text' },
  { name: 'Ink 2', token: '--color-ink-2', hex: '#2a344b', use: 'Pressed and hover ink' },
  { name: 'Body', token: '--color-body', hex: '#586073', use: 'Body copy (AA on paper)' },
  { name: 'Faint', token: '--color-faint', hex: '#8a909d', use: 'Placeholders, unrevealed statement words' },
  { name: 'Brand', token: '--color-brand', hex: '#3e5b93', use: 'Book Now, focus ring, links' },
  { name: 'Brand 2', token: '--color-brand-2', hex: '#324c7d', use: 'Brand hover' },
  { name: 'Brand soft', token: '--color-brand-soft', hex: '#e3e9f4', use: 'Selected rows, brand badge' },
  { name: 'Peach', token: '--color-peach', hex: '#fde3c6', use: 'Feature band, avatars' },
  { name: 'Peach 2', token: '--color-peach-2', hex: '#f6cfa4', use: 'Peach hover, selection' },
  { name: 'Slate', token: '--color-slate', hex: '#46536d', use: 'Footer band' },
  { name: 'Sun', token: '--color-sun', hex: '#e39a52', use: 'Stars, season chart (no text)' },
  { name: 'Success', token: '--color-success', hex: '#2f6b4f', use: 'Confirmations' },
  { name: 'Danger', token: '--color-danger', hex: '#b23b2e', use: 'Errors, saved heart' },
  { name: 'Scrim', token: '--color-scrim', hex: '#1d1a16', use: 'Dialog backdrop, photo gradients' },
]

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

const TYPE = [
  { label: 'Hero word', spec: 'Bricolage 800, 17.2vw, -0.045em', cls: 'display text-[clamp(4rem,10vw,8rem)] leading-[0.8] tracking-[-0.045em]', sample: 'EGYPT' },
  { label: 'Display XL', spec: 'Bricolage 800, clamp(48px → 90px)', cls: 'display text-[clamp(3rem,1.6rem+4.4vw,5.6rem)]', sample: 'Discover Egypt' },
  { label: 'Display L', spec: 'Bricolage 800, clamp(38px → 64px)', cls: 'display text-[clamp(2.4rem,1.5rem+2.8vw,4rem)]', sample: 'Why Travel to Egypt?' },
  { label: 'Display M', spec: 'Bricolage 800, clamp(30px → 44px)', cls: 'display text-[clamp(1.9rem,1.4rem+1.6vw,2.75rem)]', sample: 'Upcoming departures' },
  { label: 'Stat', spec: 'Poppins 400, clamp(34px → 51px)', cls: 'font-sans text-[clamp(2.1rem,1.4rem+1.8vw,3.2rem)] leading-none tracking-[-0.02em]', sample: '10k+' },
  { label: 'Card title', spec: 'Poppins 600, 18px', cls: 'font-sans text-[18px] font-semibold', sample: 'The Nile by Dahabiya' },
  { label: 'Body', spec: 'Poppins 400, 15px / 1.65', cls: 'text-[15px] leading-relaxed text-body', sample: 'Five thousand years of history, one unhurried route.' },
  { label: 'Small', spec: 'Poppins 400–500, 13px', cls: 'text-[13px] text-body', sample: 'Max 14 · 4.9 (612)' },
  { label: 'Eyebrow', spec: 'Poppins 600, 12px, +0.08em caps', cls: 'eyebrow text-ink', sample: 'Timeless history' },
]

const SPACING = [4, 8, 12, 16, 20, 24, 32, 48, 64, 96, 128]
const RADII = [
  { name: 'xs', v: '6px' },
  { name: 'sm', v: '10px' },
  { name: 'md', v: '14px' },
  { name: 'lg', v: '20px' },
  { name: 'pill', v: '999px' },
]
const SHADOWS = [
  { name: 'card', v: 'var(--shadow-card)' },
  { name: 'lift', v: 'var(--shadow-lift)' },
  { name: 'glass', v: 'var(--shadow-glass)' },
]
const MOTION = [
  { name: '--duration-fast', v: '160ms', use: 'Colour, press' },
  { name: '--duration-base', v: '320ms', use: 'Lift, chevrons' },
  { name: '--duration-slow', v: '700ms', use: 'Photo zoom on hover' },
  { name: '--ease-out-soft', v: 'cubic-bezier(.22,1,.36,1)', use: 'Every entrance' },
  { name: '--animate-rise', v: 'rise 0.9s', use: 'Section reveal' },
  { name: '--animate-drift', v: 'drift 14s alternate', use: 'Hero photo' },
  { name: '--animate-shimmer', v: 'shimmer 1.4s', use: 'Skeletons' },
]

const STATES = ['default', 'hover', 'focus', 'pressed'] as const
const VARIANTS: ButtonVariant[] = ['brand', 'light', 'ink', 'outline', 'ghost', 'glass']

function Block({ id, title, children, note }: { id: string; title: string; children: ReactNode; note?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-6 border-t border-line pt-12">
      <h2 id={`${id}-h`} className="display text-[2rem]">{title}</h2>
      {note && <p className="mt-2 max-w-2xl text-[14px] text-body">{note}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[12px] font-medium tracking-wide text-body uppercase">{children}</p>
}

export function Styleguide() {
  useDocumentTitle('Style guide')
  const toast = useToast()
  const [replay, setReplay] = useState(0)
  const [modal, setModal] = useState(false)
  const [count, setCount] = useState(2)
  const [stars, setStars] = useState(4)
  const [seg, setSeg] = useState<'a' | 'b'>('a')
  const [chip, setChip] = useState(true)

  const toc = [
    ['colors', 'Colour'],
    ['type', 'Type'],
    ['space', 'Spacing, radii, shadows'],
    ['motion', 'Motion'],
    ['buttons', 'Buttons'],
    ['badges', 'Badges & chips'],
    ['forms', 'Forms'],
    ['controls', 'Controls'],
    ['cards', 'Cards'],
    ['feedback', 'Feedback'],
  ]

  return (
    <>
      <PageHero photo="philae" size="sm" eyebrow="Design system" title="Style guide" lead="Every token and component Sandline Journeys is built from, rendered by the real components." crumbs={[{ label: 'Home', to: '/' }, { label: 'Style guide' }]} />
      <div className="mx-auto mt-12 grid max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[200px_1fr] lg:px-12">
        <nav aria-label="Style guide sections" className="lg:sticky lg:top-6 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
            {toc.map(([id, l]) => (
              <li key={id}>
                <a href={`#${id}`} className="inline-flex min-h-10 items-center rounded-full px-3 text-[14px] text-ink hov:bg-sand lg:rounded-md">{l}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex min-w-0 flex-col gap-16">
          <Block id="colors" title="Colour" note="Contrast is measured against Paper. Faint and Sun never carry small text; Faint is the floor of the scroll-reveal statement (3:1, large text).">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
              {COLORS.map((c) => (
                <li key={c.token} className="overflow-hidden rounded-[var(--radius-sm)] bg-surface shadow-card">
                  <div className="h-20 border-b border-line" style={{ background: c.hex }} />
                  <div className="p-3 text-[12px]">
                    <p className="text-[14px] font-semibold text-ink">{c.name}</p>
                    <p className="font-mono text-body">{c.hex}</p>
                    <p className="font-mono text-body">{c.token}</p>
                    <p className="mt-1 text-body">{c.use}</p>
                    <p className="mt-1 font-medium text-ink">{contrast(c.hex, '#f7f5f1').toFixed(2)}:1 on paper</p>
                  </div>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="type" title="Type" note="Bricolage Grotesque (display, 800) and Poppins (text, 400–600), both from Google Fonts.">
            <div className="flex flex-col divide-y divide-line">
              {TYPE.map((t) => (
                <div key={t.label} className="grid gap-2 py-5 md:grid-cols-[220px_1fr] md:items-baseline">
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{t.label}</p>
                    <p className="text-[12px] text-body">{t.spec}</p>
                  </div>
                  <p className={cx(t.cls, 'min-w-0 break-words text-ink')}>{t.sample}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block id="space" title="Spacing, radii, shadows">
            <Label>Spacing (px)</Label>
            <div className="flex flex-wrap items-end gap-4">
              {SPACING.map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className="bg-brand/80" style={{ width: Math.min(s, 128), height: 24 }} />
                  <span className="text-[12px] text-body">{s}</span>
                </div>
              ))}
            </div>
            <Label>
              <span className="mt-10 block">Radii</span>
            </Label>
            <div className="flex flex-wrap gap-4">
              {RADII.map((r) => (
                <div key={r.name} className="flex flex-col items-center gap-2">
                  <div className="size-20 border border-line-strong bg-peach" style={{ borderRadius: r.v }} />
                  <span className="text-[12px] text-body">{r.name} · {r.v}</span>
                </div>
              ))}
            </div>
            <Label>
              <span className="mt-10 block">Shadows</span>
            </Label>
            <div className="flex flex-wrap gap-6">
              {SHADOWS.map((s) => (
                <div key={s.name} className={cx('flex h-24 w-40 items-center justify-center rounded-[var(--radius-sm)] text-[13px]', s.name === 'glass' ? 'bg-slate text-white' : 'bg-surface text-ink')} style={{ boxShadow: s.v }}>
                  {s.name}
                </div>
              ))}
            </div>
          </Block>

          <Block id="motion" title="Motion" note="All motion respects prefers-reduced-motion: CSS durations collapse and Motion skips transforms.">
            <ul className="grid gap-2 sm:grid-cols-2">
              {MOTION.map((m) => (
                <li key={m.name} className="flex justify-between gap-3 rounded-[var(--radius-sm)] bg-surface px-4 py-3 text-[13px] shadow-card">
                  <span className="font-mono text-ink">{m.name}</span>
                  <span className="text-right text-body">{m.v} · {m.use}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <Button variant="outline" onClick={() => setReplay((r) => r + 1)} icon={<RotateCcw className="size-4" aria-hidden />}>Replay</Button>
              <div key={`rise-${replay}`} className="animate-rise rounded-[var(--radius-sm)] bg-peach px-5 py-4 text-[14px] font-medium text-ink">rise</div>
              <div key={`fade-${replay}`} className="animate-fade-in rounded-[var(--radius-sm)] bg-brand-soft px-5 py-4 text-[14px] font-medium text-ink">fade-in</div>
              <div className="h-14 w-40 overflow-hidden rounded-[var(--radius-sm)]"><div className="size-full animate-drift bg-[url(/images/dunes.webp)] bg-cover" /></div>
              <div className="skeleton h-14 w-40 rounded-[var(--radius-sm)]" />
            </div>
          </Block>

          <Block id="buttons" title="Buttons" note="States are pinned with data-force on the real component.">
            <div className="flex flex-col gap-6">
              {VARIANTS.map((v) => (
                <div key={v} className={cx('rounded-[var(--radius-md)] p-5', v === 'glass' || v === 'light' ? 'bg-[url(/images/hero.webp)] bg-cover bg-center' : 'bg-surface shadow-card')}>
                  <Label><span className={v === 'glass' || v === 'light' ? 'rounded bg-white/90 px-1.5 text-ink' : ''}>{v}</span></Label>
                  <div className="flex flex-wrap items-center gap-3">
                    {STATES.map((s) => (
                      <Button key={s} variant={v} data-force={s === 'default' ? undefined : s}>{s}</Button>
                    ))}
                    <Button variant={v} disabled>disabled</Button>
                    <Button variant={v} loading>loading</Button>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-6 rounded-[var(--radius-md)] bg-surface p-5 shadow-card">
                <div><Label>Sizes</Label><div className="flex items-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg" iconRight={<ArrowRight className="size-4" aria-hidden />}>Large</Button></div></div>
                <div><Label>Icon buttons</Label><div className="flex items-center gap-3">
                  <IconButton aria-label="Search"><Search className="size-4" aria-hidden /></IconButton>
                  <IconButton aria-label="Search (hover)" data-force="hover"><Search className="size-4" aria-hidden /></IconButton>
                  <IconButton aria-label="Save" tone="ink"><Heart className="size-4" aria-hidden /></IconButton>
                  <IconButton aria-label="Mail (disabled)" disabled><Mail className="size-4" aria-hidden /></IconButton>
                </div></div>
                <div className="rounded-[var(--radius-sm)] bg-slate p-3"><Label><span className="text-white">Arrow circle</span></Label><div className="flex gap-3"><ArrowCircleLink to="/tours" label="Arrow link" /><ArrowCircleLink to="/tours" label="Arrow link (hover)" data-force="hover" /></div></div>
                <div><Label>Logo</Label><Logo /></div>
              </div>
            </div>
          </Block>

          <Block id="badges" title="Badges & chips">
            <div className="flex flex-wrap gap-2">
              {(['neutral', 'peach', 'brand', 'ink', 'success', 'danger', 'glass'] as BadgeTone[]).map((t) => <Badge key={t} tone={t} className={t === 'glass' ? 'border border-line' : ''}>{t}</Badge>)}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip active={chip} onClick={() => setChip(!chip)}>Toggle me</Chip>
              <Chip>Default</Chip>
              <Chip data-force="hover">Hover</Chip>
              <Chip data-force="focus">Focus</Chip>
              <Chip active>Active</Chip>
              <Chip disabled>Disabled</Chip>
            </div>
          </Block>

          <Block id="forms" title="Forms">
            <div className="grid gap-5 rounded-[var(--radius-md)] bg-surface p-6 shadow-card md:grid-cols-2">
              <Field label="Default" hint="Helper text sits under the control"><Input placeholder="Placeholder" /></Field>
              <Field label="Hover"><Input data-force="hover" defaultValue="Hovered" /></Field>
              <Field label="Focus"><Input data-force="focus" defaultValue="Focused" /></Field>
              <Field label="Error" error="Enter a valid email address."><Input defaultValue="hannah@" /></Field>
              <Field label="Disabled"><Input disabled defaultValue="Not editable" /></Field>
              <Field label="Optional" optional><Select defaultValue=""><option value="">Choose a tour</option>{TOURS.map((t) => <option key={t.slug}>{t.title}</option>)}</Select></Field>
              <Field label="Textarea" className="md:col-span-2"><Textarea defaultValue="Dates, interests, who is travelling…" /></Field>
              <div className="flex flex-col gap-1">
                <Checkbox label="Unchecked" />
                <Checkbox label="Checked" defaultChecked />
                <Checkbox label="Error" error="Accept the booking conditions to continue." />
                <Checkbox label="Disabled" disabled />
              </div>
              <div className="flex flex-col gap-3">
                <FormMessage tone="success">Message sent. Your reference is EQ-4K2P9A.</FormMessage>
                <FormMessage tone="error">We could not reach the server. Check your connection and try again.</FormMessage>
              </div>
            </div>
          </Block>

          <Block id="controls" title="Controls">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[var(--radius-md)] bg-surface px-5 py-2 shadow-card"><Counter label="Adults" note="Age 12 and over" value={count} min={1} max={8} onChange={setCount} /></div>
              <div className="flex flex-col gap-4 rounded-[var(--radius-md)] bg-surface p-5 shadow-card">
                <StarInput value={stars} onChange={setStars} />
                <Stars value={4} />
              </div>
              <div className="rounded-[var(--radius-md)] bg-surface p-5 shadow-card"><Steps steps={['Trip', 'Travellers', 'Review']} current={1} /></div>
              <div className="rounded-[var(--radius-md)] bg-surface p-5 shadow-card"><Segmented label="Demo" value={seg} onChange={setSeg} options={[{ value: 'a', label: 'Requested (1)' }, { value: 'b', label: 'Saved (3)' }]} /></div>
              <div className="md:col-span-2"><Accordion items={TOURS[0].itinerary.slice(0, 3).map((d, i) => ({ meta: `Day ${i + 1}`, title: d.title, body: d.body }))} /></div>
            </div>
          </Block>

          <Block id="cards" title="Cards">
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
              <div><Label>Tour card</Label><TourCard tour={TOURS[1]} /></div>
              <div className="group" data-force="hover"><Label>Tour card (hover)</Label><TourCard tour={TOURS[4]} /></div>
              <div><Label>Loading</Label><TourCardSkeleton /></div>
              <div><Label>Destination</Label><DestinationCard d={DESTINATIONS[1]} tours={4} /></div>
              <div><Label>Feature</Label><FeatureCard index={1} title="Trusted Network" body="Our own Egyptologist guides, drivers and family-run camps." /><FeatureCard index={2} data-force="hover" title="Hover" body="Lifts 4px with a deeper shadow." className="mt-4" /></div>
              <div><Label>Review</Label><ReviewCard review={REVIEWS[1]} /></div>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-[var(--radius-md)] bg-slate p-6"><dl className="flex gap-10"><Stat value="10k+" label="Happy Travelers" light /><Stat value="500+" label="Custom Tours" light /></dl></div>
              <div className="rounded-[var(--radius-md)] bg-surface p-6 shadow-card"><SectionHeading eyebrow="Eyebrow" title="Section heading" size="md" lead="With an optional lead paragraph." /></div>
            </div>
          </Block>

          <Block id="feedback" title="Feedback">
            <div className="grid gap-6 md:grid-cols-2">
              <EmptyState icon={<Heart className="size-6" aria-hidden />} title="Nothing saved yet" body="Tap the heart on any tour to keep it here while you decide." action={<Button variant="outline" size="sm">Find a tour</Button>} />
              <div className="flex flex-col items-start gap-4 rounded-[var(--radius-md)] bg-surface p-6 shadow-card">
                <Button variant="outline" onClick={() => toast('Saved to My trips')}>Show a toast</Button>
                <Button variant="outline" onClick={() => setModal(true)}>Open a dialog</Button>
                <div className="w-full rounded-[var(--radius-sm)] bg-slate p-4 on-dark"><NewsletterForm /></div>
              </div>
            </div>
          </Block>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Dialog" description="Focus is trapped here; Esc or the backdrop closes it and focus returns to the opener.">
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
          <Button onClick={() => setModal(false)}>Confirm</Button>
        </div>
      </Modal>
    </>
  )
}

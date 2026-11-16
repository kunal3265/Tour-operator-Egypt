import { ArrowRight, CalendarDays, Plane, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'

import { ArrowCircleLink, ButtonLink } from '../components/Button'
import { DestinationCard } from '../components/DestinationCard'
import { FeatureCard } from '../components/FeatureCard'
import { HeroFrame } from '../components/HeroFrame'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { ReviewCard } from '../components/ReviewCard'
import { ScrollWords } from '../components/ScrollWords'
import { Eyebrow, SectionHeading } from '../components/SectionHeading'
import { Stat } from '../components/Stat'
import { Stars } from '../components/Stars'
import { TourCard } from '../components/TourCard'
import { BRAND, DESTINATIONS, HOME, RATING_SUMMARY, REVIEWS, TOURS } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const ease = [0.22, 1, 0.36, 1] as const

function Hero() {
  const layer = 'absolute inset-0 size-full object-cover object-[50%_62%] animate-drift motion-reduce:animate-none'
  return (
    <HeroFrame
      className="h-[clamp(640px,calc(100svh-40px),900px)]"
      background={<Photo name="hero" alt="" className={layer} fetchPriority="high" />}
    >
      {/* The headline sits between the sky and a cut-out of the pyramids, so their tips rise through the letters. */}
      <h1 className="pointer-events-none absolute inset-x-0 top-[23%] z-0 select-none lg:top-[21%]">
        <motion.span
          aria-hidden
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
          className="display block pl-[6.5%] text-[clamp(6.2rem,17.2vw,17.5rem)] leading-[0.8] tracking-[-0.045em] text-white"
          style={{ fontVariationSettings: "'opsz' 96, 'wdth' 100" }}
        >
          {HOME.heroWord}
        </motion.span>
        <span className="sr-only">{BRAND.fullName}: {HOME.heroTitle}</span>
      </h1>
      <Photo name="heroFront" alt="" aria-hidden className={`${layer} pointer-events-none z-[1]`} />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_55%_at_12%_100%,rgb(60_35_15/0.55),transparent_70%)]" />
      <motion.div
        className="pointer-events-none absolute right-[-6%] bottom-0 z-[2] h-[36%] sm:right-[-1%] sm:h-[52%] lg:h-[58%]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.45, ease }}
      >
        <Photo name="camel" alt="" className="h-full w-auto object-contain drop-shadow-[0_20px_30px_rgb(40_20_5/0.35)]" />
      </motion.div>

      <div className="relative z-[3] mt-auto flex flex-col gap-8 px-5 pb-8 sm:px-[6.5%] sm:pb-11">
        <motion.dl
          className="flex max-w-[55%] flex-col gap-4 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-x-[clamp(1.5rem,4vw,3.75rem)] sm:gap-y-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
        >
          {HOME.stats.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} light />
          ))}
        </motion.dl>
        <motion.div
          className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease }}
        >
          <div className="flex items-center gap-1">
            <ButtonLink to="/tours" variant="light" size="md" className="h-11 px-7">
              Book Now
            </ButtonLink>
            <ArrowCircleLink to="/destinations" label="Explore destinations" />
          </div>
          <p className="max-w-[340px] text-[14px] leading-relaxed text-white [text-shadow:0_1px_12px_rgb(40_20_5/0.5)] max-sm:hidden">{HOME.heroLine}</p>
        </motion.div>
      </div>
    </HeroFrame>
  )
}

function Discover() {
  return (
    <section className="mx-auto mt-24 grid max-w-[1600px] items-center gap-10 px-5 sm:mt-32 sm:px-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.62fr)] lg:gap-16 lg:px-12">
      <Reveal className="flex flex-col gap-6">
        <SectionHeading eyebrow={HOME.discover.eyebrow} title={HOME.discover.title} size="xl" />
        <p className="max-w-sm text-[15px] leading-relaxed text-body">{HOME.discover.body}</p>
        <Link to="/tours" className="group inline-flex min-h-10 items-center gap-2 self-start text-[14px] font-semibold text-ink">
          <span className="border-b border-ink/40 pb-0.5 group-hov:border-ink">Find your journey</span>
          <ArrowRight className="size-4 transition-transform group-hov:translate-x-1" aria-hidden />
        </Link>
      </Reveal>
      <Reveal delay={0.1} className="overflow-hidden rounded-[var(--radius-md)]">
        <Photo name="dunes" loading="lazy" className="aspect-[16/8] w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] hover:scale-[1.03]" />
      </Reveal>
    </section>
  )
}

function Statement() {
  return (
    <section className="mx-auto mt-28 max-w-[1100px] px-5 text-center sm:mt-40 sm:px-8">
      <h2 className="sr-only">Our promise</h2>
      <ScrollWords text={`${HOME.statement.lead} ${HOME.statement.tail}`} className="text-[clamp(2rem,1.3rem+2.6vw,3.6rem)] leading-[1.04]" />
    </section>
  )
}

function WhyEgypt() {
  const facts = [
    { icon: Sun, label: 'Best time to go', value: 'October to April' },
    { icon: Plane, label: 'Flight from Europe', value: '4 to 5 hours' },
    { icon: CalendarDays, label: 'Ideal trip length', value: '8 to 12 days' },
  ]
  return (
    <section className="mx-auto mt-28 max-w-[1600px] px-3 sm:mt-40 sm:px-4 lg:px-5">
      <Reveal className="grid gap-8 rounded-[var(--radius-sm)] bg-peach p-4 sm:p-6 md:grid-cols-[minmax(220px,300px)_1fr] lg:grid-cols-[minmax(240px,320px)_1fr_minmax(220px,300px)] lg:items-center lg:gap-14 lg:p-7">
        <div className="relative overflow-hidden rounded-[var(--radius-sm)]">
          <Photo name="temple" loading="lazy" className="aspect-[3/4] w-full object-cover max-md:aspect-[4/3]" />
          <span className="absolute top-3 left-3 rounded-full bg-white/85 px-3 py-1 text-[12px] font-medium text-ink backdrop-blur">{HOME.why.photoLabel}</span>
          <ButtonLink to="/destinations" variant="light" size="sm" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[12px]" iconRight={<ArrowRight className="size-3.5" aria-hidden />}>
            {HOME.why.cta}
          </ButtonLink>
        </div>
        <div className="flex flex-col gap-5 md:py-6">
          <Eyebrow>{HOME.why.eyebrow}</Eyebrow>
          <h2 className="display max-w-md text-[clamp(2.6rem,1.6rem+3vw,4.6rem)]">{HOME.why.title}</h2>
          <p className="max-w-md text-[15px] leading-relaxed text-ink/85">{HOME.why.body}</p>
        </div>
        <dl className="grid gap-3 md:col-span-2 md:grid-cols-3 lg:col-span-1 lg:grid-cols-1">
          {facts.map((f) => (
            <div key={f.label} className="grid grid-cols-[auto_1fr] items-center gap-x-4 rounded-[var(--radius-sm)] bg-white/60 p-4">
              <dt className="contents">
                <span className="row-span-2 inline-flex size-10 items-center justify-center rounded-full bg-white text-ink">
                  <f.icon className="size-[18px]" aria-hidden />
                </span>
                <span className="text-[12px] text-body">{f.label}</span>
              </dt>
              <dd className="col-start-2 text-[15px] font-semibold text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}

function Promises() {
  const p = HOME.promises
  return (
    <section className="mx-auto mt-24 grid max-w-[1600px] gap-12 px-5 sm:mt-32 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)] lg:px-12">
      <Reveal className="flex flex-col gap-6 lg:sticky lg:top-12 lg:self-start">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} size="lg" />
        <p className="max-w-sm text-[14px] leading-relaxed text-body">{p.note}</p>
        <ButtonLink to="/contact?type=custom" variant="outline" className="self-start">
          Plan a tailor-made trip
        </ButtonLink>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2">
        {p.items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.06} className={i % 2 === 1 ? 'sm:translate-y-14' : ''}>
            <FeatureCard index={i + 1} title={it.title} body={it.body} className="h-full min-h-[230px]" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Featured() {
  return (
    <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:mt-44 sm:px-8 lg:px-12">
      <Reveal>
        <SectionHeading eyebrow={HOME.featured.eyebrow} title={HOME.featured.title} action={<ButtonLink to="/tours" variant="outline" className="self-start md:self-auto">{HOME.featured.cta}</ButtonLink>} />
      </Reveal>
      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {TOURS.slice(0, 3).map((t, i) => (
          <Reveal key={t.slug} delay={i * 0.08}>
            <TourCard tour={t} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Places() {
  const list = DESTINATIONS.slice(0, 3)
  return (
    <section className="mx-auto mt-28 max-w-[1600px] px-5 sm:mt-36 sm:px-8 lg:px-12">
      <Reveal>
        <SectionHeading eyebrow={HOME.places.eyebrow} title={HOME.places.title} action={<ButtonLink to="/destinations" variant="outline" className="self-start md:self-auto">All destinations</ButtonLink>} />
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {list.map((d, i) => (
          <Reveal key={d.slug} delay={i * 0.08} className={i === 0 ? 'md:col-span-2' : ''}>
            <DestinationCard d={d} tours={TOURS.filter((t) => t.destinations.includes(d.slug)).length} className="h-full min-h-[440px]" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="mx-auto mt-28 max-w-[1600px] px-5 sm:mt-36 sm:px-8 lg:px-12">
      <Reveal>
        <SectionHeading
          eyebrow={HOME.reviews.eyebrow}
          title={HOME.reviews.title}
          lead={
            <span className="inline-flex items-center gap-2">
              <Stars value={RATING_SUMMARY.average} /> Verified reviews from travellers in the last two years.
            </span>
          }
          action={<ButtonLink to="/reviews" variant="outline" className="self-start md:self-auto">{HOME.reviews.cta}</ButtonLink>}
        />
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {REVIEWS.slice(0, 3).map((r, i) => (
          <Reveal key={r.id} delay={i * 0.08}>
            <ReviewCard review={r} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Home() {
  useDocumentTitle()
  return (
    <>
      <Hero />
      <Discover />
      <Statement />
      <WhyEgypt />
      <Promises />
      <Featured />
      <Places />
      <Reviews />
    </>
  )
}

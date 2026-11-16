import { ChevronDown, Heart, Menu } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

import { DESTINATIONS, NAV } from '../data'
import { cx } from '../lib/cx'
import { useStore } from '../lib/store'
import { ButtonLink, IconButton } from './Button'
import { Logo } from './Logo'
import { Modal } from './Modal'

function DestinationMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const id = useId()
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  const active = pathname.startsWith('/destinations')
  return (
    <div ref={ref} className="relative">
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={cx('inline-flex h-10 items-center gap-1 rounded-full px-4 text-[13px] font-medium text-white transition-colors hov:bg-white/15 on-dark', (active || open) && 'bg-white/15')}
      >
        Destination
        <ChevronDown className={cx('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+10px)] left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 rounded-[var(--radius-md)] bg-surface p-3 shadow-lift"
          >
            <ul className="grid grid-cols-2 gap-1">
              {DESTINATIONS.map((d) => (
                <li key={d.slug}>
                  <Link to={`/destinations/${d.slug}`} className="flex flex-col rounded-[var(--radius-sm)] px-3 py-2.5 transition-colors hov:bg-sand">
                    <span className="text-[14px] font-semibold text-ink">{d.name}</span>
                    <span className="text-[12px] text-body">{d.region}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/destinations" className="mt-2 flex min-h-10 items-center justify-center rounded-[var(--radius-sm)] bg-peach text-[13px] font-semibold text-ink hov:bg-peach-2">
              All destinations
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** The header that sits inside the top photo card on every page. */
export function Nav() {
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  const { saved, trips } = useStore()
  useEffect(() => setMenu(false), [pathname])
  const pill = 'inline-flex h-10 items-center rounded-full px-4 text-[13px] font-medium text-white transition-colors hov:bg-white/15 on-dark'
  return (
    <header className="relative z-40 flex items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-7">
      <Logo light />
      <nav aria-label="Main" className="glass absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full p-1 lg:flex">
        {NAV.map((n) =>
          'menu' in n ? (
            <DestinationMenu key={n.to} />
          ) : (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => cx(pill, isActive && 'bg-white/15')}>
              {n.label}
            </NavLink>
          ),
        )}
      </nav>
      <div className="flex items-center gap-2">
        <Link
          to="/trips"
          aria-label={`My trips${saved.length + trips.length ? `, ${saved.length} saved, ${trips.length} booked` : ''}`}
          className="glass relative hidden size-10 items-center justify-center rounded-full text-white transition-colors hov:bg-white/25 sm:inline-flex on-dark"
        >
          <Heart className="size-4" aria-hidden />
          {saved.length + trips.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex size-5 items-center justify-center rounded-full bg-peach text-[11px] font-semibold text-ink">{saved.length + trips.length}</span>
          )}
        </Link>
        <ButtonLink to="/tours" size="sm" className="h-10 px-5">
          Book Now
        </ButtonLink>
        <IconButton tone="outlineLight" size="sm" className="glass border-0 lg:hidden" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}>
          <Menu className="size-5" aria-hidden />
        </IconButton>
      </div>
      <Modal open={menu} onClose={() => setMenu(false)} title="Menu" side>
        <nav aria-label="Mobile" className="flex flex-col">
          {[...NAV.map((n) => ({ label: n.label === 'Destination' ? 'Destinations' : n.label, to: n.to })), { label: 'My trips', to: '/trips' }].map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => cx('flex min-h-12 items-center border-b border-line text-[17px] font-medium text-ink', isActive && 'text-brand')}>
              {n.label}
            </NavLink>
          ))}
          <p className="eyebrow mt-6 mb-2 text-body">Destinations</p>
          <div className="flex flex-wrap gap-2">
            {DESTINATIONS.map((d) => (
              <Link key={d.slug} to={`/destinations/${d.slug}`} className="inline-flex h-10 items-center rounded-full bg-sand px-4 text-[13px] font-medium text-ink hov:bg-peach">
                {d.name}
              </Link>
            ))}
          </div>
          <ButtonLink to="/tours" className="mt-8">
            Book Now
          </ButtonLink>
        </nav>
      </Modal>
    </header>
  )
}

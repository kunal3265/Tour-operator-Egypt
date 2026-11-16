// Departure dates are computed from today so the demo never shows a stale
// calendar. Both the booking form and the Worker use this, so a date the
// Worker accepts is always one the page offered.
import type { Tour } from '../data'

export type Departure = {
  /** ISO date, YYYY-MM-DD. */
  date: string
  price: number
  seatsLeft: number
  season: 'Peak' | 'Standard' | 'Low'
}

const DAY = 86_400_000

function iso(d: Date) {
  return d.toISOString().slice(0, 10)
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function seasonOf(month: number): Departure['season'] {
  if (month === 11 || month <= 1 || month === 3) return 'Peak'
  if (month >= 5 && month <= 7) return 'Low'
  return 'Standard'
}

const SEASON_FACTOR = { Peak: 1.12, Standard: 1, Low: 0.88 }

export function departuresFor(tour: Pick<Tour, 'slug' | 'price' | 'groupMax' | 'departs'>, today = new Date(), count = 10): Departure[] {
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) + 14 * DAY)
  const offset = (tour.departs.weekday - start.getUTCDay() + 7) % 7
  const first = start.getTime() + offset * DAY
  const out: Departure[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(first + i * tour.departs.every * DAY)
    const date = iso(d)
    const season = seasonOf(d.getUTCMonth())
    const h = hash(tour.slug + date)
    // Roughly one departure in seven is full; the rest have 1 to groupMax seats.
    const seatsLeft = h % 7 === 3 ? 0 : 1 + (h % tour.groupMax)
    out.push({ date, season, seatsLeft, price: Math.round((tour.price * SEASON_FACTOR[season]) / 10) * 10 })
  }
  return out
}

export function formatDate(date: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(date + 'T12:00:00Z').toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts })
}

export function addDays(date: string, days: number) {
  return iso(new Date(new Date(date + 'T00:00:00Z').getTime() + days * DAY))
}

export const money = (n: number) => '₹' + n.toLocaleString('en-IN')

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { BookingInput } from '../shared/validation'

// Everything the site remembers lives in localStorage under these keys:
// booked trips, the wishlist and reviews this browser has written.
const KEYS = { trips: 'sandline.trips.v1', saved: 'sandline.saved.v1', reviews: 'sandline.reviews.v1' }

export type Trip = Omit<BookingInput, 'terms'> & {
  reference: string
  total: number
  deposit: number
  createdAt: string
  status: 'Requested' | 'Cancelled'
}

export type LocalReview = {
  id: string
  name: string
  from: string
  tour: string
  rating: number
  title: string
  body: string
  date: string
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or blocked: the session still works in memory */
  }
}

type Store = {
  trips: Trip[]
  addTrip: (t: Trip) => void
  cancelTrip: (reference: string) => void
  saved: string[]
  toggleSaved: (slug: string) => void
  isSaved: (slug: string) => boolean
  reviews: LocalReview[]
  addReview: (r: LocalReview) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(() => read(KEYS.trips, []))
  const [saved, setSaved] = useState<string[]>(() => read(KEYS.saved, []))
  const [reviews, setReviews] = useState<LocalReview[]>(() => read(KEYS.reviews, []))

  useEffect(() => write(KEYS.trips, trips), [trips])
  useEffect(() => write(KEYS.saved, saved), [saved])
  useEffect(() => write(KEYS.reviews, reviews), [reviews])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.trips) setTrips(read(KEYS.trips, []))
      if (e.key === KEYS.saved) setSaved(read(KEYS.saved, []))
      if (e.key === KEYS.reviews) setReviews(read(KEYS.reviews, []))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addTrip = useCallback((t: Trip) => setTrips((list) => [t, ...list]), [])
  const cancelTrip = useCallback(
    (reference: string) => setTrips((list) => list.map((t) => (t.reference === reference ? { ...t, status: 'Cancelled' } : t))),
    [],
  )
  const toggleSaved = useCallback((slug: string) => setSaved((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug])), [])
  const addReview = useCallback((r: LocalReview) => setReviews((list) => [r, ...list]), [])

  const value = useMemo<Store>(
    () => ({ trips, addTrip, cancelTrip, saved, toggleSaved, isSaved: (s) => saved.includes(s), reviews, addReview }),
    [trips, addTrip, cancelTrip, saved, toggleSaved, reviews, addReview],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

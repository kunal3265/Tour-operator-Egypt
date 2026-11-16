// Lets the built site run straight from disk (file://) with no server.
// Opened over http(s) the Worker answers /api, so this does nothing there.
// Under file:// there is no Worker, so the same routes are answered locally
// with the same validation, pricing and response shapes.
import { TOURS } from '../data'
import { departuresFor } from '../shared/departures'
import { quote, validateBooking, validateEnquiry, validateReview, validateSubscribe } from '../shared/validation'

const reference = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

const invalid = (fieldErrors: Record<string, string>) =>
  json({ error: 'Please check the highlighted fields.', fieldErrors }, 422)

function readBody(init?: RequestInit): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(String(init?.body ?? '{}'))
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function respond(path: string, init?: RequestInit): Response {
  const method = (init?.method ?? 'GET').toUpperCase()

  if (path === '/api/health') return json({ ok: true })

  const departures = /^\/api\/tours\/([^/]+)\/departures$/.exec(path)
  if (departures) {
    const tour = TOURS.find((t) => t.slug === decodeURIComponent(departures[1]))
    if (!tour) return json({ error: 'Tour not found' }, 404)
    return json({ departures: departuresFor(tour) })
  }

  if (method === 'POST') {
    const input = readBody(init)
    if (!input) return json({ error: 'Send a JSON object.' }, 400)

    if (path === '/api/bookings') {
      const errors = validateBooking(input)
      if (Object.keys(errors).length) return invalid(errors)
      const tour = TOURS.find((t) => t.slug === input.tour)!
      const dep = departuresFor(tour).find((d) => d.date === input.date)!
      const q = quote(tour, dep.price, {
        adults: input.adults as number,
        children: input.children as number,
        room: input.room as 'shared' | 'single',
        addOns: (input.addOns as string[]) ?? [],
      })
      return json({ ok: true, reference: reference('SJ'), total: q.total, deposit: q.deposit }, 201)
    }
    if (path === '/api/enquiries') {
      const errors = validateEnquiry(input)
      if (Object.keys(errors).length) return invalid(errors)
      return json({ ok: true, reference: reference('EQ') }, 201)
    }
    if (path === '/api/reviews') {
      const errors = validateReview(input)
      if (Object.keys(errors).length) return invalid(errors)
      return json({ ok: true, id: reference('RV') }, 201)
    }
    if (path === '/api/subscribe') {
      const errors = validateSubscribe(input)
      if (Object.keys(errors).length) return invalid(errors)
      return json({ ok: true }, 201)
    }
  }

  return json({ error: 'Not found' }, 404)
}

// file:// has no server; Vercel serves the page but not the Worker routes.
const noWorker = window.location.protocol === 'file:' || import.meta.env.MODE === 'vercel'

if (noWorker) {
  const nativeFetch = window.fetch.bind(window)
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const href = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const path = new URL(href, window.location.href).pathname
    if (path.startsWith('/api/')) return Promise.resolve(respond(path, init))
    return nativeFetch(input, init)
  }
}

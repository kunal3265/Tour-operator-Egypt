// Validation shared by the forms (instant feedback) and the Worker (the
// authority). Each validator returns a map of field -> message; empty = valid.
import { ADD_ONS, ROOM_TYPES, TOURS, type Tour } from '../data'
import { departuresFor } from './departures'

export type FieldErrors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\d\s-]{7,20}$/

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const int = (v: unknown) => (typeof v === 'number' && Number.isInteger(v) ? v : Number.NaN)

export const MAX_PARTY = 8

export type BookingInput = {
  tour: string
  date: string
  adults: number
  children: number
  room: (typeof ROOM_TYPES)[number]['id']
  addOns: string[]
  name: string
  email: string
  phone: string
  country: string
  notes: string
  terms: boolean
}

/** Step 0: departure and party. Step 1: lead traveller. Step 2: terms. */
export function validateBookingStep(step: number, input: Record<string, unknown>, today = new Date()): FieldErrors {
  const errors: FieldErrors = {}
  if (step === 0) {
    const tour = TOURS.find((t) => t.slug === str(input.tour))
    if (!tour) errors.tour = 'Choose a tour.'
    const adults = int(input.adults)
    const children = int(input.children)
    if (!(adults >= 1)) errors.adults = 'At least one adult must travel.'
    if (!(children >= 0)) errors.children = 'Enter the number of children.'
    if (adults + children > MAX_PARTY) errors.adults = `For parties over ${MAX_PARTY}, contact us for a private departure.`
    if (!ROOM_TYPES.some((r) => r.id === input.room)) errors.room = 'Choose a room type.'
    const addOns = Array.isArray(input.addOns) ? input.addOns : []
    if (!addOns.every((a) => ADD_ONS.some((o) => o.id === a))) errors.addOns = 'Remove the unknown extra.'
    if (tour) {
      const date = str(input.date)
      const dep = departuresFor(tour, today).find((d) => d.date === date)
      if (!date) errors.date = 'Choose a departure date.'
      else if (!dep) errors.date = 'That departure is no longer available. Choose another date.'
      else if (dep.seatsLeft === 0) errors.date = 'That departure is full. Choose another date.'
      else if (!errors.adults && adults + (children || 0) > dep.seatsLeft) errors.adults = `Only ${dep.seatsLeft} ${dep.seatsLeft === 1 ? 'place is' : 'places are'} left on this date.`
    }
  }
  if (step === 1) {
    const name = str(input.name)
    if (name.length < 2) errors.name = 'Enter the lead traveller’s full name.'
    else if (name.length > 120) errors.name = 'Keep the name under 120 characters.'
    if (!EMAIL.test(str(input.email))) errors.email = 'Enter a valid email address.'
    if (!PHONE.test(str(input.phone))) errors.phone = 'Enter a phone number with country code.'
    if (!str(input.country)) errors.country = 'Choose your country of residence.'
    if (str(input.notes).length > 1000) errors.notes = 'Keep notes under 1,000 characters.'
  }
  if (step === 2) {
    if (input.terms !== true) errors.terms = 'Accept the booking conditions to continue.'
  }
  return errors
}

export function validateBooking(input: Record<string, unknown>, today = new Date()): FieldErrors {
  return { ...validateBookingStep(2, input, today), ...validateBookingStep(1, input, today), ...validateBookingStep(0, input, today) }
}

export function quote(tour: Tour, price: number, input: Pick<BookingInput, 'adults' | 'children' | 'room' | 'addOns'>) {
  const room = ROOM_TYPES.find((r) => r.id === input.room) ?? ROOM_TYPES[0]
  const childPrice = Math.round(price * 0.75)
  const base = price * input.adults + childPrice * input.children
  const supplement = Math.round(base * room.supplement)
  const party = input.adults + input.children
  const extras = ADD_ONS.filter((a) => input.addOns.includes(a.id)).map((a) => ({
    ...a,
    total: a.id === 'guide' ? a.price * tour.days : a.price * party,
  }))
  const total = base + supplement + extras.reduce((s, e) => s + e.total, 0)
  return { childPrice, base, supplement, extras, total, deposit: Math.round(total * 0.2) }
}

export function validateEnquiry(input: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {}
  if (str(input.name).length < 2) errors.name = 'Enter your full name.'
  if (!EMAIL.test(str(input.email))) errors.email = 'Enter a valid email address.'
  const phone = str(input.phone)
  if (phone && !PHONE.test(phone)) errors.phone = 'Enter a valid phone number.'
  if (!str(input.topic)) errors.topic = 'Choose what your message is about.'
  const travellers = int(input.travellers)
  if (input.travellers !== undefined && input.travellers !== null && !(travellers >= 1 && travellers <= 40)) errors.travellers = 'Enter between 1 and 40 travellers.'
  const month = str(input.month)
  if (month && !/^\d{4}-\d{2}$/.test(month)) errors.month = 'Choose a month.'
  const message = str(input.message)
  if (message.length < 10) errors.message = 'Tell us a little more (at least 10 characters).'
  else if (message.length > 2000) errors.message = 'Keep your message under 2,000 characters.'
  return errors
}

export function validateReview(input: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {}
  if (str(input.name).length < 2) errors.name = 'Enter your name.'
  if (!TOURS.some((t) => t.slug === str(input.tour))) errors.tour = 'Choose the tour you took.'
  const rating = int(input.rating)
  if (!(rating >= 1 && rating <= 5)) errors.rating = 'Choose a rating from 1 to 5 stars.'
  const title = str(input.title)
  if (title.length < 3) errors.title = 'Add a short headline.'
  else if (title.length > 80) errors.title = 'Keep the headline under 80 characters.'
  const body = str(input.body)
  if (body.length < 20) errors.body = 'Write at least 20 characters about your trip.'
  else if (body.length > 1500) errors.body = 'Keep your review under 1,500 characters.'
  return errors
}

export function validateSubscribe(input: Record<string, unknown>): FieldErrors {
  return EMAIL.test(str(input.email)) ? {} : { email: 'Enter a valid email address.' }
}

import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { validateSubscribe } from '../shared/validation'
import { Button } from './Button'

/** Email capture used in the footer band. Posts to /api/subscribe. */
export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [error, setError] = useState('')
  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validateSubscribe({ email })
    if (errs.email) return setError(errs.email)
    setError('')
    setState('loading')
    const res = await postJson('/api/subscribe', { email })
    if (!res.ok) {
      setState('idle')
      setError(res.fieldErrors?.email ?? res.error)
      return
    }
    setState('done')
  }
  if (state === 'done')
    return (
      <p role="status" className={cx('rounded-full bg-white/10 px-5 py-3 text-[14px] text-white', className)}>
        You are on the list. The next offer email goes out on the first of the month.
      </p>
    )
  return (
    <form onSubmit={submit} noValidate className={cx('flex flex-col gap-2', className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'nl-err' : undefined}
          className="h-12 w-full min-w-0 rounded-full sm:flex-1 border border-white/25 bg-white/10 px-5 text-[15px] text-white placeholder:text-white/70 focus:border-white focus:outline-none aria-invalid:border-peach on-dark"
        />
        <Button type="submit" variant="light" loading={state === 'loading'} iconRight={<ArrowRight className="size-4" aria-hidden />} className="h-12">
          Get offers
        </Button>
      </div>
      {error && (
        <p id="nl-err" role="alert" className="pl-5 text-[13px] text-peach">
          {error}
        </p>
      )}
    </form>
  )
}

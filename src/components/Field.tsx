import { AlertCircle, Check, ChevronDown } from 'lucide-react'
import { cloneElement, isValidElement, useId, type InputHTMLAttributes, type ReactElement, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

import { cx } from '../lib/cx'

const control =
  'w-full rounded-[var(--radius-sm)] border bg-surface px-4 text-[15px] text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-[var(--duration-fast)] hov:border-ink/50 focus:border-brand focus:shadow-[0_0_0_3px_rgb(62_91_147/0.18)] focus:outline-none disabled:cursor-not-allowed disabled:bg-sand disabled:text-faint aria-invalid:border-danger aria-invalid:focus:shadow-[0_0_0_3px_rgb(178_59_46/0.15)]'

/** Label + control + hint/error, wired with ids so screen readers announce the error. */
export function Field({ label, hint, error, children, optional, className }: { label: string; hint?: string; error?: string; optional?: boolean; children: ReactElement<Record<string, unknown>>; className?: string }) {
  const id = useId()
  const msgId = `${id}-msg`
  const child = isValidElement(children)
    ? cloneElement(children, { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': error || hint ? msgId : undefined })
    : children
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-body">(optional)</span>}
      </label>
      {child}
      {error ? (
        <p id={msgId} className="flex items-start gap-1.5 text-[13px] text-danger">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={msgId} className="text-[13px] text-body">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(control, 'h-12', className)} {...rest} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(control, 'min-h-32 py-3 leading-relaxed', className)} {...rest} />
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cx(control, 'h-12 appearance-none pr-10', className)} {...rest}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-body" aria-hidden />
    </div>
  )
}

export function Checkbox({ label, error, className, ...rest }: { label: ReactNode; error?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const id = useId()
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="group flex min-h-10 cursor-pointer items-start gap-3 text-[14px] text-ink">
        <span className="relative mt-0.5 inline-flex size-5 shrink-0">
          <input
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            className="peer size-5 cursor-pointer appearance-none rounded-[5px] border border-line-strong bg-surface transition-colors checked:border-ink checked:bg-ink hov:border-ink aria-invalid:border-danger disabled:opacity-50"
            {...rest}
          />
          <Check className="pointer-events-none absolute inset-0.5 size-4 text-white opacity-0 peer-checked:opacity-100" aria-hidden />
        </span>
        <span className="leading-snug">{label}</span>
      </label>
      {error && (
        <p id={`${id}-err`} className="flex items-center gap-1.5 pl-8 text-[13px] text-danger">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}

/** A banner for form-level success or failure. */
export function FormMessage({ tone, children }: { tone: 'error' | 'success'; children: ReactNode }) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('flex items-start gap-2 rounded-[var(--radius-sm)] px-4 py-3 text-[14px]', tone === 'error' ? 'bg-danger-soft text-danger' : 'bg-success-soft text-success')}>
      {tone === 'error' ? <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> : <Check className="mt-0.5 size-4 shrink-0" aria-hidden />}
      <div>{children}</div>
    </div>
  )
}

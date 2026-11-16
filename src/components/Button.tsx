import { ArrowUpRight, LoaderCircle } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

import { cx } from '../lib/cx'

export type ButtonVariant = 'brand' | 'light' | 'ink' | 'outline' | 'ghost' | 'glass'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-medium transition-[background-color,color,border-color,transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] pressed:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  brand: 'bg-brand text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18),0_6px_18px_-8px_rgb(62_91_147/0.8)] hov:bg-brand-2 pressed:bg-ink-2',
  light: 'bg-white text-ink shadow-[0_6px_20px_-10px_rgb(0_0_0/0.35)] hov:bg-peach pressed:bg-peach-2',
  ink: 'bg-ink text-white hov:bg-ink-2 pressed:bg-black',
  outline: 'border border-ink/70 text-ink hov:bg-ink hov:text-white pressed:bg-ink-2 pressed:text-white',
  ghost: 'text-ink hov:bg-sand pressed:bg-line',
  glass: 'glass text-white hov:bg-white/28 pressed:bg-white/35 on-dark',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[13px]',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-[15px]',
}

export function buttonClass(variant: ButtonVariant = 'brand', size: ButtonSize = 'md', className?: string) {
  return cx(base, variants[variant], sizes[size], className)
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode; iconRight?: ReactNode }

export function Button({
  variant = 'brand',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : icon}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  )
}

export function ButtonLink({ variant = 'brand', size = 'md', icon, iconRight, className, children, ...rest }: Common & LinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </Link>
  )
}

export function ButtonAnchor({ variant = 'brand', size = 'md', icon, iconRight, className, children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </a>
  )
}

const iconTones = {
  default: 'border border-line bg-surface text-ink hov:border-line-strong hov:bg-sand',
  outlineLight: 'border border-white/80 text-white hov:bg-white hov:text-ink on-dark',
  glass: 'bg-white/85 text-ink shadow-sm backdrop-blur hov:bg-white',
  ink: 'bg-ink text-white hov:bg-ink-2',
  bare: 'text-current hov:bg-current/10',
}

/** Round icon-only button. Always pass an aria-label. */
export function IconButton({
  className,
  tone = 'default',
  size = 'md',
  pressed,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: keyof typeof iconTones; size?: 'sm' | 'md'; pressed?: boolean; 'aria-label': string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform,border-color] duration-[var(--duration-fast)] pressed:scale-95 disabled:pointer-events-none disabled:opacity-40',
        size === 'md' ? 'size-11' : 'size-10',
        iconTones[tone],
        className,
      )}
      {...rest}
    />
  )
}

/** The outlined arrow circle that sits beside a pill on photography. */
export function ArrowCircleLink({ className, label, light = true, ...rest }: LinkProps & { label: string; light?: boolean }) {
  return (
    <Link
      aria-label={label}
      className={cx(
        'group inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-[background-color,color,transform] duration-[var(--duration-fast)] pressed:scale-95',
        light ? 'border-white/85 text-white hov:bg-white hov:text-ink on-dark' : 'border-ink/60 text-ink hov:bg-ink hov:text-white',
        className,
      )}
      {...rest}
    >
      <ArrowUpRight className="size-5 transition-transform duration-[var(--duration-base)] group-hov:translate-x-0.5 group-hov:-translate-y-0.5" aria-hidden />
    </Link>
  )
}

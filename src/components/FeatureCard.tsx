import { cx } from '../lib/cx'

/** White card with a numbered navy badge, as in the "why us" grid. */
export function FeatureCard({ index, title, body, className, ...rest }: { index: number; title: string; body: string; className?: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <article {...rest} className={cx('group flex flex-col gap-4 rounded-[var(--radius-sm)] bg-surface p-7 shadow-card transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-soft)] hov:-translate-y-1 hov:shadow-lift', className)}>
      <span className="inline-flex h-7 w-8 items-center justify-center rounded-[5px] bg-ink font-sans text-[12px] font-semibold text-white">{String(index).padStart(2, '0')}</span>
      <h3 className="mt-4 font-sans text-[17px] font-semibold text-ink">{title}</h3>
      <p className="text-[14px] leading-relaxed text-body">{body}</p>
    </article>
  )
}

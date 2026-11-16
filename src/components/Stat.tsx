import { cx } from '../lib/cx'

/** A big figure over its label. Render inside a <dl>. */
export function Stat({ value, label, light = false, className }: { value: string; label: string; light?: boolean; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <dt className={cx('order-2 text-[14px] sm:text-[15px]', light ? 'text-white' : 'text-body')}>{label}</dt>
      <dd className={cx('order-1 font-sans text-[clamp(1.9rem,1.4rem+1.8vw,3.2rem)] leading-none font-normal tracking-[-0.02em]', light ? 'text-white' : 'text-ink')}>{value}</dd>
    </div>
  )
}

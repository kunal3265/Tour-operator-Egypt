import { cx } from '../lib/cx'

export function Segmented<T extends string>({ value, options, onChange, label, className }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string; className?: string }) {
  return (
    <div role="radiogroup" aria-label={label} className={cx('inline-flex rounded-full border border-line-strong bg-surface p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx('h-10 rounded-full px-4 text-[13px] font-medium transition-colors', value === o.value ? 'bg-ink text-white' : 'text-ink hov:bg-sand')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

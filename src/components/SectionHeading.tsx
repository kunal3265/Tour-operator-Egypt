import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Eyebrow({ children, className, light }: { children: ReactNode; className?: string; light?: boolean }) {
  return <p className={cx('eyebrow', light ? 'text-white/85' : 'text-ink', className)}>{children}</p>
}

/** Eyebrow + heavy display headline + optional lead, used to open every section. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  size = 'lg',
  align = 'left',
  as: Tag = 'h2',
  className,
  action,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lead?: ReactNode
  size?: 'xl' | 'lg' | 'md'
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  action?: ReactNode
}) {
  return (
    <div className={cx('flex flex-col gap-5', align === 'center' && 'items-center text-center', !!action && 'md:flex-row md:items-end md:justify-between', className)}>
      <div className={cx('flex flex-col gap-4', align === 'center' && 'items-center')}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Tag
          className={cx(
            'display text-ink',
            size === 'xl' && 'text-[clamp(3rem,1.6rem+4.4vw,5.6rem)]',
            size === 'lg' && 'text-[clamp(2.4rem,1.5rem+2.8vw,4rem)]',
            size === 'md' && 'text-[clamp(1.9rem,1.4rem+1.6vw,2.75rem)]',
          )}
        >
          {title}
        </Tag>
        {lead && <p className={cx('max-w-xl text-[15px] leading-relaxed text-body', align === 'center' && 'mx-auto')}>{lead}</p>}
      </div>
      {action}
    </div>
  )
}

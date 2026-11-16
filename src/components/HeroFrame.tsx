import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Nav } from './Nav'

/** The rounded photo card every page opens with; the header sits inside it. */
export function HeroFrame({ children, className, background }: { children?: ReactNode; className?: string; background: ReactNode }) {
  return (
    <div className="px-3 pt-3 sm:px-4 sm:pt-4 lg:px-5 lg:pt-5">
      <section className={cx('relative isolate flex flex-col overflow-hidden rounded-[var(--radius-md)] bg-ink', className)}>
        <div className="absolute inset-0 -z-10">{background}</div>
        <Nav />
        {children}
      </section>
    </div>
  )
}

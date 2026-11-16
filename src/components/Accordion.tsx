import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'

import { cx } from '../lib/cx'

export type AccordionItem = { title: ReactNode; body: ReactNode; meta?: ReactNode }

/** Disclosure list used by FAQ and the day-by-day itinerary. */
export function Accordion({ items, defaultOpen = [0], className }: { items: AccordionItem[]; defaultOpen?: number[]; className?: string }) {
  const [open, setOpen] = useState<number[]>(defaultOpen)
  const base = useId()
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))
  return (
    <div className={cx('divide-y divide-line border-y border-line', className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i)
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={`${base}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p${i}`}
                onClick={() => toggle(i)}
                className="group flex min-h-14 w-full items-center gap-4 py-4 text-left"
              >
                {item.meta && <span className="w-16 shrink-0 text-[13px] font-semibold text-brand">{item.meta}</span>}
                <span className="flex-1 text-[16px] font-medium text-ink">{item.title}</span>
                <span className={cx('inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink transition-[transform,background-color] duration-[var(--duration-base)] group-hov:bg-sand', isOpen && 'rotate-45 bg-sand')}>
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-p${i}`}
                  role="region"
                  aria-labelledby={`${base}-b${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className={cx('pb-5 text-[15px] leading-relaxed text-body', item.meta ? 'sm:pl-20' : '', 'pr-12')}>{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

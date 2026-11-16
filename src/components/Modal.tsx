import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cx } from '../lib/cx'
import { useFocusTrap } from '../lib/useFocusTrap'
import { IconButton } from './Button'

function Panel({ title, onClose, children, side, description }: { title: string; onClose: () => void; children: ReactNode; side?: boolean; description?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  useFocusTrap(ref, true, onClose)
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="absolute inset-0 bg-scrim/55 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden onMouseDown={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        aria-describedby={description ? `${id}-d` : undefined}
        tabIndex={-1}
        initial={side ? { x: '100%' } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={side ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }}
        exit={side ? { x: '100%' } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cx(
          'relative flex max-h-[92svh] w-full flex-col overflow-y-auto bg-surface shadow-lift focus:outline-none',
          side ? 'fixed top-0 right-0 h-svh max-h-none max-w-sm rounded-none' : 'max-w-lg rounded-t-[var(--radius-lg)] sm:rounded-[var(--radius-lg)]',
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5">
          <h2 id={id} className="font-sans text-[18px] font-semibold text-ink">
            {title}
          </h2>
          <IconButton tone="bare" aria-label="Close" onClick={onClose} className="text-ink">
            <X className="size-5" aria-hidden />
          </IconButton>
        </div>
        {description && (
          <p id={`${id}-d`} className="px-6 pt-1 text-[14px] text-body">
            {description}
          </p>
        )}
        <div className="px-6 pt-4 pb-6">{children}</div>
      </motion.div>
    </div>
  )
}

/** Accessible dialog: traps focus, closes on Esc or backdrop, restores focus. `side` makes it a drawer. */
export function Modal({ open, ...props }: { open: boolean; title: string; onClose: () => void; children: ReactNode; side?: boolean; description?: string }) {
  return createPortal(<AnimatePresence>{open && <Panel {...props} />}</AnimatePresence>, document.body)
}

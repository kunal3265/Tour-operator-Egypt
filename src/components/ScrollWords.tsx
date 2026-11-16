import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'

import { cx } from '../lib/cx'

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const color = useTransform(progress, range, ['#8a909d', '#36425e'])
  return <motion.span style={{ color }}>{word} </motion.span>
}

/**
 * Large statement whose words fill from grey to ink as it scrolls through the
 * viewport. The grey floor (#8a909d) keeps 3:1 contrast for large text.
 */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={cx('display', className)}>
      {words.map((w, i) => (
        <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  )
}

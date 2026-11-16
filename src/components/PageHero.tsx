import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

import type { PhotoKey } from '../lib/images'
import { cx } from '../lib/cx'
import { HeroFrame } from './HeroFrame'
import { Photo } from './Photo'

/** Inner-page header: photo card, breadcrumbs, eyebrow, headline and lead. */
export function PageHero({
  photo,
  eyebrow,
  title,
  lead,
  crumbs,
  size = 'md',
  children,
  position = 'center',
}: {
  photo: PhotoKey
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  crumbs?: { label: string; to?: string }[]
  size?: 'sm' | 'md'
  children?: ReactNode
  position?: string
}) {
  return (
    <HeroFrame
      className={cx(size === 'md' ? 'min-h-[min(560px,78svh)]' : 'min-h-[360px]')}
      background={
        <>
          <Photo name={photo} alt="" className="size-full animate-[fade-in_0.6s_ease-out_both] object-cover" style={{ objectPosition: position }} fetchPriority="high" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(29_26_22/0.45)_0%,rgb(29_26_22/0.1)_35%,rgb(29_26_22/0.72)_100%)]" />
        </>
      }
    >
      <div className="mt-auto flex flex-col gap-4 px-5 pt-16 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
        {crumbs && (
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-white">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {c.to ? (
                    <Link to={c.to} className="inline-flex min-h-10 min-w-10 items-center underline-offset-4 hov:underline on-dark">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="inline-flex min-h-10 items-center">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <ChevronRight className="size-3.5 opacity-80" aria-hidden />}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow text-white">{eyebrow}</p>}
        <h1 className="display max-w-4xl text-[clamp(2.6rem,1.4rem+4vw,5.2rem)] text-white">{title}</h1>
        {lead && <p className="max-w-xl text-[15px] leading-relaxed text-white">{lead}</p>}
        {children}
      </div>
    </HeroFrame>
  )
}

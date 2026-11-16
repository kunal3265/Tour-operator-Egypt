import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { BRAND, FOOTER } from '../data'
import { Logo } from './Logo'
import { Modal } from './Modal'
import { NewsletterForm } from './NewsletterForm'
import { SocialIcon } from './SocialIcon'

export function Footer() {
  const [privacy, setPrivacy] = useState(false)
  return (
    <footer className="mt-24 bg-slate text-white on-dark sm:mt-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:py-20">
          <h2 className="display max-w-2xl text-[clamp(2.2rem,1.4rem+2.6vw,3.6rem)] text-white">{FOOTER.ctaTitle}</h2>
          <div className="flex flex-col gap-4 lg:items-end">
            <p className="max-w-md text-[14px] leading-relaxed text-white lg:text-right">{FOOTER.ctaBody}</p>
            <NewsletterForm className="w-full max-w-md" />
          </div>
        </div>
        <div className="grid gap-10 border-t border-white/15 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo light />
            <ul className="flex flex-col gap-1 text-[14px] text-white">
              <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />{BRAND.address}</li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="inline-flex min-h-10 items-center gap-2.5 hov:underline"><Mail className="size-4" aria-hidden />{BRAND.email}</a>
              </li>
              <li>
                <a href={`tel:${BRAND.phoneHref}`} className="inline-flex min-h-10 items-center gap-2.5 hov:underline"><Phone className="size-4" aria-hidden />{BRAND.phone}</a>
              </li>
            </ul>
            <ul className="flex gap-2" aria-label="Social media">
              {BRAND.social.map((s) => {
                return (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" aria-label={`${BRAND.fullName} on ${s.label}`} className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 transition-colors hov:bg-white hov:text-slate">
                      <SocialIcon name={s.label} className="size-4" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow text-white">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-1">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="inline-flex min-h-10 min-w-10 items-center text-[14px] text-white hov:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-white/15 py-6 text-[12px] text-white sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {FOOTER.legal} {BRAND.licence}.</p>
          <button type="button" onClick={() => setPrivacy(true)} className="inline-flex min-h-10 items-center self-start hov:underline sm:self-auto">
            {FOOTER.privacy}
          </button>
        </div>
      </div>
      <Modal open={privacy} onClose={() => setPrivacy(false)} title="Privacy policy">
        <div className="flex flex-col gap-3 text-[14px] leading-relaxed text-body">
          <p>We use the details you send us only to plan and run your trip, and to send offers if you subscribe.</p>
          <p>This site stores your saved tours, trip requests and reviews in your own browser (localStorage). Nothing is sent anywhere except the forms you submit.</p>
          <p>Write to {BRAND.email} to see or delete anything we hold about you.</p>
        </div>
      </Modal>
    </footer>
  )
}

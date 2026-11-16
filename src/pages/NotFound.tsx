import { Compass } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { PageHero } from '../components/PageHero'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <PageHero photo="dunes" eyebrow="Error 404" title="Lost in the dunes" lead="The page you were looking for has drifted off the map. The footprints lead back this way." position="center 70%">
      <div className="mt-2 flex flex-wrap gap-3">
        <ButtonLink to="/" variant="light">Back to home</ButtonLink>
        <ButtonLink to="/tours" variant="glass" icon={<Compass className="size-4" aria-hidden />}>Browse tours</ButtonLink>
      </div>
    </PageHero>
  )
}

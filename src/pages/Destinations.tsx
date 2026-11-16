import { DestinationCard } from '../components/DestinationCard'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { DESTINATIONS, TOURS } from '../data'
import { cx } from '../lib/cx'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// 2 = ideal, 1 = good, 0 = hot or quiet season.
const SEASONS: Record<string, number[]> = {
  'cairo-giza': [2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2],
  luxor: [2, 2, 2, 1, 0, 0, 0, 0, 1, 1, 2, 2],
  aswan: [2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 2, 2],
  'abu-simbel': [2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2],
  'red-sea': [1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1],
  'western-desert': [2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2],
}
const LABEL = ['Hot or quiet', 'Good', 'Ideal']
const TONE = ['bg-sand', 'bg-peach', 'bg-sun']

export function Destinations() {
  useDocumentTitle('Destinations in Egypt')
  return (
    <>
      <PageHero
        photo="abuSimbel"
        eyebrow="Destinations"
        title="Six regions, one river"
        lead="Most of Egypt’s story happened within a few miles of the Nile. Here is where we take you, and when each place is at its best."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Destinations' }]}
        position="center 40%"
      />
      <section className="mx-auto mt-16 max-w-[1600px] px-5 sm:px-8 lg:px-12" aria-label="All destinations">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 0.06}>
              <DestinationCard d={d} tours={TOURS.filter((t) => t.destinations.includes(d.slug)).length} className="min-h-[440px]" />
            </Reveal>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:px-12" aria-labelledby="when">
        <SectionHeading eyebrow="When to go" title={<span id="when">Egypt by month</span>} lead="Winter is high season along the Nile. The Red Sea is at its best in spring and autumn." />
        <div className="relative mt-10 overflow-x-auto rounded-[var(--radius-md)] bg-surface p-5 shadow-card sm:p-7" role="region" aria-label="Egypt by month, scrollable" tabIndex={0}>
          <table className="w-full min-w-[640px] border-separate border-spacing-1 text-[13px]">
            <caption className="sr-only">Best months to visit each destination</caption>
            <thead>
              <tr>
                <th scope="col" className="w-44 text-left font-medium text-body">Destination</th>
                {MONTHS.map((m, i) => (
                  <th key={i} scope="col" className="font-semibold text-ink">
                    <abbr title={MONTH_NAMES[i]} className="no-underline">{m}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DESTINATIONS.map((d) => (
                <tr key={d.slug}>
                  <th scope="row" className="py-1 pr-3 text-left font-medium text-ink">{d.name}</th>
                  {SEASONS[d.slug].map((v, i) => (
                    <td key={i} className={cx('h-9 rounded-[5px]', TONE[v])}>
                      <span className="sr-only">{MONTH_NAMES[i]}: {LABEL[v]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="mt-5 flex flex-wrap gap-5 text-[13px] text-body" aria-label="Legend">
            {LABEL.map((l, i) => (
              <li key={l} className="flex items-center gap-2"><span className={cx('size-4 rounded-[4px]', TONE[i])} aria-hidden />{l}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

# Sandline Journeys: tour operator site

A travel site for a fictional Egypt tour operator. The home page opens on a
photo card where the pyramids rise through the headline, then a discover
section, a scroll-filled statement, the peach "Why travel" band, numbered
promises, signature tours, destinations and reviews. Behind it sit the pages a
real operator ships: tour finder, tour detail with live departures, a
three-step booking request, destinations with a month-by-month season chart,
reviews you can add to, contact with FAQ, and My trips.

## Run it

```sh
bun install
bun run dev        # http://localhost:5318 (Vite + the Worker in workerd)
bun run typecheck
bun run build      # dist/client (assets) + dist/tour_operator/index.js (Worker)
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home |
| `/tours` | Tour finder: search, destination, length, style, sort (kept in the URL) |
| `/tours/:slug` | Tour detail: highlights, gallery, itinerary, inclusions, departures, reviews |
| `/book/:slug` | Booking request in three steps; draft kept on this device |
| `/destinations`, `/destinations/:slug` | Regions, best months, tours per region |
| `/reviews` | Rating summary, filters, write a review |
| `/contact` | Enquiry / tailor-made form, office details, FAQ (`#faq`) |
| `/trips` | Requested trips (cancel) and saved tours |
| `/styleguide` | Tokens and every component in every state |

## Edit it

- `src/data.ts` holds every string and all seed data: brand, contact
  details, tours, itineraries, destinations, reviews, FAQ. Start there.
- `src/lib/images.ts` routes every photograph. The files in `public/images`
  are generated placeholders; replace them with your own photography under the
  same keys. `hero-front.webp` is the hero photo with the sky cut out, layered
  over the headline so the pyramids sit in front of it: if you change the hero,
  make a matching cut-out (or delete the `heroFront` layer in `src/pages/Home.tsx`).
- `src/styles.css` holds the design tokens (colours, radii, shadows, motion).
  `/styleguide` (linked in the footer) shows them all, plus every component.
- `src/shared/` is used by both the pages and the Worker: departure dates
  (computed from today), prices and form validation.
- State lives in `localStorage` (`sandline.*` keys): booked trips, saved tours,
  reviews written in this browser and the booking draft.

## The Worker

`src/worker/index.ts` validates every form and returns a reference. Connect
the routes to email, a booking system or a D1 table to keep the requests.

| Route | Returns |
| --- | --- |
| `GET /api/health` | `{ ok: true }` |
| `GET /api/tours/:slug/departures` | the next 10 departures, 404 for an unknown tour |
| `POST /api/bookings` | 201 `{ reference, total, deposit }`, 422 with `fieldErrors`, 400 for bad JSON |
| `POST /api/enquiries`, `/api/reviews`, `/api/subscribe` | 201, 422 or 400 |
| any other `/api/*` | JSON 404 |

No payment is taken anywhere.

## Deploy with Freebuff Sites

`deploy.json` already points at the build output. After `bun run build`, deploy
it with the `sites_deploy` tool (or the Sites API) from this directory.

// Every string and all seed data for Sandline Journeys lives here. Edit this
// file to rename the company, change tours, prices, reviews or contact details.
// Photos are referenced by key; the files themselves live in src/lib/images.ts.
import type { PhotoKey } from './lib/images'

export const BRAND = {
  name: 'Sandline',
  fullName: 'Sandline Journeys',
  tagline: 'Small-group and private journeys through Egypt',
  email: 'hello@sandlinejourneys.com',
  phone: '+91 8919527406',
  phoneHref: '+918919527406',
  address: 'Plot No 42-A, Gurunanak Colony, Vijayawada, Andhra Pradesh',
  hours: 'Sun to Thu, 9:00 to 18:00 IST',
  licence: 'Licensed tour operator, Egyptian Ministry of Tourism no. 3412 (fictional)',
  social: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'Facebook', href: 'https://facebook.com/' },
    { label: 'LinkedIn', href: 'https://linkedin.com/' },
  ],
}

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Destination', to: '/destinations', menu: true },
  { label: 'Tours', to: '/tours' },
  { label: 'Review', to: '/reviews' },
  { label: 'Contact', to: '/contact' },
] as const

// ---------------------------------------------------------------------------
// Home page copy

export const HOME = {
  heroWord: 'EGYPT',
  heroTitle: 'Small-group journeys through Egypt',
  heroLine: 'Pyramids at first light, the Nile under sail, temples after the crowds leave. Every route planned by people who live here.',
  stats: [
    { value: '10k+', label: 'Happy Travelers' },
    { value: '500+', label: 'Custom Tours' },
    { value: '5k+', label: 'Hotel Stays Arranged' },
  ],
  discover: {
    eyebrow: 'Timeless history',
    title: 'Discover Egypt with Us',
    body: 'Five thousand years of history, one unhurried route. Our Egyptologist guides take you from the Giza plateau to the quiet temples of Nubia, at the hours when the light is best and the coaches have gone.',
  },
  statement: {
    lead: 'Explore the Pyramids, cruise the Nile, and uncover ancient wonders with our expertly curated travel packages.',
    tail: 'Book your dream trip today!',
  },
  why: {
    eyebrow: 'Timeless history',
    title: 'Why Travel to Egypt?',
    body: 'Few places hold this much of the human story in a single river valley. Add winter sun, the Red Sea, desert nights under more stars than you have ever seen, and a famously warm welcome.',
    photoLabel: 'Architecture',
    cta: 'Explore More',
  },
  promises: {
    eyebrow: 'Travel with Sandline',
    title: 'Planned in Vijayawada, not in a call centre',
    note: 'We are ensuring a smooth journey from first message to final airport transfer.',
    items: [
      { title: 'Trusted Network', body: 'Our own Egyptologist guides, drivers and family-run camps, many of whom have worked with us for over a decade.' },
      { title: 'Exclusive Benefits', body: 'Early temple entry, private boats on the Nile and rooms we hold in peak season, at prices agreed directly with the owners.' },
      { title: 'Small Groups', body: 'Never more than 14 travellers, and a private option on every departure for families and couples.' },
      { title: 'Expand Your Reach', body: 'Go beyond Giza and Luxor to Siwa, the White Desert and Nubian villages most visitors never see.' },
    ],
  },
  featured: {
    eyebrow: 'Signature tours',
    title: 'Journeys travellers book again',
    cta: 'See all tours',
  },
  places: {
    eyebrow: 'Where we go',
    title: 'From the Delta to Abu Simbel',
  },
  reviews: {
    eyebrow: 'Traveller reviews',
    title: 'Rated 4.9 from 2,140 reviews',
    cta: 'Read every review',
  },
}

export const FOOTER = {
  ctaTitle: "Get exclusive offers on Egypt's best travel deals!",
  ctaBody: 'One email a month with new departures, early-booking prices and the odd story from the road.',
  columns: [
    {
      title: 'Explore',
      links: [
        { label: 'All tours', to: '/tours' },
        { label: 'Destinations', to: '/destinations' },
        { label: 'Reviews', to: '/reviews' },
        { label: 'Tailor-made trip', to: '/contact?type=custom' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Contact', to: '/contact' },
        { label: 'My trips', to: '/trips' },
        { label: 'FAQ', to: '/contact#faq' },
        { label: 'Style guide', to: '/styleguide' },
      ],
    },
  ],
  legal: 'Sandline Journeys. All rights reserved.',
  privacy: 'Privacy Policy',
}

// ---------------------------------------------------------------------------
// Destinations

export type Destination = {
  slug: string
  name: string
  region: string
  photo: PhotoKey
  summary: string
  intro: string
  bestTime: string
  gettingThere: string
  highlights: { title: string; body: string }[]
}

export const DESTINATIONS: Destination[] = [
  {
    slug: 'cairo-giza',
    name: 'Cairo & Giza',
    region: 'Lower Egypt',
    photo: 'cairo',
    summary: 'The pyramids, the Grand Egyptian Museum and a thousand-year-old bazaar.',
    intro: 'A city of twenty million that never quite sleeps. Start on the Giza plateau at opening time, spend an afternoon with Tutankhamun’s treasures, and end the day with mint tea in the lanes of Khan el-Khalili.',
    bestTime: 'October to April',
    gettingThere: 'Cairo International Airport, 40 minutes from Zamalek',
    highlights: [
      { title: 'Giza at opening time', body: 'Walk the plateau before the coaches arrive, then see the Sphinx in low morning light.' },
      { title: 'Grand Egyptian Museum', body: 'The full Tutankhamun collection, shown together for the first time.' },
      { title: 'Islamic Cairo', body: 'Mosques, madrasas and craft workshops along Al-Muizz Street.' },
    ],
  },
  {
    slug: 'luxor',
    name: 'Luxor',
    region: 'Upper Egypt',
    photo: 'balloons',
    summary: 'The Valley of the Kings, Karnak and a balloon ride at sunrise.',
    intro: 'Ancient Thebes is the world’s largest open-air museum. The East Bank holds the temples of Karnak and Luxor; across the river, painted tombs are cut into the desert cliffs.',
    bestTime: 'November to March',
    gettingThere: 'One-hour flight from Cairo, or the overnight sleeper train',
    highlights: [
      { title: 'Valley of the Kings', body: 'Three tombs on the standard ticket, plus Seti I when it opens.' },
      { title: 'Karnak at dusk', body: 'The Hypostyle Hall as the sun drops behind its 134 columns.' },
      { title: 'Balloon at sunrise', body: 'Drift over the West Bank as the first light hits the cliffs.' },
    ],
  },
  {
    slug: 'aswan',
    name: 'Aswan',
    region: 'Nubia',
    photo: 'felucca',
    summary: 'Granite islands, felucca sails and the island temple of Philae.',
    intro: 'Egypt’s gentlest city sits where the Nile runs between granite boulders. Sail at sunset, visit Philae by boat and spend an evening with a Nubian family on the West Bank.',
    bestTime: 'November to February',
    gettingThere: 'Flights from Cairo, or three nights downriver from Luxor',
    highlights: [
      { title: 'Philae Temple', body: 'The temple of Isis, moved stone by stone to Agilkia Island.' },
      { title: 'Felucca at sunset', body: 'An hour under sail past Elephantine and Kitchener’s Island.' },
      { title: 'Nubian villages', body: 'Painted houses, home cooking and the music of the south.' },
    ],
  },
  {
    slug: 'abu-simbel',
    name: 'Abu Simbel',
    region: 'Lake Nasser',
    photo: 'abuSimbel',
    summary: 'Four colossal statues of Ramesses II, facing the sunrise.',
    intro: 'Three hours south of Aswan, the great temple of Ramesses II was carved into a cliff and later moved, whole, above the waters of Lake Nasser. Stay the night and see it lit after dark.',
    bestTime: 'October to March; sun festival on 22 February and 22 October',
    gettingThere: 'By road from Aswan with an early start, or a short flight',
    highlights: [
      { title: 'The Great Temple', body: 'Twenty-metre statues guarding a sanctuary aligned with the sun.' },
      { title: 'Temple of Nefertari', body: 'Dedicated to Hathor and the queen, with some of the finest reliefs in Egypt.' },
      { title: 'Stay overnight', body: 'See the facade at dawn when the day visitors are still on the road.' },
    ],
  },
  {
    slug: 'red-sea',
    name: 'Red Sea & Sinai',
    region: 'Coast',
    photo: 'redSea',
    summary: 'Coral reefs, mountain monasteries and quiet beach days.',
    intro: 'Some of the clearest water anywhere sits a short flight from Cairo. Snorkel reefs straight from the shore, climb Mount Sinai for sunrise and let the last days of a trip slow right down.',
    bestTime: 'March to May and September to November',
    gettingThere: 'Flights to Hurghada, Marsa Alam or Sharm el-Sheikh',
    highlights: [
      { title: 'Shore reefs', body: 'Step off the beach into coral gardens full of parrotfish.' },
      { title: 'Mount Sinai', body: 'A night climb to watch the sun rise over the granite peaks.' },
      { title: 'Desert lunch', body: 'Bedouin-cooked lunch in a canyon between dives.' },
    ],
  },
  {
    slug: 'western-desert',
    name: 'Western Desert',
    region: 'Oases',
    photo: 'whiteDesert',
    summary: 'Chalk towers, hot springs and a night in a Bedouin camp.',
    intro: 'West of the Nile the land turns to sand sea and wind-carved rock. Cross the Black Desert to the White, camp among chalk formations and swim in oasis springs.',
    bestTime: 'October to April',
    gettingThere: 'Five hours by 4x4 from Cairo to Bahariya Oasis',
    highlights: [
      { title: 'White Desert camp', body: 'Dinner by the fire, then a sky full of stars.' },
      { title: 'Bahariya springs', body: 'Warm mineral pools among the palm groves.' },
      { title: 'Crystal Mountain', body: 'A ridge of quartz that glitters in the afternoon sun.' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Tours

export const TOUR_STYLES = ['Culture', 'Nile cruise', 'Adventure', 'Family', 'Beach & reef'] as const
export type TourStyle = (typeof TOUR_STYLES)[number]

export type Tour = {
  slug: string
  title: string
  summary: string
  days: number
  price: number
  rating: number
  reviews: number
  groupMax: number
  style: TourStyle
  pace: 'Easy' | 'Moderate' | 'Active'
  destinations: string[]
  photo: PhotoKey
  gallery: PhotoKey[]
  route: string
  highlights: string[]
  itinerary: { title: string; body: string }[]
  included: string[]
  excluded: string[]
  /** Departures leave every n days on this weekday (0 = Sunday). */
  departs: { weekday: number; every: 7 | 14 }
  badge?: string
}

// Every itinerary opens with the international flight from India and closes
// with the flight home. Travellers can start from any Indian international
// airport; the gateways we quote most often are named here.
export const FLIGHT_ORIGINS = 'Vijayawada, Delhi, Mumbai or any other Indian international airport'
export const FLIGHT_RETURN = 'Vijayawada, Delhi, Mumbai or another Indian airport'

export const TOURS: Tour[] = [
  {
    slug: 'classic-egypt',
    title: 'Classic Egypt: Pyramids to Abu Simbel',
    summary: 'The whole story in ten days: Giza, a Nile cruise from Luxor to Aswan, and a night at Abu Simbel.',
    days: 10,
    price: 208000,
    rating: 4.9,
    reviews: 612,
    groupMax: 14,
    style: 'Culture',
    pace: 'Moderate',
    destinations: ['cairo-giza', 'luxor', 'aswan', 'abu-simbel'],
    photo: 'abuSimbel',
    gallery: ['abuSimbel', 'hero', 'balloons', 'felucca'],
    route: 'Cairo, Luxor, Nile cruise, Aswan, Abu Simbel',
    badge: 'Best seller',
    highlights: ['Giza plateau at opening time', 'Three nights on a boutique Nile boat', 'Overnight at Abu Simbel', 'Grand Egyptian Museum with an Egyptologist'],
    itinerary: [
      { title: 'Fly to Cairo', body: `Fly from ${FLIGHT_ORIGINS} to Cairo, landing at Cairo International. Met at arrivals and driven to your hotel in Zamalek. Welcome dinner on the river.` },
      { title: 'Giza and the Sphinx', body: 'On the plateau at opening time, then lunch with a view of the pyramids. Afternoon free.' },
      { title: 'Grand Egyptian Museum', body: 'A full morning with Tutankhamun’s treasures, then Khan el-Khalili at dusk.' },
      { title: 'Fly to Luxor', body: 'Karnak and Luxor temples in the late light. Board your Nile boat for the night.' },
      { title: 'West Bank', body: 'Valley of the Kings, Hatshepsut’s temple and the Colossi of Memnon. Sail south.' },
      { title: 'Edfu and Kom Ombo', body: 'Two temples along the river, with afternoons on the sun deck.' },
      { title: 'Aswan', body: 'Philae by boat, then a felucca to the Botanical Island at sunset.' },
      { title: 'Abu Simbel', body: 'Drive south to the temples of Ramesses II and stay the night by the lake.' },
      { title: 'Back to Cairo', body: 'Sunrise on the facade, then fly to Cairo for a farewell dinner.' },
      { title: 'Fly home', body: `Transfer to Cairo International for your returning flight to ${FLIGHT_RETURN}.` },
    ],
    included: ['9 nights in hand-picked hotels and boat', 'All breakfasts, 6 lunches, 5 dinners', 'Domestic flights Cairo to Luxor and Aswan to Cairo', 'Egyptologist guide throughout', 'All entry tickets on the itinerary', 'Airport transfers'],
    excluded: ['International flights', 'Egypt visa (about ₹2,100 on arrival)', 'Travel insurance', 'Tips for boat crew'],
    departs: { weekday: 6, every: 7 },
  },
  {
    slug: 'nile-dahabiya',
    title: 'The Nile by Dahabiya',
    summary: 'Five nights under sail on a ten-cabin dahabiya, mooring at islands and villages the big boats pass by.',
    days: 8,
    price: 270000,
    rating: 5,
    reviews: 288,
    groupMax: 20,
    style: 'Nile cruise',
    pace: 'Easy',
    destinations: ['luxor', 'aswan'],
    photo: 'dahabiya',
    gallery: ['dahabiya', 'felucca', 'philae', 'balloons'],
    route: 'Luxor, Esna, Edfu, Kom Ombo, Aswan',
    badge: 'Small ship',
    highlights: ['Ten cabins, one crew of 14', 'Moorings at quiet islands', 'Swimming from the boat', 'Philae and the Nubian West Bank'],
    itinerary: [
      { title: 'Fly to Luxor', body: `Fly from ${FLIGHT_ORIGINS} to Luxor, landing at Luxor International. Transfer to the boat, Luxor Temple at night.` },
      { title: 'Valley of the Kings', body: 'Early start on the West Bank, then set sail for Esna.' },
      { title: 'Esna', body: 'The newly cleaned ceiling of the Temple of Khnum, then a village walk.' },
      { title: 'El Kab', body: 'Rock tombs few visitors reach, and a barbecue on a sandbank.' },
      { title: 'Edfu', body: 'The best-preserved temple in Egypt, reached by horse carriage.' },
      { title: 'Kom Ombo', body: 'The double temple of Sobek and Horus, then sail to Aswan.' },
      { title: 'Aswan', body: 'Philae by boat and dinner with a Nubian family.' },
      { title: 'Fly home', body: `Transfer to Aswan International for your flight back to ${FLIGHT_RETURN}, or stay on for Abu Simbel.` },
    ],
    included: ['7 nights on board, all meals', 'Soft drinks and local wine with dinner', 'Egyptologist guide on board', 'All entry tickets', 'Transfers in Luxor and Aswan'],
    excluded: ['Flights', 'Visa', 'Travel insurance', 'Crew gratuities'],
    departs: { weekday: 1, every: 14 },
  },
  {
    slug: 'cairo-long-weekend',
    title: 'Cairo & Giza Long Weekend',
    summary: 'Four days for the pyramids, the Grand Egyptian Museum and the old city, with a private guide.',
    days: 4,
    price: 75500,
    rating: 4.8,
    reviews: 403,
    groupMax: 8,
    style: 'Culture',
    pace: 'Easy',
    destinations: ['cairo-giza'],
    photo: 'cairo',
    gallery: ['cairo', 'hero', 'dunes'],
    route: 'Giza, Saqqara, Islamic Cairo',
    highlights: ['Private guide and driver', 'Saqqara and the Step Pyramid', 'Street-food evening in downtown Cairo'],
    itinerary: [
      { title: 'Fly to Cairo', body: `Fly from ${FLIGHT_ORIGINS} to Cairo. Airport pickup, hotel near the pyramids, rooftop dinner.` },
      { title: 'Giza and Saqqara', body: 'The pyramids at opening, then the Step Pyramid and painted tombs of Saqqara.' },
      { title: 'Museum and bazaar', body: 'Grand Egyptian Museum, then Al-Muizz Street and Khan el-Khalili.' },
      { title: 'Fly home', body: `A slow breakfast, then a transfer to Cairo International for your flight back to ${FLIGHT_RETURN}.` },
    ],
    included: ['3 nights in a pyramid-view hotel', 'Daily breakfast, 2 lunches', 'Private Egyptologist and driver', 'Entry tickets', 'Airport transfers'],
    excluded: ['Flights', 'Visa', 'Dinners', 'Travel insurance'],
    departs: { weekday: 4, every: 7 },
  },
  {
    slug: 'luxor-sunrise',
    title: 'Luxor: Kings, Queens & a Balloon Sunrise',
    summary: 'Five days in ancient Thebes with time to see the painted tombs properly, and a balloon flight at dawn.',
    days: 5,
    price: 105500,
    rating: 4.9,
    reviews: 251,
    groupMax: 12,
    style: 'Culture',
    pace: 'Moderate',
    destinations: ['luxor'],
    photo: 'balloons',
    gallery: ['balloons', 'temple', 'dahabiya'],
    route: 'East Bank, West Bank, Dendera',
    highlights: ['Sunrise balloon flight', 'Tomb of Seti I (when open)', 'Day trip to Dendera'],
    itinerary: [
      { title: 'Fly to Luxor', body: `Fly from ${FLIGHT_ORIGINS} to Luxor. Check in on the West Bank and walk to Medinet Habu at sunset.` },
      { title: 'Balloon and West Bank', body: 'Fly at dawn, then the Valley of the Kings and the Tombs of the Nobles.' },
      { title: 'Karnak', body: 'A full morning in Karnak, Luxor Temple after dark.' },
      { title: 'Dendera', body: 'The Temple of Hathor and its painted ceilings.' },
      { title: 'Fly home', body: `Transfer to Luxor International for your flight back to ${FLIGHT_RETURN}.` },
    ],
    included: ['4 nights in a garden hotel', 'Breakfast daily, 3 lunches', 'Balloon flight', 'Egyptologist guide', 'Entry tickets'],
    excluded: ['Flights', 'Visa', 'Seti I tomb ticket', 'Travel insurance'],
    departs: { weekday: 0, every: 7 },
  },
  {
    slug: 'white-desert-camp',
    title: 'White Desert & Bahariya Camp',
    summary: 'Four days by 4x4 into the Western Desert, with a night among chalk towers under the stars.',
    days: 4,
    price: 64500,
    rating: 4.9,
    reviews: 197,
    groupMax: 10,
    style: 'Adventure',
    pace: 'Active',
    destinations: ['western-desert'],
    photo: 'whiteDesert',
    gallery: ['whiteDesert', 'dunes', 'hero'],
    route: 'Cairo, Bahariya, Black Desert, White Desert',
    badge: 'Under the stars',
    highlights: ['Bedouin-run camp', 'Hot springs in Bahariya', 'Crystal Mountain and Agabat valley'],
    itinerary: [
      { title: 'Fly to Cairo, drive to Bahariya', body: `Fly from ${FLIGHT_ORIGINS} to Cairo, then drive west to Bahariya. Lunch in the oasis, swim in a warm spring.` },
      { title: 'Into the desert', body: 'The Black Desert, Crystal Mountain and camp in the White Desert.' },
      { title: 'Agabat', body: 'Sunrise walk among the formations, then a lazy day in the oasis.' },
      { title: 'Back to Cairo and fly home', body: `Drive back to Cairo and transfer to the airport for your flight to ${FLIGHT_RETURN}.` },
    ],
    included: ['1 night camping, 2 nights in an eco-lodge', 'All meals in the desert', '4x4 with desert driver', 'Camping gear', 'Park fees'],
    excluded: ['Sleeping bag (rent for about ₹850)', 'Tips', 'Travel insurance'],
    departs: { weekday: 5, every: 7 },
  },
  {
    slug: 'red-sea-sinai',
    title: 'Red Sea Reefs & Mount Sinai',
    summary: 'A week on the coast: shore reefs, a desert canyon and a night climb up Mount Sinai.',
    days: 7,
    price: 135000,
    rating: 4.7,
    reviews: 164,
    groupMax: 12,
    style: 'Beach & reef',
    pace: 'Active',
    destinations: ['red-sea'],
    photo: 'redSea',
    gallery: ['redSea', 'dunes', 'whiteDesert'],
    route: 'Dahab, Ras Abu Galum, St Catherine',
    highlights: ['Snorkelling straight from the shore', 'Bedouin lunch in a canyon', 'Sunrise from the summit of Sinai'],
    itinerary: [
      { title: 'Fly to Sharm el-Sheikh', body: `Fly from ${FLIGHT_ORIGINS} to Sharm el-Sheikh, then transfer to a beach hotel in Dahab.` },
      { title: 'The Blue Lagoon', body: 'Boat and snorkel day along the protected coast.' },
      { title: 'Ras Abu Galum', body: 'Camel and walk to a Bedouin beach camp.' },
      { title: 'Canyons', body: 'The Coloured Canyon on foot, lunch in the shade.' },
      { title: 'Mount Sinai', body: 'Night climb for sunrise, then St Catherine’s Monastery.' },
      { title: 'Beach day', body: 'A free day to dive, read or do nothing at all.' },
      { title: 'Fly home', body: `Transfer to Sharm el-Sheikh International for your flight back to ${FLIGHT_RETURN}.` },
    ],
    included: ['6 nights in beach hotels and camp', 'Daily breakfast, 4 lunches', 'Snorkel gear', 'Local Bedouin guides', 'Transfers'],
    excluded: ['Flights', 'Scuba dives', 'Travel insurance'],
    departs: { weekday: 3, every: 14 },
  },
  {
    slug: 'aswan-nubia',
    title: 'Aswan, Philae & Nubian Villages',
    summary: 'Five slow days in the far south: Philae by boat, feluccas, and an early run to Abu Simbel.',
    days: 5,
    price: 92000,
    rating: 4.8,
    reviews: 139,
    groupMax: 12,
    style: 'Culture',
    pace: 'Easy',
    destinations: ['aswan', 'abu-simbel'],
    photo: 'philae',
    gallery: ['philae', 'felucca', 'abuSimbel'],
    route: 'Aswan, Philae, Abu Simbel',
    highlights: ['Philae by boat', 'Night with a Nubian family', 'Day trip to Abu Simbel'],
    itinerary: [
      { title: 'Fly to Aswan', body: `Fly from ${FLIGHT_ORIGINS} to Aswan. Check in on Elephantine Island; felucca at sunset.` },
      { title: 'Philae', body: 'The temple of Isis by boat, then the Unfinished Obelisk.' },
      { title: 'Abu Simbel', body: 'Early drive to the temples of Ramesses II and Nefertari.' },
      { title: 'Nubian West Bank', body: 'Camel to the Monastery of St Simeon, dinner in a Nubian home.' },
      { title: 'Fly home', body: `Transfer to Aswan International for your flight back to ${FLIGHT_RETURN}.` },
    ],
    included: ['4 nights on Elephantine Island', 'Breakfast daily, 3 dinners', 'Egyptologist guide', 'Entry tickets', 'Boats and transfers'],
    excluded: ['Flights', 'Visa', 'Travel insurance'],
    departs: { weekday: 2, every: 7 },
  },
  {
    slug: 'family-nile-adventure',
    title: 'Family Nile Adventure',
    summary: 'Nine days built for kids: mummies, feluccas, a camel ride and a pool at every stop.',
    days: 9,
    price: 186000,
    rating: 4.9,
    reviews: 86,
    groupMax: 16,
    style: 'Family',
    pace: 'Easy',
    destinations: ['cairo-giza', 'luxor', 'aswan'],
    photo: 'felucca',
    gallery: ['felucca', 'hero', 'balloons', 'dahabiya'],
    route: 'Cairo, Luxor, Aswan',
    badge: 'Ages 6+',
    highlights: ['Hieroglyph workshop for kids', 'Camel ride at Giza', 'Hotels with pools all the way'],
    itinerary: [
      { title: 'Fly to Cairo', body: `Fly from ${FLIGHT_ORIGINS} to Cairo. Pickup and a pool afternoon by the pyramids.` },
      { title: 'Pyramids', body: 'Giza by camel, then a picnic with a view.' },
      { title: 'Mummies', body: 'The Grand Egyptian Museum with a family-friendly guide.' },
      { title: 'Sleeper train', body: 'Overnight train to Luxor, a highlight for most kids.' },
      { title: 'Luxor', body: 'Karnak treasure hunt and a hieroglyph workshop.' },
      { title: 'West Bank', body: 'Valley of the Kings, then bikes along the canals.' },
      { title: 'Aswan', body: 'Drive south, felucca and a swim from a sandbank.' },
      { title: 'Nubian village', body: 'Meet a Nubian family and their pet crocodiles.' },
      { title: 'Fly home', body: `Fly from Cairo back to ${FLIGHT_RETURN}.` },
    ],
    included: ['8 nights in family rooms', 'Breakfast daily, 5 lunches', 'Family-specialist guide', 'Sleeper train', 'Entry tickets'],
    excluded: ['International flights', 'Visa', 'Travel insurance'],
    departs: { weekday: 6, every: 14 },
  },
]

export const ADD_ONS = [
  { id: 'balloon', label: 'Sunrise balloon over Luxor', price: 12000 },
  { id: 'guide', label: 'Private guide for your party', price: 27000 },
  { id: 'insurance', label: 'Flexible cancellation cover', price: 8000 },
] as const

export const ROOM_TYPES = [
  { id: 'shared', label: 'Twin or double', note: 'Share a room', supplement: 0 },
  { id: 'single', label: 'Single room', note: '+25% of the tour price', supplement: 0.25 },
] as const

// ---------------------------------------------------------------------------
// Reviews

export type Review = {
  id: string
  name: string
  from: string
  tour: string
  rating: number
  date: string
  title: string
  body: string
}

export const REVIEWS: Review[] = [
  { id: 'r1', name: 'Hannah K.', from: 'Leeds, UK', tour: 'classic-egypt', rating: 5, date: '2026-10-21', title: 'The Sphinx with nobody else there', body: 'Our guide had us on the plateau at seven. By the time the coaches arrived we were already at lunch. Every day had a moment like that.' },
  { id: 'r2', name: 'Marco D.', from: 'Turin, Italy', tour: 'nile-dahabiya', rating: 5, date: '2026-10-08', title: 'Quietest week of my life', body: 'Ten cabins, a crew who learned our names on day one, and swimming in the Nile off a sandbank. I would go again tomorrow.' },
  { id: 'r3', name: 'Priya S.', from: 'Toronto, Canada', tour: 'white-desert-camp', rating: 5, date: '2026-09-29', title: 'More stars than sky', body: 'The camp was simple and perfect. Dinner by the fire, then lying on the sand with the Milky Way overhead.' },
  { id: 'r4', name: 'James & Ruth O.', from: 'Denver, USA', tour: 'family-nile-adventure', rating: 5, date: '2026-09-14', title: 'Our kids still talk about the sleeper train', body: 'Pacing was spot on for a nine- and twelve-year-old. Pools every afternoon saved us.' },
  { id: 'r5', name: 'Léa M.', from: 'Lyon, France', tour: 'aswan-nubia', rating: 4, date: '2026-08-30', title: 'Aswan is the soul of Egypt', body: 'The Nubian dinner was the best meal of the trip. The Abu Simbel start is very early, but worth it.' },
  { id: 'r6', name: 'Tom W.', from: 'Melbourne, Australia', tour: 'luxor-sunrise', rating: 5, date: '2026-08-11', title: 'The balloon was the cherry on top', body: 'Five days felt unhurried. We saw seven tombs and never felt rushed.' },
  { id: 'r7', name: 'Aisha B.', from: 'Dubai, UAE', tour: 'cairo-long-weekend', rating: 5, date: '2026-07-26', title: 'A perfect first taste', body: 'Private guide, cool car, a hotel with the pyramids out of the window. Exactly what we needed on a short break.' },
  { id: 'r8', name: 'Sven L.', from: 'Malmö, Sweden', tour: 'red-sea-sinai', rating: 4, date: '2026-07-09', title: 'Reefs and a mountain', body: 'Snorkelling straight off the beach was unreal. The Sinai climb is hard work at night, so bring layers.' },
  { id: 'r9', name: 'Grace N.', from: 'Nairobi, Kenya', tour: 'classic-egypt', rating: 5, date: '2026-06-18', title: 'Faultless from start to finish', body: 'Every transfer on time, every hotel lovely. Our guide Yasmin made the history come alive.' },
  { id: 'r10', name: 'Daniel R.', from: 'Madrid, Spain', tour: 'nile-dahabiya', rating: 5, date: '2026-05-30', title: 'Worth every penny', body: 'The dahabiya stops where the big ships cannot. Esna and El Kab were highlights.' },
]

export const RATING_SUMMARY = { average: 4.9, total: 2140, breakdown: [1832, 241, 48, 12, 7] }

// ---------------------------------------------------------------------------
// FAQ and contact

export const FAQ = [
  { q: 'Is Egypt safe to visit right now?', a: 'Millions of travellers visit every year. We follow official advice daily, our guides carry phones on every route, and we will move or refund any departure that official advice says not to run.' },
  { q: 'Do I need a visa?', a: 'Most nationalities can buy a 30-day visa on arrival for about ₹2,100 or apply online in advance. We send a visa checklist with your booking confirmation.' },
  { q: 'When is the best time to go?', a: 'October to April is cooler and ideal for sightseeing. Summer is hot in the south but quiet, with lower prices on Nile boats.' },
  { q: 'How big are the groups?', a: 'No more than 14 on most tours, and as few as 8 on the Cairo weekend. Every tour can also run privately for your own party.' },
  { q: 'What deposit do you take?', a: 'A 20% deposit holds your place; the balance is due 60 days before departure. This demo site takes no payment.' },
  { q: 'Can you plan a tailor-made trip?', a: 'Yes. Tell us your dates and interests on the contact page and a planner in Vijayawada will reply within one working day.' },
]

export const CONTACT = {
  eyebrow: 'Talk to a planner',
  title: 'Plan your Egypt journey',
  body: 'Ask about a tour, or tell us what you have in mind and we will build a route around you. A planner in our Vijayawada office replies within one working day.',
  topics: ['A tour on the website', 'A tailor-made trip', 'A booking I have made', 'Something else'] as const,
  budgets: ['Under ₹1,25,000', '₹1,25,000 to ₹2,50,000', '₹2,50,000 to ₹4,25,000', 'Over ₹4,25,000'] as const,
}

export const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'United Arab Emirates', 'India', 'Other'] as const

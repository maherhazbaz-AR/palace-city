const media = (file) => `${import.meta.env.BASE_URL}media/${file}`

export const MEDIA = {
  heroPoster: media('hero-poster.jpg'),
  heroFilm: media('hero.mp4'),
  walkPoster: media('walk-poster.jpg'),
  walkFilm: media('walkthrough.mp4'),
}

export const NAV_LINKS = [
  { id: 'walkthrough', label: 'Walkthrough' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'villas', label: 'Villas' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'location', label: 'Location' },
  { id: 'faq', label: 'FAQ' },
]

export const TRUST = ['CMDA and RERA approved', 'Absolute land ownership', '72% open space', 'Walk to the beach']

export const RERA = 'TN RERA No. TN/01/Building/0208/2023'

/** Walkthrough chapters: `at` is the second in the clip where each one starts. */
export const CLIP_LEN = 65.75
export const CHAPTERS = [
  { at: 0.0, name: 'The villa', title: 'Arrive at your palace', text: 'Neo-classical villas inspired by European palaces and Rajasthan’s royal heritage.' },
  { at: 7.4, name: 'Living', title: 'Living and dining', text: 'Double-height living rooms with crystal chandeliers and Italian marble.' },
  { at: 16.4, name: 'Bedrooms', title: 'Rest like royalty', text: '4 and 5 BHK homes, from 1,640 to 4,800 sq ft.' },
  { at: 42.8, name: 'Kitchen & bath', title: 'Kitchen, utility and baths', text: 'A fitted kitchen, multi-utility room and designer bathrooms.' },
  { at: 55.1, name: 'Garden', title: 'Your own garden', text: 'Every villa has a landscaped garden and outdoor lounge deck.' },
]

export const PERKS = [
  'The current price list and villa availability',
  'Brochure, master layout and floor plans',
  'A guided tour of the furnished show villa',
]

export const VILLA_OPTIONS = ['Not sure yet', 'Ultra Luxury Villa', 'Luxury Villa', 'Twin Villa', 'Elite Villa']
export const VISIT_OPTIONS = ['This weekend', 'On a weekday this week', 'Next week', 'Just send me the details']

export const HIGHLIGHTS = [
  { img: media('highlight-living.jpg'), title: 'Double-height living rooms', text: 'Soaring ceilings and tall windows fill every living room with light.' },
  { img: media('highlight-chandeliers.jpg'), title: 'Crystal chandeliers', text: 'Statement chandeliers and panelled ceilings in true palace style.' },
  { img: media('highlight-suites.jpg'), title: 'Serene master suites', text: 'Calm, spacious bedrooms with walk-in comfort and garden views.' },
  { img: media('highlight-kitchen.jpg'), title: 'Designer kitchens', text: 'Fitted modular kitchens with a separate multi-utility room.' },
  { img: media('highlight-garden.jpg'), title: 'Private garden and deck', text: 'Every villa has a landscaped garden, outdoor lounge deck and barbeque counter.' },
  { img: media('highlight-marble.jpg'), title: 'Italian marble and smart homes', text: 'Italian marble floors and smart home technology throughout.' },
]

export const FACTS = [
  { value: '4 & 5 BHK', label: 'Palace villas' },
  { value: '₹5–10 Cr*', label: 'Price range' },
  { value: '72%', label: 'Open space' },
  { value: '1,640–4,800', label: 'Sq ft villa sizes' },
  { value: 'CMDA & RERA', label: 'Approved project' },
]

export const VILLAS = [
  {
    numeral: 'I', name: 'Ultra Luxury Villa', area: '4,800 sq ft',
    page: 'https://adhomesinteriors.com/360/AdityaramUltraLuxury/',
    text: '6 exclusive balconies, parking for 3 to 4 cars and lift provision.',
    icon: ['M6 24 32 8l26 16z', 'M8 24h48M8 28h48', 'M13 28v22M24 28v22M40 28v22M51 28v22', 'M28 50V40h8v10', 'M6 50h52M4 55h56'],
  },
  {
    numeral: 'II', name: 'Luxury Villa', area: '2,400 sq ft',
    page: 'https://adhomesinteriors.com/360/AdityaramLuxuryVilla/',
    text: '3 exclusive balconies, parking for 2 cars and a multipurpose room.',
    icon: ['M10 26 32 12l22 14z', 'M12 26h40M12 30h40', 'M17 30v20M32 30v8M47 30v20', 'M27 50V40h10v10', 'M10 50h44M8 55h48'],
  },
  {
    numeral: 'III', name: 'Twin Villa', area: '2,067 sq ft per villa',
    page: 'https://adhomesinteriors.com/360/AdityaramTwin/',
    text: '2 balconies and 1 parking space per villa, with 90% non-shared walls.',
    icon: ['M5 30 18 21l13 9zM33 30l13-9 13 9z', 'M7 30h22M35 30h22', 'M10 30v20M26 30v20M38 30v20M54 30v20', 'M15 50v-8h6v8M43 50v-8h6v8', 'M4 50h56M3 55h58'],
  },
  {
    numeral: 'IV', name: 'Elite Villa', area: '1,640 sq ft',
    page: 'https://adhomesinteriors.com/360/AdityaramEliteVilla/',
    text: 'An exclusive balcony and 1 parking space per villa.',
    icon: ['M16 30 32 19l16 11z', 'M18 30h28', 'M21 30v20M43 30v20', 'M28 50v-9h8v9', 'M14 50h36M12 55h40'],
  },
]

export const ADVANTAGES = [
  { title: 'CMDA & RERA approved', text: 'RERA No. TN/01/Building/0208/2023, with transparent documentation.' },
  { title: 'Absolute ownership', text: 'You own both the land and the villa outright, with no undivided share.' },
  { title: 'Biggest villa project on ECR', text: 'The largest villa development on ECR within city limits.' },
  { title: '72% open space', text: 'A naturally structured gated community with clutter-free living.' },
  { title: 'Walk to the beach', text: 'The sea is within walking distance of the community.' },
  { title: 'Three-way connectivity', text: 'Reach the city via the ECR–OMR link road, Akkarai and Panaiyur.' },
  { title: 'Elevated corridor nearby', text: 'The upcoming Thiruvanmiyur–Uthandi elevated corridor runs close by.' },
  { title: 'Sea link access', text: 'The proposed Marina–Neelankarai sea link bridge will shorten trips to the city.' },
]

export const AMENITIES = [
  { title: 'Luxury clubhouse', text: 'A premium clubhouse at the heart of the community.' },
  { title: 'Swimming pools', text: 'Pools for laps, lounging and evening swims.' },
  { title: 'Indoor gym', text: 'Train year-round, whatever the weather on the coast.' },
  { title: 'Basketball courts', text: 'Courts for weekend games.' },
  { title: 'Children’s play areas', text: 'Safe, open spaces inside the gated campus.' },
  { title: 'Multi-purpose halls', text: 'Host celebrations, gatherings and functions.' },
  { title: 'Landscaped gardens', text: 'Green walks, paver block roads and LED street lighting.' },
  { title: '24/7 security', text: 'Round-the-clock security across the community.' },
]

/** Sample cards shown until WordPress testimonials are connected. */
export const SAMPLE_TESTIMONIALS = [
  { quote: 'Add a resident or visitor testimonial in WordPress. The post’s excerpt appears here as the quote.', name: 'Resident name', tag: 'Villa type or city', placeholder: true },
  { quote: 'Each testimonial is one WordPress post in the “testimonial” category, so your team can add or change them any time.', name: 'Resident name', tag: 'Villa type or city', placeholder: true },
  { quote: 'These sample cards only show in the preview. Once WordPress is connected, only real testimonials appear.', name: 'Resident name', tag: 'Villa type or city', placeholder: true },
]

export const LOCATION_FACTS = [
  { label: 'Address', value: 'No. 50, East Coast Road, Adityaram Nagar, Panaiyur, Chennai 600119' },
  { label: 'To OMR', value: 'Via the ECR–OMR link road' },
  { label: 'Upcoming', value: 'Thiruvanmiyur–Uthandi elevated corridor, Marina–Neelankarai sea link' },
]

export const SCHOOLS =
  'Campus K IGCSE School, Narayana E-Techno School, Ellen Sharma Memorial School, Gateway The Complete School, PSBB Millennium School, Babaji Vidyashram, Sacred Heart Matric School, Velammal Vidyalaya, NPS International School, JS Global School and Ramana Vidyalaya.'

export const FAQS = [
  { q: 'Where is Adityaram Palace City located?', a: 'On East Coast Road in Chennai, between Akkarai and Panaiyur, with connectivity to OMR through the ECR–OMR link road and to the city along ECR.' },
  { q: 'What types of villas are available?', a: 'Four types: the Ultra Luxury Villa (4,800 sq ft), Luxury Villa (2,400 sq ft), Twin Villa (2,067 sq ft per villa) and Elite Villa (1,640 sq ft), in 4 and 5 BHK configurations.' },
  { q: 'What is the price range?', a: 'Villas are priced from ₹5 Cr to ₹10 Cr*, depending on the villa type. Fill in the form for the current price list.' },
  { q: 'Is the project approved?', a: 'Yes. Palace City is approved by CMDA and registered with TN RERA under TN/01/Building/0208/2023.' },
  { q: 'Do I own the land?', a: 'Yes. Buyers get absolute ownership of both the land and the villa, with no undivided share (UDS).' },
  { q: 'What amenities are included?', a: 'A grand entrance arch, luxury clubhouse, swimming pools, gym, landscaped gardens, children’s play areas, paver block roads, LED street lighting and round-the-clock security, among 20+ amenities.' },
  { q: 'Who is the developer?', a: 'Adityaram Properties Pvt. Ltd., the flagship real estate company of the Adityaram Group, known for villa communities along ECR and OMR.' },
]




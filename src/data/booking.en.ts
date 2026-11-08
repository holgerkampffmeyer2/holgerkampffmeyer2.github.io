import type { BookingContent } from './booking.types';

const email = 'holger.kampffmeyer+dj@gmail.com';
const phoneDisplay = '+49 171 1467491';
const phoneHref = 'tel:+491711467491';
const whatsappNumber = '491711467491';

const enMailBody = `Hi Holger,

I would like to book you for the following event:

Event:
Date:
Time:
Venue / City:
Format (club / festival / corporate / private party):
Expected guests:
Music style:
Own PA/tech available? (yes/no, details):
Budget:

Best regards`;

const enWhatsAppText = 'Hi Holger, I would like to book you for an event. Here are the details:';

export const bookingContent: BookingContent = {
  seo: {
    title: 'Electronic Music & Tech House DJ Booking Stuttgart | DJ Hulk',
    description:
      'Book DJ Hulk (Holger Kampffmeyer) for clubs, festivals and events in Stuttgart. House, Tech House, Techno & DnB. Request rider & EPK.',
    keywords:
      'DJ booking Stuttgart, tech house DJ for events, electronic music act booking, DJ Hulk EPK, technical rider, references Romy S., tech house club night',
    ogImage: '/og/booking-dj-hulk-en.jpg',
    ogLocale: 'en_US',
    path: '/en/booking',
    alternatePath: '/booking',
    alternateHrefLang: 'de',
  },
  hero: {
    eyebrow: 'Booking & EPK',
    title: 'Electronic Music & Tech House DJ Booking Stuttgart',
    subtitle: 'DJ Hulk (Holger Kampffmeyer) · House, Tech House, Techno & Drum n Bass',
    description:
      'For club nights, festivals, corporate events and private parties in Stuttgart and beyond. With technical rider, references and a complete EPK.',
    primaryCta: 'Request booking',
    secondaryCta: 'Download EPK',
    shareCta: 'Share page',
    languageLabel: 'Deutsch',
    languageHref: '/booking',
    imageAlt: 'DJ Hulk in neon light – electronic music DJ from Stuttgart',
  },
  trust: ['Romy S.', 'EX-Club Zollamt', 'Mrs. Jones', 'EM3F Festival', '365 FM Radio', 'ToMaTe Stuttgart n.e.V.'],
  facts: [
    { label: 'Genres', value: 'House, Tech House, Deep House, Afro/Latin House, Techno, DnB' },
    { label: 'Formats', value: 'Club, festival, corporate, private party, warm-up, all night long' },
    { label: 'Based in', value: 'Stuttgart / Leinfelden-Echterdingen, Germany' },
    { label: 'Travel', value: 'Stuttgart & surrounding area, Germany-wide on request' },
    { label: 'Equipment', value: 'CDJ setup or own DDJ-1000 controller' },
    { label: 'Languages', value: 'German & English' },
    { label: 'Availability', value: 'Weekends & selected weekdays' },
    { label: 'Rates', value: 'On request' },
  ],
  bio: {
    title: 'DJ Hulk – electronic music from Stuttgart',
    lead: 'DJ Hulk is the electronic music project of Holger Kampffmeyer from Stuttgart. For years he has been playing House, Tech House, Techno and Drum n Bass – from club nights and festivals to corporate events.',
    paragraphs: [
      'Under the name DJ Hulk, Holger Kampffmeyer has been active in Stuttgart’s electronic music scene for years. His sound ranges from House and Tech House to Deep, Afro and Latin House, Techno and Drum n Bass.',
      'He has played venues such as Romy S., EX-Club Zollamt and Mrs. Jones, performed at corporate events and afterhours for Vector, and is co-founder of the ToMaTe Stuttgart n.e.V. collective and the EM3F – Electronic Music Family and Friends Festival.',
      'As a resident DJ he can be heard regularly on 365 FM Radio and CouchRadio. His weekly mixes are published on Mixcloud – with full tracklists and often as B2B collaborations with DJs from around the world.',
    ],
    pressBio:
      'DJ Hulk is the electronic music project of Holger Kampffmeyer from Stuttgart. He plays House, Tech House, Techno and Drum n Bass in clubs, at festivals and corporate events. He is co-founder of ToMaTe Stuttgart n.e.V. and the EM3F festival, and resident DJ at 365 FM Radio and CouchRadio.',
  },
  genres: {
    title: 'Sound & genres',
    description:
      'The sound is tailored to the event: from deep and groovy early sets to driving Tech House and Techno in primetime.',
    groups: [
      { title: 'House & Tech House', items: ['House', 'Tech House', 'Deep House', 'Jackin House', 'Afro House', 'Latin House'] },
      { title: 'Techno & Bass', items: ['Techno', 'Minimal', 'Drum n Bass', 'Bass House'] },
      { title: 'Retro & crowd pleasers', items: ['90s/2000s Eurodance', 'R&B', 'Hip-Hop', 'Reggae'] },
    ],
  },
  references: {
    title: 'References & venues',
    description:
      'Selected club nights, festivals, corporate events and radio residencies. More references and flyers can be found in the event archive.',
    items: [
      { name: 'Romy S.', meta: 'Romy’s Clubnight · Stuttgart · 2023', description: 'Electronic club night – DJ and co-organisation.' },
      { name: 'EX-Club Zollamt', meta: 'Club · Stuttgart', description: 'Club gigs in Stuttgart’s electronic scene.' },
      { name: 'Mrs. Jones', meta: 'Club · Stuttgart', description: 'Club nights with House and Tech House.' },
      { name: 'EM3F Festival', meta: 'Kulturinsel Stuttgart · 2024', description: 'Festival with local and international acts – DJ and co-organisation.' },
      { name: 'Vector ADP Events', meta: 'Corporate events · Stuttgart · 2023', description: 'Afterhour clubbing and evening event for Vector.' },
      { name: 'Entdeckerfest', meta: 'Echterdingen · 2025 & 2026', description: 'Neighbourhood festival with electronic music.' },
      { name: 'Schmellbackyard Crosslauf', meta: 'Leinfelden-Echterdingen · 2026', description: 'Sound, light and music for the cross-country run.' },
      { name: '365 FM Radio & CouchRadio', meta: 'Web radio', description: 'Resident DJ at both stations.' },
    ],
  },
  formats: {
    title: 'Booking formats',
    description:
      'Whether club night, festival or corporate event – the set is tailored to the occasion, audience and time slot.',
    items: [
      { title: 'Club night / label night', description: 'Tech House and House for club nights, label nights and afterhours.' },
      { title: 'Festival / open air', description: 'Electronic music for festivals, city festivals and open-air stages.' },
      { title: 'Corporate event / afterhour', description: 'Representative events, summer parties and afterhours with electronic sound.' },
      { title: 'Private party / birthday', description: 'Parties with a musical focus – from House to Drum n Bass.' },
      { title: 'Warm-up / support', description: 'Support sets for national and international guests.' },
      { title: 'All night long', description: 'One night, one DJ – a musical journey through House, Tech House and Techno.' },
      { title: 'DJ + equipment', description: 'DJ booking including PA, light and equipment via Sound & Licht Stuttgart.' },
    ],
  },
  stats: {
    title: 'Reach & community',
    description:
      'Real reach instead of empty promises: DJ Hulk reaches a growing community of electronic music fans on Instagram, Facebook and Mixcloud.',
    followersLabel: 'followers',
    updatedLabel: 'Updated',
    note: 'Counts are refreshed automatically at build time.',
  },
  rider: {
    title: 'Technical rider',
    description:
      'I prefer a classic CDJ setup. Alternatively, I bring my own laptop with a DDJ-1000 controller.',
    groups: [
      {
        title: 'Preferred setup',
        items: [
          '2× Pioneer CDJ-3000 (or CDJ-2000NXS2)',
          '1× Pioneer DJM-900NXS2 or DJM-V10',
          '1× booth monitor',
          '2× XLR cables to the PA',
          'Stable DJ table, at least 180 × 80 cm',
          '2× power outlets at the booth',
        ],
      },
      {
        title: 'Alternative',
        items: [
          'Own laptop + Pioneer DDJ-1000 controller (provided by artist)',
          '2× RCA or XLR to mixer/PA',
          '1× booth monitor optional',
          'Stable table and power outlet',
        ],
      },
      {
        title: 'Backup & schedule',
        items: [
          'Own USB sticks and headphones',
          'Booth access 30 minutes before the set',
          'Water/soft drinks at the booth welcome',
          'Rates and travel costs on request',
        ],
      },
    ],
    note: 'The full rider is included in the EPK PDF. For technical questions, just get in touch.',
  },
  press: {
    title: 'Press kit & EPK',
    description:
      'Everything for bookers, promoters and press: EPK as PDF, press photos, logo, short bio and technical rider.',
    pdfHref: '/files/dj-hulk-epk-en.pdf',
    pdfLabel: 'Download EPK as PDF',
    printLabel: 'Print as PDF',
    photosTitle: 'Press photos',
    photosDescription:
      'High-resolution photos for editorial coverage and event promotion. Please respect the photo credit.',
    photos: [
      { key: 'neon', alt: 'DJ Hulk in neon light', download: '/img/press/dj-hulk-neon.jpg' },
      { key: 'studio', alt: 'DJ Hulk studio portrait', download: '/img/press/dj-hulk-studio.jpg' },
      { key: 'club', alt: 'DJ Hulk in the club', download: '/img/press/dj-hulk-club.jpg' },
      { key: 'light', alt: 'DJ Hulk high-key portrait', download: '/img/press/dj-hulk-light.jpg' },
      {
        key: 'liveBw',
        alt: 'DJ Hulk performing live',
        download: '/img/press/dj-hulk-live-bw.jpg',
        credit: 'Photo: Crossi0711',
        creditUrl: 'https://www.instagram.com/crossi0711/',
      },
      { key: 'liveCrowd', alt: 'DJ Hulk performing live in front of a crowd', download: '/img/press/dj-hulk-live-crowd.jpg' },
    ],
    assets: [
      { label: 'Logo (SVG)', href: '/img/djhulk_logo.svg', description: 'Vector logo for print and web.' },
      { label: 'Logo (PNG)', href: '/img/djhulk_logo.png', description: 'Transparent PNG logo.' },
      { label: 'Promo card', href: '/img/press/dj-hulk-card.png', description: 'DJ Hulk card for social media and flyers.' },
      { label: 'Press bio', href: '#press-bio', description: 'Short bio to copy.' },
      { label: 'Press Kit (ZIP)', href: '/files/dj-hulk-press-kit.zip', description: 'Logo (SVG/PNG), Promo Card, Press bio DE/EN.' },
    ],
    photoCredits: 'Photo credit: Crossi0711 for the live photo DSC_2316. All other images: DJ Hulk.',
  },
  process: {
    title: 'How booking works',
    description: 'From the first request to the performance – transparent and straightforward.',
    steps: [
      { title: 'Send request', description: 'Include date, venue, time, format, expected guests and equipment.' },
      { title: 'Availability & quote', description: 'I check the date and usually reply within 24 hours.' },
      { title: 'Rider & equipment', description: 'Setup, equipment and schedule are coordinated.' },
      { title: 'Confirmation', description: 'After confirmation you receive all details for the event day.' },
      { title: 'Performance', description: 'Soundcheck, set and a night of electronic music.' },
    ],
  },
  faq: {
    title: 'Booking FAQ',
    description: 'The most common questions about booking, equipment and the process.',
  },
  contact: {
    title: 'Booking request',
    description:
      'The fastest way is email or WhatsApp. The more details you send upfront, the faster I can prepare a quote.',
    email,
    phone: phoneDisplay,
    phoneHref,
    whatsappHref: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enWhatsAppText)}`,
    responseTime: 'Usually a reply within 24 hours.',
    location: 'Stuttgart / Leinfelden-Echterdingen, Germany',
  },
  share: {
    title: 'Share this booking page',
    description: 'Share this page with bookers, promoters or friends – including a social media preview.',
    text: 'DJ Hulk (Holger Kampffmeyer) – Electronic Music & Tech House DJ from Stuttgart. Booking & EPK:',
    hashtags: 'DJHulk,TechHouse,Stuttgart,DJBooking',
    nativeLabel: 'Share',
    whatsappLabel: 'WhatsApp',
    facebookLabel: 'Facebook',
    xLabel: 'X',
    linkedinLabel: 'LinkedIn',
    emailLabel: 'Email',
    pinterestLabel: 'Pinterest',
    redditLabel: 'Reddit',
    telegramLabel: 'Telegram',
    copyLabel: 'Copy link',
    copiedLabel: 'Link copied',
  },
  mail: {
    subject: 'Booking request: [event] on [date]',
    body: enMailBody,
  },
  labels: {
    booking: 'Booking',
    factSheet: 'At a glance',
    genre: 'Genres',
    references: 'References',
    formats: 'Formats',
    rider: 'Rider',
    press: 'Press kit',
    process: 'Process',
    faq: 'FAQ',
    contact: 'Contact',
    share: 'Share',
    backToTop: 'Back to top',
    lastUpdated: 'Updated',
    priceOnRequest: 'On request',
    download: 'Download',
    open: 'Open',
    copyBio: 'Copy bio',
    bioCopied: 'Bio copied',
  },
};
import type { BookingContent } from './booking.types';

const email = 'holger.kampffmeyer+dj@gmail.com';
const phoneDisplay = '+49 171 1467491';
const phoneHref = 'tel:+491711467491';
const whatsappNumber = '491711467491';

const deMailBody = `Hallo Holger,

ich möchte dich für folgendes Event buchen:

Event:
Datum:
Uhrzeit:
Ort / Venue:
Format (Club / Festival / Firmenfeier / Private Party):
Gästezahl:
Musikrichtung:
Technik vorhanden? (ja/nein, Details):
Budget:

Viele Grüße`;

const deWhatsAppText = 'Hallo Holger, ich möchte dich für ein Event buchen. Hier sind die Details:';

export const bookingContent: BookingContent = {
  seo: {
    title: 'Electronic Music & Tech House DJ Booking Stuttgart | DJ Hulk',
    description:
      'DJ Hulk (Holger Kampffmeyer) für Clubs, Festivals und Events in Stuttgart buchen. Sound: House, Tech House, Techno & DnB. Jetzt Rider & EPK anfragen.',
    keywords:
      'DJ für Club Booking Stuttgart, Tech House DJ für Event buchen, Electronic Music Act buchen, DJ Hulk EPK, Technischer Rider, Referenzen Romy S., Tech House Act für Clubnächte',
    ogImage: '/og/booking-dj-hulk-de.jpg',
    ogLocale: 'de_DE',
    path: '/booking',
    alternatePath: '/en/booking',
    alternateHrefLang: 'en',
  },
  hero: {
    eyebrow: 'Booking & EPK',
    title: 'Electronic Music & Tech House DJ Booking Stuttgart',
    subtitle: 'DJ Hulk (Holger Kampffmeyer) · House, Tech House, Techno & Drum n Bass',
    description:
      'Für Clubnächte, Festivals, Firmenfeiern und private Events in Stuttgart und Umgebung. Mit technischem Rider, Referenzen und vollständigem EPK.',
    primaryCta: 'Booking anfragen',
    secondaryCta: 'EPK als PDF',
    shareCta: 'Seite teilen',
    languageLabel: 'English',
    languageHref: '/en/booking',
    imageAlt: 'DJ Hulk im Neonlicht – Electronic Music DJ aus Stuttgart',
  },
  trust: ['Romy S.', 'EX-Club Zollamt', 'Mrs. Jones', 'EM3F Festival', '365 FM Radio', 'ToMaTe Stuttgart n.e.V.'],
  facts: [
    { label: 'Genres', value: 'House, Tech House, Deep House, Afro/Latin House, Techno, DnB' },
    { label: 'Formate', value: 'Club, Festival, Firmenfeier, Private Party, Warm-up, All Night Long' },
    { label: 'Standort', value: 'Stuttgart / Leinfelden-Echterdingen' },
    { label: 'Reise', value: 'Stuttgart & Umgebung, deutschlandweit auf Anfrage' },
    { label: 'Technik', value: 'CDJ-Setup oder eigener DDJ-1000 Controller' },
    { label: 'Sprachen', value: 'Deutsch & Englisch' },
    { label: 'Verfügbarkeit', value: 'Wochenenden & ausgewählte Wochentage' },
    { label: 'Preise', value: 'Auf Anfrage' },
  ],
  bio: {
    title: 'DJ Hulk – Electronic Music aus Stuttgart',
    lead: 'DJ Hulk ist das Electronic-Music-Projekt von Holger Kampffmeyer aus Stuttgart. Seit Jahren legt er House, Tech House, Techno und Drum n Bass auf – von Clubnächten über Festivals bis zu Firmenfeiern.',
    paragraphs: [
      'Unter dem Namen DJ Hulk ist Holger Kampffmeyer seit Jahren in der Stuttgarter Electronic-Szene aktiv. Sein Sound reicht von House und Tech House über Deep, Afro und Latin House bis zu Techno und Drum n Bass.',
      'Er hat in Venues wie Romy S., EX-Club Zollamt und Mrs. Jones aufgelegt, war bei Firmenevents und Afterhours für Vector im Einsatz und ist Mitgründer des Kollektivs ToMaTe Stuttgart n.e.V. sowie des EM3F – Electronic Music Family and Friends Festival.',
      'Als Resident DJ ist er regelmäßig bei 365 FM Radio und CouchRadio zu hören. Seine wöchentlichen Mixes erscheinen auf Mixcloud – mit vollständigen Tracklists und häufig als B2B-Collaboration mit DJs aus aller Welt.',
    ],
    pressBio:
      'DJ Hulk ist das Electronic-Music-Projekt von Holger Kampffmeyer aus Stuttgart. Er spielt House, Tech House, Techno und Drum n Bass in Clubs, auf Festivals und bei Firmenevents. Er ist Mitgründer von ToMaTe Stuttgart n.e.V. und des EM3F Festivals sowie Resident DJ bei 365 FM Radio und CouchRadio.',
  },
  genres: {
    title: 'Sound & Genres',
    description:
      'Der Sound wird auf das Event abgestimmt: von deep und groovy am frühen Abend bis zu treibendem Tech House und Techno in der Primetime.',
    groups: [
      { title: 'House & Tech House', items: ['House', 'Tech House', 'Deep House', 'Jackin House', 'Afro House', 'Latin House'] },
      { title: 'Techno & Bass', items: ['Techno', 'Minimal', 'Drum n Bass', 'Bass House'] },
      { title: 'Retro & Crowd Pleaser', items: ['90s/2000s Eurodance', 'R&B', 'Hip-Hop', 'Reggae'] },
    ],
  },
  references: {
    title: 'Referenzen & Venues',
    description:
      'Ausgewählte Clubnächte, Festivals, Firmenevents und Radio-Residencies. Weitere Referenzen und Flyer findest du im Veranstaltungsarchiv.',
    items: [
      { name: 'Romy S.', meta: 'Romy’s Clubnight · Stuttgart · 2023', description: 'Clubnight mit elektronischer Musik – DJ und Mit-Organisation.' },
      { name: 'EX-Club Zollamt', meta: 'Club · Stuttgart', description: 'Clubgigs im Stuttgarter Electronic-Umfeld.' },
      { name: 'Mrs. Jones', meta: 'Club · Stuttgart', description: 'Clubnächte mit House und Tech House.' },
      { name: 'EM3F Festival', meta: 'Kulturinsel Stuttgart · 2024', description: 'Festival mit lokalen und internationalen Acts – DJ und Mit-Organisation.' },
      { name: 'Vector ADP Events', meta: 'Firmenevents · Stuttgart · 2023', description: 'Afterhour Clubbing und Evening Event für Vector.' },
      { name: 'Entdeckerfest', meta: 'Echterdingen · 2025 & 2026', description: 'Stadtteilfest mit elektronischer Musik.' },
      { name: 'Schmellbackyard Crosslauf', meta: 'Leinfelden-Echterdingen · 2026', description: 'Sound, Licht und Musik für den Crosslauf.' },
      { name: '365 FM Radio & CouchRadio', meta: 'Web-Radio', description: 'Resident DJ bei beiden Stationen.' },
    ],
  },
  formats: {
    title: 'Booking-Formate',
    description:
      'Ob Clubnacht, Festival oder Firmenfeier – das Set wird auf Anlass, Publikum und Zeitfenster abgestimmt.',
    items: [
      { title: 'Clubnight / Label Night', description: 'Tech House und House für Clubnächte, Label-Nights und Afterhours.' },
      { title: 'Festival / Open Air', description: 'Elektronische Musik für Festivals, Stadtfeste und Open-Air-Bühnen.' },
      { title: 'Firmenfeier / Afterhour', description: 'Representative Events, Sommerfeste und Afterhours mit elektronischem Sound.' },
      { title: 'Private Party / Geburtstag', description: 'Feiern mit musikalischem Fokus – von House bis Drum n Bass.' },
      { title: 'Warm-up / Support', description: 'Support-Sets für nationale und internationale Gäste.' },
      { title: 'All Night Long', description: 'Ein Abend, ein DJ – musikalische Reise durch House, Tech House und Techno.' },
      { title: 'DJ + Technik', description: 'DJ-Booking inklusive PA, Licht und Technik über Sound & Licht Stuttgart.', link: 'https://soundundlicht-stuttgart.de/', linkLabel: 'Zur Vermietung' },
    ],
  },
  stats: {
    title: 'Reichweite & Community',
    description:
      'Echte Reichweite statt leerer Versprechen: DJ Hulk erreicht auf Instagram, Facebook und Mixcloud eine wachsende Community aus Electronic-Music-Fans.',
    followersLabel: 'Follower',
    updatedLabel: 'Stand',
    note: 'Die Zahlen werden zur Buildzeit automatisch aktualisiert.',
  },
  rider: {
    title: 'Technischer Rider',
    description:
      'Bevorzugt spiele ich auf einem klassischen CDJ-Setup. Alternativ bringe ich meinen Laptop mit DDJ-1000 Controller mit.',
    groups: [
      {
        title: 'Bevorzugtes Setup',
        items: [
          '2× Pioneer CDJ-3000 (oder CDJ-2000NXS2)',
          '1× Pioneer DJM-900NXS2 oder DJM-V10',
          '1× Booth-Monitor',
          '2× XLR-Kabel zur PA',
          'Stabiler DJ-Tisch, mind. 180 × 80 cm',
          '2× Stromanschluss am Booth',
        ],
      },
      {
        title: 'Alternative',
        items: [
          'Eigener Laptop + Pioneer DDJ-1000 Controller (wird mitgebracht)',
          '2× RCA oder XLR zum Mixer/PA',
          '1× Booth-Monitor optional',
          'Stabiler Tisch und Stromanschluss',
        ],
      },
      {
        title: 'Backup & Ablauf',
        items: [
          'Eigene USB-Sticks und Kopfhörer',
          'Booth-Zugang 30 Minuten vor dem Set',
          'Wasser/Softdrinks am Booth willkommen',
          'Preise und Reisekosten auf Anfrage',
        ],
      },
    ],
    note: 'Der vollständige Rider ist im EPK-PDF enthalten. Bei Fragen zur Technik einfach direkt melden.',
  },
  press: {
    title: 'Press Kit & EPK',
    description:
      'Alle Unterlagen für Booker, Veranstalter und Presse: EPK als PDF, Pressefotos, Logo, Kurz-Bio und technischer Rider.',
    pdfHref: '/files/dj-hulk-epk-de.pdf',
    pdfLabel: 'EPK als PDF herunterladen',
    printLabel: 'Als PDF drucken',
    photosTitle: 'Pressefotos',
    photosDescription:
      'Hochauflösende Fotos für redaktionelle Berichterstattung und Event-Promotion. Bitte Foto-Credit beachten.',
    photos: [
      { key: 'neon', alt: 'DJ Hulk im Neonlicht', download: '/img/press/dj-hulk-neon.jpg' },
      { key: 'studio', alt: 'DJ Hulk Studio-Portrait', download: '/img/press/dj-hulk-studio.jpg' },
      { key: 'club', alt: 'DJ Hulk im Club', download: '/img/press/dj-hulk-club.jpg' },
      { key: 'light', alt: 'DJ Hulk High-Key-Portrait', download: '/img/press/dj-hulk-light.jpg' },
      {
        key: 'liveBw',
        alt: 'DJ Hulk live auf einer Veranstaltung',
        download: '/img/press/dj-hulk-live-bw.jpg',
        credit: 'Foto: Crossi0711',
        creditUrl: 'https://www.instagram.com/crossi0711/',
      },
      { key: 'liveCrowd', alt: 'DJ Hulk live vor Publikum', download: '/img/press/dj-hulk-live-crowd.jpg' },
    ],
    assets: [
      { label: 'Logo (SVG)', href: '/img/djhulk_logo.svg', description: 'Vektor-Logo für Print und Web.' },
      { label: 'Logo (PNG)', href: '/img/djhulk_logo.png', description: 'Transparentes PNG-Logo.' },
      { label: 'Promo Card', href: '/img/press/dj-hulk-card.png', description: 'DJ Hulk Card für Social Media und Flyer.' },
      { label: 'Pressetext', href: '#press-bio', description: 'Kurz-Bio zum Kopieren.' },
      { label: 'Press Kit (ZIP)', href: '/files/dj-hulk-press-kit.zip', description: 'Logo (SVG/PNG), Promo Card, Pressetext DE/EN.' },
    ],
    photoCredits: 'Foto-Credit: Crossi0711 für das Live-Foto DSC_2316. Alle weiteren Bilder: DJ Hulk.',
  },
  process: {
    title: 'So funktioniert die Buchung',
    description: 'Von der ersten Anfrage bis zum Auftritt – transparent und unkompliziert.',
    steps: [
      { title: 'Anfrage senden', description: 'Datum, Ort, Uhrzeit, Format, Gästezahl und Technik angeben.' },
      { title: 'Verfügbarkeit & Angebot', description: 'Ich prüfe den Termin und melde mich in der Regel innerhalb von 24 Stunden.' },
      { title: 'Rider & Technik', description: 'Setup, Technik und Ablauf werden abgestimmt.' },
      { title: 'Bestätigung', description: 'Nach der Zusage erhältst du alle Details für den Eventtag.' },
      { title: 'Auftritt', description: 'Soundcheck, Set und ein Abend mit elektronischer Musik.' },
    ],
  },
  faq: {
    title: 'Booking-FAQ',
    description: 'Die häufigsten Fragen zu Booking, Technik und Ablauf.',
  },
  contact: {
    title: 'Booking-Anfrage',
    description:
      'Am schnellsten geht es per E-Mail oder WhatsApp. Je mehr Details du direkt mitschickst, desto schneller kann ich ein Angebot erstellen.',
    email,
    phone: phoneDisplay,
    phoneHref,
    whatsappHref: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(deWhatsAppText)}`,
    responseTime: 'Antwort in der Regel innerhalb von 24 Stunden.',
    location: 'Stuttgart / Leinfelden-Echterdingen',
  },
  share: {
    title: 'Booking-Seite teilen',
    description: 'Teile diese Seite mit Bookern, Veranstaltern oder Freunden – inklusive Vorschau auf Social Media.',
    text: 'DJ Hulk (Holger Kampffmeyer) – Electronic Music & Tech House DJ aus Stuttgart. Booking & EPK:',
    hashtags: 'DJHulk,TechHouse,Stuttgart,DJBooking',
    nativeLabel: 'Teilen',
    whatsappLabel: 'WhatsApp',
    facebookLabel: 'Facebook',
    xLabel: 'X',
    linkedinLabel: 'LinkedIn',
    emailLabel: 'E-Mail',
    pinterestLabel: 'Pinterest',
    redditLabel: 'Reddit',
    telegramLabel: 'Telegram',
    copyLabel: 'Link kopieren',
    copiedLabel: 'Link kopiert',
  },
  mail: {
    subject: 'Booking-Anfrage: [Event] am [Datum]',
    body: deMailBody,
  },
  labels: {
    booking: 'Booking',
    factSheet: 'Auf einen Blick',
    genre: 'Genres',
    references: 'Referenzen',
    formats: 'Formate',
    rider: 'Rider',
    press: 'Press Kit',
    process: 'Ablauf',
    faq: 'FAQ',
    contact: 'Kontakt',
    share: 'Teilen',
    backToTop: 'Nach oben',
    lastUpdated: 'Stand',
    priceOnRequest: 'Auf Anfrage',
    download: 'Download',
    open: 'Öffnen',
    copyBio: 'Bio kopieren',
    bioCopied: 'Bio kopiert',
  },
};
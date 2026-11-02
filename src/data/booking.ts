export type BookingLocale = 'de' | 'en';

export interface BookingFact {
  label: string;
  value: string;
}

export interface BookingGenreGroup {
  title: string;
  items: string[];
}

export interface BookingReference {
  name: string;
  meta: string;
  description: string;
}

export interface BookingFormat {
  title: string;
  description: string;
  link?: string;
  linkLabel?: string;
}

export interface RiderGroup {
  title: string;
  items: string[];
}

export interface PressPhoto {
  key: 'neon' | 'studio' | 'club' | 'light' | 'liveBw' | 'liveCrowd' | 'presskit';
  alt: string;
  download: string;
  credit?: string;
  creditUrl?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface BookingContent {
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    ogLocale: string;
    path: string;
    alternatePath: string;
    alternateHrefLang: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    shareCta: string;
    languageLabel: string;
    languageHref: string;
    imageAlt: string;
  };
  trust: string[];
  facts: BookingFact[];
  bio: {
    title: string;
    lead: string;
    paragraphs: string[];
    pressBio: string;
  };
  genres: {
    title: string;
    description: string;
    groups: BookingGenreGroup[];
  };
  references: {
    title: string;
    description: string;
    items: BookingReference[];
  };
  formats: {
    title: string;
    description: string;
    items: BookingFormat[];
  };
  stats: {
    title: string;
    description: string;
    followersLabel: string;
    updatedLabel: string;
    note: string;
  };
  rider: {
    title: string;
    description: string;
    groups: RiderGroup[];
    note: string;
  };
  press: {
    title: string;
    description: string;
    pdfHref: string;
    pdfLabel: string;
    printLabel: string;
    photosTitle: string;
    photosDescription: string;
    photos: PressPhoto[];
    assets: { label: string; href: string; description: string }[];
    photoCredits: string;
  };
  process: {
    title: string;
    description: string;
    steps: ProcessStep[];
  };
  faq: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
    phoneHref: string;
    whatsappHref: string;
    responseTime: string;
    location: string;
  };
share: {
    title: string;
    description: string;
    text: string;
    hashtags: string;
    nativeLabel: string;
    whatsappLabel: string;
    facebookLabel: string;
    xLabel: string;
    linkedinLabel: string;
    emailLabel: string;
    pinterestLabel: string;
    redditLabel: string;
    telegramLabel: string;
    copyLabel: string;
    copiedLabel: string;
  };
  mail: {
    subject: string;
    body: string;
  };
  labels: {
    booking: string;
    factSheet: string;
    genre: string;
    references: string;
    formats: string;
    rider: string;
    press: string;
    process: string;
    faq: string;
    contact: string;
    share: string;
    backToTop: string;
    lastUpdated: string;
    priceOnRequest: string;
    download: string;
    open: string;
    copyBio: string;
    bioCopied: string;
  };
}

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

const deWhatsAppText = 'Hallo Holger, ich möchte dich für ein Event buchen. Hier sind die Details:';
const enWhatsAppText = 'Hi Holger, I would like to book you for an event. Here are the details:';

export const bookingContent: Record<BookingLocale, BookingContent> = {
  de: {
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
  },
  en: {
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
  },
};

export const bookingMailto = (lang: BookingLocale): string => {
  const content = bookingContent[lang];
  return `mailto:${content.contact.email}?subject=${encodeURIComponent(content.mail.subject)}&body=${encodeURIComponent(content.mail.body)}`;
};

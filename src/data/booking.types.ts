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
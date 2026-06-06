export const serviceArea = [
  { "@type": "City" as const, "name": "Stuttgart" },
  { "@type": "City" as const, "name": "Leinfelden-Echterdingen" },
  { "@type": "City" as const, "name": "Esslingen am Neckar" },
  { "@type": "City" as const, "name": "Tübingen" },
  { "@type": "City" as const, "name": "Böblingen" },
  { "@type": "City" as const, "name": "Filderstadt" },
  { "@type": "City" as const, "name": "Ludwigsburg" },
  { "@type": "City" as const, "name": "Reutlingen" }
];

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://holger-kampffmeyer.de/#dj",
  "name": "DJ Hulk - Holger Kampffmeyer",
  "description": "Verleih von Musikanlagen, Partyboxen, Lichttechnik und Tontechnik im Großraum Stuttgart. Electronic Music DJ für Events, Feiern und Hochzeiten.",
  "url": "https://holger-kampffmeyer.de",
  "image": "https://holger-kampffmeyer.de/img/header.webp",
  "priceRange": "€€",
  "telephone": "+491711467491",
  "email": "holger.kampffmeyer+dj@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Magellanstraße 4",
    "addressLocality": "Leinfelden-Echterdingen",
    "postalCode": "70771",
    "addressRegion": "Baden-Württemberg",
    "addressCountry": "DE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "48.6938",
    "longitude": "9.1539"
  },
  "openingHours": ["Mo 09:00-20:00", "Tu 09:00-20:00", "We 09:00-20:00", "Th 09:00-20:00", "Fr 09:00-20:00", "Sa 09:00-20:00", "Su 09:00-20:00"],
  "areaServed": serviceArea,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+491711467491",
    "contactType": "customer service",
    "email": "holger.kampffmeyer+dj@gmail.com",
    "availableLanguage": ["German", "English"]
  },
  "sameAs": [
    "https://www.facebook.com/holger.kampffmeyer",
    "https://www.instagram.com/djhulk_de",
    "https://www.youtube.com/@djhulk_de",
    "https://www.mixcloud.com/holger-kampffmeyer/",
    "https://soundcloud.com/djhulk",
    "https://open.spotify.com/user/11131869179",
    "https://github.com/holgerkampffmeyer2",
    "https://soundundlicht-stuttgart.de"
  ]
};

export const siteNavigationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Hauptnavigation",
  "itemListElement": [
    {
      "@type": "SiteNavigationElement",
      "position": 1,
      "name": "Home",
      "url": "https://holger-kampffmeyer.de/"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 2,
      "name": "DJ Hulk",
      "url": "https://holger-kampffmeyer.de/djhulk-electronic-music/"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 3,
      "name": "Vermietung",
      "url": "https://holger-kampffmeyer.de/vermietung/"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 4,
      "name": "DJ Mixes",
      "url": "https://holger-kampffmeyer.de/dj/mixes/"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 5,
      "name": "Videos",
      "url": "https://holger-kampffmeyer.de/dj/videos/"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 6,
      "name": "Work",
      "url": "https://holger-kampffmeyer.de/work/"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 7,
      "name": "Links",
      "url": "https://holger-kampffmeyer.de/links/"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 8,
      "name": "Impressum",
      "url": "https://holger-kampffmeyer.de/impressum/"
    }
  ]
};

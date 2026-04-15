# Konzept: DJ Hulk / Holger Kampffmeyer Website

> **Quick-Start:** Siehe AGENTS.md für die wichtigsten Befehle und Regeln.

## Architektur

### Technologie-Stack
- **Framework:** Astro 6.x (Static Site Generation)
- **Styling:** Tailwind CSS 4.x
- **Build-Tool:** Vite (via @tailwindcss/vite Plugin)
- **Sprache:** TypeScript / Astro Components
- **Deployment:** GitHub Pages via GitHub Actions

### Projektstruktur
```
src/
├── components/           # Wiederverwendbare UI-Komponenten
├── data/                 # Daten-Dateien
│   └── mixcloud-data.json    # Mixcloud Daten (wird beim Build aktualisiert)
├── scripts/              # Build-Skripte
│   ├── fetch-mixcloud.mjs   # Mixcloud API Abfrage
│   ├── generate-rss.mjs     # RSS Feed Generator
│   ├── create-webp.mjs      # Bildoptimierung
│   ├── optimize-images.mjs  # Bildoptimierung
│   └── update-image-refs.mjs # Bildreferenzen aktualisieren
│   ├── Footer.astro
│   └── vermietung/      # Vermietung-spezifische Komponenten
│       ├── ProductGallery.astro
│       ├── TechnicalSpecs.astro
│       ├── RentalIncludes.astro
│       ├── RentalPricing.astro
│       ├── ExampleEvents.astro
│       ├── IncludedInPackages.astro
│       └── PackageContents.astro
├── layouts/              # Seiten-Layouts
│   └── Layout.astro
├── pages/                # Routen/Seiten
│   ├── index.astro                   # Startseite (Hero-Slider: 3 Slides)
│   ├── djhulk-electronic-music.astro # DJ Hulk Hauptseite
│   ├── dj/                          # DJ Unterseiten
│   │   ├── videos.astro              # Video-Galerie (YouTube)
│   │   ├── mixes.astro              # DJ Mixes (Mixcloud)
│   │   └── em3f.astro               # EM3F Festival Fotos
│   ├── vermietung.astro             # Vermietung Übersicht
│   ├── vermietung/                  # Vermietung Detailseiten
│   │   ├── partypaket-stuttgart.astro
│   │   ├── veranstaltungspaket-stuttgart.astro
│   │   ├── djpaket-fildern.astro
│   │   ├── ld-maui-28g3.astro
│   │   ├── jbl-partybox-300-320.astro
│   │   ├── partylicht-moving-head.astro
│   │   ├── led-bossfx-nebelmaschine.astro
│   │   └── kls-laser-bar.astro
│   ├── work.astro
│   ├── impressum.astro
│   └── links.astro
├── public/
│   ├── rss.xml                 # RSS Feed
│   ├── robots.txt
├── styles/
│   └── global.css
└── env.d.ts
```

### Statische Generierung
- `output: 'static'` - rein statische HTML-Ausgabe
- Kein SSR - alle Seiten werden zur Build-Zeit generiert
- Optimiert für maximale Performance und GitHub Pages Hosting

### Build-Skripte
```bash
pnpm run dev      # Development server
pnpm run check    # TypeScript check
pnpm run build    # Production build
pnpm run preview  # Preview production build
pnpm run lint     # ESLint check
```

---

## Designentscheidungen

### Farbschema
- **Primary:** Orange (#f97316) - Energie, Dynamik
- **Secondary:** Cyan (#22d3ee) - Modernität, Tech
- **Background:** Dunkel (#0a0a0f) - Elegant, Club-Atmosphäre
- **Surface:** leicht heller (#16161a) - Kartenhintergründe
- **Text:** Hell (#e5e5e5) auf dunklem Grund
### UI-Komponenten
- Veranstaltungskarten im Archiv besitzen einen feinen Rahmen (border) und reagieren beim Hover mit sekundärer Farbe und leichtem Schatten – dieselbe Stilistik wie bei Vermietungs-Galeriekarten.
### Typografie
- **Headings:** Play (bold) - Eigenständig, markant
- **Body:** Josefin Sans - Modern, gut lesbar

### Layout & UX
- **Responsive:** Mobile-First mit Breakpoints (sm, md, lg)
- **Navigation:** Fixed Header mit Dropdown-Menüs
- **Hero-Slider:** Fullscreen mit automatischer Rotation
- **Animationen:** Fade-in-up beim Scrollen (Intersection Observer)

### Seitenstruktur
1. **Home (index)** - Hero-Slider (DJ Hulk, Vermietung, Work), DJing Section, Vermietung, Kontakt
2. **DJ Hulk** - DJing Info, Videos Link, Mixes, Radio Stations, Spotify Playlist, zusätzlich ein **Veranstaltungsarchiv** mit Karten für vergangene Gigs und Flyer
3. **DJ / Videos** - YouTube Video-Galerie
4. **DJ / Mixes** - Weekly Sunday House Mixes (Mixcloud)
5. **DJ / EM3F** - Festival-Fotogalerie
6. **Vermietung** - Equipment-Katalog mit Preisen, Detailseiten
7. **Work** - Business/Research Info, Research Papers (PDFs)
8. **Links** - Social Media Links, Plattformen
9. **Impressum** - Rechtliche Informationen

### URLs
- `/` - Startseite
- `/djhulk-electronic-music` - DJ Hulk Seite
- `/dj/videos` - Video-Galerie (YouTube)
- `/dj/mixes` - DJ Mixes
- `/dj/em3f` - EM3F Festival
- `/vermietung` - Vermietung Übersicht
- `/work` - Work/Research
- `/impressum` - Impressum
- `/links` - Links (Social Media, Plattformen)

---

## Funktionen

### Navigation
- Hauptnavigation: Home, DJing (Dropdown), Vermietung (Dropdown), Work, Links, Impressum
- DJing-Dropdown: Über mich, Videos, Mixes, EM3F Festival
- Vermietung-Dropdown: Übersicht + alle Detailseiten
- Mobile Hamburger-Menü

### Vermietung
- 8 Equipment-Artikel mit Bildern, Preisen, Beschreibungen
- Google Forms Embed für Mietanfragen
- Testimonials von Kunden

### Work / Research
- Business-Profil (Vector Software)
- University Research (Uni Stuttgart)
- 3 PDF-Papers mit Direktlinks

### Galerie
- EM3F Festival Fotos
- Video-Sektion mit YouTube Embeds
- Spotify Playlist Embed

### RSS Feed
- Automatische Generierung bei jedem Build
- Datenquellen:
  - Astro-Seiten in `src/pages/` (nach Git-Änderungsdatum)
  - Mixcloud-Daten (`src/data/mixcloud-data.json`) - neueste 10 Mixes
  - Open Source Projekte (`src/data/open-source-projects.json`)
- Build-Script: `scripts/generate-rss.mjs`
- Output: `public/rss.xml`
- Einträge werden nach Datum sortiert

**Neuen RSS-Eintrag hinzufügen:**
```bash
# RSS wird automatisch generiert bei:
# - Neue Astro-Seiten in src/pages/
# - Neue Mixes in mixcloud-data.json
# - Neue Open Source Projekte in open-source-projects.json

pnpm run build
```
---

## Bildoptimierung

### Tools & Skripte

Im Projekt-Root befinden sich mehrere Hilfsskripte zur Bildoptimierung:

| Skript | Beschreibung |
|--------|--------------|
| `scripts/create-webp.mjs` | Konvertiert JPG/JPEG zu WebP (Qualität: 80%, max. 1920px) |
| `scripts/optimize-images.mjs` | Optimiert JPG/PNG (Qualität: 80%, Größe je nach Verzeichnis) |
| `scripts/update-image-refs.mjs` | Aktualisiert Bildreferenzen in Astro/HTML Dateien auf WebP |

### Verwendung

```bash
# 1. WebP erstellen
node scripts/create-webp.mjs

# 2. Bilder optimieren
node scripts/optimize-images.mjs

# 3. Referenzen aktualisieren
node scripts/update-image-refs.mjs
```

### Konfiguration

- **Vermietungsbilder**: max. 1200px Breite
- **Header/Videos**: max. 1920px Breite
- **Icons**: max. 100px Breite
- **WebP-Qualität**: 80%
- **JPG/PNG-Qualität**: 80% mit mozjpeg/pngquant

### Ergebnisse
- ~140 Bilder zu WebP konvertiert
- 30-80% Größenersparnis je nach Bildinhalt

### Hero Slider
- 3 Slides auf index.html mit unterschiedlichen Hintergründen:
  1. DJ Hulk → /djhulk-electronic-music
  2. DJ Technik Verleih → /vermietung
  3. Work/Research → /work
- Automatische Rotation alle 5 Sekunden
- Navigation via Pfeile und Dots
- Fix: pointer-events und z-index für korrekte Button-Interaktion

### SEO & Meta
- Canonical URL
- Open Graph Tags
- Meta Descriptions
- Semantisches HTML
- LLM-Optimierung: robots.txt erweitert für GPTBot, ChatGPT-User, Google-Extended, anthropic-ai, Claude-Web, cohere-ai

### Lint-Konfiguration
- **Tool:** ESLint mit TypeScript- und Astro-Support
- **Konfig:** `eslint.config.mjs`
- **Regeln (alle auf warn):**
  - `no-unused-vars` - Ungenutzte Variablen
  - `no-console` - Console-Statements
  - `@typescript-eslint/no-unused-vars` - Ungenutzte TypeScript-Variablen

---

## Deployment

### GitHub Actions Workflow
- Trigger: Push auf main-Branch
- Steps: Checkout → pnpm install → pnpm run lint → pnpm run check → pnpm run build → upload-artifact → deploy-pages
- Environment: github-pages

### Konfiguration
- `site: 'https://holger-kampffmeyer.de'`
- `base: '/'` - Root-Hosting

---

## Zukünftige Verbesserungen
- [x] Bildoptimierung (WebP)
- [x] Sitemap-Generierung
- [x] Produktdetailseiten für Vermietung
- [x] RSS Feed
- [x] Neues Skript `scripts/fetch-mixcloud.mjs` zum Abrufen der letzten 16 Mixes zur Build-Zeit
- [x] Neue Komponente `src/components/MixcloudWidget.astro` zur flexiblen Widget-Einbindung
- [x] `src/pages/dj/mixes.astro` auf dynamisches Laden umgestellt
- [x] Integration in `package.json` Build-Prozess
- [x] Visueller Abstand zwischen Sektionen auf allen Seiten reduziert (durch Anpassung von `.section-padding` in `global.css`)
- [x] Refactoring der Sektionen in der index.astro "Was ich Dir biete" und "FAQ" als Astro Komponente. Einbau der 2 Komponenten auf der vermietung.astro Seite ergänzen.
- [ ] Blog-Sektion

---

## Änderungen

### 2025-xx-xx: Produktdetailseiten für Vermietung

**Neue Komponenten unter `src/components/vermietung/`:**
- `ProductGallery.astro` - Bildergalerie mit Thumbnail-Navigation
- `TechnicalSpecs.astro` - Tabelle für technische Daten
- `RentalIncludes.astro` - Liste mit Icons für Lieferumfang
- `RentalPricing.astro` - Preis, Kaution und Mietbedingungen
- `ExampleEvents.astro` - Karten für Beispielanwendungen

**Neue Seiten:**
- `src/pages/vermietung/ld-maui-28g3.astro` - Produktdetailseite für LD Maui 28 G3
- `src/pages/vermietung/jbl-partybox-300-320.astro` - Produktdetailseite für JBL Partybox 300/320 Set
- `src/pages/vermietung/partylicht-moving-head.astro` - Produktdetailseite für Partylicht & Gobo Moving Head
- `src/pages/vermietung/led-bossfx-nebelmaschine.astro` - Produktdetailseite für LED BossFX-2 Pro & Nebelmaschine
- `src/pages/vermietung/kls-laser-bar.astro` - Produktdetailseite für Eurolite KLS Laser Bar

**Features:**
- Breadcrumb-Navigation
- Responsive Bildergalerie mit Tastatursteuerung
- Vollständige technische Spezifikationen
- Mietpreis und Kaution
- Beispielanwendungen für verschiedene Veranstaltungsarten
- Verlinkung von der Hauptseite und Navbar

### 2026-02-25: Galerie-Verbesserungen

**Änderung:**
- Bilder in `public/img/vermietung/` für Produktgalerien
- `object-contain` für vollständige Bildanzeige
- Abgerundete Ecken in der Galerie

### 2026-02-28: DJ Hulk Seiten-Refactoring

**Ziel:** DJ-bezogene Inhalte von der Startseite auf separate Seite auslagern

**Neue Seiten:**
- `src/pages/dj/mixes.astro` - DJ Mixes (von `/mixes` verschoben)
- `src/pages/dj/em3f.astro` - EM3F Festival Fotos (von `/em3f` verschoben)
- `src/pages/dj/videos.astro` - Video-Galerie (YouTube)
- `src/pages/djhulk-electronic-music.astro` - DJ Hulk Hauptseite

**Änderungen:**
- Hero Slider auf index.astro: 3 Slides statt 4 (DJ Hulk + Mixes zusammengeführt)
- Galerie, DJing, Mixes, Spotify Sections → neue DJ Hulk Seite
- Navbar: "DJing" Dropdown (Über mich, Videos, Mixes, EM3F)
- Startseite: DJing Section hinzugefügt + Vermietung + Kontakt Sections
- DJ Hulk Seite: Radio Stations Section hinzugefügt (365 FM Radio, CouchRadio)
- Video-Galerie auf eigene Unterseite `/dj/videos` ausgelagert

### 2026-02-28: Index Seite Updates

**Änderungen:**
- Vermietung Section: Bilder hinzugefügt (2 Bilder im Grid)
- "Was ich dir biete" Section: 4 Karten mit SVG-Icons (orange)
- FAQ Section: 6 Fragen mit Answer-Details
- Alle Bilder mit Hover-Effekt (ring + scale)
- LLM-Optimierung: robots.txt mit GPTBot, ChatGPT-User, etc.
- sitemap.xml aktualisiert mit allen 13 Seiten

### 2026-03-06: Partypaket und Veranstaltungspaket Seiten

**Neue Komponenten unter `src/components/vermietung/`:**
- `PackageContents.astro` - Paketzusammenstellung mit Links zu Produktdetailseiten
- `Testimonials.astro` - Wiederverwendbare Kundenbewertungen

**Neue Seiten:**
- `src/pages/vermietung/partypaket-stuttgart.astro` - Partypaket für bis zu 50 Personen
- `src/pages/vermietung/veranstaltungspaket-stuttgart.astro` - Veranstaltungspaket für bis zu 150 Personen

**Änderungen:**
- Navbar: Vermietung Dropdown mit neuen Paketseiten
- PackageContents: "Enthalten im Partypaket/Veranstaltungspaket" mit Links zu Produktseiten
- Testimonials: Als wiederverwendbare Komponente auf Vermietungsseite und Paketseiten
- sitemap.xml und urllist.txt mit neuen Seiten aktualisiert

### 2026-03-06: DJ-Paket Fildern

**Neue Seite:**
- `src/pages/vermietung/djpaket-fildern.astro` - DJ-Paket für bis zu 150 Personen

**Enthalten im Paket:**
- 2x LD Maui 28 G3
- LED BossFX-2 Pro + AF-150 Nebelmaschine
- 18 Prisma Moving Head
- Showlight LED Stage Bar
- 1 Funkmikrofon
- 4x LED PAR Strahler

### 2026-03-08: Vermietungsseite Updates

**Neue Komponente:**
- `src/components/vermietung/MietanfrageAblauf.astro` - Ablauf & Service-Sektion

**Änderungen auf `src/pages/vermietung.astro`:**
- Hero Section: Umstellung auf Hero-Carousel (3 Slides: Partypaket, DJ-Paket, Veranstaltungspaket) mit "ab"-Preisen und CTA-Buttons
- Intro-Sektion: Text neu formatiert und zentriert (nun Block-Format)
- Einbindung der Komponente `MietanfrageAblauf`
- Slider-Übergang auf 8 Sekunden erhöht
- Import-Fixes für Icons

### 2026-03-09: Vermietungsseite - Katalogstruktur

**Änderungen auf `src/pages/vermietung.astro`:**
- Unterteilung in 3 Abschnitte: Komplettpakete, Sound, Licht
- Equipment in 3 Kategorien aufgeteilt:
  - **Komplettpakete:** Partypaket, DJ-Paket, Veranstaltungspaket
  - **Sound:** LD Maui, JBL Partyboxen, Yamaha Mischpult, Mikrofon
  - **Licht:** LED BossFX, Laser Bar, Moving Heads, PAR Strahler, Nebelmaschine, Beamer
- Abwechselnde Hintergrundfarben (surface/bg) für visuelle Trennung

### 2026-03-09: JSON-LD Schema Updates

**Neue Schema-Typen:**
- `SiteNavigationElement` als `ItemList` in Layout.astro
- `LocalBusiness` + `Person` auf index.astro
- `Person` auf work.astro mit XING/LinkedIn Verknüpfung
- `Service`-Schema auf allen Vermietungs-Detailseiten

**Änderungen:**
- Alle JSON-LD Scripte in Layout.astro für konsistente Business-Daten
- Index-Seite: FAQPage, LocalBusiness, Person
- Work-Seite: Person mit sameAs für soziale Profile

### 2026-03-09: Dependencies Update

**Aktualisierte Versionen:**
- Astro: 6.x (aktuell)
- Tailwind CSS: 4.x
- TypeScript: 5.x

### 2026-03-15: DJ Mixes Pagination

**Änderungen:**
- `scripts/fetch-mixcloud.mjs`: Fetch-Limit von 16 auf 100 erhöht
- `src/pages/dj/mixes.astro`: 
  - Pagination mit URL-Parameter (`?page=2`, etc.)
  - 5 Mixes pro Seite (einstellbar über `ITEMS_PER_PAGE`)
  - 1 Spalte Layout (untereinander)
  - Previous/Next Buttons + Seitenzahlen
  - Lazy Loading für iframes
- `src/data/mixcloud-data.json`: 100 Mixes werden geladen (vorher 16)

### 2026-03-16: Google Maps Einbettung

**Änderungen:**
- `src/pages/index.astro`: Google Maps iframe im Kontakt-Bereich eingebettet
- Embed zeigt auf "Holger Kampffmeyer DJ Dienstleistungen" (Place ID)
- Responsive: h-64 auf Mobile, h-80 auf größeren Bildschirmen

### 2026-03-18: Lint-Fixes und MixcloudWidget Anpassung

**Lint-Warnungen behoben:**
- `src/pages/dj/mixes.astro`: `catch` Block ohne ungenutzte Variable, `console.warn` entfernt
- `src/pages/djhulk-electronic-music.astro`: Ungenutzte Imports entfernt (ChevronRightIcon, LinkedInIcon)
- `src/pages/links.astro`: Ungenutzter Import XIcon entfernt

**MixcloudWidget-Komponente:**
- `src/components/MixcloudWidget.astro`: Optionale `height` Property hinzugefügt
- `astro.config.mjs`: `@ts-ignore` für Tailwind/Vite Type-Mismatch

**Seitenanpassung:**
- `src/pages/djhulk-electronic-music.astro`: Mixcloud Player wie auf dj/mixes.astro angepasst mit `variant="featured"`

### 2026-03-18: CVE Fixes und GitHub Action Update

**CVE Fixes:**
- `pnpm audit fix` ausgeführt: devalue, lodash aktualisiert
- `@astrojs/rss` entfernt (nicht verwendet, brachte fast-xml-parser mit)
- Resultat: 0 vulnerabilities

**GitHub Actions Workflow:**
- `.github/workflows/deploy.yml` erweitert mit eigenen Steps statt withastro/action@v5
- Neue Steps: Checkout → pnpm install → pnpm run lint → pnpm run check → pnpm run build
- Build schlägt fehl bei Lint/TypeScript-Fehlern (verhindert Deploy)

### 2026-03-21: Astro 6.x Upgrade

**Upgrade:**
- Astro von 5.x auf 6.x aktualisiert
- Tailwind CSS via `@tailwindcss/vite` Plugin (astro.config.mjs)
- Keine breaking Changes für dieses Projekt

**Geänderte Dateien:**
- `astro.config.mjs`: Import und Plugin-Setup aktualisiert
- `package.json`: Astro Version auf ^6.0.8 aktualisiert

# Konzept: DJ Hulk / Holger Kampffmeyer Website

## Architektur

### Technologie-Stack
- **Framework:** Astro 5.x (Static Site Generation)
- **Styling:** Tailwind CSS 4.x
- **Build-Tool:** Vite
- **Sprache:** TypeScript / Astro Components
- **Deployment:** GitHub Pages via GitHub Actions

### Projektstruktur
```
src/
├── components/           # Wiederverwendbare UI-Komponenten
│   ├── Navbar.astro
│   ├── Footer.astro
│   └── vermietung/      # Vermietung-spezifische Komponenten
│       ├── ProductGallery.astro
│       ├── TechnicalSpecs.astro
│       ├── RentalIncludes.astro
│       ├── RentalPricing.astro
│       └── ExampleEvents.astro
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
│   │   ├── ld-maui-28g3.astro
│   │   ├── jbl-partybox-300-320.astro
│   │   ├── partylicht-moving-head.astro
│   │   ├── led-bossfx-nebelmaschine.astro
│   │   └── kls-laser-bar.astro
│   ├── work.astro
│   └── impressum.astro
├── styles/
│   └── global.css
└── env.d.ts
```

### Statische Generierung
- `output: 'static'` - rein statische HTML-Ausgabe
- Kein SSR - alle Seiten werden zur Build-Zeit generiert
- Optimiert für maximale Performance und GitHub Pages Hosting

---

## Designentscheidungen

### Farbschema
- **Primary:** Orange (#f97316) - Energie, Dynamik
- **Secondary:** Cyan (#22d3ee) - Modernität, Tech
- **Background:** Dunkel (#0a0a0f) - Elegant, Club-Atmosphäre
- **Surface:** leicht heller (#16161a) - Kartenhintergründe
- **Text:** Hell (#e5e5e5) auf dunklem Grund

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
2. **DJ Hulk** - DJing Info, Videos Link, Mixes, Radio Stations, Spotify Playlist
3. **DJ / Videos** - YouTube Video-Galerie
4. **DJ / Mixes** - Weekly Sunday House Mixes (Mixcloud)
5. **DJ / EM3F** - Festival-Fotogalerie
6. **Vermietung** - Equipment-Katalog mit Preisen, Detailseiten
7. **Work** - Business/Research Info, Research Papers (PDFs)
8. **Impressum** - Rechtliche Informationen

### URLs
- `/` - Startseite
- `/djhulk-electronic-music` - DJ Hulk Seite
- `/dj/videos` - Video-Galerie (YouTube)
- `/dj/mixes` - DJ Mixes
- `/dj/em3f` - EM3F Festival
- `/vermietung` - Vermietung Übersicht
- `/work` - Work/Research

---

## Funktionen

### Navigation
- Hauptnavigation: Home, DJing (Dropdown), Vermietung (Dropdown), Work, Impressum
- DJing-Dropdown: Über mich, Videos, Mixes, EM3F Festival
- Vermietung-Dropdown: Übersicht + alle Detailseiten
- Mobile Hamburger-Menü

### Vermietung
- 18 Equipment-Artikel mit Bildern, Preisen, Beschreibungen
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
---

## Bildoptimierung

### Tools & Skripte

Im Projekt-Root befinden sich mehrere Hilfsskripte zur Bildoptimierung:

| Skript | Beschreibung |
|--------|--------------|
| `create-webp.mjs` | Konvertiert JPG/JPEG zu WebP (Qualität: 80%, max. 1920px) |
| `optimize-images.mjs` | Optimiert JPG/PNG (Qualität: 80%, Größe je nach Verzeichnis) |
| `update-image-refs.mjs` | Aktualisiert Bildreferenzen in Astro/HTML Dateien auf WebP |

### Verwendung

```bash
# 1. WebP erstellen
node create-webp.mjs

# 2. Bilder optimieren
node optimize-images.mjs

# 3. Referenzen aktualisieren
node update-image-refs.mjs
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

---

## Deployment

### GitHub Actions Workflow
- Trigger: Push auf main-Branch
- Steps: Checkout → withastro/action@v5 → deploy-pages
- Environment: github-pages

### Konfiguration
- `site: 'https://holger-kampffmeyer.de'`
- `base: '/'` - Root-Hosting

---

## Zukünftige Verbesserungen
- [x] Bildoptimierung (WebP)
- [x] Sitemap-Generierung
- [x] Produktdetailseiten für Vermietung
- [ ] RSS Feed
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

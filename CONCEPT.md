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
│   ├── index.astro
│   ├── vermietung.astro
│   ├── vermietung/
│   │   └── ld-maui-28g3.astro
│   ├── work.astro
│   ├── mixes.astro
│   ├── em3f.astro
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
1. **Home (index)** - Hero-Slider, DJing, Vermietung, Galerie, Kontakt
2. **Vermietung** - Equipment-Katalog mit Preisen, Kontaktformular
3. **Work** - Business/Research Info, Research Papers (PDFs)
4. **Mixes** - SoundCloud Embeds
5. **EM3F** - Festival-Fotogalerie
6. **Impressum** - Rechtliche Informationen

---

## Funktionen

### Navigation
- Hauptnavigation: Home, Vermietung, Work, Impressum
- Home-Dropdown: Galerie, DJing, Kontakt
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
- **WebP-Optimierung:** ~140 Bilder konvertiert (30-80% Größenersparnis)

### Hero Slider
- 4 Slides auf index.html mit unterschiedlichen Hintergründen
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
- `src/pages/vermietung/ld-maui-28g3.astro` - Erste Produktdetailseite für LD Maui 28 G3

**Features:**
- Breadcrumb-Navigation
- Responsive Bildergalerie mit Tastatursteuerung
- Vollständige technische Spezifikationen
- Mietpreis und Kaution (100€ / 200€)
- Beispielanwendungen für bis zu 150 Personen (Hochzeit, Firmenfeier, Vereinsfeier)
- Verlinkung von der Hauptseite

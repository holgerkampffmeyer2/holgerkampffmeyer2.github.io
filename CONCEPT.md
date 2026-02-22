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
├── components/       # Wiederverwendbare UI-Komponenten
│   ├── Navbar.astro
│   └── Footer.astro
├── layouts/          # Seiten-Layouts
│   └── Layout.astro
├── pages/            # Routen/Seiten
│   ├── index.astro
│   ├── vermietung.astro
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
- [ ] Bildoptimierung (Astro Image)
- [ ] Sitemap-Generierung
- [ ] RSS Feed
- [ ] Blog-Sektion

# Agenten-Informationen

## Projekt
Persönliche Website von Holger Kampffmeyer - DJ, Lichttechniker und Event-Technik-Verleih

## Domain
- **Live-Domain:** https://holger-kampffmeyer.de
- **Hosting:** GitHub Pages (holgerkampffmeyer2.github.io)
- **CNAME:** holger-kampffmeyer.de

## Tech-Stack
- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS 4.x
- **Build:** Static Site Generation (SSG)

## Build & Deployment
```bash
npm run dev      # Development server
npm run check   # TypeScript check
npm run build   # Production build -> dist/
npm run preview # Preview production build
```

## Wichtige Pfade
- **Source:** `src/pages/`
- **Statische Assets:** `public/` (wird in Root kopiert)
- **Config:** `astro.config.mjs`

## Astro-Konfiguration (astro.config.mjs)
- `site:` muss auf `https://holger-kampffmeyer.de` gesetzt sein
- `output: 'static'` für SSG
- `build.format: 'file'` für .html Dateien statt Verzeichnisse

## Statische Dateien im public/
Alle Dateien in `public/` werden beim Build in den Root kopiert:
- `robots.txt` - Suchmaschinen-Crawling
- `sitemap.xml` - SEO Sitemap
- `urllist.txt` - Zusätzliche URL-Liste
- `BingSiteAuth.xml` - Bing Webmaster Verification
- `googlehostedservice.html` - Google Verification
- `a5337f1aa7804e5a9b9f2204ee7b203a.txt` - Google Verification

## Seitenstruktur
```
src/pages/
├── index.astro                    # Startseite
├── djhulk-electronic-music.astro # DJ Hulk Hauptseite
├── dj/                           # DJ Unterseiten
│   ├── videos.astro              # Video-Galerie (YouTube)
│   ├── mixes.astro              # DJ Mixes (Mixcloud)
│   └── em3f.astro               # EM3F Festival Fotos
├── vermietung.astro              # Vermietung Übersicht
├── vermietung/                    # Detailseiten
│   ├── ld-maui-28g3.astro
│   ├── jbl-partybox-300-320.astro
│   ├── partylicht-moving-head.astro
│   ├── led-bossfx-nebelmaschine.astro
│   └── kls-laser-bar.astro
├── work.astro                    # Work/Research
└── impressum.astro               # Impressum
```

## Wichtige Regeln
1. Domain IMMER auf `holger-kampffmeyer.de` setzen
2. Neue Seiten in `src/pages/` erstellen
3. Statische Dateien wie images, sitemap.xml, robots.txt in `public/` ablegen
4. Nach Änderungen: check -> build -> commit -> push

## Git-Workflow
```bash
npm run check
npm run build
git add .
git commit -m "describe changes"
git tag -a v.x.x.x -m "version message"
git push && git push origin
```
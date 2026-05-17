# DJ Hulk Website - Konzept, Struktur & Design

> **Quick-Start:** [AGENTS.md](../AGENTS.md)

## Technologie-Stack

- **Framework:** Astro 6.x (Static Site Generation, `output: 'static'`)
- **Styling:** Tailwind CSS 4.x + CSS Custom Properties (Theme-System)
- **Deployment:** GitHub Pages
- **Site-URL:** `https://holger-kampffmeyer.de` (gesetzt in `astro.config.mjs`)

---

## Projektstruktur

```
src/
├── components/           # UI-Komponenten
├── data/                 # Daten (faqs.json, mixcloud-data.json)
├── layouts/             # Layouts (Layout.astro)
├── pages/               # Routen
│   ├── index.astro      # Startseite
│   ├── djhulk-electronic-music.astro
│   ├── dj/
│   │   ├── videos.astro
│   │   ├── mixes.astro
│   │   ├── mixes/[number].astro
│   │   ├── mixes-all.astro
│   │   ├── mixes-blog-archive.astro
│   │   └── em3f.astro
│   ├── vermietung.astro  # Landingpage mit Verweis → extern
│   ├── work.astro
│   ├── links.astro
│   └── impressum.astro
└── styles/
    ├── global.css         # Komponent-Styles, Utility-Klassen
    ├── fonts.css          # @font-face Deklarationen
    └── themes/
        ├── default.css    # Standard-Theme (primary=orange, secondary=cyan)
        ├── deep-bass.css  # Navy/Blau
        ├── electric-night.css  # Purple/Pink/Neon
        └── golden-hour.css     # Amber/Gold/terrakotta
```

---

## URLs

| Pfad | Seite |
|------|-------|
| / | Startseite |
| /djhulk-electronic-music | DJ Hulk |
| /dj/videos | Videos |
| /dj/mixes | Mixes (pagiert) |
| /dj/mixes/[n] | Single Mix mit Tracklist |
| /dj/mixes-all | Alle Mixes |
| /dj/mixes-blog-archive | Mixes Blog-Archiv |
| /dj/em3f | Festival Fotos |
| /vermietung | Vermietung Landingpage (Verweis → soundundlicht-stuttgart.de) |
| /work | Work/Research |
| /links | Links |
| /impressum | Impressum |

---

## CSS-Theme-System

### Struktur

- **`fonts.css`** — Separates File für `@font-face` Deklarationen (self-hosted Josefin Sans)
- **`themes/*.css`** — Jedes Theme definiert einen `@theme {}` Block mit allen Custom Properties:
  - Farben: `--color-*` (bg, surface, primary, secondary, accent, text, border)
  - Fonts: `--font-heading`, `--font-body`
- **`global.css`** — Importiert Tailwind + Fonts + aktives Theme + alle Component-Klassen

### Theme-Wechsel

Über URL-Parameter: `?theme=deep-bass`, `?theme=electric-night`, `?theme=golden-hour`

Das Script in `Layout.astro` setzt synchron vor dem ersten Paint `data-theme` auf `<html>`.
Ein Fallback-`<style>` Block definiert die CSS-Vars für alle Alternativ-Themes.

### Farbverarbeitung

Statt hartcodierter `rgba()`-Werte wird durchgängig `color-mix()` verwendet:
```css
box-shadow: 0 0 30px color-mix(in srgb, var(--color-primary) 30%, transparent);
```
Dadurch sind alle Schatten, Glows und Overlays automatisch theme-kompatibel.

---

## Farbschema (default Theme)

| Variable | Farbe | Rolle |
|---|---|---|
| `--color-primary` | <span style="display:inline-block;width:12px;height:12px;background:#f97316;border-radius:2px;"></span> `#f97316` Orange | Primäre CTA (Buttons, Badges, Scrollbar) |
| `--color-primary-hover` | <span style="display:inline-block;width:12px;height:12px;background:#fb923c;border-radius:2px;"></span> `#fb923c` Helles Orange | Button-Hover, Akzente |
| `--color-secondary` | <span style="display:inline-block;width:12px;height:12px;background:#0891b2;border-radius:2px;"></span> `#0891b2` Cyan | Sekundäre Akzente (Tags, Nav-Links) |
| `--color-secondary-hover` | <span style="display:inline-block;width:12px;height:12px;background:#22d3ee;border-radius:2px;"></span> `#22d3ee` Helles Cyan | Hover-States |
| `--color-accent` | <span style="display:inline-block;width:12px;height:12px;background:#818cf8;border-radius:2px;"></span> `#818cf8` Indigo | Gradient-Partner, Secondary-Buttons |
| `--color-bg` | <span style="display:inline-block;width:12px;height:12px;background:#0a0a0f;border-radius:2px;border:1px solid #333;"></span> `#0a0a0f` Dunkel | Hintergrund |
| `--color-surface` | <span style="display:inline-block;width:12px;height:12px;background:#12121a;border-radius:2px;border:1px solid #333;"></span> `#12121a` Dunkelgrau | Karten, Sektionen |
| `--color-surface-hover` | <span style="display:inline-block;width:12px;height:12px;background:#1a1a25;border-radius:2px;border:1px solid #333;"></span> `#1a1a25` | Hover auf Cards |
| `--color-text` | <span style="display:inline-block;width:12px;height:12px;background:#f8fafc;border-radius:2px;"></span> `#f8fafc` Weiß | Text |
| `--color-text-muted` | <span style="display:inline-block;width:12px;height:12px;background:#94a3b8;border-radius:2px;"></span> `#94a3b8` Graublau | Nebenfarbe |
| `--color-border` | <span style="display:inline-block;width:12px;height:12px;background:#1e1e2e;border-radius:2px;border:1px solid #333;"></span> `#1e1e2e` | Rahmen |

### Alternativ-Themes

| Theme | Stimmung | URL |
|---|---|---|
| `deep-bass` | <span style="display:inline-block;width:12px;height:12px;background:#2563eb;border-radius:2px;"></span> Kühl, Navy/Blau, professionell | `?theme=deep-bass` |
| `electric-night` | <span style="display:inline-block;width:12px;height:12px;background:#a855f7;border-radius:2px;"></span> Neon, Purple/Pink, clubartig | `?theme=electric-night` |
| `golden-hour` | <span style="display:inline-block;width:12px;height:12px;background:#f59e0b;border-radius:2px;"></span> Warm, Amber/Gold, elegant | `?theme=golden-hour` |

### Inline-Stile

Statische Inline-`style`-Attribute werden vermieden. Alle Farben, Schatten und
Gradienten referenzieren `var(--color-*)` via Tailwind-Arbitrary-Values oder
CSS-Klassen. Dynamische Styles (Brand-Farben auf Links-Seite, Pagination)
bleiben als Ausnahme erhalten.

---

## Animation-Klassen

- `.animate-on-scroll` – Fade-In bei Scroll (IntersectionObserver)
- `.gradient-text` – Orange→Cyan Text-Gradient
- `.event-card-glow` – Hover-Glow auf Event-Karten
- `prefers-reduced-motion` in global.css unterstützt

---

## Bildkonventionen

- **Format**: WebP primär
- **Hero**: `public/img/header.webp` (1920px)
- **Tracklists**: `public/tracklists/<name>.webp` (600px)
- **Events/Galerie**: `public/img/events/<name>.webp`
- **Batch-Konvertierung**: `node scripts/create-webp.mjs -w <px> <datei>`
- **Optimierung**: `node scripts/optimize-images.mjs` (CLI: `-w`, `-q`, `--concurrency`)

---

## Hero-Overlays

Hero-Bereiche nutzen einen mehrschichtigen Gradient:

1. **Linearer Gradient** von oben links (dunkel für Textlesbarkeit) → transparent
2. **Radialer Glow** in der linken unteren Ecke (`--color-primary` = orange)
3. **Radialer Glow** in der rechten oberen Ecke (`--color-secondary` = cyan)
4. **Kein Base-Layer** — das Hintergrundbild bleibt weitgehend sichtbar

Zwei Varianten: `.hero-overlay` (default) und `.hero-overlay-secondary`
(tauscht primary/secondary Glow-Positionen).

---

## Barrierefreiheit

- `prefers-reduced-motion` bei allen Animationen
- Bilder mit alt-Text
- Farben nicht als einziges Mittel zur Informationsvermittlung

---

## Build-Skripte

```bash
pnpm run dev        # Development
pnpm run lint      # ESLint
pnpm run build     # Production (nur Astro, schnell)
pnpm run build:seo  # RSS + Sitemap generieren
pnpm run preview   # Preview
```

---

## SEO

- JSON-LD: LocalBusiness, Person, WebPage, FAQPage (Index), VideoObject (8 Videos), Blog + BlogPosting (Mixes-Übersicht), AudioObject + BreadcrumbList (Mix-Detailseiten)
- Open Graph Tags
- Sitemap + RSS Feed
- robots.txt erweitert für AI-Crawler

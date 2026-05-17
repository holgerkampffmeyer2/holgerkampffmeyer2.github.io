# DJ Hulk Website - Konzept & Struktur

> **Quick-Start:** Siehe AGENTS.md

## Technologie-Stack

- **Framework:** Astro 6.x (Static Site Generation)
- **Styling:** Tailwind CSS 4.x + CSS Custom Properties (Theme-System)
- **Deployment:** GitHub Pages

---

## Projektstruktur

```
src/
├── components/           # UI-Komponenten
├── data/                 # Daten (faqs.ts, mixcloud-data.json)
├── layouts/             # Layouts (Layout.astro)
├── lib/                 # Utilities (faqUtils.ts)
├── pages/               # Routen
│   ├── index.astro      # Startseite
│   ├── djhulk-electronic-music.astro
│   ├── dj/
│   │   ├── videos.astro
│   │   ├── mixes.astro, mixes/[n].astro, mixes-all.astro
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

### farbverarbeitung

Statt hartcodierter `rgba()`-Werte wird durchgängig `color-mix()` verwendet:
```css
box-shadow: 0 0 30px color-mix(in srgb, var(--color-primary) 30%, transparent);
```
Dadurch sind alle Schatten, Glows und Overlays automatisch theme-kompatibel.

---

## Farbschema (default Theme)

| Variable | Farbe | Rolle |
|---|---|---|
| `--color-primary` | `#f97316` Orange | Primäre CTA (Buttons, Badges, Scrollbar) |
| `--color-primary-hover` | `#fb923c` Helles Orange | Button-Hover, Akzente |
| `--color-secondary` | `#0891b2` Cyan | Sekundäre Akzente (Tags, Nav-Links) |
| `--color-secondary-hover` | `#22d3ee` Helles Cyan | Hover-States |
| `--color-accent` | `#818cf8` Indigo | Gradient-Partner, Secondary-Buttons |
| `--color-bg` | `#0a0a0f` Dunkel | Hintergrund |
| `--color-surface` | `#12121a` Dunkelgrau | Karten, Sektionen |
| `--color-surface-hover` | `#1a1a25` | Hover auf Cards |
| `--color-text` | `#f8fafc` Weiß | Text |
| `--color-text-muted` | `#94a3b8` Graublau | Nebenfarbe |
| `--color-border` | `#1e1e2e` | Rahmen |

### Alternativ-Themes

| Theme | Stimmung | URL |
|---|---|---|
| `deep-bass` | Kühl, Navy/Blau, professionell | `?theme=deep-bass` |
| `electric-night` | Neon, Purple/Pink, clubartig | `?theme=electric-night` |
| `golden-hour` | Warm, Amber/Gold, elegant | `?theme=golden-hour` |

### Inline-Stile

Statische Inline-`style`-Attribute werden vermieden. Alle Farben, Schatten und
Gradienten referenzieren `var(--color-*)` via Tailwind-Arbitrary-Values oder
CSS-Klassen. Dynamische Styles (Brand-Farben auf Links-Seite, Pagination)
bleiben als Ausnahme erhalten.

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

- JSON-LD: LocalBusiness, Person, FAQPage
- Open Graph Tags
- Sitemap + RSS Feed
- robots.txt erweitert für AI-Crawler
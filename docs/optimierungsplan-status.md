# Astro-Optimierungsplan – Status

> Plan basierend auf soundundlicht-stuttgart.de/docs/astro-optimizerungen.md

## Phase 1: Image Optimization (astro:assets) ✅

### 1A: Config + Quick Wins ✅
- `astro.config.mjs`: Image Service Config (webp effort:6, avif effort:4)
- `tsconfig.json`: Path Aliases (`@assets/*`, `@components/*`, `@lib/*`, `@data/*`)
- `Hero.astro`: `loading="eager"` + `fetchpriority="high"` ergänzt
- `links.astro`: `fetchpriority="high"` ergänzt

### 1B: Hero/HeroSlider mit astro:assets ✅
- Hero + HeroSlider: `backgroundImage` akzeptiert `ImageMetadata | string`
- Bei `ImageMetadata`: Rendert `<Picture>` mit AVIF/WebP
- Bei `string`: Fallback zu `<img>` mit LCP-Attributen
- **8 Pages umgestellt**: djhulk-electronic-music, mixes-all, em3f, videos, work, impressum, index (HeroSlider + 5 statische), links

### 1C: Statische `<img>` → `<Picture>` ✅
| Datei | Bilder | Format |
|-------|--------|--------|
| Navbar.astro | Logo | AVIF + WebP |
| index.astro | 5 (DJ-Profil, Mix-Tracklists, Open Source) | AVIF + WebP |
| links.astro | Profilbild | AVIF + WebP |
| djhulk-electronic-music.astro | 3 (DJ-Fotos, Urkunde) | AVIF + WebP |

**Ergebnis:** 18 `<img>`-Tags durch `<Picture>` ersetzt, 139 optimierte AVIF/WebP/Png-Varianten generiert.

### Optional: Dynamische Bilder (Events, Tracklists) ✅
- `events.ts` (8 Event-Bilder), `blog-posts.json` (32 Tracklists), `open-source-projects.json` (4 Projekte)
- **Alle 12 referenzierten WebP-Bilder existieren auf Disk** — bestätigt
- `<img>`-Tags in dynamischen Komponenten bereits optimiert: `loading="lazy"`, `decoding="async"`, `object-cover`, explizite width/height
- `scripts/optimize-images.mjs`: Auch `public/assets/` eingebunden (vorher nur `public/img` + `public/tracklists`)
- Beispiel: 2 zuvor fehlende WebP-Varianten konvertiert (EM3F 2024, Poster 20 Jahre Propp)
- **Build-Pipeline**: `"build:images"` Skript + in `"build:full"` integriert (vor astro build)

## Phase 2: View Transitions ✅

### CSS-only (0KB JS)
- `@view-transition { navigation: auto; }` in global.css (`src/styles/global.css:3`)
- **Erledigt**

## Phase 3: Content Collections ❌
Nicht priorisiert — Datenmodell zu klein für Zod-Validierung.

## Phase 4: Inline-Script auslagern ❌
Kein Bedarf — keine großen Inline-Scripts vorhanden.

## Phase 5: Config Feintuning ✅ 
- `image.service.config` ✅
- Path Aliases ✅
- `compressHTML`: Astro 7 default ist `compressHTML: 'jsx'` — keine explizite Config nötig ✅
- `scripts/optimize-images.mjs`: `public/assets/` zu default dirs hinzugefügt ✅
- `package.json`: `"build:images"` Script + Integration in `"build:full"` ✅

## Phase 6: Build-Optimierung & Dead Code ✅

### 6A: Unused Dependencies entfernen ✅
- `@fontsource-variable/josefin-sans` entfernt (Font wird via `@font-face` geladen)
- `@fontsource/play` entfernt (wurde nirgendwo verwendet)
- **Impact:** Cleaner node_modules, schnellere CI-Installs

### 6B: JPG/PNG Originals aus public/ aufräumen ✅
- 12 JPG/PNG-Dateien (~10MB) entfernt
  - 10 nicht referenzierte JPGs (hatten WebP-Gegenstück, aber nur WebP in `src/` genutzt)
  - 2 orphaned Dateien (abweichende Namenskonvention in events/)
- 9 dazugehörige WebP-Dateien (ebenfalls nicht referenziert) entfernt
- **Referenz-Check:** Alle referenzierten Dateien (35 JPGs) wurden behalten
- **Impact:** ~12MB weniger im Build-Output, saubereres `public/img/`

### 6C: public/og/ alte Mix-OG-Bilder ❌
- **Geprüft:** Alle 103 OG-Bilder werden via `blog-posts.json[].ogImage` referenziert
- Keine Löschung nötig

## Phase 7: Performance-Optimierung ✅

### 7A: preconnect für externe Origins ✅
- `mixcloud.com`, `youtube.com`, `google.com` — jeweils `preconnect` + `dns-prefetch`
- Eingebaut in `src/layouts/Layout.astro:162-168`

### 7B: CSS Bundle verkleinern ❌
- Aktuell 52KB CSS-Bundle
- Tailwind 4 JIT sollte purgen, aber Prüfung auf Overhead sinnvoll

## Phase 8: Code-Qualität ❌

### 8A: 33 Icon-Komponenten konsolidieren ❌
- Jedes Icon ist eine eigene `.astro`-Datei
- Könnte in eine einzige `Icon.astro`-Komponente mit `name`-Prop merged werden
- **Impact:** Weniger Dateien, einfachere Imports

## Phase 9: Build-Output verkleinern ❌

### 9A: Build-Größe analysieren ❌
- **~58MB gesamt** (nach Phase-6-Bereinigung)
- Größter Treiber: astro:assets generiert viele Varianten pro Bild
- **Prüfen:** Sind alle Bildvarianten nötig? `widths`-Angaben optimieren?

## Phase 10: Redirect-Korrektur ✅

### 10A: /dj/mixes/ Redirect gefixt ✅
- **Problem:** `/dj/mixes/` → `/dj/mixes-all` leitete Weekly Mixes fälschlich auf All Mixes um
- **Ursache:** Redirect erzeugte `dist/dj/mixes/index.html` als Redirect-Seite, die die eigentliche Seite überschrieb
- **Fix:** Beide problematischen Redirects entfernt:
  - `/dj/mixes/` → `/dj/mixes-all` ❌ entfernt (war der Fehler)
  - `/dj/mixes/` → `/dj/mixes` ❌ entfernt (erzeugte self-redirect-Konflikt)
  - `/dj/mixes.html` → `/dj/mixes-all` ❌ entfernt (Verzeichnis/Datei-Konflikt)
- **Lösung:** `trailingSlash: 'never'` kümmert sich automatisch um Slash-Handling
- **Build:** 36 pages (vorher 35) — Weekly Mixes jetzt korrekt generiert

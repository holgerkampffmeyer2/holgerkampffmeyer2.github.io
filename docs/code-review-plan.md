# Code-Review Umsetzungsplan

Basierend auf dem Code-Review vom 07.07.2026.

## P1 — Kritisch (SEO)

### 1.1 JSON-LD Redundanz beheben (`index.astro`)
- `noSiteJsonLd` entfernen → Layout liefert LocalBusiness + SiteNavigation + WebPage
- Eigene duplicate LocalBusiness-Blöcke aus `jsonLd`-Array entfernen
- Nur BreadcrumbList + FAQ + ggf. Person-Schema behalten

### 1.2 JSON-LD auf Mix-Seiten (`[number].astro`, `mixes-weekly.astro`)
- `noSiteJsonLd` entfernen → Layout liefert WebPage + LocalBusiness + SiteNavigation
- Eigene LocalBusiness-Blöcke aus `jsonLd` entfernen
- `Blog`-Schema in `mixes-weekly.astro` durch valides Schema ersetzen

## P2 — Code-Qualität

### 2.1 `USECASE_CONFIG` zentralisieren
- Neue Datei `src/data/usecase-config.ts`
- Aus allen Komponenten importieren statt duplizieren
- Farben in `BlogPost.astro` vereinheitlichen (alle auf `primary`)

### 2.2 `extractMixNumber`-Alias entfernen (`fetch-mixcloud.mjs`)
- `const getMixNumber = extractMixNumber` löschen, direkt `extractMixNumber` verwenden

### 2.3 Event-Carousel optimieren (`djhulk-electronic-music.astro`)
- `[...events, ...events, ...events]` durch smarteres Infinite-Scroll ersetzen (JS klont beim Scrollen)

### 2.4 `any[]` in `mixes-blog-archive.astro` typisieren

## P3 — Accessibility

### 3.1 `<main>`-Landmark in Layout.astro einfügen
- `<main id="main-content" tabindex="-1">` um `<slot />` herum

### 3.2 Fehlendes `title` auf Google-Maps-Iframe (`impressum.astro`)

## P4 — Cleanup

### 4.1 Redirects in `astro.config.mjs` formatieren
### 4.2 Veraltete Testdateien im Root aufräumen

---

## Umsetzungsreihenfolge

1. `src/data/usecase-config.ts` anlegen
2. `src/components/BlogPost.astro` — USECASE_CONFIG durch Import ersetzen
3. `src/components/dj/MixDetail.astro` — USECASE_CONFIG durch Import ersetzen
4. `src/pages/dj/mixes-weekly.astro` — USECASE_CONFIG durch Import ersetzen
5. `src/pages/dj/mixes-blog-archive.astro` — USECASE_CONFIG durch Import ersetzen + `any[]` fix
6. `src/pages/djhulk-electronic-music.astro` — USECASE_CONFIG durch Import ersetzen
7. `src/layouts/Layout.astro` — `<main>`-Landmark + `skip-link`
8. `src/pages/index.astro` — JSON-LD deduplizieren
9. `src/pages/dj/mixes/[number].astro` — JSON-LD deduplizieren
10. `src/pages/dj/mixes-weekly.astro` — JSON-LD deduplizieren + Blog-Schema fixen
11. `scripts/fetch-mixcloud.mjs` — `getMixNumber`-Alias entfernen
12. `src/pages/djhulk-electronic-music.astro` — Event-Carousel optimieren
13. `src/pages/impressum.astro` — iframe `title` fix
14. `astro.config.mjs` — Redirects formatieren
15. Veraltete Testdateien verschieben/löschen

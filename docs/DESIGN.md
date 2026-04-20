# DJ Hulk Website - Konzept & Struktur

> **Quick-Start:** Siehe AGENTS.md

## Technologie-Stack

- **Framework:** Astro 6.x (Static Site Generation)
- **Styling:** Tailwind CSS 4.x
- **Deployment:** GitHub Pages

---

## Projektstruktur

```
src/
├── components/           # UI-Komponenten
│   └── vermietung/       # Vermietung-spezifisch
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
│   ├── vermietung.astro
│   ├── vermietung/       # 8 Detailseiten
│   ├── work.astro
│   ├── links.astro
│   └── impressum.astro
└── styles/global.css
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
| /vermietung | Vermietung Übersicht |
| /vermietung/\<produkt\> | 8 Detailseiten |
| /work | Work/Research |
| /links | Links |
| /impressum | Impressum |

---

## Build-Skripte

```bash
npm run dev        # Development
npm run lint      # ESLint
npm run build     # Production (RSS + Sitemap)
npm run preview   # Preview
```

---

## Farbschema

- **Primary:** Orange (#f97316)
- **Secondary:** Cyan (#22d3ee)
- **Background:** Dunkel (#0a0a0f)
- **Surface:** (#16161a)
- **Text:** Hell (#e5e5e5)

---

## SEO

- JSON-LD: LocalBusiness, Person, FAQPage
- Open Graph Tags
- Sitemap + RSS Feed
- robots.txt erweitert für AI-Crawler
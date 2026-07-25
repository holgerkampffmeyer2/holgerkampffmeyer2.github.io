# Design: Baseline Feature Architecture

## Architecture Overview
The project is built as a static site generated (SSG) web application using Astro 6/7 and Tailwind CSS 4, optimized for high performance, SEO, and low maintenance.

```
┌─────────────────────────────────────────────────────────────────┐
│                      Astro SSG Build Core                       │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
        ┌────────▼────────┐             ┌────────▼────────┐
        │  Content & Data │             │ Build Automations│
        │  - Mixcloud API │             │ - Sharp Images  │
        │  - JSON Stores  │             │ - RSS / Urllist │
        └────────┬────────┘             │ - IndexNow Ping │
                 │                      └─────────────────┘
        ┌────────▼────────┐
        │  Rendered Pages │
        │  - Index / Home │
        │  - Mix Details  │
        │  - Blog Archive │
        │  - Vermietung   │
        └─────────────────┘
```

## Key Technical Decisions
1. **Static Site Generation (SSG):** Fast loading, excellent Core Web Vitals, secure, easy deployment.
2. **Tailwind CSS 4 + Themes:** Custom CSS variables for flexible color schemes (*Default*, *Deep Bass*, *Electric Night*, *Golden Hour*).
3. **Structured Data (JSON-LD):** Automated schema generation (`AudioObject`, `BlogPosting`, `BreadcrumbList`) for maximum search engine visibility.
4. **Automated Scripts:** Node.js CLI scripts for fetching Mixcloud sets, optimizing images to WebP, generating RSS/sitemaps, and submitting to IndexNow.

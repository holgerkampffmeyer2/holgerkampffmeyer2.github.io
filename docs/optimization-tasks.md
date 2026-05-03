# Website Optimization Tasks

**Projekt:** DJ & Lichttechnik Website - holger-kampffmeyer.de  
**Stand:** 2026-05-03  
**Status:** TODO

---

## 🚀 Priority 1: High Impact, Low Effort

### 1.1 Image Lazy-Loading Implementation
**Status:** ⬜ TODO  
**Impact:** High - Reduces initial page load time  
**Effort:** Low (15 min)

**Problem:** Many images in rental galleries and hero sliders load simultaneously

**Solution:**
```html
<!-- Instead of direct src -->
<img src="/img/vermietung/ldmaui3.webp" loading="lazy" alt="LD Maui 28 G3">

<!-- For Hero Slider: Only first slide loads immediately -->
<img 
  src="/img/header.webp" 
  loading="eager" 
  alt="Hero"
>
<!-- Other slides: loading="lazy" -->
```

**Files to update:**
- `src/pages/vermietung/*.astro` (all rental pages)
- `src/pages/index.astro` (hero slider)
- `src/pages/dj/mixes-all.astro` (mix grid)

---

### 1.2 Font Loading Optimization
**Status:** ⬜ TODO  
**Impact:** High - Prevents render blocking  
**Effort:** Low (20 min)

**Problem:** Google Fonts block rendering

**Solution:** Add `display=swap` to font imports in `src/styles/global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&family=Play:wght@400;500;600&display=swap');

/* Alternative: Self-host with @fontsource */
/* pnpm add @fontsource-variable/josefin-sans @fontsource-variable/play */
```

**Bonus:** Add `font-display: optional` for less critical font weights

---

### 1.3 JavaScript Deferring
**Status:** ⬜ TODO  
**Impact:** Medium - Improves parsing speed  
**Effort:** Low (15 min)

**Problem:** Inline scripts block HTML parsing

**Solution:** Move pagination/animation logic to external JS files with `defer`:
```html
<script src="/assets/pagination.js" defer></script>
```

**Files to update:**
- `src/pages/dj/mixes-all.astro`
- `src/pages/dj/mixes-blog-archive.astro`

---

## ⚡ Priority 2: Medium Impact, Medium Effort

### 2.1 Astro Image Component
**Status:** ⬜ TODO  
**Impact:** High - Automatic responsive images, modern formats  
**Effort:** Medium (1-2 hours)

**Problem:** Manual WebP conversion in scripts

**Solution:** Replace manual `<img>` with Astro's `<Image>`:
```astro
---
import { Image } from 'astro:assets';
---
<Image 
  src="/img/vermietung/ldmaui3.webp" 
  alt="LD Maui 28 G3" 
  widths={[400, 800, 1200]} 
  formats={['webp', 'avif']} 
/>
```

**Benefits:**
- Automatic responsive `srcset`
- Modern formats (AVIF/WebP)
- CLS prevention with automatic dimensions

**Files to update:**
- All `src/pages/vermietung/*.astro`
- `src/pages/dj/**/*.astro`

---

### 2.2 Animation Optimization (Intersection Observer)
**Status:** ⬜ TODO  
**Impact:** Medium - Reduces layout thrashing  
**Effort:** Medium (1 hour)

**Problem:** Scroll event listeners cause layout thrashing

**Solution:** Replace scroll listeners with Intersection Observer:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

**File:** `src/styles/global.css` - update `.animate-on-scroll` logic

---

### 2.3 Critical CSS Extraction
**Status:** ⬜ TODO  
**Impact:** Medium - Faster first paint  
**Effort:** Medium (1-2 hours)

**Problem:** Large `global.css` blocks first rendering

**Solution:**
1. Extract Above-the-Fold CSS (Hero, Navigation)
2. Inline critical CSS in `<head>`
3. Load rest asynchronously:

```html
<style>
  /* Critical CSS for Hero + Nav */
</style>
<link rel="stylesheet" href="/styles/global.css" media="print" onload="this.media='all'">
```

---

## 🔧 Priority 3: Lower Impact, Architectural Changes

### 3.1 Build Process Integration
**Status:** ⬜ TODO  
**Impact:** Low-Medium - Automated updates  
**Effort:** High (2-3 hours)

**Problem:** Custom scripts for sitemap/RSS

**Solution:** Consider `@astrojs/sitemap` + `@astrojs/rss`

**Pros:**
- Runs during build, knows all routes
- Automatic updates

**Cons:**
- Less control over complex logic (mix priorities)
- Would need to refactor custom priority logic

**Recommendation:** Keep custom scripts (better for your use case)

---

### 3.2 Performance Budget Establishment
**Status:** ⬜ TODO  
**Impact:** Low (monitoring)  
**Effort:** Low (30 min)

**Target values for good UX:**
- LCP < 2.5s
- FID < 100ms  
- CLS < 0.1
- TTI < 3.8s

**Tools:**
- Lighthouse CI in GitHub Actions
- Web Vitals extension
- Chrome UX Report

---

## 📱 Mobile-First Optimizations

### 4.1 Touch Target Sizes
**Status:** ⬜ TODO  
**Impact:** Medium - Better mobile UX  
**Effort:** Low (20 min)

**Problem:** Small touch targets in filters/pagination

**Solution:** Ensure interactive elements are at least 44x44px:
```html
<button 
  class="w-10 h-10 min-w-[44px] min-h-[44px] ..."
>
```

**Files to check:**
- `src/pages/dj/mixes-all.astro` (pagination)
- `src/pages/dj/mixes-blog-archive.astro` (filter buttons)

---

### 4.2 Avoid Layout Shift
**Status:** ⬜ TODO  
**Impact:** High - Better CLS score  
**Effort:** Low (20 min)

**Problem:** Images without dimensions cause CLS

**Solution:** Always set `width` and `height` attributes or use `aspect-ratio`:
```html
<img 
  src="/img/vermietung/ldmaui3.webp" 
  width="800" 
  height="600" 
  loading="lazy"
  alt="LD Maui 28 G3"
>
```

---

## 📊 Special Observations

### Current Strengths ✅
- Excellent use of CSS variables for color management
- Good component-based architecture with Tailwind
- Clean separation of structure (Astro), style (Tailwind/CSS), and behavior (JS)
- Consistent use of `@theme` tokens in Tailwind v4

### Optimization Potential
Main improvements lie in:
1. **Resource loading** (images, fonts, JS)
2. **Rendering path** (reduce blocking resources)
3. **Client-side performance** (JS efficiency, animations)

---

## 🎯 Quick Wins Checklist

- [ ] Add `loading="lazy"` to all non-hero images
- [ ] Add `display=swap` to Google Font imports
- [ ] Defer non-critical JavaScript
- [ ] Ensure all images have width/height or aspect-ratio
- [ ] Check touch targets are minimum 44x44px
- [ ] Test with Lighthouse (aim for 90+ scores)
- [ ] Validate JSON-LD schemas (already done ✅)

---

## 📝 Notes

- Priority 1 tasks can be done in ~1 hour total
- Priority 2 tasks require more testing
- Priority 3 tasks are architectural - consider carefully before refactoring
- Current setup is solid - these are incremental improvements
- Focus on mobile performance (your target audience books events on mobile)

**Next session:** Start with Priority 1.1 (Image Lazy-Loading) - biggest impact for least effort.

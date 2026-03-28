# Portfolio Improvements Design
**Date:** 2026-03-28
**Project:** nano-banana-portfolio
**Status:** Approved

---

## Goal

Five focused improvements to the portfolio:
1. Refactor `page.tsx` into section components (maintainability)
2. Responsive design (execute existing spec)
3. `prefers-reduced-motion` support (accessibility)
4. SEO — Full tier (metadata, JSON-LD, OG image, sitemap, robots)
5. Performance — known optimizations without Lighthouse audit

---

## Implementation Approach: Layer B

Work in three layers so each layer builds cleanly on the previous:

- **Layer 1 (Structural):** `page.tsx` refactor → enables better code splitting
- **Layer 2 (Cross-cutting):** Responsive design + prefers-reduced-motion → both touch same components
- **Layer 3 (Additive):** SEO + performance → mostly new files, minimal changes to existing

---

## Layer 1 — page.tsx Refactor

### Problem
`page.tsx` is 1756 lines. All 10 sections, all imports, and all GSAP setup live in one file. This makes every subsequent improvement harder to apply cleanly.

### Solution
Extract each section into its own component in `src/components/sections/`.

### Section Map

| Component File | Section | Original Lines |
|---------------|---------|----------------|
| `IntroSection.tsx` | VOID / INTRO | 143–239 |
| `OriginSection.tsx` | ORIGIN / CHAPTER 1 | 240–403 |
| `GrowthSection.tsx` | GROWTH / CHAPTER 2 | 404–580 |
| `SelectedWorksSection.tsx` | SELECTED WORKS | 581–635 |
| `ManifestoSection.tsx` | MANIFESTO | 636–804 |
| `FoundFootageSection.tsx` | FOUND FOOTAGE / VHS | 805–971 |
| `MasterySection.tsx` | MASTERY / CHAPTER 3 | 972–1218 |
| `ProcessSection.tsx` | PROCESS / KITCHEN SINK | 1219–1483 |
| `TestimonialsSection.tsx` | TESTIMONIALS / MEMO BOARD | 1484–1575 |
| `VisionSection.tsx` | VISION / CHAPTER 4 | 1576–end |

### What Stays in page.tsx
- `mainRef` and global GSAP setup (progress bar, reveal-text ScrollTrigger)
- Global overlays: `ParticleField`, `GrainOverlay`, `CursorTrail`, `AmbientSound`, `ScannerEffect`, `LoadingScreen`, `TimeAwareTheme`
- Scroll progress bar UI
- `gsap.registerPlugin(ScrollTrigger)`

### What Moves to Section Components
- All JSX markup for that section
- Refs used only within that section (e.g. `nameRef`, `subtitleRef`, `scrollIndicatorRef` → `IntroSection`)
- Imports used only by that section
- Section-specific GSAP animations (name entrance, subtitle fade, scroll indicator → `IntroSection`)

### Result
`page.tsx` becomes ~60 lines — global setup + 10 section component calls.

---

## Layer 2 — Responsive Design

Follows the approved spec at `docs/superpowers/specs/2026-03-21-responsive-design.md` exactly. No design changes needed.

### Files Modified

| File | Changes |
|------|---------|
| `src/hooks/useMediaQuery.ts` | **New** — `isMobile`, `isTablet`, `isDesktop` hook |
| `src/app/page.tsx` | Section heights conditional on breakpoint, `ScrollTrigger.refresh()` after `isMobile` resolves |
| `src/components/CursorTrail.tsx` | Render `null` on `(pointer: coarse)` devices |
| `src/components/MousePhysics.tsx` | Add `touchstart`/`touchmove`/`touchend` event support |
| `src/components/MemoBoard.tsx` | Mobile positions for SEED_CARDS, 2-col layout algorithm for API notes |

---

## Layer 2 — prefers-reduced-motion

### Hook

**New file:** `src/hooks/useReducedMotion.ts`

```ts
import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}
```

### Behavior Per Component

Philosophy: **content stays, motion intensity is reduced — not eliminated.**

| Component | Normal | Reduced Motion |
|-----------|--------|----------------|
| GSAP name entrance | 3D flip + stagger | Fade in, no rotation, no stagger |
| GSAP scroll animations | Blur + y-translate | Fade only, no translation |
| `ParticleField` | 1500 moving particles | 500 particles, near-zero velocity |
| `ScannerEffect` | Animated scan line | Render null |
| `CollageElement` | Parallax + magnetic hover | Static position, no parallax, no magnetic |
| `MousePhysics` | Full spring physics | Renders children without physics wrapper |
| `CursorTrail` | Trailing particles | Render null |
| `GrainOverlay` | Animated grain | Keep (static texture, not motion) |
| `DioramaLayer` | Parallax scroll depth | No parallax (speed=0) |

### GSAP Integration

Pass `prefersReducedMotion` boolean to GSAP calls:
```ts
gsap.fromTo(letters,
  { opacity: 0, ...(prefersReducedMotion ? {} : { y: 100, rotateX: -90 }) },
  {
    opacity: 1,
    ...(prefersReducedMotion ? {} : { y: 0, rotateX: 0 }),
    duration: prefersReducedMotion ? 0.3 : 1.2,
    stagger: prefersReducedMotion ? 0 : 0.05,
  }
)
```

---

## Layer 3 — SEO

### Domain Config

Single source of truth at top of `layout.tsx`:
```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andhiekaagrestya.netlify.app'
```

When switching to custom domain: set `NEXT_PUBLIC_SITE_URL=https://andhiekaagrestya.com` in environment.

### Files

**`src/app/layout.tsx` — update existing metadata:**
- Add `metadataBase: new URL(SITE_URL)` — required for Next.js to resolve relative OG image URLs
- Add `openGraph.url` and `openGraph.images`
- Add `twitter.images`
- Add JSON-LD Person schema as `<script type="application/ld+json">` in `<head>`
- Update title to reflect "Software Engineer" positioning

**JSON-LD Person Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Andhieka Agrestya",
  "jobTitle": "Software Engineer",
  "url": "SITE_URL",
  "sameAs": [
    "https://github.com/andhiekaagrestya",
    "https://linkedin.com/in/andhiekaagrestya"
  ]
}
```

**`src/app/opengraph-image.tsx` — dynamic OG image:**
- Uses Next.js `ImageResponse` from `next/og`
- Layout: dark background (#1a1409), logo.png left, name + "Software Engineer" right, domain bottom
- Size: 1200×630px (standard OG)
- Font: matches portfolio (Playfair Display for name, mono for title)

**`src/app/sitemap.ts`:**
- Single entry: `{ url: SITE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }`

**`src/app/robots.ts`:**
- Allow all crawlers
- Point sitemap to `${SITE_URL}/sitemap.xml`

### Note on GitHub/LinkedIn URLs
Placeholder `andhiekaagrestya` used for sameAs — confirm actual handles before finalizing.

---

## Layer 3 — Performance

### Known Optimizations

| Issue | Fix | File |
|-------|-----|------|
| Google Fonts `display=swap` | Already present — no change needed | `layout.tsx` |
| No `sizes` prop on `CollageElement` images | Add `sizes="(max-width: 768px) 45vw, 22vw"` | `CollageElement.tsx` |
| `TapeRoll3D` 3D model no suspense fallback | Wrap in `<Suspense fallback={null}>` | Usage sites in section components |
| `page.tsx` single large bundle | Solved by Layer 1 refactor — Next.js auto-splits per component | — |
| No explicit `width`/`height` on some images | Audit during Layer 1 refactor — fix any found | Section components |

---

## Files Created / Modified Summary

### New Files
- `src/hooks/useMediaQuery.ts`
- `src/hooks/useReducedMotion.ts`
- `src/components/sections/IntroSection.tsx`
- `src/components/sections/OriginSection.tsx`
- `src/components/sections/GrowthSection.tsx`
- `src/components/sections/SelectedWorksSection.tsx`
- `src/components/sections/ManifestoSection.tsx`
- `src/components/sections/FoundFootageSection.tsx`
- `src/components/sections/MasterySection.tsx`
- `src/components/sections/ProcessSection.tsx`
- `src/components/sections/TestimonialsSection.tsx`
- `src/components/sections/VisionSection.tsx`
- `src/app/opengraph-image.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`

### Modified Files
- `src/app/page.tsx` (stripped to ~60 lines)
- `src/app/layout.tsx` (metadata + JSON-LD)
- `src/components/CursorTrail.tsx`
- `src/components/MousePhysics.tsx`
- `src/components/MemoBoard.tsx`
- `src/components/CollageElement.tsx`
- `src/components/ParticleField.tsx`
- `src/components/ScannerEffect.tsx`
- `src/components/DioramaLayer.tsx`

---

## Success Criteria

- `page.tsx` < 80 lines after refactor
- No horizontal scrollbar at 320px, 768px, 1024px, 1440px
- OG image appears correctly when link shared on WhatsApp/Slack/Twitter
- `sitemap.xml` and `robots.txt` accessible at correct URLs
- JSON-LD Person schema present and valid (testable with Google Rich Results Test)
- With `prefers-reduced-motion` enabled in OS: all content visible, no full-screen motion effects
- `CollageElement` has `sizes` prop on all Next.js Image usages
- `TapeRoll3D` wrapped in `<Suspense>`

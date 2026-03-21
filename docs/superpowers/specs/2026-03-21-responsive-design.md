# Responsive Design Spec
**Date:** 2026-03-21
**Project:** nano-banana-portfolio
**Status:** Approved

---

## Goal

Make the portfolio fully responsive across all breakpoints — mobile (320px+), tablet (768px–1023px), and desktop (1024px+) — while preserving the experimental collage aesthetic, GSAP animations, and interactive physics.

---

## Breakpoints

| Name     | Range          |
|----------|----------------|
| mobile   | < 768px        |
| tablet   | 768px – 1023px |
| desktop  | ≥ 1024px       |

---

## Architecture

### 1. `useMediaQuery` Hook

**File:** `src/hooks/useMediaQuery.ts`

A shared hook that returns the active breakpoint. All components that need behavior differences use this hook — no component duplication.

```ts
const { isMobile, isTablet, isDesktop } = useMediaQuery()
```

Internally uses `window.matchMedia` with SSR-safe fallback (default to `false` on server).

### 2. Two-layer Strategy

- **CSS layer (Tailwind responsive classes):** Handles visual adjustments — font sizes, image sizes, padding, display/hide of decorative elements.
- **JS layer (`useMediaQuery`):** Handles behavioral changes — section heights, touch event activation, MemoBoard initial positions, cursor visibility.

---

## Page Sections (`page.tsx`)

### VOID / Intro

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Height   | 80vh   | 100vh  | 120vh   |

- CollageElement banana-plant and camera: resize and reposition to not overlap the name title on small screens. Use Tailwind `!top-[x%]` overrides.
- Name title already has `text-3xl md:text-7xl` — verify wrapping works down to 320px.

### Chapter 1 — Origin

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Height   | 130vh  | 160vh  | 200vh   |

- CollageElement typewriter and fragments: stack below/beside text, no overlap with main text.
- ScatteredText elements positioned at `right: 15%` or `left: 55%` — adjust so they stay within bounds on mobile.

### Chapter 2 — Growth

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Height   | 140vh  | 180vh  | 220vh   |

- MousePhysics zone: add touch support (see Interactive Components section).
- Physics items: adjust initial positions so they are all visible on mobile.
- CollageElement compass: reduce size on mobile.

### Selected Works / Gallery

- Height: flexible (`auto` / `min-h`) on mobile.
- `PolaroidGallery` already has `min-h-[60vh] md:min-h-[80vh]` — retain.

### Manifesto

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Height   | 120vh  | 150vh  | 180vh   |

- HoverMorphText lines already use `clamp()` for font size — verify positions don't overlap on mobile and adjust `top/left` percentages if needed.

### MemoBoard

- Sticky notes: recalculate initial positions on mobile to prevent overlap (see Interactive Components section).

---

## Interactive Components

### CursorTrail

- Detect touch device via `(pointer: coarse)` media query or `'ontouchstart' in window`.
- On touch device: render `null`. Desktop: unchanged.

### MousePhysics

- Add `touchstart` and `touchmove` event listeners alongside existing `mousemove`.
- Extract coordinates from `event.touches[0].clientX/Y`.
- Physics logic unchanged — only the coordinate source differs.
- Label "PUSH ME AROUND" changes to "TAP ME AROUND" on mobile via `isMobile`.

### MemoBoard Sticky Notes

- Add mobile-specific initial positions (`pos_top_mobile`, `pos_left_mobile`) to each `SEED_CARD` entry — arranged in a loose 3×2 grid to prevent overlap.
- On mobile (`isMobile === true`): use mobile positions as initial render position.
- After user drags, position is free — no constraints.
- Framer Motion `drag` already supports touch natively — no extra work needed.

### AmbientSound

- No changes — already optional and user-triggered.

### ParticleField & GrainOverlay

- Keep on all devices — lightweight and decorative.

### ScannerEffect, DioramaLayer, HandDrawnSVG

- Keep on all devices — verify no horizontal overflow on mobile.

---

## Collage Elements & Scattered Text

**Default strategy:** Reposition to vertical stacking on mobile using Tailwind responsive overrides (`!top-[x%] md:!top-[y%]`).

**Fallback:** If an element still overflows or overlaps unacceptably after repositioning, hide it on mobile with `hidden md:block`.

**Per-element decisions** are made during implementation — hide only as a last resort.

---

## What Will NOT Change

- GSAP animations and ScrollTrigger behavior
- DioramaLayer parallax effect
- Color theme and CSS variables
- All visual effects (grain, vignette, particle field)
- Font choices and typographic hierarchy
- Overall scrapbook / collage aesthetic

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useMediaQuery.ts` | **New file** — shared breakpoint hook |
| `src/app/page.tsx` | Section heights, CollageElement positions, ScatteredText positions |
| `src/components/CursorTrail.tsx` | Render null on touch devices |
| `src/components/MousePhysics.tsx` | Add touch event support |
| `src/components/MemoBoard.tsx` | Mobile initial positions for sticky notes |

---

## Success Criteria

- No horizontal scrollbar on any breakpoint
- Name title readable and non-clipped on 320px wide screens
- CollageElements do not obscure primary content on mobile
- MousePhysics responds to touch on mobile
- MemoBoard notes do not overlap on initial mobile render (but remain draggable)
- All GSAP animations still trigger correctly on scroll on mobile

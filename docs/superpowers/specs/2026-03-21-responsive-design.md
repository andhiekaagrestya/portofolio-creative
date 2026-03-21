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

A shared hook returning `isMobile`, `isTablet`, `isDesktop`.

**SSR / hydration strategy:** Default all values to `false` on initial render (server + first client render). Update to real values inside a `useEffect` after mount. This means the server always renders the desktop layout, avoiding hydration mismatch. Components using hook values for inline `style` heights should tolerate a one-frame flash — acceptable trade-off for SSR safety. Do not use `suppressHydrationWarning`.

```ts
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  const mq = window.matchMedia('(max-width: 767px)')
  setIsMobile(mq.matches)
  const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
  mq.addEventListener('change', handler)
  return () => mq.removeEventListener('change', handler)
}, [])
```

### 2. Two-layer Strategy

- **CSS layer (Tailwind responsive classes):** Handles visual adjustments — font sizes, image sizes, decorative element visibility (`hidden md:block`).
- **JS layer (`useMediaQuery`):** Handles behavioral and layout changes — section heights via conditional inline styles, touch event activation, MemoBoard initial positions, cursor conditional rendering.

**Section heights use the JS layer** (conditional inline `style` props) because the values are too varied to express cleanly as Tailwind classes and the heights have direct behavioral impact on scroll storytelling.

### 3. `overflow-x` Strategy

Apply `overflow-x: hidden` at two levels:
- `<body>` — already has `overflow-x-hidden` class in `layout.tsx`. Verify this is present.
- Per-section `<div className="relative overflow-hidden">` — already applied to most sections. Ensure all section wrappers have `overflow-hidden`.

**Warning:** Do not apply `overflow-x: hidden` on `<html>` or on elements that use `position: sticky` — it will break `ScrollTrigger` pin behavior.

---

## Page Sections (`page.tsx`)

### VOID / Intro

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Height   | 80vh   | 100vh  | 120vh   |

- CollageElement banana-plant and camera: reduce size on mobile, adjust positions so they don't overlap the name title. Use Tailwind override classes (`!top-[x%] md:!top-[y%]`). If still overlapping after repositioning, apply `hidden md:block`.
- Name title already has `text-3xl md:text-7xl` — verify wrapping works at 320px wide.

### Chapter 1 — Origin

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Height   | 130vh  | 160vh  | 200vh   |

- CollageElement typewriter and fragments: reposition so they don't overlap main text. Use Tailwind responsive overrides. Fallback: `hidden md:block`.
- ScatteredText elements: see ScatteredText section below.

### Chapter 2 — Growth

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Height   | 140vh  | 180vh  | 220vh   |

- MousePhysics zone: add touch support (see Interactive Components).
- Physics items: adjust initial `top/left` positions so all items are visible on mobile viewport.
- CollageElement compass: reduce to `w-[150px]` on mobile.

### Selected Works / Gallery

- Height: flexible (`auto` / `min-h`) on mobile.
- PolaroidGallery already has `min-h-[60vh] md:min-h-[80vh]` — retain.
- DNAHelix: keep, verify no horizontal overflow.

### Manifesto

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Height   | 120vh  | 150vh  | 180vh   |

- HoverMorphText lines already use `clamp()` for font size — verify positions don't cause overlap and adjust `top/left` percentages as needed.

### MemoBoard

- See MemoBoard section in Interactive Components below.

---

## Interactive Components

### CursorTrail

**Touch detection method:** Use `(pointer: coarse)` media query — more reliable than `'ontouchstart' in window` and works correctly for touch laptops in both mouse and touch mode.

**Implementation:** Inside `CursorTrail.tsx`, detect at mount with `useEffect`:
```ts
useEffect(() => {
  if (window.matchMedia('(pointer: coarse)').matches) return // exit early, no cursor
  // existing cursor logic
}, [])
```
Return `null` from render on touch devices (check same condition with `useState` initialized to `false`, updated in `useEffect`).

### MousePhysics

**Touch event support:**
- Add `touchstart` and `touchmove` event listeners in the same `useEffect` that handles `mousemove`.
- Extract coordinates: `const { clientX, clientY } = event.touches[0]`
- Update `mouseRef.current` with touch coordinates — the RAF physics loop reads from `mouseRef`, so no other changes needed.
- `touchend`: trigger the same explosion effect as `handleClick` (simulate a click at last touch position).
- RAF loop continues running on touch devices — this is intentional, the same loop handles both input types.
- Label "PUSH ME AROUND" → "TAP ME AROUND" on mobile via `isMobile`.

### MemoBoard Sticky Notes

**`Note` interface extension:**
```ts
interface Note {
  // ... existing fields
  pos_top_mobile?: string  // optional — falls back to pos_top if absent
  pos_left_mobile?: string
}
```

**SEED_CARDS:** Add `pos_top_mobile` and `pos_left_mobile` to each entry. Arrange in a loose 3×2 grid (columns ~5%, ~38%, ~68%; rows ~5%, ~50%):
```ts
{ id: 'seed-1', pos_top: '6%', pos_left: '5%', pos_top_mobile: '3%', pos_left_mobile: '5%', ... }
{ id: 'seed-2', pos_top: '4%', pos_left: '33%', pos_top_mobile: '3%', pos_left_mobile: '38%', ... }
// etc.
```

**API-fetched notes:** Notes returned from `/api/memoboard` do not have mobile positions. On mobile, use a sequential layout algorithm: assign positions in a 2-column grid (left col: `pos_left: '5%'`, right col: `pos_left: '55%'`) with `pos_top` incrementing by `28%` per row. Apply only when `isMobile === true`. After the user drags a note, position is free (Framer Motion drag tracks its own offset).

**Drag on touch:** Framer Motion `drag` prop already supports touch events natively — no extra work needed.

**TapeRoll3D** (used inside MemoBoard as form trigger at `bottom: 12%, left: 12%`): add `bottom: isMobile ? '5%' : '12%'` and verify it doesn't overlap with notes on mobile.

### LoadingScreen

- Audit for absolute-positioned elements that could overflow on mobile. Apply `overflow-hidden` to the container and ensure any full-screen elements use `w-screen h-screen` or `w-full h-full` rather than fixed pixel values.

### MarqueeStrip

- Ensure marquee container has `overflow-hidden` and `w-full`. Marquee animation is horizontal and should be clipped to viewport. If not already present, add `overflow-hidden` to the strip wrapper.

### FilmReel, DataOrb, TextVortex

- These are decorative. No responsive changes required — they are self-contained and use relative/absolute positioning within their own containers. Verify no viewport overflow on mobile during implementation.

### AmbientSound

- No changes — already optional and user-triggered.

### ParticleField & GrainOverlay

- Keep on all devices — lightweight and purely decorative.

### ScannerEffect, DioramaLayer, HandDrawnSVG

- Keep on all devices — verify no horizontal overflow on mobile.

---

## ScatteredText Overflow

`ScatteredText` renders with `whiteSpace: 'nowrap'` and `position: absolute`. This means long text strings **will overflow** the viewport on mobile even after repositioning. Three possible fixes per element (decide during implementation):

1. **Reposition** — move `left` value inward and ensure `right` doesn't go negative. Works for short strings.
2. **Scale down font** — use a smaller `clamp()` minimum, e.g. `clamp(0.6rem, 1.5vw, 1.2rem)`.
3. **Hide on mobile** — `hidden md:block` wrapper. Last resort.

For each ScatteredText in `page.tsx`, check its text length and current `left/right` value. If the text at its minimum font size would overflow a 320px viewport, hide it on mobile.

---

## GSAP Animations — Testable Success Criteria

The following specific animations must work correctly on mobile after changes:

| Animation | Where | Pass Condition |
|-----------|-------|----------------|
| Name letter entrance | Intro section, on load | All letters animate in without clipping |
| Subtitle fade-in | Intro section, on load | Visible and not overlapping name |
| `reveal-text` blur-in | All sections with `.reveal-text` class | Triggers on scroll at `top 85%` |
| Scroll progress bar | Fixed top bar | Scales from 0 to 1 as page scrolls from top to bottom |
| Scroll indicator fade | Intro section | Fades out when scrolling past 100px |

ScrollTrigger behavior on mobile may require `ScrollTrigger.refresh()` after layout changes — call it inside `useEffect` after `isMobile` resolves.

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
| `src/app/page.tsx` | Section heights, CollageElement positions, ScatteredText positions, ScrollTrigger.refresh() call |
| `src/components/CursorTrail.tsx` | Render null on touch devices using `(pointer: coarse)` |
| `src/components/MousePhysics.tsx` | Add touch event support, touchend explosion |
| `src/components/MemoBoard.tsx` | Extend Note interface, add mobile positions to SEED_CARDS, API note layout algorithm, TapeRoll3D mobile position |

---

## Success Criteria

- No horizontal scrollbar on any breakpoint (320px, 768px, 1024px, 1440px)
- Name title fully visible and non-clipped on 320px wide screens
- CollageElements do not obscure primary text content on mobile
- MousePhysics responds to touch drag on mobile; `touchend` triggers explosion effect
- MemoBoard notes do not overlap on initial mobile render; all notes remain draggable via touch
- CursorTrail does not render on touch devices
- Name letter entrance, subtitle fade, `reveal-text` animations, scroll progress bar, and scroll indicator all function correctly on mobile
- `ScrollTrigger.refresh()` called after `isMobile` resolves to prevent stale trigger positions
- `overflow-x: hidden` on `<body>` and per-section wrappers prevents horizontal bleed without breaking ScrollTrigger pins

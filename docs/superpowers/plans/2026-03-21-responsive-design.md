# Responsive Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio fully responsive across mobile (320px+), tablet (768–1023px), and desktop (1024px+) while preserving all animations, parallax, and collage aesthetic.

**Architecture:** Add a shared `useMediaQuery` hook as the JS-layer foundation; use it for section heights, conditional rendering, and touch event switching. Use Tailwind responsive classes for pure CSS adjustments (font sizes, image widths, visibility). Collage elements use Tailwind overrides first; fallback to `hidden md:block` only when repositioning still causes overlap.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, GSAP + ScrollTrigger, Framer Motion 12, TypeScript 5

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/hooks/useMediaQuery.ts` | **Create** | Shared SSR-safe breakpoint hook |
| `src/components/CursorTrail.tsx` | **Modify** | Disable on touch devices |
| `src/components/MousePhysics.tsx` | **Modify** | Add touch event support + touchend explosion |
| `src/components/MemoBoard.tsx` | **Modify** | Mobile sticky note positions + API note grid layout |
| `src/app/page.tsx` | **Modify** | Section heights, CollageElement positions, ScatteredText overflow, ScrollTrigger.refresh() |

---

## Task 1: `useMediaQuery` Hook

**Files:**
- Create: `src/hooks/useMediaQuery.ts`

- [ ] **Step 1: Create the hook file**

```typescript
// src/hooks/useMediaQuery.ts
'use client';

import { useState, useEffect } from 'react';

interface Breakpoints {
  isMobile: boolean;  // < 768px
  isTablet: boolean;  // 768px – 1023px
  isDesktop: boolean; // >= 1024px
}

export function useMediaQuery(): Breakpoints {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

    const update = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
    };

    update(); // set initial values

    mobileQuery.addEventListener('change', update);
    tabletQuery.addEventListener('change', update);

    return () => {
      mobileQuery.removeEventListener('change', update);
      tabletQuery.removeEventListener('change', update);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useMediaQuery.ts
git commit -m "feat: add useMediaQuery hook for responsive breakpoint detection"
```

---

## Task 2: CursorTrail — Disable on Touch Devices

**Files:**
- Modify: `src/components/CursorTrail.tsx`

The component currently starts a `mousemove` listener and RAF loop unconditionally. On touch devices there's no cursor, so we return `null` early.

- [ ] **Step 1: Add touch detection state**

At the top of the component, add a `useState` and `useEffect` to detect touch:

```typescript
// Add to imports: useState
const [isTouchDevice, setIsTouchDevice] = useState(false);
```

- [ ] **Step 2: Detect touch in first useEffect (before the existing one)**

Add a new `useEffect` *before* the existing one:

```typescript
useEffect(() => {
  if (window.matchMedia('(pointer: coarse)').matches) {
    setIsTouchDevice(true);
  }
}, []);
```

- [ ] **Step 3: Guard the existing useEffect and JSX**

Wrap the existing `useEffect` body to bail early on touch:

```typescript
useEffect(() => {
  if (isTouchDevice) return;
  // ... existing code unchanged ...
}, [isTouchDevice]); // add isTouchDevice to dep array
```

At the end of the component, before `return (<>...)`, add:

```typescript
if (isTouchDevice) return null;
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Manual check**

Open DevTools → toggle device toolbar → set to mobile. The custom cursor ring and trail dots should not appear. On desktop, they should appear as before.

- [ ] **Step 6: Commit**

```bash
git add src/components/CursorTrail.tsx
git commit -m "feat: disable CursorTrail on touch devices"
```

---

## Task 3: MousePhysics — Touch Event Support

**Files:**
- Modify: `src/components/MousePhysics.tsx`

The component uses `mousemove` to update `mouseRef.current`. The RAF `animate()` loop reads from that ref. Adding `touchstart`, `touchmove`, and `touchend` to update the same ref gives us touch support for free since the physics loop doesn't care about input source.

`touchstart` is required so a stationary tap (without movement) still populates `mouseRef.current` with the correct position before `touchend` triggers the explosion. Without it, a tap-without-drag uses the initialized `{0, 0}` origin and the explosion fires from the wrong place.

- [ ] **Step 1: Add touch handlers inside the useEffect**

In `src/components/MousePhysics.tsx`, inside the `useEffect`, after the `handleClick` function definition, add:

```typescript
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0];
  mouseRef.current = { x: touch.clientX, y: touch.clientY };
};

const handleTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0];
  mouseRef.current = { x: touch.clientX, y: touch.clientY };
};

const handleTouchEnd = (e: TouchEvent) => {
  // Update position from last touch, then trigger explosion
  const touch = e.changedTouches[0];
  mouseRef.current = { x: touch.clientX, y: touch.clientY };
  handleClick();
};
```

- [ ] **Step 2: Register and clean up touch listeners**

After `window.addEventListener('click', handleClick)`, add:

```typescript
window.addEventListener('touchstart', handleTouchStart, { passive: true });
window.addEventListener('touchmove', handleTouchMove, { passive: true });
window.addEventListener('touchend', handleTouchEnd);
```

In the cleanup `return () => {` block, add:

```typescript
window.removeEventListener('touchstart', handleTouchStart);
window.removeEventListener('touchmove', handleTouchMove);
window.removeEventListener('touchend', handleTouchEnd);
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Manual check**

Open site on a touch device (or DevTools device toolbar). Touch and drag over the physics zone — elements should be pushed away. Lifting finger (touchend) should cause an explosion burst.

- [ ] **Step 5: Commit**

```bash
git add src/components/MousePhysics.tsx
git commit -m "feat: add touch event support to MousePhysics component"
```

---

## Task 4: MemoBoard — Mobile Sticky Note Positions

**Files:**
- Modify: `src/components/MemoBoard.tsx`

**Overview:** Extend `Note` interface with optional mobile position fields. SEED_CARDS get explicit mobile positions. API-fetched notes get algorithmic 2-column grid positions computed at render time inside `DraggableCard`.

- [ ] **Step 1: Extend the Note interface**

In `MemoBoard.tsx`, update the `Note` interface:

```typescript
interface Note {
  id: string;
  name: string;
  role: string;
  message: string;
  color: string;
  theme?: string;
  rotate: number;
  pos_top: string;
  pos_left: string;
  pos_top_mobile?: string;   // add these two
  pos_left_mobile?: string;
  created_at: string;
}
```

- [ ] **Step 2: Update SEED_CARDS with mobile positions**

Mobile uses a 2-column layout. The card width is 190px (`w-[190px]`). On the smallest supported screen (320px), the right column must start at ≤ `(320 - 190) / 320 = 40.6%` to avoid overflow. Use `38%` for safety.

- Column 1: `left: '5%'`
- Column 2: `left: '38%'`  (190px card + 122px offset = 312px, within 320px ✓)
- Row spacing: every `32%` of container height

Replace the `SEED_CARDS` constant with:

```typescript
const SEED_CARDS: Note[] = [
  { id: 'seed-1', name: 'Rizky H.', role: 'Lead Engineer, Startup SaaS', message: 'Andhieka delivered a production-ready API under insane deadlines. Clean code, zero drama.', color: 'white', rotate: -5, pos_top: '6%', pos_left: '5%', pos_top_mobile: '3%', pos_left_mobile: '5%', created_at: '' },
  { id: 'seed-2', name: 'Dinda P.', role: 'Product Manager', message: "He turned a half-baked Figma mockup into something I'd actually use. Fast, precise, creative.", color: 'pink', rotate: 4, pos_top: '4%', pos_left: '33%', pos_top_mobile: '3%', pos_left_mobile: '38%', created_at: '' },
  { id: 'seed-3', name: 'Bimo S.', role: 'CTO, Fintech Startup', message: 'The kind of developer who asks the right questions before touching a single line of code.', color: 'blue', rotate: -7, pos_top: '5%', pos_left: '66%', pos_top_mobile: '35%', pos_left_mobile: '5%', created_at: '' },
  { id: 'seed-4', name: 'Sera A.', role: 'UI/UX Designer', message: 'Rare to find a dev who actually respects the design spec AND improves it.', color: 'yellow', rotate: 6, pos_top: '52%', pos_left: '18%', pos_top_mobile: '35%', pos_left_mobile: '38%', created_at: '' },
  { id: 'seed-5', name: 'Farhan M.', role: 'Freelance Client', message: 'Shipped in 3 days what another team quoted 3 weeks for. Genuinely impressive work.', color: 'green', rotate: -3, pos_top: '50%', pos_left: '62%', pos_top_mobile: '67%', pos_left_mobile: '5%', created_at: '' },
];
```

- [ ] **Step 3: Update DraggableCard to accept index and isMobile props**

Change the `DraggableCard` function signature:

```typescript
function DraggableCard({ note, zBase, onFocus, index, isMobile }: {
  note: Note;
  zBase: number;
  onFocus: () => void;
  index: number;
  isMobile: boolean;
}) {
```

- [ ] **Step 4: Add position computation inside DraggableCard**

At the start of the `DraggableCard` function body, before the destructuring, add:

```typescript
const getPos = () => {
  if (!isMobile) return { top: note.pos_top, left: note.pos_left };
  if (note.pos_top_mobile && note.pos_left_mobile) {
    return { top: note.pos_top_mobile, left: note.pos_left_mobile };
  }
  // Fallback 2-column grid for API-fetched notes (right col at 38% max for 320px safety)
  const col = index % 2;
  const row = Math.floor(index / 2);
  return {
    top: `${5 + row * 32}%`,
    left: col === 0 ? '5%' : '38%',
  };
};
const pos = getPos();
```

Replace the `motion.div` `style` prop: change `top: note.pos_top, left: note.pos_left` to `top: pos.top, left: pos.left`:

```typescript
style={{
  top: pos.top,
  left: pos.left,
  rotate: isDragging ? note.rotate * 0.3 : note.rotate,
  zIndex: isDragging ? localZ + 100 : localZ,
  cursor: isDragging ? 'grabbing' : 'grab',
}}
```

- [ ] **Step 5: Import useMediaQuery and thread props through MemoBoard**

At the top of `MemoBoard.tsx`, add the import:

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery';
```

In the main `MemoBoard` component, add the hook:

```typescript
export default function MemoBoard() {
  const { isMobile } = useMediaQuery();
  // ... rest unchanged
```

Update the `DraggableCard` render call to pass `index` and `isMobile`:

```typescript
{notes.map((note, i) => (
  <DraggableCard key={note.id} note={note} zBase={i + 2} onFocus={handleFocus} index={i} isMobile={isMobile} />
))}
```

- [ ] **Step 6: Update WashiTapeRoll position for mobile**

Update the `WashiTapeRoll` function signature and its `style` prop (keep everything else — `initial`, `animate`, `transition`, `onClick` — identical):

```typescript
function WashiTapeRoll({ onClick, isMobile }: { onClick: () => void; isMobile: boolean; }) {
  return (
    <motion.div
      className="absolute"
      style={{
        bottom: isMobile ? '3%' : '12%',
        left: isMobile ? '5%' : '12%',
        zIndex: 200,
      }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 180, damping: 20 }}
    >
      <TapeRoll3D />
    </motion.div>
  );
}
```

Update the call site in `MemoBoard` — the existing `{fetchedOnce && ...}` block stays as-is, just add `isMobile`:

```typescript
{fetchedOnce && (
  <WashiTapeRoll onClick={() => setShowForm(true)} isMobile={isMobile} />
)}
```

Note: The `<AnimatePresence>` block that wraps `AddNoteForm` (below the WashiTapeRoll call) is separate and must not be removed.

- [ ] **Step 7: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 8: Manual check**

Open site in DevTools mobile view. Navigate to the MemoBoard section. Sticky notes should be in a 2–3 column layout without overlap. Drag a note — it should move freely. The tape roll trigger should be visible in the bottom-left without overlapping notes.

- [ ] **Step 9: Commit**

```bash
git add src/components/MemoBoard.tsx src/hooks/useMediaQuery.ts
git commit -m "feat: add mobile-responsive sticky note positions to MemoBoard"
```

---

## Task 4b: page.tsx — Physics Item Positions

**Files:**
- Modify: `src/app/page.tsx`

Both `MousePhysics` zones have physics items (`data-physics`) positioned with inline `top/left` percentages. On mobile these can bunch up or fall outside the zone's visible height. Adjust positions so all items are visible within the zone on a 375px wide screen.

**Chapter 2 MousePhysics zone** (zone height: 30% of 140vh ≈ ~60vh on mobile):

- [ ] **Step 1: Adjust Chapter 2 physics item positions for mobile**

The zone uses `style={{ top: '35%', left: 0, height: '30%' }}`. On mobile with the section at 140vh, this zone sits around 50–80vh. Items at `left: '65%'` and `right: '10%'` are fine (within width). Items at `top: '25%'` and `top: '40%'` inside the zone may stack up. The biggest issue is the zone height — on mobile, reduce physics item positions to stay within a tighter vertical range.

For each `data-physics` div in the Chapter 2 zone, replace `top` values so all items land between `5%` and `50%` of zone height. Change the two bottom-heavy items:

```tsx
// "books" item — change from top: '25%' to:
<div data-physics data-mass="0.6" className="absolute" style={{ top: '20%', left: '65%' }}>

// "PLAY" text — change from top: '40%' to:
<div data-physics data-mass="0.9" className="absolute" style={{ top: '35%', left: '25%' }}>

// "CREATE" text — change from top: '35%' to:
<div data-physics data-mass="1.5" className="absolute" style={{ top: '30%', right: '20%' }}>
```

**Mastery MousePhysics zone** (zone height: 25% of 160vh ≈ ~40vh on mobile):

- [ ] **Step 2: Adjust Mastery physics item positions for mobile**

The zone uses `style={{ top: '46%', left: 0, height: '25%' }}`. On mobile at 160vh, this zone is at ~74–114vh. The `right: '15%'` camera item is fine. The item at `top: '35%'` and `top: '40%'` inside the zone risk being cut off at zone bottom. Compress vertical range:

```tsx
// "REBUILD" text — change from top: '35%' to:
<div data-physics data-mass="1.3" className="absolute" style={{ top: '25%', left: '70%' }}>

// fragments image — change from top: '40%' to:
<div data-physics data-mass="0.9" className="absolute" style={{ top: '30%', left: '40%' }}>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Manual check**

At 375px mobile, open Chapter 2 and Mastery. The physics zones should show all items without any cut off at the bottom. Touch-drag should affect all visible items.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: adjust physics item positions for mobile viewport in both MousePhysics zones"
```

---

## Task 4c: LoadingScreen + MarqueeStrip Audit

**Files:**
- Verify: `src/components/LoadingScreen.tsx`
- Verify: `src/components/MarqueeStrip.tsx`

- [ ] **Step 1: Verify LoadingScreen is overflow-safe**

`LoadingScreen` uses `fixed inset-0` which is inherently viewport-bounded — it cannot cause horizontal overflow. Confirm the outermost div has `fixed inset-0` (it does, as of current code). No changes needed. ✓

- [ ] **Step 2: Verify MarqueeStrip is not used in page.tsx**

Run: `grep -n "MarqueeStrip" src/app/page.tsx`

Expected: no matches. `MarqueeStrip` is defined but not imported or used in the main page — it poses no overflow risk. No changes needed. ✓

- [ ] **Step 3: Commit if any changes were needed**

If steps 1-2 confirmed no changes required, skip this step. If any fix was made:

```bash
git add src/components/LoadingScreen.tsx
git commit -m "fix: ensure LoadingScreen is overflow-safe on mobile"
```

---

## Task 5: page.tsx — Section Heights

**Files:**
- Modify: `src/app/page.tsx`

Section heights are currently hardcoded inline styles. Replace them with conditional values using `useMediaQuery`.

**Height reference table:**

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Intro / VOID | 80vh | 100vh | 120vh |
| Chapter 1 — Origin | 130vh | 160vh | 200vh |
| Chapter 2 — Growth | 140vh | 180vh | 220vh |
| Manifesto | 120vh | 150vh | 180vh |
| Found Footage / VHS | 110vh | 140vh | 160vh |
| Mastery / Chapter 3 | 160vh | 200vh | 250vh |
| Process / Kitchen Sink | 180vh | 230vh | 280vh |

- [ ] **Step 1: Import useMediaQuery and add hook in Home component**

At the top of `page.tsx`, add the import:

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery';
```

At the start of the `Home` component body (after the `useRef` declarations), add:

```typescript
const { isMobile, isTablet } = useMediaQuery();
```

- [ ] **Step 2: Add a helper function for section heights**

After the `useMediaQuery` call, add:

```typescript
const sectionHeight = (mobile: string, tablet: string, desktop: string) =>
  isMobile ? mobile : isTablet ? tablet : desktop;
```

- [ ] **Step 3: Replace Intro section height**

Find: `<div className="relative overflow-hidden" style={{ height: '120vh' }}>`  (the VOID/Intro section — it's the first section wrapper after `<main>`)

Replace with:
```tsx
<div className="relative overflow-hidden" style={{ height: sectionHeight('80vh', '100vh', '120vh') }}>
```

- [ ] **Step 4: Replace Chapter 1 height**

Find: `<div className="relative overflow-hidden" style={{ height: '200vh' }}>` (CHAPTER 1 — Origin)

Replace with:
```tsx
<div className="relative overflow-hidden" style={{ height: sectionHeight('130vh', '160vh', '200vh') }}>
```

- [ ] **Step 5: Replace Chapter 2 height**

Find: `<div className="relative overflow-hidden" style={{ height: '220vh' }}>` (CHAPTER 2 — Growth)

Replace with:
```tsx
<div className="relative overflow-hidden" style={{ height: sectionHeight('140vh', '180vh', '220vh') }}>
```

- [ ] **Step 6: Replace Manifesto height**

Find: `<div className="relative overflow-hidden" style={{ height: '180vh' }}>` (MANIFESTO)

Replace with:
```tsx
<div className="relative overflow-hidden" style={{ height: sectionHeight('120vh', '150vh', '180vh') }}>
```

- [ ] **Step 7: Replace VHS height**

Find: `<div className="relative overflow-hidden" style={{ height: '160vh' }}>` (FOUND FOOTAGE / VHS)

Replace with:
```tsx
<div className="relative overflow-hidden" style={{ height: sectionHeight('110vh', '140vh', '160vh') }}>
```

- [ ] **Step 8: Replace Mastery height**

Find: `<div className="relative overflow-hidden" style={{ height: '250vh' }}>` (MASTERY / CHAPTER 3)

Replace with:
```tsx
<div className="relative overflow-hidden" style={{ height: sectionHeight('160vh', '200vh', '250vh') }}>
```

- [ ] **Step 9: Replace Process height**

Find: `<div className="relative overflow-hidden" style={{ height: '280vh' }}>` (PROCESS / KITCHEN SINK)

Replace with:
```tsx
<div className="relative overflow-hidden" style={{ height: sectionHeight('180vh', '230vh', '280vh') }}>
```

- [ ] **Step 10: Add ScrollTrigger.refresh() after isMobile resolves**

In the `useEffect` that handles GSAP animations (the main one at line ~41), add a trigger to refresh ScrollTrigger when the responsive state changes. Add a second `useEffect` after the main animation one:

```typescript
useEffect(() => {
  // Refresh ScrollTrigger after breakpoint resolves to fix stale trigger positions
  ScrollTrigger.refresh();
}, [isMobile, isTablet]);
```

- [ ] **Step 11: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 12: Manual check**

Open DevTools mobile view (375px). Scroll through all sections — they should not feel excessively long on mobile. On desktop, heights should be unchanged.

- [ ] **Step 13: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: responsive section heights and ScrollTrigger refresh on breakpoint change"
```

---

## Task 6: page.tsx — CollageElement Position Fixes

**Files:**
- Modify: `src/app/page.tsx`

CollageElements that don't already have Tailwind mobile overrides need them. Elements with `style={{ top: '...', left/right: '...' }}` inline styles may overlap content on small screens.

**Strategy:** Add `className` with Tailwind `!top-[x%] !left-[x%] md:!top-[y%] md:!left-[y%]` overrides. If an element already has these classes, skip it. Only modify elements that would visually obscure primary content.

- [ ] **Step 1: Fix Intro section CollageElements**

**banana-plant** (currently `top: '15%', right: '5%'`): already has `className="w-[180px] md:w-[350px]"` — add mobile position override:

```tsx
// Change className from:
className="w-[180px] md:w-[350px]"
// To:
className="w-[120px] md:w-[350px] !top-[8%] !right-[2%] md:!top-[15%] md:!right-[5%]"
```

**camera** (currently `bottom: '25%', left: '5%'`): already has `className="w-[180px] md:w-[350px]"` — add mobile position:

```tsx
// Change className from:
className="w-[180px] md:w-[350px]"
// To:
className="w-[120px] md:w-[350px] !bottom-[20%] !left-[2%] md:!bottom-[25%] md:!left-[5%]"
```

- [ ] **Step 2: Fix Chapter 1 CollageElements**

**typewriter** — already has `className="w-[120px] md:w-[350px] !top-[60%] !left-[5%] md:!top-[18%] md:!left-[15%]"` ✓ — no change needed.

**fragments** (in DioramaLayer foreground, `top: '35%', right: '-5%'`): wrap in `hidden md:block` since it's a decorative blur element and would stick out of viewport on mobile:

```tsx
// Wrap the CollageElement in:
<div className="hidden md:block">
  <CollageElement
    src="/collage/fragments-new.png"
    // ... rest unchanged
  />
</div>
```

- [ ] **Step 3: Fix Chapter 2 CollageElements**

**compass** (DioramaLayer foreground, `top: '12%', left: '30%'`): add mobile width override:

```tsx
// Change:
style={{ top: '12%', left: '30%', rotate: '-7deg', zIndex: 10, filter: 'blur(2px)' }}
// No style change needed — add className:
className="w-[150px] md:w-[400px]"
```

Note: `CollageElement` accepts `className` prop — add it to this element.

- [ ] **Step 4: Fix Mastery CollageElements**

Elements at lines ~1037 and ~1046 have no mobile responsive classes:

**typewriter at Mastery** (`top: '25%', left: '50%'`): hide on mobile (decorative depth element):

```tsx
<div className="hidden md:block">
  <CollageElement
    src="/collage/typewriter.png"
    alt="Mastery 4"
    // ... rest unchanged
  />
</div>
```

**camera at Mastery** (`top: '22%', left: '20%'`): hide on mobile (would overlap main text):

```tsx
<div className="hidden md:block">
  <CollageElement
    src="/collage/camera.png"
    alt="Mastery 5"
    // ... rest unchanged
  />
</div>
```

**fragments at Mastery** (`top: '28%', right: '30%'`): hide on mobile:

```tsx
<div className="hidden md:block">
  <CollageElement
    src="/collage/fragments-new.png"
    alt="Mastery 6"
    // ... rest unchanged
  />
</div>
```

- [ ] **Step 5: Fix VHS section CollageElement**

**camera in VHS** (`top: '58%', right: '5%'`, opacity 0.4): shrink on mobile:

```tsx
// Add className:
className="w-[100px] md:w-[220px]"
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 7: Manual check**

Open at 375px width. Check Intro, Chapter 1, Chapter 2, Mastery, and VHS sections. CollageElements should not overlap headings or primary text.

- [ ] **Step 8: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: fix CollageElement positions for mobile viewport"
```

---

## Task 7: page.tsx — ScatteredText Overflow Fixes

**Files:**
- Modify: `src/app/page.tsx`

`ScatteredText` renders with `position: absolute` and `whiteSpace: nowrap`. Elements with `right: x%` or `left: > 40%` can overflow on mobile. Audit each one; fix by repositioning or hiding.

**Approach per element:**
- If the text is short (≤ 20 chars) and positioned modestly → reposition using Tailwind isn't possible for inline styles, but we can update the style `left/right` value to be safe.
- If the text is long and positioned to the right → hide on mobile with a wrapper `<div className="hidden md:block">`.
- `ScatteredText` accepts a `style` prop — we can use `clamp()` for font and adjust coordinates.

- [ ] **Step 1: Fix "PUSH ME AROUND" label in Chapter 2 MousePhysics**

This ScatteredText is inside the `MousePhysics` zone. Change the text based on `isMobile`:

```tsx
<ScatteredText
  text={isMobile ? "TAP ME AROUND" : "PUSH ME AROUND"}
  style={{ top: '5%', left: '50%', fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}
  // ... rest unchanged
/>
```

- [ ] **Step 2: Fix "← click to explode →" label in Mastery MousePhysics**

```tsx
<ScatteredText
  text={isMobile ? "↓ tap to explode ↓" : "← click to explode →"}
  style={{ top: '0%', left: '35%', fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}
  // ... rest unchanged
/>
```

- [ ] **Step 3: Fix long ScatteredText lines that use `right:` positioning**

The following elements use `right: x%` or `left: > 50%` with long text — wrap them in `hidden md:block`:

- `"late nights. broken code. breakthrough."` at `right: '5%'` — wrap in `<div className="hidden md:block">`
- `"npm install everything"` at `right: '5%'` — wrap in `<div className="hidden md:block">`
- `"async function buildTheFuture() {"` at `right: '10%'` — wrap in `<div className="hidden md:block">`
- `"return { experience: infinite };"` at `right: '8%'` — wrap in `<div className="hidden md:block">`
- `"the best bugs become the best stories"` at `right: '8%'` — wrap in `<div className="hidden md:block">`
- `"const growth = iterate(learn, build, ship);"` at `left: '5%'` (long mono text) — wrap in `<div className="hidden md:block">`

- [ ] **Step 4: Fix Manifesto ScatteredText lines**

The three manifesto poetry lines (`Systems that breathe`, `Interfaces that feel`, `Code that lasts`) at `left: '12%'`, `'30%'`, `'55%'` use `clamp(1.5rem, 4vw, 3.5rem)`. On mobile they'll be ~1.5rem which is fine. The `left: '55%'` one may push outside viewport. Change its style:

```tsx
// "Code that lasts." — change left from '55%' to be safe on mobile
style={{ top: '72%', left: isMobile ? '10%' : '55%', rotate: '-2deg', fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }}
```

- [ ] **Step 5: Fix Chapter 1 "curiosity drove everything" ScatteredText**

Currently at `left: '55%'` — on mobile this starts more than halfway across:

```tsx
style={{ top: '30%', left: isMobile ? '8%' : '55%', rotate: '5deg', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 7: Manual check**

Resize browser to 375px wide. Scroll through all sections. No horizontal scrollbar should appear. Use DevTools → Elements to verify no ScatteredText div extends beyond `document.body.scrollWidth`.

- [ ] **Step 8: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: fix ScatteredText overflow on mobile, add touch labels for physics zones"
```

---

## Task 8: Overflow Audit + Final Checks

**Files:**
- Verify: `src/app/layout.tsx`
- Verify: `src/app/page.tsx`

- [ ] **Step 1: Verify body has overflow-x-hidden**

Open `src/app/layout.tsx`. Confirm `<body>` has `className` containing `overflow-x-hidden`:

```tsx
<body className="antialiased overflow-x-hidden hide-native-cursor">
```

If missing, add `overflow-x-hidden`. If already there ✓, skip.

- [ ] **Step 2: Verify all section wrappers have overflow-hidden**

In `page.tsx`, check each top-level section div. All should have `overflow-hidden` in `className`. The ones currently using `style={{ height: 'Xvh' }}` without a className should get `className="relative overflow-hidden"`.

Grep to find any section without it:
```bash
grep -n 'style={{ height:' src/app/page.tsx
```

For each result, confirm the wrapping div has `overflow-hidden` in className. Add if missing.

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: zero errors

- [ ] **Step 4: Run build check**

Run: `npm run build`
Expected: successful build with no errors

- [ ] **Step 5: Full manual responsive check**

Open the dev server (`npm run dev`) and test at these widths:

| Width | Device | What to verify |
|-------|--------|----------------|
| 375px | iPhone SE / standard mobile | No horizontal scroll, name title readable, notes not overlapping |
| 768px | iPad Mini | Sections feel proportioned, CollageElements visible |
| 1024px | iPad Pro / small laptop | Desktop layout active, all effects working |
| 1440px | Desktop | Unchanged from before this PR |

Also test on an actual touch device if available:
- CursorTrail should not appear
- Touch-dragging in MousePhysics zones should move elements
- Tapping (touchend) should trigger explosion
- MemoBoard notes should be draggable by touch

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "fix: ensure overflow-hidden on all section wrappers for horizontal scroll prevention"
```

---

## Task 9: Final Commit and Summary

- [ ] **Step 1: Run final build**

```bash
npm run build
```

Expected: clean build, no TypeScript errors, no Next.js warnings about missing keys or prop types.

- [ ] **Step 2: Final commit (only if any uncommitted changes remain)**

Check for any remaining uncommitted changes from the tasks above:

```bash
git status
```

If there are uncommitted changes, stage only the known modified files:

```bash
git add src/hooks/useMediaQuery.ts src/components/CursorTrail.tsx src/components/MousePhysics.tsx src/components/MemoBoard.tsx src/app/page.tsx src/app/layout.tsx
git commit -m "feat: complete responsive design implementation across all breakpoints"
```

---

## Verification Checklist

After all tasks are done, confirm:

- [ ] No horizontal scrollbar at 320px, 375px, 768px, 1024px, 1440px
- [ ] Name title visible and non-clipped at 320px
- [ ] CollageElements do not cover primary headings on mobile
- [ ] `CursorTrail` returns `null` on touch devices (verified in DevTools)
- [ ] `MousePhysics` responds to `touchmove` and `touchend` on mobile
- [ ] MemoBoard sticky notes don't overlap on initial mobile render
- [ ] MemoBoard notes are draggable by touch (Framer Motion handles this)
- [ ] `ScrollTrigger.refresh()` called after breakpoint change (prevents stale trigger positions)
- [ ] TypeScript compiles clean: `npx tsc --noEmit`
- [ ] `npm run build` succeeds

# World 3D Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build route `/world` — a 3D world layout portfolio page with fly-through camera on scroll, scattered text at depth layers, and ClothAboutSection at the end.

**Architecture:** `WorldHeroSection` uses a CSS `perspective` container with `transform-style: preserve-3d`. `ScatteredText` items are placed at three `translateZ` depths. `useScrollHijack` (existing hook) intercepts wheel events and produces `progress` 0→1, which GSAP uses to animate each layer's opacity. Name+title block has an independent GSAP sine wave loop.

**Tech Stack:** Next.js 16 (App Router), React 19, GSAP 3.14, TypeScript 5, Tailwind CSS 4. No test framework installed — verification is via `npm run dev` (visual) and `npm run build` (TypeScript check).

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/world/page.tsx` | Create | Route entry point — renders `WorldHeroSection` + `ClothAboutSection` |
| `src/components/sections/WorldHeroSection.tsx` | Create | 3D world scene: perspective container, depth layers, wave animation, fly-through camera |
| `src/components/ScatteredText.tsx` | Read-only | Existing component — used as-is, `style` prop accepts `transform: translateZ(...)` |
| `src/hooks/useScrollHijack.ts` | Read-only | Existing hook — returns `{ sectionRef, progress }` |
| `src/components/sections/ClothAboutSection.tsx` | Read-only | Existing component — rendered after WorldHeroSection in page.tsx |

---

## Task 1: Create `/world` route

**Files:**
- Create: `src/app/world/page.tsx`

- [ ] **Step 1: Create the page file**

```tsx
// src/app/world/page.tsx
import ClothAboutSection from '@/components/sections/ClothAboutSection';
import WorldHeroSection from '@/components/sections/WorldHeroSection';

export default function WorldPage() {
  return (
    <main style={{ background: '#111', minHeight: '100vh' }}>
      <WorldHeroSection />
      <ClothAboutSection />
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`

Expected: Build fails with "Cannot find module '@/components/sections/WorldHeroSection'" — this is expected because WorldHeroSection doesn't exist yet.

- [ ] **Step 3: Commit**

```bash
git add src/app/world/page.tsx
git commit -m "feat: add /world route scaffold"
```

---

## Task 2: WorldHeroSection — perspective container + name/title block

**Files:**
- Create: `src/components/sections/WorldHeroSection.tsx`

- [ ] **Step 1: Create WorldHeroSection with perspective container and static name/title**

```tsx
// src/components/sections/WorldHeroSection.tsx
'use client';

import { useRef } from 'react';

export default function WorldHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameTitleRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
        background: '#111',
      }}
    >
      {/* perspective-3d inner layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Name + Title block */}
        <div
          ref={nameTitleRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translateZ(0px)',
            zIndex: 20,
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 7rem)',
              fontWeight: 900,
              color: 'var(--accent-cream)',
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Andhieka Agrestya
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)',
              fontWeight: 400,
              color: 'var(--accent-warm)',
              opacity: 0.7,
              marginTop: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Software Engineer
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`

Expected: Build succeeds (no TypeScript errors).

- [ ] **Step 3: Verify visually**

Run: `npm run dev`

Open `http://localhost:3000/world` — should see dark page with "Andhieka Agrestya / Software Engineer" centered.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WorldHeroSection.tsx
git commit -m "feat: add WorldHeroSection with perspective container and name/title block"
```

---

## Task 3: Add ScatteredText depth layers

**Files:**
- Modify: `src/components/sections/WorldHeroSection.tsx`

> **Context:** `ScatteredText` accepts `style` prop that is spread directly onto the container div's `style`. Setting `transform: 'translateZ(-500px)'` in that prop works because the parent has `transform-style: preserve-3d`. The existing `rotate` style values use CSS `rotate` property (separate from `transform`) so they don't conflict.

- [ ] **Step 1: Add import and define layer data at the top of the file**

Add the import and the layer constants after the `'use client'` directive, before the component function:

```tsx
'use client';

import { useRef } from 'react';
import ScatteredText from '@/components/ScatteredText';

// ─── Depth layer data ─────────────────────────────────────────────
// translateZ values: negative = further from camera
const CLOSE_ITEMS = [
  {
    text: 'curiosity drove everything',
    style: { top: '20%', left: '8%', rotate: '-3deg', fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)', transform: 'translateZ(-150px)' },
    font: 'serif' as const,
    weight: '300',
    italic: true,
  },
  {
    text: 'late nights. broken code. breakthrough.',
    style: { top: '70%', right: '6%', rotate: '2deg', fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)', transform: 'translateZ(-150px)' },
    font: 'sans' as const,
    weight: '300',
  },
  {
    text: '// first_line_of_code',
    style: { top: '45%', left: '62%', rotate: '4deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)', transform: 'translateZ(-150px)' },
    font: 'mono' as const,
  },
];

const MID_ITEMS = [
  {
    text: 'WHERE IT ALL BEGAN',
    style: { top: '15%', left: '38%', rotate: '-2deg', fontSize: 'clamp(1rem, 2.5vw, 2rem)', transform: 'translateZ(-500px)' },
    font: 'serif' as const,
    weight: '900',
  },
  {
    text: "console.log('hello world');",
    style: { top: '60%', left: '4%', rotate: '-1deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)', transform: 'translateZ(-500px)' },
    font: 'mono' as const,
  },
  {
    text: 'motion is the message',
    style: { top: '80%', right: '18%', rotate: '3deg', fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)', transform: 'translateZ(-500px)' },
    font: 'sans' as const,
    italic: true,
  },
];

const FAR_ITEMS = [
  {
    text: 'crafted with intention',
    style: { top: '25%', right: '12%', rotate: '-4deg', fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)', transform: 'translateZ(-900px)' },
    font: 'sans' as const,
    weight: '300',
  },
  {
    text: 'design × engineering',
    style: { top: '55%', left: '28%', rotate: '1deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)', transform: 'translateZ(-900px)' },
    font: 'mono' as const,
  },
  {
    text: 'make it move',
    style: { top: '75%', left: '14%', rotate: '-2deg', fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)', transform: 'translateZ(-900px)' },
    font: 'serif' as const,
    italic: true,
  },
];
```

- [ ] **Step 2: Add refs for layer groups and render ScatteredText items inside the preserve-3d div**

Replace the full `WorldHeroSection` component with:

```tsx
export default function WorldHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameTitleRef = useRef<HTMLDivElement>(null);
  const closeLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const farLayerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
        background: '#111',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Far layer — opacity 0.25 */}
        <div ref={farLayerRef} style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
          {FAR_ITEMS.map((item, i) => (
            <ScatteredText
              key={`far-${i}`}
              text={item.text}
              style={item.style}
              font={item.font}
              weight={item.weight}
              italic={item.italic}
              color="var(--accent-cream)"
              animationType="fade"
              zIndex={1}
            />
          ))}
        </div>

        {/* Mid layer — opacity 0.55 */}
        <div ref={midLayerRef} style={{ position: 'absolute', inset: 0, opacity: 0.55 }}>
          {MID_ITEMS.map((item, i) => (
            <ScatteredText
              key={`mid-${i}`}
              text={item.text}
              style={item.style}
              font={item.font}
              weight={item.weight}
              italic={item.italic}
              color="var(--accent-cream)"
              animationType="fade"
              zIndex={2}
            />
          ))}
        </div>

        {/* Close layer — opacity 1.0 */}
        <div ref={closeLayerRef} style={{ position: 'absolute', inset: 0, opacity: 1 }}>
          {CLOSE_ITEMS.map((item, i) => (
            <ScatteredText
              key={`close-${i}`}
              text={item.text}
              style={item.style}
              font={item.font}
              weight={item.weight}
              italic={item.italic}
              color="var(--accent-warm)"
              animationType="fade"
              zIndex={3}
            />
          ))}
        </div>

        {/* Name + Title block — always in front */}
        <div
          ref={nameTitleRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translateZ(0px)',
            zIndex: 20,
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 7rem)',
              fontWeight: 900,
              color: 'var(--accent-cream)',
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Andhieka Agrestya
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)',
              fontWeight: 400,
              color: 'var(--accent-warm)',
              opacity: 0.7,
              marginTop: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Software Engineer
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

Expected: Build succeeds.

- [ ] **Step 4: Verify visually**

Open `http://localhost:3000/world` — should see name/title in center, scattered text at various sizes (CSS perspective makes far ones appear smaller). Far text is dim, mid text medium, close text bright.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/WorldHeroSection.tsx
git commit -m "feat: add ScatteredText depth layers to WorldHeroSection"
```

---

## Task 4: Wave animation on name/title block

**Files:**
- Modify: `src/components/sections/WorldHeroSection.tsx`

- [ ] **Step 1: Add GSAP import and wave animation useEffect**

Add `gsap` import after the existing imports:

```tsx
import { gsap } from 'gsap';
```

Add `useEffect` inside the component, after the refs, before the return:

```tsx
// Wave animation on name/title — continuous sine oscillation
useEffect(() => {
  if (!nameTitleRef.current) return;

  const tween = gsap.to(nameTitleRef.current, {
    y: 10,
    rotation: 1.2,
    duration: 2.8,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });

  return () => {
    tween.kill();
  };
}, []);
```

- [ ] **Step 2: Verify visually**

Open `http://localhost:3000/world` — the "Andhieka Agrestya / Software Engineer" block should gently sway up/down + slight rotation, looping smoothly.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/WorldHeroSection.tsx
git commit -m "feat: add wave animation to name/title block"
```

---

## Task 5: Close layer float-up animation

**Files:**
- Modify: `src/components/sections/WorldHeroSection.tsx`

> **Context:** Close layer items move upward continuously (GSAP loop). Each item floats at slightly different speed/offset using stagger. We animate the individual ScatteredText wrapper divs inside `closeLayerRef`, not the ref itself (that would move all 3 together).

- [ ] **Step 1: Add float-up useEffect for close layer items**

Add this `useEffect` after the wave animation one:

```tsx
// Float-up animation for close layer items
useEffect(() => {
  if (!closeLayerRef.current) return;

  const items = closeLayerRef.current.querySelectorAll<HTMLElement>(':scope > div');
  if (!items.length) return;

  const tweens = Array.from(items).map((el, i) =>
    gsap.to(el, {
      y: -28 - i * 6,
      duration: 5 + i * 1.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: i * 0.8,
    })
  );

  return () => {
    tweens.forEach((t) => t.kill());
  };
}, []);
```

- [ ] **Step 2: Verify visually**

Open `http://localhost:3000/world` — the three close-layer texts (warm colored) should each float up and down with slightly different rhythm.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/WorldHeroSection.tsx
git commit -m "feat: add float-up animation to close layer ScatteredText items"
```

---

## Task 6: Fly-through camera — scroll hijack + opacity

**Files:**
- Modify: `src/components/sections/WorldHeroSection.tsx`

> **Context:** `useScrollHijack` (at `src/hooks/useScrollHijack.ts`) intercepts wheel events when the section is ≥60% visible and accumulates `progress` from 0 to 1. When `progress` reaches 1, wheel events are no longer intercepted and native scroll continues to ClothAboutSection. The hook returns `{ sectionRef, progress }` where `sectionRef` must be attached to the section's root element.
>
> Opacity formula:
> - Mid layer: starts at 0.55, reaches 1.0 when progress = 0.5 → `Math.min(1, 0.55 + (progress / 0.5) * 0.45)`
> - Far layer: starts at 0.25, reaches 1.0 when progress = 1.0 → `Math.min(1, 0.25 + ((Math.max(0, progress - 0.5)) / 0.5) * 0.75)`

- [ ] **Step 1: Add useScrollHijack import**

Add after existing imports:

```tsx
import { useScrollHijack } from '@/hooks/useScrollHijack';
```

- [ ] **Step 2: Wire up useScrollHijack and attach sectionRef to the root div**

Replace the refs block at the top of the component:

```tsx
const { sectionRef, progress } = useScrollHijack<HTMLDivElement>({ sensitivity: 0.001 });
const nameTitleRef = useRef<HTMLDivElement>(null);
const closeLayerRef = useRef<HTMLDivElement>(null);
const midLayerRef = useRef<HTMLDivElement>(null);
const farLayerRef = useRef<HTMLDivElement>(null);
```

And in the JSX, change the root div's `ref` from `containerRef` to `sectionRef`:

```tsx
<div
  ref={sectionRef}
  style={{
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    perspective: '1200px',
    perspectiveOrigin: '50% 50%',
    background: '#111',
  }}
>
```

Also remove `const containerRef = useRef<HTMLDivElement>(null);` — it's no longer needed.

- [ ] **Step 3: Add opacity useEffect that watches progress**

Add after the float-up useEffect:

```tsx
// Fly-through: update mid + far layer opacity based on scroll progress
useEffect(() => {
  if (!midLayerRef.current || !farLayerRef.current) return;

  const midOpacity = Math.min(1, 0.55 + (progress / 0.5) * 0.45);
  const farProgress = Math.max(0, (progress - 0.5) / 0.5);
  const farOpacity = Math.min(1, 0.25 + farProgress * 0.75);

  gsap.set(midLayerRef.current, { opacity: midOpacity });
  gsap.set(farLayerRef.current, { opacity: farOpacity });
}, [progress]);
```

- [ ] **Step 4: Verify build**

Run: `npm run build`

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 5: Verify visually**

Open `http://localhost:3000/world`. Scroll down (wheel) — mid and far layer texts should gradually become fully opaque. After full opacity is reached, native scroll kicks in and ClothAboutSection appears below.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/WorldHeroSection.tsx
git commit -m "feat: add fly-through camera scroll mechanic with opacity transitions"
```

---

## Task 7: Final polish — entry animation on mount

**Files:**
- Modify: `src/components/sections/WorldHeroSection.tsx`

> **Context:** On first load, name/title fades in from slight blur + y offset. This plays once on mount (not scroll-triggered). The ScatteredText items already have their own `animationType="fade"` entry handled by the existing ScrollTrigger logic inside the component — no extra work needed there.

- [ ] **Step 1: Add entry animation useEffect for name/title**

Add this `useEffect` before the wave animation one (it should run first):

```tsx
// Entry animation: name/title fades in on mount
useEffect(() => {
  if (!nameTitleRef.current) return;

  gsap.fromTo(
    nameTitleRef.current,
    { opacity: 0, y: 30, filter: 'blur(8px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.4,
      delay: 0.3,
      ease: 'power3.out',
    }
  );
}, []);
```

- [ ] **Step 2: Set initial opacity to 0 on nameTitleRef div**

In the JSX, add `opacity: 0` to the name/title container's style so it starts invisible before GSAP animates it:

```tsx
<div
  ref={nameTitleRef}
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) translateZ(0px)',
    zIndex: 20,
    textAlign: 'center',
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0,   // ← add this
  }}
>
```

- [ ] **Step 3: Verify visually**

Open `http://localhost:3000/world`. On load — name/title should fade in smoothly from blur. Then the wave animation kicks in automatically (the wave tween runs regardless because it targets the element after GSAP's own state).

- [ ] **Step 4: Final build check**

Run: `npm run build`

Expected: Build succeeds, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/WorldHeroSection.tsx
git commit -m "feat: add entry fade animation for name/title block on /world"
```

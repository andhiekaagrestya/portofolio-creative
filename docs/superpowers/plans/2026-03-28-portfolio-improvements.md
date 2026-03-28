# Portfolio Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor page.tsx into section components, implement responsive design and prefers-reduced-motion support, add full-tier SEO, and apply known performance optimizations.

**Architecture:** Layer 1 extracts 10 section components from page.tsx into `src/components/sections/`. Layer 2 adds `useMediaQuery` and `useReducedMotion` hooks then applies them across components. Layer 3 adds SEO files and performance fixes with no structural changes.

**Tech Stack:** Next.js 16 App Router, GSAP + ScrollTrigger, Framer Motion, Three.js, Tailwind CSS 4, @neondatabase/serverless, next/og

---

## Layer 1 — page.tsx Refactor

### Task 1: Create hooks directory and useMediaQuery hook

**Files:**
- Create: `src/hooks/useMediaQuery.ts`

- [ ] **Step 1: Create the file**

```ts
// src/hooks/useMediaQuery.ts
'use client';

import { useState, useEffect } from 'react';

interface MediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useMediaQuery(): MediaQueryResult {
  const [result, setResult] = useState<MediaQueryResult>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 767px)');
    const tabletMq = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const update = () => {
      setResult({
        isMobile: mobileMq.matches,
        isTablet: tabletMq.matches,
        isDesktop: desktopMq.matches,
      });
    };

    update();
    mobileMq.addEventListener('change', update);
    tabletMq.addEventListener('change', update);
    desktopMq.addEventListener('change', update);

    return () => {
      mobileMq.removeEventListener('change', update);
      tabletMq.removeEventListener('change', update);
      desktopMq.removeEventListener('change', update);
    };
  }, []);

  return result;
}
```

- [ ] **Step 2: Create useReducedMotion hook**

Create `src/hooks/useReducedMotion.ts`:

```ts
// src/hooks/useReducedMotion.ts
'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useMediaQuery.ts src/hooks/useReducedMotion.ts
git commit -m "feat: add useMediaQuery and useReducedMotion hooks"
```

---

### Task 2: Extract IntroSection

**Files:**
- Create: `src/components/sections/IntroSection.tsx`
- Modify: `src/app/page.tsx` (remove intro section JSX, lines 143–238)

- [ ] **Step 1: Create IntroSection.tsx**

```tsx
// src/components/sections/IntroSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import CollageElement from '@/components/CollageElement';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const nameLine1 = 'Andhieka Agrestya';
const nameLine2 = 'Al Ara Ab';

export default function IntroSection() {
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (nameRef.current) {
      const letters = nameRef.current.querySelectorAll('.letter');
      gsap.fromTo(
        letters,
        {
          opacity: 0,
          ...(prefersReduced ? {} : { y: 100, rotateX: -90 }),
        },
        {
          opacity: 1,
          ...(prefersReduced ? {} : { y: 0, rotateX: 0 }),
          duration: prefersReduced ? 0.3 : 1.2,
          stagger: prefersReduced ? 0 : 0.05,
          ease: 'back.out(1.7)',
          delay: 0.5,
        }
      );
    }

    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, ...(prefersReduced ? {} : { y: 20 }) },
        {
          opacity: 0.6,
          ...(prefersReduced ? {} : { y: 0 }),
          duration: prefersReduced ? 0.3 : 1.5,
          delay: prefersReduced ? 0.3 : 1.5,
          ease: 'power2.out',
        }
      );
    }

    if (scrollIndicatorRef.current) {
      gsap.fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 2.5 });

      if (!prefersReduced) {
        gsap.to(scrollIndicatorRef.current, {
          y: 10,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: scrollIndicatorRef.current,
          start: '100px top',
          end: '200px top',
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ height: '120vh' }}>
      {/* Warm ambient light */}
      <div
        className="absolute w-150 h-150 rounded-full opacity-10"
        style={{
          top: '20%',
          left: '20%',
          background: 'radial-gradient(circle, rgba(196,149,106,0.4), transparent)',
          filter: 'blur(80px)',
        }}
      />

      {/* Main title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={nameRef} className="flex flex-col items-center gap-1 md:gap-2 px-4" style={{ perspective: '800px' }}>
          <div className="flex gap-1 md:gap-3 justify-center flex-wrap max-w-full">
            {nameLine1.split('').map((letter, i) => (
              <span
                key={`l1-${i}`}
                className="letter inline-block text-3xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter"
                style={{
                  fontFamily: 'var(--font-serif)',
                  color:
                    i % 3 === 0
                      ? 'var(--accent-cream)'
                      : i % 3 === 1
                      ? 'var(--accent-warm)'
                      : 'var(--accent-sepia)',
                  textShadow: '0 0 40px rgba(196,149,106,0.15)',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
          <div className="flex gap-1 md:gap-3 justify-center flex-wrap max-w-full">
            {nameLine2.split('').map((letter, i) => (
              <span
                key={`l2-${i}`}
                className="letter inline-block text-3xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter"
                style={{
                  fontFamily: 'var(--font-serif)',
                  color:
                    (i + nameLine1.length) % 3 === 0
                      ? 'var(--accent-cream)'
                      : (i + nameLine1.length) % 3 === 1
                      ? 'var(--accent-warm)'
                      : 'var(--accent-sepia)',
                  textShadow: '0 0 40px rgba(196,149,106,0.15)',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
        </div>

        <div ref={subtitleRef} className="mt-8 text-center opacity-0">
          <p
            className="text-sm md:text-base tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-warm)' }}
          >
            Fullstack Developer
          </p>
        </div>
      </div>

      <CollageElement
        src="/collage/banana-plant.png"
        alt="Banana Plant Sketch"
        width={200}
        height={200}
        className="w-45 md:w-87.5"
        style={{ top: '15%', right: '5%', rotate: '12deg', zIndex: 3 }}
        parallaxSpeed={0.3}
        animateFrom="right"
      />
      <CollageElement
        src="/collage/camera.png"
        alt="Vintage Camera"
        width={200}
        height={200}
        className="w-45 md:w-87.5"
        style={{ bottom: '25%', left: '5%', rotate: '-8deg', zIndex: 2 }}
        parallaxSpeed={0.5}
        animateFrom="left"
      />

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-warm)' }}
        >
          Scroll to explore
        </span>
        <div
          className="w-px h-12"
          style={{ background: 'linear-gradient(to bottom, var(--accent-warm), transparent)' }}
        />
      </div>

      <HandDrawnSVG
        preset="arrowCurve"
        width={80}
        height={160}
        style={{ top: '82%', left: '48%', rotate: '10deg' }}
        color="var(--accent-warm)"
        strokeWidth={2.5}
        duration={2}
        opacity={0.5}
        zIndex={3}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify page.tsx lines 143–238 match IntroSection exactly, then delete them from page.tsx and add import**

In `src/app/page.tsx`, delete lines 143–238 (the VOID / INTRO div and its contents). Then add `import IntroSection from '@/components/sections/IntroSection';` at the top imports, and place `<IntroSection />` where the section was.

Also delete `nameRef`, `subtitleRef`, `scrollIndicatorRef` refs from page.tsx, and remove their GSAP setup from the `useEffect` (lines 43–81 in the original). Remove `const nameLine1` and `const nameLine2` variables.

- [ ] **Step 3: Run dev server to verify no visual regression**

```bash
npm run dev
```

Open http://localhost:3000 and verify the intro section looks identical.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/IntroSection.tsx src/app/page.tsx
git commit -m "refactor: extract IntroSection from page.tsx"
```

---

### Task 3: Extract OriginSection

**Files:**
- Create: `src/components/sections/OriginSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create OriginSection.tsx**

```tsx
// src/components/sections/OriginSection.tsx
'use client';

import dynamic from 'next/dynamic';
import CollageElement from '@/components/CollageElement';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });
const DioramaLayer = dynamic(() => import('@/components/DioramaLayer'), { ssr: false });

export default function OriginSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '200vh' }}>
      {/* --- BACKGROUND LAYER (Deep, Slow) --- */}
      <DioramaLayer speed={0.4} className="z-0" fadeOnScroll>
        <div
          className="absolute w-125 h-125 rounded-full opacity-8"
          style={{
            top: '30%',
            left: '40%',
            background: 'radial-gradient(circle, rgba(139,105,20,0.3), transparent)',
            filter: 'blur(100px)',
          }}
        />
        <CollageElement
          src="/collage/typewriter.png"
          alt="Typewriter"
          width={200}
          height={200}
          className="w-30 md:w-87.5 top-[60%]! left-[5%]! md:top-[18%]! md:left-[15%]!"
          style={{ rotate: '-5deg', zIndex: 1 }}
          parallaxSpeed={0}
          animateFrom="left"
          magnetic
        />
      </DioramaLayer>

      {/* --- MIDGROUND LAYER (Normal Speed, Main Content) --- */}
      <DioramaLayer speed={1} className="z-5">
        <ScatteredText
          text="WHERE IT ALL BEGAN"
          style={{ top: '5%', left: '10%', rotate: '-3deg', fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          font="serif"
          weight="900"
          color="var(--accent-cream)"
          animationType="split"
          zIndex={5}
        />
        <ScatteredText
          text="// first_line_of_code"
          style={{ top: '12%', right: '15%', rotate: '2deg', fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}
          font="mono"
          color="var(--accent-warm)"
          animationType="typewriter"
          zIndex={4}
        />
        <ScatteredText
          text="curiosity drove everything"
          style={{ top: '30%', left: '55%', rotate: '5deg', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
          font="sans"
          weight="300"
          italic
          color="var(--accent-warm)"
          animationType="fade"
          zIndex={4}
        />
        <ScatteredText
          text="console.log('hello world');"
          style={{ top: '42%', left: '8%', rotate: '-1deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)' }}
          font="mono"
          color="var(--accent-sage)"
          animationType="typewriter"
          zIndex={3}
        />
      </DioramaLayer>

      {/* --- FOREGROUND LAYER (Close, Fast, Blurred) --- */}
      <DioramaLayer speed={1.8} className="z-10">
        <CollageElement
          src="/collage/fragments-new.png"
          alt="Fragments"
          width={450}
          height={450}
          style={{ top: '35%', right: '-5%', rotate: '15deg', zIndex: 10, filter: 'blur(4px)' }}
          parallaxSpeed={0}
          animateFrom="right"
        />
      </DioramaLayer>

      <HandDrawnSVG
        preset="squiggle"
        width={160}
        height={35}
        style={{ top: '50%', left: '8%', rotate: '-5deg' }}
        color="var(--accent-sepia)"
        strokeWidth={1.5}
        duration={1.8}
        opacity={0.25}
      />

      <HoverMorphText
        text="THE SPARK"
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--accent-sepia)"
        italicHover
        style={{
          position: 'absolute',
          top: '55%',
          left: '40%',
          rotate: '-8deg',
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          zIndex: 5,
        }}
      />

      <CollageElement
        src="/collage/books.png"
        alt="Books"
        width={200}
        height={200}
        className="w-30 md:w-87.5 top-[75%]! left-[60%]! md:top-[60%]! md:left-[60%]!"
        style={{ rotate: '8deg', zIndex: 2 }}
        parallaxSpeed={0.6}
        animateFrom="bottom"
      />

      <ScatteredText
        text="late nights. broken code. breakthrough."
        style={{ top: '75%', right: '5%', rotate: '3deg', fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)' }}
        font="sans"
        weight="300"
        color="var(--foreground)"
        animationType="fade"
        zIndex={4}
      />

      <CollageElement
        src="/collage/banana-plant.png"
        alt="Botanical"
        width={350}
        height={350}
        style={{ top: '80%', left: '20%', rotate: '-12deg', zIndex: 1 }}
        parallaxSpeed={0.9}
        animateFrom="scale"
        blendMode="multiply"
      />

      <HandDrawnSVG
        preset="arrowDown"
        width={50}
        height={150}
        style={{ top: '88%', right: '30%', rotate: '-8deg' }}
        color="var(--accent-sage)"
        strokeWidth={2.5}
        duration={1.5}
        opacity={0.5}
        zIndex={3}
      />

      <HandDrawnSVG
        preset="circle"
        width={90}
        height={85}
        style={{ top: '52%', left: '35%', rotate: '5deg' }}
        color="var(--accent-sepia)"
        strokeWidth={2}
        duration={2}
        opacity={0.35}
        zIndex={2}
      />
    </div>
  );
}
```

- [ ] **Step 2: Remove lines 240–402 from page.tsx, add import and `<OriginSection />`**

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/OriginSection.tsx src/app/page.tsx
git commit -m "refactor: extract OriginSection from page.tsx"
```

---

### Task 4: Extract GrowthSection

**Files:**
- Create: `src/components/sections/GrowthSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create GrowthSection.tsx**

```tsx
// src/components/sections/GrowthSection.tsx
'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import CollageElement from '@/components/CollageElement';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import MousePhysics from '@/components/MousePhysics';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });
const DioramaLayer = dynamic(() => import('@/components/DioramaLayer'), { ssr: false });

export default function GrowthSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '220vh' }}>
      {/* --- BACKGROUND LAYER --- */}
      <DioramaLayer speed={0.5} className="z-0" fadeOnScroll>
        <div
          className="absolute w-125 h-125 rounded-full opacity-8"
          style={{
            top: '20%',
            right: '20%',
            background: 'radial-gradient(circle, rgba(107,124,94,0.3), transparent)',
            filter: 'blur(100px)',
          }}
        />
        <CollageElement
          src="/collage/camera.png"
          alt="Camera"
          width={300}
          height={300}
          style={{ top: '28%', right: '5%', rotate: '10deg', zIndex: 1 }}
          parallaxSpeed={0}
          animateFrom="right"
        />
      </DioramaLayer>

      {/* --- MIDGROUND LAYER --- */}
      <DioramaLayer speed={0.9} className="z-5">
        <ScatteredText
          text="EVOLUTION"
          style={{ top: '3%', right: '8%', rotate: '6deg', fontSize: 'clamp(4rem, 10vw, 9rem)' }}
          font="serif"
          weight="900"
          color="var(--accent-warm)"
          animationType="split"
          zIndex={5}
        />
        <ScatteredText
          text="frameworks came and went"
          style={{ top: '10%', left: '5%', rotate: '-2deg', fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)' }}
          font="sans"
          weight="300"
          italic
          color="var(--accent-sage)"
          animationType="fade"
        />
        <ScatteredText
          text="npm install everything"
          style={{ top: '20%', right: '5%', rotate: '4deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)' }}
          font="mono"
          color="var(--accent-sepia)"
          animationType="typewriter"
        />
      </DioramaLayer>

      {/* --- FOREGROUND LAYER --- */}
      <DioramaLayer speed={1.5} className="z-10">
        <CollageElement
          src="/collage/compass.png"
          alt="Compass"
          width={400}
          height={400}
          style={{ top: '12%', left: '30%', rotate: '-7deg', zIndex: 10, filter: 'blur(2px)' }}
          parallaxSpeed={0}
          animateFrom="scale"
          magnetic
        />
      </DioramaLayer>

      {/* Mouse Physics Zone */}
      <MousePhysics
        className="absolute w-full"
        style={{ top: '35%', left: 0, height: '30%' }}
        radius={300}
        strength={100}
      >
        <div className="relative w-full h-full">
          <ScatteredText
            text="PUSH ME AROUND"
            style={{ top: '5%', left: '50%', fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}
            font="mono"
            color="var(--accent-warm)"
            animationType="fade"
            zIndex={10}
          />
          <div data-physics data-mass="0.8" className="absolute" style={{ top: '15%', left: '10%' }}>
            <Image src="/collage/banana-plant.png" alt="physics banana" width={160} height={160} className="pointer-events-none select-none" />
          </div>
          <div data-physics data-mass="1.2" className="absolute" style={{ top: '5%', left: '40%' }}>
            <Image src="/collage/fragments-new.png" alt="physics fragments" width={140} height={140} className="pointer-events-none select-none" />
          </div>
          <div data-physics data-mass="0.6" className="absolute" style={{ top: '25%', left: '65%' }}>
            <Image src="/collage/books.png" alt="physics books" width={180} height={180} className="pointer-events-none select-none" />
          </div>
          <div data-physics data-mass="1.0" className="absolute" style={{ top: '10%', right: '10%' }}>
            <Image src="/collage/compass.png" alt="physics compass" width={150} height={150} className="pointer-events-none select-none" />
          </div>
          <div data-physics data-mass="0.9" className="absolute" style={{ top: '40%', left: '25%' }}>
            <div
              className="text-4xl md:text-6xl font-bold cursor-pointer transition-transform hover:scale-110"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-cream)', textShadow: '0 0 30px rgba(196,149,106,0.3)' }}
            >
              PLAY
            </div>
          </div>
          <div data-physics data-mass="1.5" className="absolute" style={{ top: '35%', right: '20%' }}>
            <div
              className="text-3xl md:text-5xl font-bold cursor-pointer transition-transform hover:scale-110"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-sepia)', textShadow: '0 0 30px rgba(196,149,106,0.3)' }}
            >
              CREATE
            </div>
          </div>
        </div>
      </MousePhysics>

      <ScatteredText
        text="building systems, breaking limits"
        style={{ top: '68%', left: '12%', rotate: '-4deg', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
        font="sans"
        weight="600"
        color="var(--foreground)"
        animationType="fade"
        zIndex={4}
      />

      <CollageElement
        src="/collage/typewriter.png"
        alt="Growth"
        width={280}
        height={280}
        style={{ top: '72%', right: '15%', rotate: '-6deg', zIndex: 2 }}
        parallaxSpeed={0.4}
        animateFrom="bottom"
        magnetic
      />

      <div className="absolute left-[35%] md:left-[41%]" style={{ top: '82%', rotate: '12deg', zIndex: 6 }}>
        <HoverMorphText
          text="STACKING"
          className="reveal-text"
          font="serif"
          weight={900}
          color="var(--accent-rust)"
          italicHover
          style={{ fontSize: 'clamp(2.5rem, 12vw, 10rem)' }}
        />
      </div>

      <ScatteredText
        text="const growth = iterate(learn, build, ship);"
        style={{ top: '92%', left: '5%', rotate: '1deg', fontSize: 'clamp(0.6rem, 1vw, 0.9rem)' }}
        font="mono"
        color="var(--accent-sage)"
        animationType="typewriter"
      />

      <HandDrawnSVG
        preset="spiral"
        width={90}
        height={95}
        style={{ top: '90%', left: '45%', rotate: '15deg' }}
        color="var(--accent-rust)"
        strokeWidth={2.5}
        duration={2.5}
        opacity={0.45}
        zIndex={3}
      />
    </div>
  );
}
```

- [ ] **Step 2: Remove lines 404–579 from page.tsx, add import and `<GrowthSection />`**

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/GrowthSection.tsx src/app/page.tsx
git commit -m "refactor: extract GrowthSection from page.tsx"
```

---

### Task 5: Extract remaining 7 sections

**Files:**
- Create: `src/components/sections/SelectedWorksSection.tsx`
- Create: `src/components/sections/ManifestoSection.tsx`
- Create: `src/components/sections/FoundFootageSection.tsx`
- Create: `src/components/sections/MasterySection.tsx`
- Create: `src/components/sections/ProcessSection.tsx`
- Create: `src/components/sections/TestimonialsSection.tsx`
- Create: `src/components/sections/VisionSection.tsx`
- Modify: `src/app/page.tsx`

Each section component follows the same pattern as Tasks 2–4: copy the exact JSX from page.tsx into a new `'use client'` component, import only what that section uses, remove the JSX from page.tsx and replace with `<SectionName />`.

- [ ] **Step 1: Create SelectedWorksSection.tsx**

Copy lines 581–634 from page.tsx. Imports needed: `dynamic` (for `HoverMorphText`, `PolaroidGallery`), `ScatteredText`, `HandDrawnSVG`, `DNAHelix`.

```tsx
// src/components/sections/SelectedWorksSection.tsx
'use client';

import dynamic from 'next/dynamic';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import DNAHelix from '@/components/DNAHelix';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });
const PolaroidGallery = dynamic(() => import('@/components/PolaroidGallery'), { ssr: false });

export default function SelectedWorksSection() {
  return (
    <div className="relative w-full">
      <HoverMorphText
        text="SELECTED WORKS"
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--accent-warm)"
        italicHover
        style={{
          position: 'absolute',
          top: '5vh',
          right: '10%',
          rotate: '-2deg',
          fontSize: 'clamp(2rem, 6vw, 5rem)',
          zIndex: 10,
        }}
      />
      <div className="relative w-full pt-[10vh] min-h-[60vh] md:min-h-[80vh]">
        <PolaroidGallery />
      </div>
      <ScatteredText
        text="experiments in digital materiality"
        style={{ top: '85%', left: '15%', rotate: '3deg', fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}
        font="sans"
        italic
        color="var(--accent-sage)"
        animationType="fade"
      />
      <div
        className="relative w-full h-[60vh] md:h-[85vh] z-20 flex items-center justify-center border-y border-[#d4c5a9]/5 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      >
        <DNAHelix className="opacity-90" />
      </div>
      <HandDrawnSVG
        preset="braceLeft"
        width={40}
        height={120}
        style={{ top: '88%', right: '20%', rotate: '10deg' }}
        color="var(--accent-sepia)"
        strokeWidth={2}
        duration={2}
        opacity={0.3}
        zIndex={3}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create ManifestoSection.tsx**

Copy lines 636–804 from page.tsx. Imports: `dynamic` (HoverMorphText), `ScatteredText`, `HandDrawnSVG`, `WashiTape`.

```tsx
// src/components/sections/ManifestoSection.tsx
'use client';

import dynamic from 'next/dynamic';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import WashiTape from '@/components/WashiTape';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });

export default function ManifestoSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '180vh' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(30,25,20,0.0) 0%, rgba(10,8,5,0.6) 100%)' }}
      />
      <div
        className="absolute w-full h-0.5 left-0 pointer-events-none"
        style={{ top: '35%', background: 'linear-gradient(90deg, transparent, rgba(196,149,106,0.08), transparent)', filter: 'blur(20px)' }}
      />
      <div
        className="absolute select-none pointer-events-none"
        style={{
          top: '6%', left: '4%',
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(8rem, 22vw, 18rem)',
          fontWeight: 900,
          lineHeight: 0.9,
          color: 'var(--accent-cream)',
          opacity: 0.04,
          zIndex: 1,
        }}
      >
        I
      </div>
      <HoverMorphText text="I don't just" className="reveal-text" font="serif" weight={900} color="var(--accent-cream)" italicHover style={{ position: 'absolute', top: '8%', left: '10%', rotate: '-1deg', fontSize: 'clamp(2.5rem, 7vw, 6.5rem)', zIndex: 5 }} />
      <HoverMorphText text="write code." className="reveal-text" font="serif" weight={900} color="var(--accent-rust)" italicHover style={{ position: 'absolute', top: '17%', left: '18%', rotate: '1deg', fontSize: 'clamp(2.5rem, 7vw, 6.5rem)', zIndex: 5 }} />
      <HandDrawnSVG preset="underline" width={260} height={25} style={{ top: '25%', left: '18%', rotate: '1deg' }} color="var(--accent-rust)" strokeWidth={2.5} duration={1.2} opacity={0.5} zIndex={6} />
      <HoverMorphText text="I build" className="reveal-text" font="serif" weight={900} color="var(--foreground)" italicHover style={{ position: 'absolute', top: '33%', right: '20%', rotate: '-2deg', fontSize: 'clamp(2.5rem, 7vw, 6.5rem)', zIndex: 5 }} />
      <HoverMorphText text="experiences." className="reveal-text" font="serif" weight={900} color="var(--accent-warm)" italicHover style={{ position: 'absolute', top: '42%', right: '8%', rotate: '3deg', fontSize: 'clamp(2.5rem, 7vw, 6.5rem)', zIndex: 5 }} />
      <ScatteredText text="Systems that breathe." style={{ top: '56%', left: '12%', rotate: '-3deg', fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }} font="serif" weight="300" italic color="var(--accent-sage)" animationType="fade" zIndex={5} />
      <ScatteredText text="Interfaces that feel." style={{ top: '64%', left: '30%', rotate: '2deg', fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }} font="serif" weight="300" italic color="var(--accent-sepia)" animationType="fade" zIndex={5} />
      <ScatteredText text="Code that lasts." style={{ top: '72%', left: '55%', rotate: '-2deg', fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }} font="serif" weight="300" italic color="var(--accent-cream)" animationType="fade" zIndex={5} />
      <WashiTape color="var(--accent-warm)" pattern="stripes" width={80} height={20} rotate={-85} opacity={0.3} style={{ top: '8%', right: '8%', zIndex: 6 }} />
      <WashiTape color="var(--accent-sage)" pattern="dots" width={80} height={20} rotate={-85} opacity={0.3} style={{ top: '50%', left: '3%', zIndex: 6 }} />
      <HandDrawnSVG preset="arrowCurve" width={80} height={140} style={{ top: '86%', right: '15%', rotate: '-15deg' }} color="var(--accent-warm)" strokeWidth={2} duration={2} opacity={0.35} zIndex={3} />
    </div>
  );
}
```

- [ ] **Step 3: Create FoundFootageSection.tsx**

Copy lines 805–970. Imports: `dynamic` (HoverMorphText), `ScatteredText`, `HandDrawnSVG`, `CollageElement`.

```tsx
// src/components/sections/FoundFootageSection.tsx
'use client';

import dynamic from 'next/dynamic';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import CollageElement from '@/components/CollageElement';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });

export default function FoundFootageSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '160vh' }}>
      <div className="absolute inset-0 pointer-events-none z-10" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)` }} />
      <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,0,0.015), rgba(255,0,0,0.01), transparent 60%)' }} />
      <div className="absolute z-20" style={{ top: '4%', left: '5%' }}>
        <ScatteredText text="● REC" style={{ position: 'relative', top: 'auto', left: 'auto', rotate: '0deg', fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }} font="mono" color="var(--accent-rust)" animationType="fade" zIndex={20} className="animate-pulse" />
      </div>
      <ScatteredText text="00:42:17:09" style={{ top: '4%', right: '5%', rotate: '0deg', fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }} font="mono" color="rgba(212,197,169,0.3)" animationType="fade" zIndex={15} />
      <div className="absolute" style={{ top: '18%', left: '8%', right: '8%', zIndex: 12 }}>
        <ScatteredText text="Every great project" style={{ position: 'relative', top: 'auto', left: 'auto', rotate: '-1deg', fontSize: 'clamp(2rem, 5.5vw, 5rem)' }} font="serif" weight="900" color="var(--accent-cream)" animationType="split" zIndex={12} />
      </div>
      <HoverMorphText text="started with a" className="reveal-text" font="serif" weight={900} color="var(--foreground)" italicHover style={{ position: 'absolute', top: '30%', left: '12%', rotate: '1deg', fontSize: 'clamp(2rem, 5.5vw, 5rem)', zIndex: 12 }} />
      <HoverMorphText text="blank terminal." className="reveal-text" font="serif" weight={900} color="var(--accent-sage)" italicHover style={{ position: 'absolute', top: '41%', left: '20%', rotate: '-2deg', fontSize: 'clamp(2rem, 5.5vw, 5rem)', zIndex: 12 }} />
      <ScatteredText text="FOUND FOOTAGE" style={{ top: '60%', left: '10%', rotate: '-3deg', fontSize: 'clamp(2rem, 7vw, 6rem)' }} font="serif" weight="900" color="rgba(212,197,169,0.06)" animationType="glitch" zIndex={4} />
      <ScatteredText text="midnight sessions. cold coffee. good code." style={{ top: '68%', left: '15%', rotate: '2deg', fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }} font="sans" weight="300" italic color="var(--accent-warm)" animationType="fade" zIndex={13} />
      <ScatteredText text="the best bugs become the best stories" style={{ top: '74%', right: '8%', rotate: '-2deg', fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }} font="sans" weight="300" italic color="var(--accent-sepia)" animationType="fade" zIndex={13} />
      <div className="absolute left-0 right-0 pointer-events-none" style={{ top: 0, height: 80, background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(212,197,169,0.04) 2px, rgba(212,197,169,0.04) 4px)', opacity: 0.6 }} />
      <CollageElement src="/collage/camera.png" alt="found footage camera" width={220} height={220} style={{ top: '58%', right: '5%', rotate: '-8deg', zIndex: 8, opacity: 0.4, filter: 'saturate(0.3) brightness(0.6)' }} parallaxSpeed={0.3} animateFrom="right" />
      <HandDrawnSVG preset="arrowCurve" width={70} height={130} style={{ bottom: '3%', left: '45%', rotate: '8deg' }} color="var(--accent-sepia)" strokeWidth={2} duration={2} opacity={0.35} zIndex={3} />
    </div>
  );
}
```

- [ ] **Step 4: Create MasterySection.tsx**

Copy lines 972–1218. Imports: `dynamic` (HoverMorphText, DioramaLayer), `ScatteredText`, `HandDrawnSVG`, `CollageElement`, `DNAHelix`.

```tsx
// src/components/sections/MasterySection.tsx
'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import CollageElement from '@/components/CollageElement';
import MousePhysics from '@/components/MousePhysics';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });
const DioramaLayer = dynamic(() => import('@/components/DioramaLayer'), { ssr: false });

export default function MasterySection() {
  return (
    // Copy the exact JSX from page.tsx lines 972-1218
    // (the div with height: '250vh' and all its children)
    <div className="relative overflow-hidden" style={{ height: '250vh' }}>
      {/* Paste exact content from page.tsx lines 974-1217 here */}
    </div>
  );
}
```

**Important:** Read `src/app/page.tsx` lines 972–1218 carefully and paste the exact JSX into MasterySection. The content is too long to repeat here — copy it directly.

- [ ] **Step 5: Create ProcessSection.tsx**

Copy lines 1219–1482. Imports: `dynamic` (HoverMorphText), `ScatteredText`, `HandDrawnSVG`, `WashiTape`, `StickyNote`, `CollageElement`.

Same pattern as Step 4 — read lines 1219–1482 from page.tsx and paste exact JSX.

```tsx
// src/components/sections/ProcessSection.tsx
'use client';

import dynamic from 'next/dynamic';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import WashiTape from '@/components/WashiTape';
import StickyNote from '@/components/StickyNote';
import CollageElement from '@/components/CollageElement';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });

export default function ProcessSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '280vh' }}>
      {/* Paste exact content from page.tsx lines 1221-1481 here */}
    </div>
  );
}
```

- [ ] **Step 6: Create TestimonialsSection.tsx**

Copy lines 1484–1574. Imports: `dynamic` (HoverMorphText), `ScatteredText`, `HandDrawnSVG`, `WashiTape`, `MemoBoard`.

```tsx
// src/components/sections/TestimonialsSection.tsx
'use client';

import dynamic from 'next/dynamic';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import WashiTape from '@/components/WashiTape';
import MemoBoard from '@/components/MemoBoard';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });

export default function TestimonialsSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '180vh' }}>
      {/* Paste exact content from page.tsx lines 1486-1573 here */}
    </div>
  );
}
```

- [ ] **Step 7: Create VisionSection.tsx**

Copy lines 1576–1751. Imports: `dynamic` (HoverMorphText, DioramaLayer), `ScatteredText`, `CollageElement`.

```tsx
// src/components/sections/VisionSection.tsx
'use client';

import dynamic from 'next/dynamic';
import ScatteredText from '@/components/ScatteredText';
import CollageElement from '@/components/CollageElement';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });
const DioramaLayer = dynamic(() => import('@/components/DioramaLayer'), { ssr: false });

export default function VisionSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '200vh' }}>
      {/* Paste exact content from page.tsx lines 1578-1751 here */}
    </div>
  );
}
```

- [ ] **Step 8: Remove all extracted lines from page.tsx and replace with section imports**

After extracting all sections, `src/app/page.tsx` should look like:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll from '@/components/SmoothScroll';
import GrainOverlay from '@/components/GrainOverlay';
import LoadingScreen from '@/components/LoadingScreen';
import IntroSection from '@/components/sections/IntroSection';
import OriginSection from '@/components/sections/OriginSection';
import GrowthSection from '@/components/sections/GrowthSection';
import SelectedWorksSection from '@/components/sections/SelectedWorksSection';
import ManifestoSection from '@/components/sections/ManifestoSection';
import FoundFootageSection from '@/components/sections/FoundFootageSection';
import MasterySection from '@/components/sections/MasterySection';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import VisionSection from '@/components/sections/VisionSection';

const ParticleField = dynamic(() => import('@/components/ParticleField'), { ssr: false });
const CursorTrail = dynamic(() => import('@/components/CursorTrail'), { ssr: false });
const AmbientSound = dynamic(() => import('@/components/AmbientSound'), { ssr: false });
const TimeAwareTheme = dynamic(() => import('@/components/TimeAwareTheme'), { ssr: false });
const ScannerEffect = dynamic(() => import('@/components/ScannerEffect'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    // Scroll progress bar
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    }

    // Reveal animation for HoverMorphText elements
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach((text) => {
      gsap.fromTo(
        text,
        { opacity: 0, ...(prefersReduced ? {} : { y: 50, filter: 'blur(10px)' }) },
        {
          opacity: 1,
          ...(prefersReduced ? {} : { y: 0, filter: 'blur(0px)' }),
          duration: prefersReduced ? 0.3 : 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: text,
            start: 'top 85%',
          },
        }
      );
    });
  }, []);

  return (
    <SmoothScroll>
      <LoadingScreen />
      <TimeAwareTheme />
      <ParticleField />
      <GrainOverlay />
      <CursorTrail />
      <AmbientSound />
      <ScannerEffect />

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-100">
        <div
          ref={progressRef}
          className="h-full origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--accent-rust), var(--accent-warm), var(--accent-cream))',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      <main ref={mainRef} className="relative" style={{ zIndex: 1 }}>
        <IntroSection />
        <OriginSection />
        <GrowthSection />
        <SelectedWorksSection />
        <ManifestoSection />
        <FoundFootageSection />
        <MasterySection />
        <ProcessSection />
        <TestimonialsSection />
        <VisionSection />
      </main>
    </SmoothScroll>
  );
}
```

- [ ] **Step 9: Run dev server and verify all sections render correctly**

```bash
npm run dev
```

Scroll through the entire page. Verify each section is visually identical to before.

- [ ] **Step 10: Commit**

```bash
git add src/components/sections/ src/app/page.tsx
git commit -m "refactor: extract all sections from page.tsx — page.tsx now ~70 lines"
```

---

## Layer 2 — Responsive Design

### Task 6: CursorTrail — disable on touch devices

**Files:**
- Modify: `src/components/CursorTrail.tsx`

- [ ] **Step 1: Read the current CursorTrail.tsx and add touch + reduced motion detection**

Find the main component function. Add this state and effect at the very top, before any existing logic:

```tsx
const [shouldHide, setShouldHide] = useState(false);

useEffect(() => {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setShouldHide(isTouch || isReduced);
}, []);

if (shouldHide) return null;
```

Add `useState` to the React import if not already present.

- [ ] **Step 2: Commit**

```bash
git add src/components/CursorTrail.tsx
git commit -m "feat: disable CursorTrail on touch devices and with prefers-reduced-motion"
```

---

### Task 7: MousePhysics — touch event support

**Files:**
- Modify: `src/components/MousePhysics.tsx`

- [ ] **Step 1: Read MousePhysics.tsx and locate the useEffect that adds mousemove listener**

Inside the same `useEffect`, after the `mousemove` handler, add:

```ts
const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault();
  const touch = e.touches[0];
  mouseRef.current = { x: touch.clientX, y: touch.clientY };
};

const handleTouchEnd = (e: TouchEvent) => {
  // Trigger explosion at last touch position
  const touch = e.changedTouches[0];
  handleClick({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
};

container.addEventListener('touchmove', handleTouchMove, { passive: false });
container.addEventListener('touchend', handleTouchEnd);
```

And in the cleanup return:

```ts
container.removeEventListener('touchmove', handleTouchMove);
container.removeEventListener('touchend', handleTouchEnd);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MousePhysics.tsx
git commit -m "feat: add touch support to MousePhysics"
```

---

### Task 8: Section heights — responsive

**Files:**
- Modify: `src/components/sections/IntroSection.tsx`
- Modify: `src/components/sections/OriginSection.tsx`
- Modify: `src/components/sections/GrowthSection.tsx`
- Modify: `src/components/sections/ManifestoSection.tsx`
- Modify: `src/components/sections/FoundFootageSection.tsx`
- Modify: `src/components/sections/MasterySection.tsx`
- Modify: `src/components/sections/ProcessSection.tsx`
- Modify: `src/components/sections/TestimonialsSection.tsx`
- Modify: `src/components/sections/VisionSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add useMediaQuery to page.tsx for ScrollTrigger.refresh()**

In `src/app/page.tsx`:

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Inside Home():
const { isMobile } = useMediaQuery();

// Inside useEffect, add dependency on isMobile and call refresh:
useEffect(() => {
  // ... existing code ...
  ScrollTrigger.refresh();
}, [isMobile]);
```

- [ ] **Step 2: Update each section's outer div height using useMediaQuery**

In each section component, import `useMediaQuery` and replace the fixed height with a conditional:

For **IntroSection**:
```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Inside component:
const { isMobile, isTablet } = useMediaQuery();
const height = isMobile ? '80vh' : isTablet ? '100vh' : '120vh';

// On the outer div:
<div className="relative overflow-hidden" style={{ height }}>
```

For **OriginSection**: `isMobile ? '130vh' : isTablet ? '160vh' : '200vh'`
For **GrowthSection**: `isMobile ? '140vh' : isTablet ? '180vh' : '220vh'`
For **ManifestoSection**: `isMobile ? '120vh' : isTablet ? '150vh' : '180vh'`
For **FoundFootageSection**: `isMobile ? '120vh' : isTablet ? '140vh' : '160vh'`
For **MasterySection**: `isMobile ? '180vh' : isTablet ? '220vh' : '250vh'`
For **ProcessSection**: `isMobile ? '200vh' : isTablet ? '240vh' : '280vh'`
For **TestimonialsSection**: `isMobile ? '140vh' : isTablet ? '160vh' : '180vh'`
For **VisionSection**: `isMobile ? '160vh' : isTablet ? '180vh' : '200vh'`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ src/app/page.tsx
git commit -m "feat: responsive section heights using useMediaQuery"
```

---

### Task 9: MemoBoard — mobile positions

**Files:**
- Modify: `src/components/MemoBoard.tsx`

- [ ] **Step 1: Read MemoBoard.tsx and find the SEED_CARDS array**

Add `pos_top_mobile` and `pos_left_mobile` to the Note interface and each SEED_CARD entry:

```ts
interface Note {
  id: string;
  name: string;
  role: string;
  message: string;
  color: string;
  rotate: number;
  pos_top: string;
  pos_left: string;
  pos_top_mobile?: string;
  pos_left_mobile?: string;
  created_at: string;
}

const SEED_CARDS: Note[] = [
  { id: 'seed-1', pos_top: '6%', pos_left: '5%', pos_top_mobile: '3%', pos_left_mobile: '5%', ... },
  { id: 'seed-2', pos_top: '4%', pos_left: '33%', pos_top_mobile: '3%', pos_left_mobile: '55%', ... },
  { id: 'seed-3', pos_top: '12%', pos_left: '60%', pos_top_mobile: '32%', pos_left_mobile: '5%', ... },
  { id: 'seed-4', pos_top: '45%', pos_left: '10%', pos_top_mobile: '32%', pos_left_mobile: '55%', ... },
  { id: 'seed-5', pos_top: '50%', pos_left: '45%', pos_top_mobile: '62%', pos_left_mobile: '5%', ... },
];
```

- [ ] **Step 2: Add isMobile detection and apply mobile positions**

At the top of the MemoBoard component:

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Inside component:
const { isMobile } = useMediaQuery();

// When rendering each note, use mobile position if available:
const top = isMobile ? (note.pos_top_mobile ?? note.pos_top) : note.pos_top;
const left = isMobile ? (note.pos_left_mobile ?? note.pos_left) : note.pos_left;
```

For API-fetched notes without mobile positions, assign a 2-column grid layout when `isMobile`:

```tsx
const getMobilePosition = (index: number) => ({
  top: `${3 + Math.floor(index / 2) * 28}%`,
  left: index % 2 === 0 ? '5%' : '55%',
});
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MemoBoard.tsx
git commit -m "feat: responsive MemoBoard positions for mobile"
```

---

## Layer 2 — prefers-reduced-motion

### Task 10: CollageElement — reduced motion

**Files:**
- Modify: `src/components/CollageElement.tsx`

- [ ] **Step 1: Add reduced motion check at start of useEffect**

```tsx
useEffect(() => {
  if (!elementRef.current) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = elementRef.current;

  // Entry animation — skip y/rotation movement if reduced
  if (animateFrom !== 'static') {
    const fromVars: Record<string, number | string> = { opacity: 0 };
    const toVars: Record<string, number | string> = {
      opacity: 1,
      duration: prefersReduced ? 0.3 : 1.5,
      ease: 'power2.out',
    };

    if (!prefersReduced) {
      switch (animateFrom) {
        case 'left':
          fromVars.x = -200; fromVars.rotation = -15;
          toVars.x = 0; toVars.rotation = parseFloat(style.rotate || '0');
          break;
        case 'right':
          fromVars.x = 200; fromVars.rotation = 15;
          toVars.x = 0; toVars.rotation = parseFloat(style.rotate || '0');
          break;
        case 'top':
          fromVars.y = -200; fromVars.rotation = -10;
          toVars.y = 0; toVars.rotation = parseFloat(style.rotate || '0');
          break;
        case 'bottom':
          fromVars.y = 200; fromVars.rotation = 10;
          toVars.y = 0; toVars.rotation = parseFloat(style.rotate || '0');
          break;
        case 'scale':
          fromVars.scale = 0; fromVars.rotation = Math.random() * 30 - 15;
          toVars.scale = 1; toVars.rotation = parseFloat(style.rotate || '0');
          break;
      }
    }

    gsap.fromTo(el, fromVars, {
      ...toVars,
      scrollTrigger: { trigger: el, start: scrollStart, end: scrollEnd, toggleActions: 'play none none reverse' },
    });
  }

  // Parallax — skip if reduced motion
  if (!prefersReduced) {
    gsap.to(el, {
      yPercent: -100 * parallaxSpeed,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  }

  // Magnetic — skip if reduced motion
  if (magnetic && !prefersReduced) {
    // ... existing magnetic code unchanged ...
  }
}, [animateFrom, magnetic, parallaxSpeed, scrollEnd, scrollStart, style.rotate]);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CollageElement.tsx
git commit -m "feat: respect prefers-reduced-motion in CollageElement"
```

---

### Task 11: ParticleField — reduced motion

**Files:**
- Modify: `src/components/ParticleField.tsx`

- [ ] **Step 1: Read ParticleField.tsx and locate particleCount and velocities setup**

Add reduced motion check after the component opens:

```tsx
useEffect(() => {
  if (!containerRef.current) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleCount = prefersReduced ? 500 : 1500;
  // ... rest of existing code unchanged
```

Then where velocities are set (the loop):
```ts
velocities[i3] = prefersReduced ? 0 : (Math.random() - 0.5) * 0.002;
velocities[i3 + 1] = prefersReduced ? 0 : (Math.random() - 0.5) * 0.002;
velocities[i3 + 2] = prefersReduced ? 0 : (Math.random() - 0.5) * 0.001;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ParticleField.tsx
git commit -m "feat: reduce particles and freeze velocity for prefers-reduced-motion"
```

---

### Task 12: ScannerEffect and DioramaLayer — reduced motion

**Files:**
- Modify: `src/components/ScannerEffect.tsx`
- Modify: `src/components/DioramaLayer.tsx`

- [ ] **Step 1: Read ScannerEffect.tsx — add early return for reduced motion**

Add at the very start of the component function:

```tsx
const [isReduced, setIsReduced] = useState(false);
useEffect(() => {
  setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}, []);
if (isReduced) return null;
```

Add `useState` to React import if not present.

- [ ] **Step 2: Read DioramaLayer.tsx — add reduced motion check**

DioramaLayer creates a parallax scroll effect by translating the container's Y based on scroll. Find where it applies the Y transform (likely in a useEffect with a scroll listener). Add:

```tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Then wherever yOffset is applied:
const effectiveSpeed = prefersReduced ? 0 : speed;
```

This keeps the layer visible but removes the parallax movement.

- [ ] **Step 3: Commit**

```bash
git add src/components/ScannerEffect.tsx src/components/DioramaLayer.tsx
git commit -m "feat: respect prefers-reduced-motion in ScannerEffect and DioramaLayer"
```

---

### Task 13: MousePhysics — reduced motion fallback

**Files:**
- Modify: `src/components/MousePhysics.tsx`

- [ ] **Step 1: Add reduced motion detection — render children without physics wrapper**

At the top of the MousePhysics component:

```tsx
const [isReduced, setIsReduced] = useState(false);
useEffect(() => {
  setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}, []);

if (isReduced) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MousePhysics.tsx
git commit -m "feat: MousePhysics renders static children when prefers-reduced-motion"
```

---

## Layer 3 — SEO

### Task 14: Update layout.tsx with full metadata and JSON-LD

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx with updated version**

```tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andhiekaagrestya.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Andhieka Agrestya — Software Engineer & Creative Developer',
  description:
    'Andhieka Agrestya is a Software Engineer and Creative Developer from Indonesia, specializing in fullstack development with Next.js, Go, and PostgreSQL. Explore an experimental portfolio built with collage animation, scrollytelling, and interactive physics.',
  keywords: [
    'andhieka agrestya',
    'andhieka',
    'software engineer',
    'creative developer',
    'fullstack developer',
    'frontend developer',
    'react developer',
    'nextjs developer',
    'indonesia',
    'portfolio',
  ],
  authors: [{ name: 'Andhieka Agrestya', url: SITE_URL }],
  creator: 'Andhieka Agrestya',
  publisher: 'Andhieka Agrestya',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    title: 'Andhieka Agrestya — Software Engineer & Creative Developer',
    description:
      'Software Engineer from Indonesia. Experimental portfolio with collage animation, scrollytelling, and interactive physics.',
    siteName: 'Andhieka Agrestya',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Andhieka Agrestya — Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andhieka Agrestya — Software Engineer & Creative Developer',
    description:
      'Software Engineer from Indonesia. Experimental portfolio with collage animation, scrollytelling, and interactive physics.',
    creator: '@andhiekaagrestya',
    images: ['/opengraph-image'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Andhieka Agrestya',
  jobTitle: 'Software Engineer',
  url: SITE_URL,
  sameAs: [
    'https://github.com/andhiekaagrestya',
    'https://linkedin.com/in/andhiekaagrestya',
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased overflow-x-hidden hide-native-cursor">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: full SEO metadata, OG tags, and JSON-LD Person schema"
```

---

### Task 15: Dynamic OG image

**Files:**
- Create: `src/app/opengraph-image.tsx`

- [ ] **Step 1: Create the OG image route**

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Andhieka Agrestya — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#1a1409',
          fontFamily: 'serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://andhiekaagrestya.netlify.app/logo.png"
            width={120}
            height={120}
            alt="logo"
            style={{ borderRadius: '50%' }}
          />
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, paddingLeft: '60px' }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: '#f5e6c8', lineHeight: 1 }}>
            Andhieka Agrestya
          </div>
          <div style={{ fontSize: 32, color: '#c4956a', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            Software Engineer
          </div>
          <div style={{ fontSize: 22, color: '#8b6914', fontFamily: 'monospace', marginTop: '16px' }}>
            andhiekaagrestya.netlify.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: Verify OG image renders at `/opengraph-image`**

```bash
npm run dev
```

Open http://localhost:3000/opengraph-image in browser. Should see a 1200×630 image.

- [ ] **Step 3: Commit**

```bash
git add src/app/opengraph-image.tsx
git commit -m "feat: dynamic OG image via next/og"
```

---

### Task 16: Sitemap and robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create sitemap.ts**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andhiekaagrestya.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
```

- [ ] **Step 2: Create robots.ts**

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andhiekaagrestya.netlify.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Verify both routes work**

```bash
npm run dev
```

- Open http://localhost:3000/sitemap.xml — should show XML with one URL entry
- Open http://localhost:3000/robots.txt — should show allow rules and sitemap pointer

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap.xml and robots.txt"
```

---

## Layer 3 — Performance

### Task 17: CollageElement sizes prop

**Files:**
- Modify: `src/components/CollageElement.tsx`

- [ ] **Step 1: Add sizes prop to the Next.js Image component inside CollageElement**

Find the `<Image>` tag in CollageElement.tsx and add a `sizes` prop:

```tsx
<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
  className="pointer-events-none select-none"
  style={{ filter: 'saturate(1.2) contrast(1.05)' }}
/>
```

Also remove the `priority` prop — `CollageElement` is used throughout the page and only images in the initial viewport should have `priority`. Setting it on all instances hurts performance.

- [ ] **Step 2: Commit**

```bash
git add src/components/CollageElement.tsx
git commit -m "perf: add sizes prop and remove blanket priority from CollageElement"
```

---

### Task 18: TapeRoll3D Suspense wrapper

**Files:**
- Modify: `src/components/MemoBoard.tsx` (or wherever TapeRoll3D is used)

- [ ] **Step 1: Find where TapeRoll3D is rendered**

Search for `TapeRoll3D` usage:

```bash
grep -rn "TapeRoll3D" src/
```

- [ ] **Step 2: Wrap with Suspense**

```tsx
import { Suspense } from 'react';
import TapeRoll3D from '@/components/TapeRoll3D';

// Wherever TapeRoll3D is rendered:
<Suspense fallback={null}>
  <TapeRoll3D />
</Suspense>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MemoBoard.tsx
git commit -m "perf: wrap TapeRoll3D in Suspense"
```

---

### Task 19: Final build verification

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: Build completes with no errors. Warnings about image optimization or bundle size are acceptable — note them but do not block.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Fix any errors found. Warnings are acceptable.

- [ ] **Step 3: Manual smoke test on dev server**

```bash
npm run dev
```

Check:
- [ ] Intro section name animation works
- [ ] All 10 sections render and scroll correctly
- [ ] Scroll progress bar animates
- [ ] Open http://localhost:3000/opengraph-image — OG image renders
- [ ] Open http://localhost:3000/sitemap.xml — XML visible
- [ ] Open http://localhost:3000/robots.txt — text visible
- [ ] Open DevTools → Network → disable cache → verify no console errors

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete portfolio improvements — responsive, a11y, SEO, performance"
```

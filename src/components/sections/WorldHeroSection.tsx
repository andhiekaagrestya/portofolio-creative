'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useScrollHijack } from '@/hooks/useScrollHijack';
import ClothHeroSection from './ClothHeroSection';

// ─── Seeded RNG (LCG) — deterministic, no external deps ─────────────────────
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// ─── Deep-space starfield config ─────────────────────────────────────────────
const LEVELS = [
  { z: -1_000,     fadeAt: 1_000,     baseOpacity: 1.0,   count: 4  },
  { z: -5_000,     fadeAt: 5_000,     baseOpacity: 0.9,   count: 8  },
  { z: -15_000,    fadeAt: 15_000,    baseOpacity: 0.8,   count: 12 },
  { z: -40_000,    fadeAt: 40_000,    baseOpacity: 0.6,   count: 18 },
  { z: -100_000,   fadeAt: 100_000,   baseOpacity: 0.4,   count: 25 },
  { z: -250_000,   fadeAt: 250_000,   baseOpacity: 0.2,   count: 32 },
  { z: -600_000,   fadeAt: 600_000,   baseOpacity: 0.1,   count: 40 },
];

const POSITIONS_PER_LEVEL: React.CSSProperties[][] = LEVELS.map(({ count }, li) => {
  const rng = makeRng(li * 997 + 42);
  return Array.from({ length: count }, () => ({
    top:  `${(rng() * 200 - 50).toFixed(1)}%`,
    left: `${(rng() * 200 - 50).toFixed(1)}%`,
  }));
});

const ROTATIONS_PER_LEVEL: string[][] = LEVELS.map(({ count }, li) => {
  const rng = makeRng(li * 1337 + 77);
  return Array.from({ length: count }, () => {
    return `${Math.round(rng() * 360)}deg`;
  });
});

const PHOTO_SRCS: (string | null)[][] = LEVELS.map(({ count }) =>
  Array(count).fill(null)
);

const PERSPECTIVE = 20_000;

export default function WorldHeroSection() {
  const { sectionRef, progress } = useScrollHijack<HTMLDivElement>({ sensitivity: 0.0008 });
  const nameTitleRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const clothWrapRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<HTMLDivElement[]>([]);

  // Entry animation
  useEffect(() => {
    if (!nameTitleRef.current) return;
    gsap.fromTo(
      nameTitleRef.current,
      { opacity: 0, y: 30, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, delay: 0.3, ease: 'power3.out' }
    );
  }, []);

  // Wave animation on name/title
  useEffect(() => {
    if (!nameTitleRef.current) return;
    const tween = gsap.to(nameTitleRef.current, {
      y: 10, rotation: 1.2, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.7,
    });
    return () => { tween.kill(); };
  }, []);

  // Float-up on the 2 closest levels
  useEffect(() => {
    [0, 1].forEach((li) => {
      const layer = layerRefs.current[li];
      if (!layer) return;
      layer.querySelectorAll<HTMLElement>(':scope > div').forEach((el, i) => {
        gsap.to(el, { y: -15 - i * 4, duration: 4.5 + i * 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.7 });
      });
    });
  }, []);

  // ─── Scroll effect: name recedes, cloth rises ───────────────────────────────
  useEffect(() => {
    if (!nameTitleRef.current || !clothWrapRef.current || !worldRef.current) return;

    // Phase 1 (0→0.5): Name + title recede backward, cloth slides up to cover
    // Phase 2 (0.5→1): Cloth continues to fill screen

    const nameProgress = Math.min(progress / 0.4, 1); // 0→1 during first 40%
    const clothProgress = Math.min(progress / 0.6, 1); // 0→1 during first 60%

    // Name recedes: scale down, move up slightly, fade out
    gsap.set(nameTitleRef.current, {
      scale: 1 - nameProgress * 0.4,
      z: -nameProgress * 800,
      opacity: 1 - nameProgress,
      filter: `blur(${nameProgress * 6}px)`,
    });

    // Starfield also recedes with name
    gsap.set(worldRef.current, {
      scale: 1 - nameProgress * 0.15,
      opacity: 1 - nameProgress * 0.8,
    });

    // Cloth slides up from below: starts at 65vh (peeking), moves to 0vh (covering)
    const clothY = 65 - clothProgress * 65; // 65 → 0
    gsap.set(clothWrapRef.current, {
      y: `${clothY}vh`,
    });
  }, [progress]);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        perspective: `${PERSPECTIVE}px`,
        perspectiveOrigin: '50% 50%',
        background: '#111',
      }}
    >
      {/* 3D world container */}
      <div
        ref={worldRef}
        style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
      >
        {LEVELS.map((level, li) => (
          <div
            key={li}
            ref={el => { if (el) layerRefs.current[li] = el; }}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: level.baseOpacity,
              transformStyle: 'preserve-3d',
            }}
          >
            {POSITIONS_PER_LEVEL[li].map((pos, pi) => {
              const src = PHOTO_SRCS[li]?.[pi] ?? null;
              return (
                <div
                  key={pi}
                  style={{
                    position: 'absolute',
                    ...pos,
                    rotate: ROTATIONS_PER_LEVEL[li][pi],
                    transform: `translateZ(${level.z}px) scale(${[1.2, 0.9, 0.6, 0.4, 0.2, 0.08, 0.03, 0.01][li] || 1})`,
                    width: 90,
                    background: '#f4f1e1',
                    padding: '6px 6px 22px 6px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                    userSelect: 'none',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: `translateX(-50%) rotate(${parseFloat(ROTATIONS_PER_LEVEL[li][pi]) * 0.5}deg)`,
                    width: 40,
                    height: 12,
                    background: 'rgba(235,225,205,0.85)',
                    backdropFilter: 'blur(2px)',
                  }} />
                  <div style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    background: '#0a0a0a',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={`level ${li + 1} photo ${pi + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(0.3) contrast(1.1)' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 18, height: 14, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1 }} />
                        <div style={{ color: 'rgba(255,255,255,0.12)', fontSize: 7, fontFamily: 'monospace' }}>
                          {li + 1}·{pi + 1}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: 4,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontFamily: 'var(--font-serif)',
                    fontSize: 7,
                    color: '#6e5d50',
                    opacity: 0.5,
                    letterSpacing: 1,
                  }}>
                    {li + 1} — {pi + 1}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Name + Title — centered, single line */}
      <div
        ref={nameTitleRef}
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0,
          willChange: 'transform, opacity, filter',
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
            whiteSpace: 'nowrap',
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
            whiteSpace: 'nowrap',
          }}
        >
          Software Engineer
        </p>
      </div>

      {/* Cloth — peeking from below, slides up on scroll */}
      <div
        ref={clothWrapRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 30,
          transform: 'translateY(65vh)',
          willChange: 'transform',
          pointerEvents: progress > 0.1 ? 'auto' : 'none',
        }}
      >
        <ClothHeroSection embedded />
      </div>
    </div>
  );
}

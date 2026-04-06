'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScatteredText from '@/components/ScatteredText';
import { useScrollHijack } from '@/hooks/useScrollHijack';

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

export default function WorldHeroSection() {
  const { sectionRef, progress } = useScrollHijack<HTMLDivElement>({ sensitivity: 0.001 });
  const nameTitleRef = useRef<HTMLDivElement>(null);
  const closeLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const farLayerRef = useRef<HTMLDivElement>(null);

  // Wave animation on name/title — starts after entry animation completes (delay 1.7s)
  useEffect(() => {
    if (!nameTitleRef.current) return;

    const tween = gsap.to(nameTitleRef.current, {
      y: 10,
      rotation: 1.2,
      duration: 2.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1.7,
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Float-up animation for close layer items — each at slightly different rhythm
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

  // Fly-through: update mid + far layer opacity based on scroll progress
  useEffect(() => {
    if (!midLayerRef.current || !farLayerRef.current) return;

    const midOpacity = Math.min(1, 0.55 + (progress / 0.5) * 0.45);
    const farProgress = Math.max(0, (progress - 0.5) / 0.5);
    const farOpacity = Math.min(1, 0.25 + farProgress * 0.75);

    gsap.set(midLayerRef.current, { opacity: midOpacity });
    gsap.set(farLayerRef.current, { opacity: farOpacity });
  }, [progress]);

  return (
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

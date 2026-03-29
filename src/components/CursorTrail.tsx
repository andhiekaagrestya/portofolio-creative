'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const PULL_RADIUS = 260; // px — masuk radius langsung force ke BH

function CursorTrailInner() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const bhEl = document.querySelector('[data-blackhole]') as HTMLElement | null;

      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;
      let lerpSpeed = 0.15;

      if (bhEl) {
        const rect = bhEl.getBoundingClientRect();
        const bhX = rect.left + rect.width / 2;
        const bhY = rect.top + rect.height / 2;
        const dist = Math.hypot(mousePos.current.x - bhX, mousePos.current.y - bhY);

        if (dist < PULL_RADIUS) {
          // Langsung force ke tengah BH
          targetX = bhX;
          targetY = bhY;
          lerpSpeed = 0.12; // sedikit smooth supaya tidak terlalu rigid
        }
      }

      const dx = targetX - cursorPos.current.x;
      const dy = targetY - cursorPos.current.y;
      cursorPos.current.x += dx * lerpSpeed;
      cursorPos.current.y += dy * lerpSpeed;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 12}px, ${cursorPos.current.y - 12}px)`;
      }

      // Trail dots
      trailsRef.current.forEach((trail, i) => {
        const delay = (i + 1) * 0.08;
        const tx = targetX - 4;
        const ty = targetY - 4;
        setTimeout(() => {
          if (trail) {
            trail.style.transform = `translate(${tx}px, ${ty}px)`;
            trail.style.opacity = `${1 - (i + 1) * 0.15}`;
          }
        }, delay * 1000);
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Trail dots - warm sepia */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailsRef.current[i] = el; }}
          className="fixed top-0 left-0 rounded-full pointer-events-none"
          style={{
            width: 8 - i,
            height: 8 - i,
            background: `rgba(196, 149, 106, ${0.5 - i * 0.07})`,
            zIndex: 99998,
            transition: 'opacity 0.3s ease',
          }}
        />
      ))}
      {/* Main cursor - warm cream ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{ zIndex: 99999 }}
      >
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 rounded-full border opacity-70" style={{ borderColor: 'var(--accent-cream)' }} />
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'var(--accent-warm)' }} />
        </div>
      </div>
    </>
  );
}

export default function CursorTrail() {
  const prefersReduced = useReducedMotion();
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (isTouch || prefersReduced) return null;
  return <CursorTrailInner />;
}

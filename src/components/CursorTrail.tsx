'use client';

import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Smooth cursor follow
      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;
      cursorPos.current.x += dx * 0.15;
      cursorPos.current.y += dy * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 12}px, ${cursorPos.current.y - 12}px)`;
      }

      // Trail dots
      trailsRef.current.forEach((trail, i) => {
        const delay = (i + 1) * 0.08;
        const tx = mousePos.current.x - 4;
        const ty = mousePos.current.y - 4;
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

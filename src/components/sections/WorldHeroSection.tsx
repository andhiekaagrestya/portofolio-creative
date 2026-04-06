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

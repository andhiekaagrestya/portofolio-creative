'use client';

import dynamic from 'next/dynamic';
import CollageElement from '@/components/CollageElement';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';

import { useMediaQuery } from '@/hooks/useMediaQuery';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });

export default function FoundFootageSection() {
  const { isMobile, isTablet } = useMediaQuery();
  const height = isMobile ? '120vh' : isTablet ? '140vh' : '160vh';

  return (
    <div className="relative overflow-hidden" style={{ height }}>

      {/* VHS scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          )`,
        }}
      />

      {/* VHS color bleed */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,0,0.015), rgba(255,0,0,0.01), transparent 60%)',
        }}
      />

      {/* REC indicator */}
      <div
        className="absolute z-20"
        style={{ top: '4%', left: '5%' }}
      >
        <ScatteredText
          text="● REC"
          style={{ position: 'relative', top: 'auto', left: 'auto', rotate: '0deg', fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}
          font="mono"
          color="var(--accent-rust)"
          animationType="fade"
          zIndex={20}
          className="animate-pulse"
        />
      </div>

      {/* Timestamp */}
      <ScatteredText
        text="00:42:17:09"
        style={{ top: '4%', right: '5%', rotate: '0deg', fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}
        font="mono"
        color="rgba(212,197,169,0.3)"
        animationType="fade"
        zIndex={15}
      />

      {/* Main VHS quote */}
      <div className="absolute" style={{ top: '18%', left: '8%', right: '8%', zIndex: 12 }}>
        <ScatteredText
          text="Every great project"
          style={{ position: 'relative', top: 'auto', left: 'auto', rotate: '-1deg', fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
          font="serif"
          weight="900"
          color="var(--accent-cream)"
          animationType="split"
          zIndex={12}
        />
      </div>

      <HoverMorphText
        text="started with a"
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--foreground)"
        italicHover
        style={{
          position: 'absolute',
          top: '30%',
          left: '12%',
          rotate: '1deg',
          fontSize: 'clamp(2rem, 5.5vw, 5rem)',
          zIndex: 12,
        }}
      />

      <HoverMorphText
        text="blank terminal."
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--accent-sage)"
        italicHover
        style={{
          position: 'absolute',
          top: '41%',
          left: '20%',
          rotate: '-2deg',
          fontSize: 'clamp(2rem, 5.5vw, 5rem)',
          zIndex: 12,
        }}
      />

      {/* Chromatic aberration effect on a word — using text-shadow */}
      <ScatteredText
        text="FOUND FOOTAGE"
        style={{ top: '60%', left: '10%', rotate: '-3deg', fontSize: 'clamp(2rem, 7vw, 6rem)' }}
        font="serif"
        weight="900"
        color="rgba(212,197,169,0.06)"
        animationType="glitch"
        zIndex={4}
      />

      {/* Behind-the-scenes scattered notes */}
      <ScatteredText
        text="midnight sessions. cold coffee. good code."
        style={{ top: '68%', left: '15%', rotate: '2deg', fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}
        font="sans"
        weight="300"
        italic
        color="var(--accent-warm)"
        animationType="fade"
        zIndex={13}
      />
      <ScatteredText
        text="the best bugs become the best stories"
        style={{ top: '74%', right: '8%', rotate: '-2deg', fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}
        font="sans"
        weight="300"
        italic
        color="var(--accent-sepia)"
        animationType="fade"
        zIndex={13}
      />

      {/* VHS static at top */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: 0,
          height: 80,
          background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(212,197,169,0.04) 2px, rgba(212,197,169,0.04) 4px)',
          opacity: 0.6,
        }}
      />

      {/* Collage element in VHS section */}
      <CollageElement
        src="/collage/camera.png"
        alt="found footage camera"
        width={220}
        height={220}
        style={{ top: '58%', right: '5%', rotate: '-8deg', zIndex: 8, opacity: 0.4, filter: 'saturate(0.3) brightness(0.6)' }}
        parallaxSpeed={0.3}
        animateFrom="right"
      />

      {/* Connector to Mastery */}
      <HandDrawnSVG
        preset="arrowCurve"
        width={70}
        height={130}
        style={{ bottom: '3%', left: '45%', rotate: '8deg' }}
        color="var(--accent-sepia)"
        strokeWidth={2}
        duration={2}
        opacity={0.35}
        zIndex={3}
      />
    </div>
  );
}

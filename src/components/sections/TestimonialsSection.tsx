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

      {/* Warm ambient light */}
      <div className="absolute w-150 h-150 rounded-full pointer-events-none"
        style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(196,149,106,0.06), transparent)', filter: 'blur(100px)' }} />

      {/* Section heading */}
      <HoverMorphText
        text="VOICES"
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--accent-sepia)"
        italicHover
        style={{
          position: 'absolute',
          top: '1%',
          right: '8%',
          rotate: '4deg',
          fontSize: 'clamp(4rem, 13vw, 11rem)',
          zIndex: 5,
          opacity: 0.15,
        }}
      />

      <ScatteredText
        text="people i've had the privilege of working with"
        style={{ top: '2%', left: '5%', rotate: '-1deg', fontSize: 'clamp(0.75rem, 1.3vw, 1rem)' }}
        font="sans"
        weight="300"
        italic
        color="var(--accent-warm)"
        animationType="fade"
        zIndex={6}
      />

      {/* Hand-drawn circle accent */}
      <HandDrawnSVG
        preset="circle"
        width={100}
        height={90}
        style={{ top: '1%', left: '2%', rotate: '-8deg' }}
        color="var(--accent-rust)"
        strokeWidth={2}
        duration={2}
        opacity={0.25}
        zIndex={4}
      />

      {/* The cork board area */}
      <div className="absolute" style={{ top: '8%', left: '2%', right: '2%', bottom: '15%' }}>
        <MemoBoard />
      </div>

      {/* Washi tape pinning the board */}
      <WashiTape
        color="var(--accent-rust)"
        pattern="stripes"
        width={120}
        height={22}
        rotate={-2}
        opacity={0.35}
        style={{ top: '7%', left: '45%', zIndex: 7 }}
      />

      {/* Bottom quote */}
      <ScatteredText
        text="every collab is a co-creation"
        style={{ bottom: '5%', left: '30%', rotate: '-1deg', fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)' }}
        font="sans"
        weight="300"
        italic
        color="var(--accent-sage)"
        animationType="fade"
        zIndex={5}
      />

      {/* connector to Vision */}
      <HandDrawnSVG
        preset="arrowCurve"
        width={70}
        height={130}
        style={{ bottom: '2%', right: '30%', rotate: '-12deg' }}
        color="var(--accent-cream)"
        strokeWidth={2.5}
        duration={2}
        opacity={0.35}
        zIndex={3}
      />
    </div>
  );
}

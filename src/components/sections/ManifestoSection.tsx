'use client';

import dynamic from 'next/dynamic';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import WashiTape from '@/components/WashiTape';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });

export default function ManifestoSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '180vh' }}>

      {/* Heavy paper texture background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(30,25,20,0.0) 0%, rgba(10,8,5,0.6) 100%)',
        }}
      />

      {/* Ink bleed ambient glow */}
      <div className="absolute w-full h-0.5 left-0 pointer-events-none"
        style={{ top: '35%', background: 'linear-gradient(90deg, transparent, rgba(196,149,106,0.08), transparent)', filter: 'blur(20px)' }}
      />

      {/* Giant initial drop cap */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          top: '6%',
          left: '4%',
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

      {/* Manifesto lines — each staggered */}
      <HoverMorphText
        text="I don't just"
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--accent-cream)"
        italicHover
        style={{
          position: 'absolute',
          top: '8%',
          left: '10%',
          rotate: '-1deg',
          fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
          zIndex: 5,
        }}
      />
      <HoverMorphText
        text="write code."
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--accent-rust)"
        italicHover
        style={{
          position: 'absolute',
          top: '17%',
          left: '18%',
          rotate: '1deg',
          fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
          zIndex: 5,
        }}
      />

      {/* Hand-drawn underline under 'write code' */}
      <HandDrawnSVG
        preset="underline"
        width={260}
        height={25}
        style={{ top: '25%', left: '18%', rotate: '1deg' }}
        color="var(--accent-rust)"
        strokeWidth={2.5}
        duration={1.2}
        opacity={0.5}
        zIndex={6}
      />

      <HoverMorphText
        text="I build"
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--foreground)"
        italicHover
        style={{
          position: 'absolute',
          top: '33%',
          right: '20%',
          rotate: '-2deg',
          fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
          zIndex: 5,
        }}
      />
      <HoverMorphText
        text="experiences."
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--accent-warm)"
        italicHover
        style={{
          position: 'absolute',
          top: '42%',
          right: '8%',
          rotate: '3deg',
          fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
          zIndex: 5,
        }}
      />

      <ScatteredText
        text="Systems that breathe."
        style={{ top: '56%', left: '12%', rotate: '-3deg', fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }}
        font="serif"
        weight="300"
        italic
        color="var(--accent-sage)"
        animationType="fade"
        zIndex={5}
      />
      <ScatteredText
        text="Interfaces that feel."
        style={{ top: '64%', left: '30%', rotate: '2deg', fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }}
        font="serif"
        weight="300"
        italic
        color="var(--accent-sepia)"
        animationType="fade"
        zIndex={5}
      />
      <ScatteredText
        text="Code that lasts."
        style={{ top: '72%', left: '55%', rotate: '-2deg', fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }}
        font="serif"
        weight="300"
        italic
        color="var(--accent-cream)"
        animationType="fade"
        zIndex={5}
      />

      {/* Washi tape on side */}
      <WashiTape
        color="var(--accent-sepia)"
        pattern="solid"
        width={6}
        height={200}
        rotate={0}
        opacity={0.2}
        style={{ top: '20%', left: '2%', zIndex: 3, width: 6, height: 200 }}
      />

      {/* Connector */}
      <HandDrawnSVG
        preset="arrowDown"
        width={50}
        height={130}
        style={{ bottom: '3%', left: '48%', rotate: '3deg' }}
        color="var(--accent-warm)"
        strokeWidth={2}
        duration={1.5}
        opacity={0.35}
        zIndex={3}
      />
    </div>
  );
}

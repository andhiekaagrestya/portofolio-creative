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
          zIndex: 10
        }}
      />

      <div className="relative w-full pt-[10vh] min-h-[60vh] md:min-h-[80vh]">
        <PolaroidGallery />
      </div>
      <ScatteredText
        text="experiments in digital materiality"

        style={{ top: '85%', left: '1' + '5%', rotate: '3deg', fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}
        font="sans"
        italic
        color="var(--accent-sage)"
        animationType="fade"
      />

      {/* === ORGANIC DNA HELIX === */}
      <div
        className="relative w-full h-[60vh] md:h-[85vh] z-20 flex items-center justify-center border-y border-[#d4c5a9]/5 overflow-hidden"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
      >
        {/* No background - Transparent */}
        <DNAHelix className="opacity-90" />
      </div>

      {/* Hand-drawn connector: Selected Works → Mastery */}
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

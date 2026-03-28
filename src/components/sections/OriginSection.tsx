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
        {/* Warm projector glow */}
        <div className="absolute w-125 h-125 rounded-full opacity-8"
          style={{ top: '30%', left: '40%', background: 'radial-gradient(circle, rgba(139,105,20,0.3), transparent)', filter: 'blur(100px)' }} />

        <CollageElement // Restored opening tag
          src="/collage/typewriter.png"
          alt="Typewriter"
          width={200}
          height={200}
          className="w-30 md:w-87.5 top-[60%]! left-[5%]! md:top-[18%]! md:left-[15%]!"
          style={{ rotate: '-5deg', zIndex: 1 }}
          parallaxSpeed={0} // Disable internal parallax to let DioramaLayer handle it
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
          width={450} // Made larger to emphasize foreground
          height={450}
          style={{ top: '35%', right: '-5%', rotate: '15deg', zIndex: 10, filter: 'blur(4px)' }} // Blur applies depth of field
          parallaxSpeed={0} // Disable internal parallax
          animateFrom="right"
        />
      </DioramaLayer>

      {/* Hand-drawn squiggle near the spark */}
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
          zIndex: 5
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

      {/* Hand-drawn connector: Chapter 1 → Chapter 2 */}
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

      {/* Hand-drawn circle accent */}
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

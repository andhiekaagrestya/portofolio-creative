'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import CollageElement from '@/components/CollageElement';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import MousePhysics from '@/components/MousePhysics';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });
const DioramaLayer = dynamic(() => import('@/components/DioramaLayer'), { ssr: false });

export default function GrowthSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '220vh' }}>
      {/* --- BACKGROUND LAYER --- */}
      <DioramaLayer speed={0.5} className="z-0" fadeOnScroll>
        <div className="absolute w-125 h-125 rounded-full opacity-8"
          style={{ top: '20%', right: '20%', background: 'radial-gradient(circle, rgba(107,124,94,0.3), transparent)', filter: 'blur(100px)' }} />

        <CollageElement
          src="/collage/camera.png"
          alt="Camera"
          width={300}
          height={300}
          style={{ top: '28%', right: '5%', rotate: '10deg', zIndex: 1 }}
          parallaxSpeed={0}
          animateFrom="right"
        />
      </DioramaLayer>

      {/* --- MIDGROUND LAYER --- */}
      <DioramaLayer speed={0.9} className="z-5">
        <ScatteredText
          text="EVOLUTION"
          style={{ top: '3%', right: '8%', rotate: '6deg', fontSize: 'clamp(4rem, 10vw, 9rem)' }}
          font="serif"
          weight="900"
          color="var(--accent-warm)"
          animationType="split"
          zIndex={5}
        />

        <ScatteredText
          text="frameworks came and went"
          style={{ top: '10%', left: '5%', rotate: '-2deg', fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)' }}
          font="sans"
          weight="300"
          italic
          color="var(--accent-sage)"
          animationType="fade"
        />

        <ScatteredText
          text="npm install everything"
          style={{ top: '20%', right: '5%', rotate: '4deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)' }}
          font="mono"
          color="var(--accent-sepia)"
          animationType="typewriter"
        />
      </DioramaLayer>

      {/* --- FOREGROUND LAYER --- */}
      <DioramaLayer speed={1.5} className="z-10">
        <CollageElement
          src="/collage/compass.png"
          alt="Compass"
          width={400}
          height={400}
          style={{ top: '12%', left: '30%', rotate: '-7deg', zIndex: 10, filter: 'blur(2px)' }}
          parallaxSpeed={0}
          animateFrom="scale"
          magnetic
        />
      </DioramaLayer>

      {/* Mouse Physics Zone */}
      <MousePhysics
        className="absolute w-full"
        style={{ top: '35%', left: 0, height: '30%' }}
        radius={300}
        strength={100}
      >
        <div className="relative w-full h-full">
          <ScatteredText
            text="PUSH ME AROUND"
            style={{ top: '5%', left: '50%', fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}
            font="mono"
            color="var(--accent-warm)"
            animationType="fade"
            zIndex={10}
          />

          <div data-physics data-mass="0.8" className="absolute" style={{ top: '15%', left: '10%' }}>
            <Image src="/collage/banana-plant.png" alt="physics banana" width={160} height={160}
              className="pointer-events-none select-none" />
          </div>
          <div data-physics data-mass="1.2" className="absolute" style={{ top: '5%', left: '40%' }}>
            <Image src="/collage/fragments-new.png" alt="physics fragments" width={140} height={140}
              className="pointer-events-none select-none" />
          </div>
          <div data-physics data-mass="0.6" className="absolute" style={{ top: '25%', left: '65%' }}>
            <Image src="/collage/books.png" alt="physics books" width={180} height={180}
              className="pointer-events-none select-none" />
          </div>
          <div data-physics data-mass="1.0" className="absolute" style={{ top: '10%', right: '10%' }}>
            <Image src="/collage/compass.png" alt="physics compass" width={150} height={150}
              className="pointer-events-none select-none" />
          </div>
          <div data-physics data-mass="0.9" className="absolute" style={{ top: '40%', left: '25%' }}>
            <div className="text-4xl md:text-6xl font-bold cursor-pointer transition-transform hover:scale-110" style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--accent-cream)',
              textShadow: '0 0 30px rgba(196,149,106,0.3)'
            }}>
              PLAY
            </div>
          </div>

          <div data-physics data-mass="1.5" className="absolute" style={{ top: '35%', right: '20%' }}>
            <div className="text-3xl md:text-5xl font-bold cursor-pointer transition-transform hover:scale-110" style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--accent-sepia)', // Changed from sepia to cream for visibility
              textShadow: '0 0 30px rgba(196,149,106,0.3)'
            }}>
              CREATE
            </div>
          </div>
        </div>
      </MousePhysics>

      <ScatteredText
        text="building systems, breaking limits"
        style={{ top: '68%', left: '12%', rotate: '-4deg', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
        font="sans"
        weight="600"
        color="var(--foreground)"
        animationType="fade"
        zIndex={4}
      />

      <CollageElement
        src="/collage/typewriter.png"
        alt="Growth"
        width={280}
        height={280}
        style={{ top: '72%', right: '15%', rotate: '-6deg', zIndex: 2 }}
        parallaxSpeed={0.4}
        animateFrom="bottom"
        magnetic
      />

      <div
        className="absolute left-[35%] md:left-[41%]"
        style={{ top: '82%', rotate: '12deg', zIndex: 6 }}
      >
        <HoverMorphText
          text="STACKING"
          className="reveal-text"
          font="serif"
          weight={900}
          color="var(--accent-rust)"
          italicHover
          style={{
            fontSize: 'clamp(2.5rem, 12vw, 10rem)',
          }}
        />
      </div>

      <ScatteredText
        text="const growth = iterate(learn, build, ship);"
        style={{ top: '92%', left: '5%', rotate: '1deg', fontSize: 'clamp(0.6rem, 1vw, 0.9rem)' }}
        font="mono"
        color="var(--accent-sage)"
        animationType="typewriter"
      />
      {/* Hand-drawn connector: Chapter 2 → Selected Works */}
      <HandDrawnSVG
        preset="spiral"
        width={90}
        height={95}
        style={{ top: '90%', left: '45%', rotate: '15deg' }}
        color="var(--accent-rust)"
        strokeWidth={2.5}
        duration={2.5}
        opacity={0.45}
        zIndex={3}
      />
    </div>
  );
}

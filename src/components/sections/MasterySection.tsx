'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import CollageElement from '@/components/CollageElement';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import MousePhysics from '@/components/MousePhysics';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });

export default function MasterySection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '250vh' }}>
      <div className="absolute w-150 h-150 rounded-full opacity-8"
        style={{ top: '10%', left: '10%', background: 'radial-gradient(circle, rgba(196,149,106,0.25), transparent)', filter: 'blur(120px)' }} />

      <ScatteredText
        text="MASTERY"
        style={{ top: '2%', left: '5%', rotate: '-5deg', fontSize: 'clamp(3rem, 14vw, 12rem)' }}
        font="serif"
        weight="900"
        color="var(--accent-cream)"
        animationType="split"
        zIndex={5}
      />

      <ScatteredText
        text="is a direction, not a destination"
        style={{ top: '8%', left: '20%', rotate: '2deg', fontSize: 'clamp(0.9rem, 1.5vw, 1.3rem)' }}
        font="sans"
        weight="300"
        italic
        color="var(--accent-warm)"
        animationType="fade"
      />

      {/* Dense scrapbook cluster */}
      <CollageElement
        src="/collage/banana-plant.png"
        alt="Mastery 1"
        width={320}
        height={320}
        className="w-35 md:w-80 top-[55%]! left-[5%]! md:top-[13%]! md:left-[5%]!"
        style={{ rotate: '-8deg', zIndex: 4 }}
        parallaxSpeed={0.3}
        animateFrom="left"
        magnetic
      />
      <CollageElement
        src="/collage/compass.png"
        alt="Mastery 2"
        width={280}
        height={280}
        className="w-30 md:w-70 top-[60%]! left-[70%]! md:top-[15%]! md:left-[35%]!"
        style={{ rotate: '5deg', zIndex: 3 }}
        parallaxSpeed={0.5}
        animateFrom="scale"
      />
      <CollageElement
        src="/collage/books.png"
        alt="Mastery 3"
        width={250}
        height={250}
        className="w-25 md:w-62.5 top-[25%]! right-[5%]! md:top-[18%]! md:right-[8%]!"
        style={{ rotate: '-12deg', zIndex: 5 }}
        parallaxSpeed={0.7}
        animateFrom="right"
        magnetic
      />
      <CollageElement
        src="/collage/typewriter.png"
        alt="Mastery 4"
        width={200}
        height={200}
        style={{ top: '25%', left: '50%', rotate: '18deg', zIndex: 2 }}
        parallaxSpeed={0.4}
        animateFrom="bottom"
      />
      <CollageElement
        src="/collage/camera.png"
        alt="Mastery 5"
        width={240}
        height={240}
        style={{ top: '22%', left: '20%', rotate: '-3deg', zIndex: 6 }}
        parallaxSpeed={0.6}
        animateFrom="top"
      />
      <CollageElement
        src="/collage/fragments-new.png"
        alt="Mastery 6"
        width={180}
        height={180}
        style={{ top: '28%', right: '30%', rotate: '22deg', zIndex: 4 }}
        parallaxSpeed={0.8}
        animateFrom="scale"
      />

      {/* Hand-drawn underline for mastery text */}
      <HandDrawnSVG
        preset="underline"
        width={200}
        height={25}
        style={{ top: '39.5%', left: '8%', rotate: '-2deg' }}
        color="var(--accent-warm)"
        strokeWidth={1.5}
        duration={1.2}
        delay={0.3}
        opacity={0.2}
        zIndex={6}
      />

      <ScatteredText
        text="fullstack. systems. infrastructure."
        style={{ top: '38%', left: '8%', rotate: '-2deg', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
        font="sans"
        weight="500"
        color="var(--foreground)"
        animationType="fade"
        zIndex={7}
      />

      <ScatteredText
        text="async function buildTheFuture() {"
        style={{ top: '42%', right: '10%', rotate: '3deg', fontSize: 'clamp(0.6rem, 1vw, 0.9rem)' }}
        font="mono"
        color="var(--accent-sage)"
        animationType="typewriter"
      />

      {/* Second Mouse Physics Zone */}
      <MousePhysics
        className="absolute w-full"
        style={{ top: '46%', left: 0, height: '25%' }}
        radius={350}
        strength={120}
        springStiffness={0.02}
        damping={0.9}
      >
        <div className="relative w-full h-full">
          <ScatteredText
            text="← click to explode →"
            style={{ top: '0%', left: '35%', fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}
            font="mono"
            color="var(--accent-sepia)"
            animationType="fade"
            zIndex={10}
          />

          <div data-physics data-mass="0.5" className="absolute" style={{ top: '15%', left: '5%' }}>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border opacity-30" style={{ borderColor: 'var(--accent-warm)' }} />
          </div>
          <div data-physics data-mass="0.7" className="absolute" style={{ top: '10%', left: '8%' }}>
            <Image src="/collage/banana-plant.png" alt="p1" width={130} height={130}
              className="pointer-events-none select-none rounded-lg w-20 md:w-32.5" />
          </div>
          <div data-physics data-mass="1.0" className="absolute" style={{ top: '20%', left: '50%' }}>
            <div className="text-5xl md:text-7xl font-bold" style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--accent-warm)',
              textShadow: '0 0 40px rgba(196,149,106,0.3)'
            }}>
              BREAK
            </div>
          </div>
          <div data-physics data-mass="0.8" className="absolute" style={{ top: '5%', right: '15%' }}>
            <Image src="/collage/camera.png" alt="p2" width={150} height={150}
              className="pointer-events-none select-none" />
          </div>
          <div data-physics data-mass="1.3" className="absolute" style={{ top: '35%', left: '70%' }}>
            <div className="text-4xl md:text-6xl font-bold" style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--accent-rust)',
              textShadow: '0 0 30px rgba(160,82,45,0.3)'
            }}>
              REBUILD
            </div>
          </div>
          <div data-physics data-mass="0.6" className="absolute" style={{ top: '30%', left: '15%' }}>
            <div className="w-16 h-16 md:w-20 md:h-20 border rotate-45 opacity-20" style={{ borderColor: 'var(--accent-sepia)' }} />
          </div>
          <div data-physics data-mass="0.9" className="absolute" style={{ top: '40%', left: '40%' }}>
            <Image src="/collage/fragments-new.png" alt="p3" width={120} height={120}
              className="pointer-events-none select-none" />
          </div>
        </div>
      </MousePhysics>

      <HoverMorphText
        text="DEPTH"
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--accent-sepia)"
        italicHover
        style={{
          position: 'absolute',
          top: '74%',
          right: '10%',
          rotate: '-10deg',
          fontSize: 'clamp(4rem, 16vw, 14rem)',
          zIndex: 6
        }}
      />

      <CollageElement
        src="/collage/books.png"
        alt="Depth"
        width={350}
        height={350}
        style={{ top: '78%', left: '10%', rotate: '7deg', zIndex: 3 }}
        parallaxSpeed={0.3}
        animateFrom="left"
      />

      <ScatteredText
        text="every pixel tells a story"
        style={{ top: '88%', left: '40%', rotate: '4deg', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
        font="sans"
        weight="300"
        italic
        color="var(--accent-warm)"
        animationType="fade"
      />

      <ScatteredText
        text="return { experience: infinite };"
        style={{ top: '93%', right: '8%', rotate: '-2deg', fontSize: 'clamp(0.6rem, 1vw, 0.9rem)' }}
        font="mono"
        color="var(--accent-sage)"
        animationType="typewriter"
      />
      {/* Hand-drawn connector: Chapter 3 → Chapter 4 */}
      <HandDrawnSVG
        preset="arrowCurve"
        width={70}
        height={140}
        style={{ top: '90%', left: '55%', rotate: '-15deg' }}
        color="var(--accent-cream)"
        strokeWidth={2.5}
        duration={2}
        opacity={0.4}
        zIndex={3}
      />

      {/* Hand-drawn cross accent */}
      <HandDrawnSVG
        preset="crossMark"
        width={45}
        height={45}
        style={{ top: '85%', left: '15%', rotate: '12deg' }}
        color="var(--accent-rust)"
        strokeWidth={2}
        duration={1.2}
        opacity={0.3}
        zIndex={2}
      />
    </div>
  );
}

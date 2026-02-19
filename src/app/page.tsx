'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import SmoothScroll from '@/components/SmoothScroll';
import CollageElement from '@/components/CollageElement';
import ScatteredText from '@/components/ScatteredText';
import MousePhysics from '@/components/MousePhysics';
import GrainOverlay from '@/components/GrainOverlay';
import LoadingScreen from '@/components/LoadingScreen';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import DNAHelix from '../components/DNAHelix';

// Dynamic imports for browser-only components (no SSR to fix hydration)
const ParticleField = dynamic(() => import('@/components/ParticleField'), { ssr: false });
const CursorTrail = dynamic(() => import('@/components/CursorTrail'), { ssr: false });
const AmbientSound = dynamic(() => import('@/components/AmbientSound'), { ssr: false });
const TimeAwareTheme = dynamic(() => import('@/components/TimeAwareTheme'), { ssr: false });
const PolaroidGallery = dynamic(() => import('@/components/PolaroidGallery'), { ssr: false });
const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    // Name entrance animation
    if (nameRef.current) {
      const letters = nameRef.current.querySelectorAll('.letter');
      gsap.fromTo(letters,
        { opacity: 0, y: 100, rotateX: -90 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.2, stagger: 0.05,
          ease: 'back.out(1.7)',
          delay: 0.5,
        }
      );
    }

    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.6, y: 0, duration: 1.5, delay: 1.5, ease: 'power2.out' }
      );
    }

    // Scroll indicator pulse
    if (scrollIndicatorRef.current) {
      gsap.fromTo(scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2.5 }
      );
      gsap.to(scrollIndicatorRef.current, {
        y: 10, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut'
      });
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: mainRef.current,
          start: '100px top',
          end: '200px top',
          scrub: true,
        },
      });
    }

    // Scroll progress bar
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    }

    // Reveal animation for HoverMorphText elements
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach((text) => {
      gsap.fromTo(text,
        { opacity: 0, y: 50, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: text,
            start: 'top 85%',
          }
        }
      );
    });
  }, []);

  const nameLine1 = 'Andhieka Agrestya';
  const nameLine2 = 'Al Ara Ab';

  return (
    <SmoothScroll>
      <LoadingScreen />
      <TimeAwareTheme />
      <ParticleField />
      <GrainOverlay />
      <CursorTrail />
      <AmbientSound />

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[100]">
        <div
          ref={progressRef}
          className="h-full origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--accent-rust), var(--accent-warm), var(--accent-cream))',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      <main ref={mainRef} className="relative" style={{ zIndex: 1 }}>

        {/* ==================== VOID / INTRO ==================== */}
        <div className="relative" style={{ height: '120vh' }}>
          {/* Warm ambient light - like projector glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-10"
            style={{ top: '20%', left: '20%', background: 'radial-gradient(circle, rgba(196,149,106,0.4), transparent)', filter: 'blur(80px)' }} />

          {/* Main title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div ref={nameRef} className="flex flex-col items-center gap-1 md:gap-2 px-4" style={{ perspective: '800px' }}>
              {/* Line 1: Andhieka Agrestya */}
              <div className="flex gap-1 md:gap-3 justify-center">
                {nameLine1.split('').map((letter, i) => (
                  <span
                    key={`l1-${i}`}
                    className="letter inline-block text-4xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: i % 3 === 0 ? 'var(--accent-cream)' :
                        i % 3 === 1 ? 'var(--accent-warm)' : 'var(--accent-sepia)',
                      textShadow: '0 0 40px rgba(196,149,106,0.15)',
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </div>
              {/* Line 2: Al Ara Ab */}
              <div className="flex gap-1 md:gap-3 justify-center">
                {nameLine2.split('').map((letter, i) => (
                  <span
                    key={`l2-${i}`}
                    className="letter inline-block text-4xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: (i + nameLine1.length) % 3 === 0 ? 'var(--accent-cream)' :
                        (i + nameLine1.length) % 3 === 1 ? 'var(--accent-warm)' : 'var(--accent-sepia)',
                      textShadow: '0 0 40px rgba(196,149,106,0.15)',
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </div>
            </div>

            <div ref={subtitleRef} className="mt-8 text-center opacity-0">
              <p className="text-sm md:text-base tracking-[0.3em] uppercase"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-warm)' }}>
                Fullstack Developer
              </p>
            </div>
          </div>

          {/* Scrapbook collage peeks */}
          <CollageElement
            src="/collage/banana-plant.png"
            alt="Banana Plant Sketch"
            width={350}
            height={350}
            style={{ top: '15%', right: '8%', rotate: '12deg', zIndex: 3 }}
            parallaxSpeed={0.3}
            animateFrom="right"
          />
          <CollageElement
            src="/collage/camera.png"
            alt="Vintage Camera"
            width={350}
            height={350}
            style={{ bottom: '20%', left: '5%', rotate: '-8deg', zIndex: 2 }}
            parallaxSpeed={0.5}
            animateFrom="left"
          />

          {/* Scroll indicator */}
          <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
            <span className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-warm)' }}>
              Scroll to explore
            </span>
            <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, var(--accent-warm), transparent)' }} />
          </div>

          {/* Hand-drawn connector: Intro → Chapter 1 */}
          <HandDrawnSVG
            preset="arrowCurve"
            width={80}
            height={160}
            style={{ top: '82%', left: '48%', rotate: '10deg' }}
            color="var(--accent-warm)"
            strokeWidth={2.5}
            duration={2}
            opacity={0.5}
            zIndex={3}
          />
        </div>

        {/* ==================== ORIGIN / CHAPTER 1 ==================== */}
        <div className="relative" style={{ height: '200vh' }}>
          {/* Warm projector glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-8"
            style={{ top: '30%', left: '40%', background: 'radial-gradient(circle, rgba(139,105,20,0.3), transparent)', filter: 'blur(100px)' }} />

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

          <CollageElement
            src="/collage/typewriter.png"
            alt="Typewriter"
            width={350}
            height={350}
            style={{ top: '18%', left: '15%', rotate: '-5deg', zIndex: 3 }}
            parallaxSpeed={0.4}
            animateFrom="left"
            magnetic
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

          <CollageElement
            src="/collage/fragments-new.png"
            alt="Fragments"
            width={350}
            height={350}
            style={{ top: '35%', right: '10%', rotate: '15deg', zIndex: 2 }}
            parallaxSpeed={0.7}
            animateFrom="right"
          />

          <ScatteredText
            text="console.log('hello world');"
            style={{ top: '42%', left: '8%', rotate: '-1deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)' }}
            font="mono"
            color="var(--accent-sage)"
            animationType="typewriter"
            zIndex={3}
          />

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
            width={350}
            height={350}
            style={{ top: '60%', left: '60%', rotate: '8deg', zIndex: 2 }}
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

        {/* ==================== GROWTH / CHAPTER 2 ==================== */}
        <div className="relative" style={{ height: '220vh' }}>
          <div className="absolute w-[500px] h-[500px] rounded-full opacity-8"
            style={{ top: '20%', right: '20%', background: 'radial-gradient(circle, rgba(107,124,94,0.3), transparent)', filter: 'blur(100px)' }} />

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

          <CollageElement
            src="/collage/compass.png"
            alt="Compass"
            width={400}
            height={400}
            style={{ top: '12%', left: '30%', rotate: '-7deg', zIndex: 3 }}
            parallaxSpeed={0.3}
            animateFrom="scale"
            magnetic
          />

          <ScatteredText
            text="npm install everything"
            style={{ top: '20%', right: '5%', rotate: '4deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)' }}
            font="mono"
            color="var(--accent-sepia)"
            animationType="typewriter"
          />

          <CollageElement
            src="/collage/camera.png"
            alt="Camera"
            width={300}
            height={300}
            style={{ top: '28%', right: '5%', rotate: '10deg', zIndex: 2 }}
            parallaxSpeed={0.5}
            animateFrom="right"
          />

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

          <HoverMorphText
            text="STACKING"
            className="reveal-text"
            font="serif"
            weight={900}
            color="var(--accent-rust)"
            italicHover
            style={{
              position: 'absolute',
              top: '82%',
              left: '50%',
              rotate: '12deg',
              fontSize: 'clamp(5rem, 12vw, 10rem)',
              zIndex: 6
            }}
          />

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
        <div className="h-[20vh] w-full" />


        {/* ==================== SELECTED WORKS ==================== */}
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
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              zIndex: 10
            }}
          />

          <div className="relative w-full pt-[20vh]">
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
            className="relative w-full h-[85vh] z-20 flex items-center justify-center border-y border-[#d4c5a9]/5 overflow-hidden"
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

        {/* ==================== MASTERY / CHAPTER 3 ==================== */}
        <div className="relative" style={{ height: '250vh' }}>
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-8"
            style={{ top: '10%', left: '10%', background: 'radial-gradient(circle, rgba(196,149,106,0.25), transparent)', filter: 'blur(120px)' }} />

          <ScatteredText
            text="MASTERY"
            style={{ top: '2%', left: '5%', rotate: '-5deg', fontSize: 'clamp(5rem, 14vw, 12rem)' }}
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
            style={{ top: '13%', left: '5%', rotate: '-8deg', zIndex: 4 }}
            parallaxSpeed={0.3}
            animateFrom="left"
            magnetic
          />
          <CollageElement
            src="/collage/compass.png"
            alt="Mastery 2"
            width={280}
            height={280}
            style={{ top: '15%', left: '35%', rotate: '5deg', zIndex: 3 }}
            parallaxSpeed={0.5}
            animateFrom="scale"
          />
          <CollageElement
            src="/collage/books.png"
            alt="Mastery 3"
            width={250}
            height={250}
            style={{ top: '18%', right: '8%', rotate: '-12deg', zIndex: 5 }}
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
              <div data-physics data-mass="0.7" className="absolute" style={{ top: '10%', left: '25%' }}>
                <Image src="/collage/banana-plant.png" alt="p1" width={130} height={130}
                  className="pointer-events-none select-none rounded-lg" />
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
              fontSize: 'clamp(6rem, 16vw, 14rem)',
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

        {/* ==================== VISION / CHAPTER 4 ==================== */}
        <div className="relative" style={{ height: '200vh' }}>
          <div className="absolute w-[700px] h-[700px] rounded-full opacity-6"
            style={{ top: '20%', left: '30%', background: 'radial-gradient(circle, rgba(196,149,106,0.2), transparent)', filter: 'blur(120px)' }} />

          <HoverMorphText
            text="WHAT'S NEXT"
            className="reveal-text"
            font="serif"
            weight={900}
            color="var(--foreground)"
            italicHover
            style={{
              position: 'absolute',
              top: '5%',
              left: '15%',
              rotate: '3deg',
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              zIndex: 5
            }}
          />

          <ScatteredText
            text="the future is unwritten code"
            style={{ top: '14%', right: '10%', rotate: '-3deg', fontSize: 'clamp(0.9rem, 1.5vw, 1.3rem)' }}
            font="sans"
            weight="300"
            italic
            color="var(--accent-warm)"
            animationType="fade"
          />

          <CollageElement
            src="/collage/compass.png"
            alt="Future"
            width={380}
            height={380}
            style={{ top: '18%', left: '25%', rotate: '-4deg', zIndex: 3 }}
            parallaxSpeed={0.2}
            animateFrom="scale"
            magnetic
          />

          <CollageElement
            src="/collage/fragments-new.png"
            alt="Vision"
            width={250}
            height={250}
            style={{ top: '25%', right: '10%', rotate: '14deg', zIndex: 4 }}
            parallaxSpeed={0.5}
            animateFrom="right"
          />

          <ScatteredText
            text="// TODO: change the world"
            style={{ top: '40%', left: '5%', rotate: '1deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)' }}
            font="mono"
            color="var(--accent-sage)"
            animationType="typewriter"
          />

          <ScatteredText
            text="INFINITE"
            style={{ top: '48%', left: '20%', rotate: '-6deg', fontSize: 'clamp(5rem, 14vw, 12rem)' }}
            font="serif"
            weight="900"
            color="var(--accent-sepia)"
            animationType="glitch"
            zIndex={6}
          />

          <CollageElement
            src="/collage/banana-plant.png"
            alt="Infinite banana"
            width={300}
            height={300}
            style={{ top: '55%', left: '50%', rotate: '-20deg', zIndex: 2 }}
            parallaxSpeed={0.6}
            animateFrom="bottom"
          />

          <ScatteredText
            text="POSSIBILITIES"
            style={{ top: '55%', right: '5%', rotate: '8deg', fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            font="serif"
            weight="900"
            color="var(--accent-warm)"
            animationType="split"
            zIndex={5}
          />

          {/* Contact scattered */}
          <div className="absolute" style={{ top: '72%', left: 0, right: 0, height: '28%' }}>
            <ScatteredText
              text="LET'S CONNECT"
              style={{ top: '5%', left: '30%', rotate: '-2deg', fontSize: 'clamp(2rem, 5vw, 4rem)' }}
              font="serif"
              weight="700"
              color="var(--accent-cream)"
              animationType="split"
              zIndex={5}
            />

            <ScatteredText
              text="hello@nanobanana.dev"
              style={{ top: '30%', left: '20%', rotate: '3deg', fontSize: 'clamp(1rem, 2.5vw, 2rem)' }}
              font="mono"
              color="var(--accent-warm)"
              animationType="typewriter"
              zIndex={4}
            />

            <ScatteredText
              text="github.com/andhiekaagrestya"
              style={{ top: '45%', right: '15%', rotate: '-4deg', fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}
              font="mono"
              color="var(--accent-sage)"
              animationType="typewriter"
              zIndex={4}
            />

            <ScatteredText
              text="@agresstya"
              style={{ top: '60%', left: '45%', rotate: '6deg', fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}
              font="mono"
              color="var(--accent-rust)"
              animationType="typewriter"
              zIndex={4}
            />

            <CollageElement
              src="/collage/typewriter.png"
              alt="Final"
              width={200}
              height={200}
              style={{ top: '20%', left: '5%', rotate: '25deg', zIndex: 1 }}
              parallaxSpeed={0.3}
              animateFrom="left"
            />

            <CollageElement
              src="/collage/books.png"
              alt="Final books"
              width={280}
              height={280}
              style={{ top: '40%', right: '5%', rotate: '-15deg', zIndex: 1 }}
              parallaxSpeed={0.5}
              animateFrom="right"
            />
          </div>

          {/* Final fade-out text */}
          <ScatteredText
            text="© Andhieka Agrestya 2026"
            style={{ bottom: '2%', left: '40%', rotate: '0deg', fontSize: 'clamp(0.6rem, 0.8vw, 0.8rem)' }}
            font="mono"
            color="rgba(212,197,169,0.3)"
            animationType="fade"
          />
        </div>

      </main>
    </SmoothScroll >
  );
}

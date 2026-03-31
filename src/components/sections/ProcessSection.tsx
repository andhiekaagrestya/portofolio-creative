'use client';

import dynamic from 'next/dynamic';
import CollageElement from '@/components/CollageElement';
import ScatteredText from '@/components/ScatteredText';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import WashiTape from '@/components/WashiTape';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });
const ClothReceiptSection = dynamic(() => import('@/components/sections/ClothReceiptSection'), { ssr: false });

export default function ProcessSection() {
  const { isMobile, isTablet } = useMediaQuery();
  const height = isMobile ? '200vh' : isTablet ? '240vh' : '280vh';

  return (
    <div className="relative" style={{ height, overflow: 'clip' }}>

      {/* Ambient warm glow */}
      <div className="absolute w-200 h-200 rounded-full pointer-events-none"
        style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(196,149,106,0.07), transparent)', filter: 'blur(120px)' }} />

      {/* ── CHAPTER TITLE ── */}
      <HoverMorphText
        text="THE PROCESS"
        className="reveal-text"
        font="serif"
        weight={900}
        color="var(--accent-cream)"
        italicHover
        style={{
          position: 'absolute',
          top: '3%',
          left: '8%',
          rotate: '-3deg',
          fontSize: 'clamp(3rem, 10vw, 8rem)',
          zIndex: 5,
        }}
      />
      <ScatteredText
        text="// how the sausage gets made"
        style={{ top: '9%', left: '10%', rotate: '1deg', fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}
        font="mono"
        color="var(--accent-sage)"
        animationType="typewriter"
        zIndex={4}
      />

      {/* Hand-drawn underline on title */}
      <HandDrawnSVG
        preset="underline"
        width={180}
        height={22}
        style={{ top: '5%', left: '8%', rotate: '-2deg' }}
        color="var(--accent-rust)"
        strokeWidth={2}
        duration={1.5}
        delay={0.2}
        opacity={0.4}
        zIndex={6}
      />

      {/* ── WASHI TAPE ACCENTS ── */}
      <WashiTape
        color="#ffb3c6"
        pattern="stripes"
        width={200}
        height={26}
        rotate={-35}
        opacity={0.45}
        style={{ top: '5%', right: '3%', zIndex: 6 }}
      />
      <WashiTape
        color="var(--accent-sage)"
        pattern="dots"
        width={160}
        height={24}
        rotate={15}
        opacity={0.4}
        style={{ top: '18%', left: '-2%', zIndex: 6 }}
      />
      <WashiTape
        color="#ffcc99"
        pattern="zigzag"
        width={220}
        height={28}
        rotate={-10}
        opacity={0.5}
        style={{ top: '55%', right: '5%', zIndex: 6 }}
      />
      <WashiTape
        color="var(--accent-warm)"
        pattern="stripes"
        width={140}
        height={22}
        rotate={42}
        opacity={0.35}
        style={{ top: '80%', left: '10%', zIndex: 6 }}
      />

      {/* ── TIMESTAMP LOG TRAIL ── */}
      <ScatteredText
        text="[02:47am] fixed the hydration bug"
        style={{ top: '22%', left: '28%', rotate: '-1deg', fontSize: 'clamp(0.65rem, 1vw, 0.85rem)' }}
        font="mono"
        color="var(--accent-sage)"
        animationType="typewriter"
        zIndex={7}
      />
      <ScatteredText
        text="[11:13pm] pushed to main. yolo."
        style={{ top: '27%', left: '55%', rotate: '2deg', fontSize: 'clamp(0.65rem, 1vw, 0.85rem)' }}
        font="mono"
        color="var(--accent-warm)"
        animationType="typewriter"
        zIndex={7}
      />
      <ScatteredText
        text="[05:01am] coffee #4. still going."
        style={{ top: '48%', left: '10%', rotate: '-2deg', fontSize: 'clamp(0.65rem, 1vw, 0.85rem)' }}
        font="mono"
        color="var(--accent-rust)"
        animationType="typewriter"
        zIndex={7}
      />
      <ScatteredText
        text="[12:00pm] it works. no idea why."
        style={{ top: '53%', right: '8%', rotate: '3deg', fontSize: 'clamp(0.65rem, 1vw, 0.85rem)' }}
        font="mono"
        color="var(--accent-cream)"
        animationType="typewriter"
        zIndex={7}
      />
      <ScatteredText
        text="[09:22am] shipped. slept. repeat."
        style={{ top: '70%', left: '35%', rotate: '-1deg', fontSize: 'clamp(0.65rem, 1vw, 0.85rem)' }}
        font="mono"
        color="var(--accent-sage)"
        animationType="typewriter"
        zIndex={7}
      />

      {/* ── QUOTES as ScatteredText ── */}
      <ScatteredText
        text={`"it's not a bug, it's undocumented behavior" — me`}
        style={{ top: '13%', right: '6%', rotate: '2deg', fontSize: 'clamp(0.7rem, 1vw, 0.85rem)' }}
        font="mono"
        color="var(--accent-warm)"
        animationType="fade"
        zIndex={8}
      />
      <ScatteredText
        text={`"sleep is important... but so is this commit"`}
        style={{ top: '57%', left: '5%', rotate: '-2deg', fontSize: 'clamp(0.7rem, 1vw, 0.85rem)' }}
        font="mono"
        color="var(--accent-cream)"
        animationType="fade"
        zIndex={8}
      />

      {/* ── CLOTH RECEIPT — centered, no container ── */}
      <ClothReceiptSection embedded />

      {/* ── HAND-DRAWN SQUIGGLE ── */}
      <HandDrawnSVG
        preset="squiggle"
        width={120}
        height={30}
        style={{ top: '30%', left: '15%', rotate: '8deg' }}
        color="var(--accent-sepia)"
        strokeWidth={1.5}
        duration={1.8}
        opacity={0.25}
        zIndex={6}
      />

      {/* ── COLLAGE ITEMS — desk objects ── */}
      <CollageElement
        src="/collage/camera.png"
        alt="desk camera"
        width={200}
        height={200}
        className="w-25 md:w-50"
        style={{ top: '63%', left: '3%', rotate: '-14deg', zIndex: 4 }}
        parallaxSpeed={0.3}
        animateFrom="left"
      />
      <CollageElement
        src="/collage/typewriter.png"
        alt="desk typewriter"
        width={260}
        height={260}
        className="w-32.5 md:w-65"
        style={{ top: '65%', right: '3%', rotate: '11deg', zIndex: 4 }}
        parallaxSpeed={0.4}
        animateFrom="right"
      />
      <CollageElement
        src="/collage/books.png"
        alt="reference books"
        width={180}
        height={180}
        className="w-22.5 md:w-45"
        style={{ top: '78%', left: '45%', rotate: '-6deg', zIndex: 3 }}
        parallaxSpeed={0.2}
        animateFrom="bottom"
      />

      {/* connector to Vision */}
      <HandDrawnSVG
        preset="arrowDown"
        width={50}
        height={120}
        style={{ top: '93%', left: '50%', rotate: '5deg' }}
        color="var(--accent-warm)"
        strokeWidth={2}
        duration={1.5}
        opacity={0.4}
        zIndex={3}
      />
    </div>
  );
}

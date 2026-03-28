'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll from '@/components/SmoothScroll';
import GrainOverlay from '@/components/GrainOverlay';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import LoadingScreen from '@/components/LoadingScreen';
import IntroSection from '@/components/sections/IntroSection';
import OriginSection from '@/components/sections/OriginSection';
import GrowthSection from '@/components/sections/GrowthSection';
import SelectedWorksSection from '@/components/sections/SelectedWorksSection';
import ManifestoSection from '@/components/sections/ManifestoSection';
import FoundFootageSection from '@/components/sections/FoundFootageSection';
import MasterySection from '@/components/sections/MasterySection';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import VisionSection from '@/components/sections/VisionSection';

const ParticleField = dynamic(() => import('@/components/ParticleField'), { ssr: false });
const CursorTrail = dynamic(() => import('@/components/CursorTrail'), { ssr: false });
const AmbientSound = dynamic(() => import('@/components/AmbientSound'), { ssr: false });
const TimeAwareTheme = dynamic(() => import('@/components/TimeAwareTheme'), { ssr: false });
const ScannerEffect = dynamic(() => import('@/components/ScannerEffect'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMediaQuery();

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [isMobile]);

  useEffect(() => {
    if (!mainRef.current) return;

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
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach((text) => {
      gsap.fromTo(
        text,
        { opacity: 0, ...(prefersReduced ? {} : { y: 50, filter: 'blur(10px)' }) },
        {
          opacity: 1,
          ...(prefersReduced ? {} : { y: 0, filter: 'blur(0px)' }),
          duration: prefersReduced ? 0.3 : 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: text,
            start: 'top 85%',
          },
        }
      );
    });
  }, []);

  return (
    <SmoothScroll>
      <LoadingScreen />
      <TimeAwareTheme />
      <ParticleField />
      <GrainOverlay />
      <CursorTrail />
      <AmbientSound />
      <ScannerEffect />

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-100">
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
        <IntroSection />
        <OriginSection />
        <GrowthSection />
        <SelectedWorksSection />
        <ManifestoSection />
        <FoundFootageSection />
        <MasterySection />
        <ProcessSection />
        <TestimonialsSection />
        <VisionSection />
      </main>
    </SmoothScroll>
  );
}

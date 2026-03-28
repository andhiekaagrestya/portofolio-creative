'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CollageElement from '@/components/CollageElement';
import HandDrawnSVG from '@/components/HandDrawnSVG';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const nameLine1 = 'Andhieka Agrestya';
const nameLine2 = 'Al Ara Ab';

export default function IntroSection() {
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (nameRef.current) {
        const letters = nameRef.current.querySelectorAll('.letter');
        gsap.fromTo(
          letters,
          {
            opacity: 0,
            ...(prefersReduced ? {} : { y: 100, rotateX: -90 }),
          },
          {
            opacity: 1,
            ...(prefersReduced ? {} : { y: 0, rotateX: 0 }),
            duration: prefersReduced ? 0.3 : 1.2,
            stagger: prefersReduced ? 0 : 0.05,
            ease: 'back.out(1.7)',
            delay: 0.5,
          }
        );
      }

      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, ...(prefersReduced ? {} : { y: 20 }) },
          {
            opacity: 0.6,
            ...(prefersReduced ? {} : { y: 0 }),
            duration: prefersReduced ? 0.3 : 1.5,
            delay: prefersReduced ? 0.3 : 1.5,
            ease: 'power2.out',
          }
        );
      }

      if (scrollIndicatorRef.current) {
        gsap.fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 2.5 });

        if (!prefersReduced) {
          gsap.to(scrollIndicatorRef.current, {
            y: 10,
            duration: 1.2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          });
        }

        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          scrollTrigger: {
            trigger: scrollIndicatorRef.current,
            start: '100px top',
            end: '200px top',
            scrub: true,
          },
        });
      }
    }, nameRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <div className="relative overflow-hidden" style={{ height: '120vh' }}>
      {/* Warm ambient light - like projector glow */}
      <div className="absolute w-150 h-150 rounded-full opacity-10"
        style={{ top: '20%', left: '20%', background: 'radial-gradient(circle, rgba(196,149,106,0.4), transparent)', filter: 'blur(80px)' }} />

      {/* Main title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={nameRef} className="flex flex-col items-center gap-1 md:gap-2 px-4" style={{ perspective: '800px' }}>
          {/* Line 1: Andhieka Agrestya */}
          <div className="flex gap-1 md:gap-3 justify-center flex-wrap max-w-full">
            {nameLine1.split('').map((letter, i) => (
              <span
                key={`l1-${i}`}
                className="letter inline-block text-3xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter"
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
          <div className="flex gap-1 md:gap-3 justify-center flex-wrap max-w-full">
            {nameLine2.split('').map((letter, i) => (
              <span
                key={`l2-${i}`}
                className="letter inline-block text-3xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter"
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
        width={200}
        height={200}
        className="w-45 md:w-87.5"
        style={{ top: '15%', right: '5%', rotate: '12deg', zIndex: 3 }}
        parallaxSpeed={0.3}
        animateFrom="right"
      />
      <CollageElement
        src="/collage/camera.png"
        alt="Vintage Camera"
        width={200}
        height={200}
        className="w-45 md:w-87.5"
        style={{ bottom: '25%', left: '5%', rotate: '-8deg', zIndex: 2 }}
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
  );
}

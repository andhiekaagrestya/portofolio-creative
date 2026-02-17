'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GlitchTransitionProps {
  triggerPosition: string; // e.g. '2500px'
}

export default function GlitchTransition({ triggerPosition }: GlitchTransitionProps) {
  const glitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!glitchRef.current) return;

    const el = glitchRef.current;
    const layers = el.querySelectorAll('.glitch-layer');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(layers[0], {
      opacity: 0.7,
      x: -5,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: 'steps(2)',
    })
      .to(layers[1], {
        opacity: 0.7,
        x: 5,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: 'steps(2)',
      }, '<')
      .to(el, {
        opacity: 0,
        duration: 0.3,
      });
  }, []);

  return (
    <div
      ref={glitchRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        top: triggerPosition,
        zIndex: 50,
        position: 'absolute',
        height: '100vh',
      }}
    >
      <div
        className="glitch-layer absolute inset-0 opacity-0"
        style={{
          background: 'rgba(168, 85, 247, 0.08)',
          animation: 'glitch-1 0.3s linear infinite',
        }}
      />
      <div
        className="glitch-layer absolute inset-0 opacity-0"
        style={{
          background: 'rgba(34, 211, 238, 0.08)',
          animation: 'glitch-2 0.3s linear infinite',
        }}
      />
    </div>
  );
}

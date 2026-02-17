'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScatteredTextProps {
  text: string;
  style: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    rotate?: string;
    fontSize?: string;
  };
  font?: 'sans' | 'serif' | 'mono';
  color?: string;
  blendMode?: string;
  weight?: string;
  italic?: boolean;
  animationType?: 'fade' | 'typewriter' | 'split' | 'glitch';
  zIndex?: number;
}

export default function ScatteredText({
  text,
  style,
  font = 'sans',
  color = 'var(--foreground)',
  blendMode,
  weight = '400',
  italic = false,
  animationType = 'fade',
  zIndex = 2,
}: ScatteredTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const el = textRef.current;

    switch (animationType) {
      case 'fade':
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        break;

      case 'typewriter': {
        const chars = el.querySelectorAll('.char');
        gsap.fromTo(chars,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.05, stagger: 0.03, ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        break;
      }

      case 'split': {
        const chars = el.querySelectorAll('.char');
        gsap.fromTo(chars,
          { opacity: 0, y: 50, rotateX: -90 },
          {
            opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.02, ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        break;
      }

      case 'glitch':
        gsap.fromTo(el,
          { opacity: 0, skewX: 20, x: -50 },
          {
            opacity: 1, skewX: 0, x: 0, duration: 0.6, ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        break;
    }
  }, [animationType]);

  const fontFamily = font === 'serif' ? 'var(--font-serif)' : font === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)';

  const renderText = () => {
    if (animationType === 'typewriter' || animationType === 'split') {
      return text.split('').map((char, i) => (
        <span key={i} className="char inline-block" style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }
    return text;
  };

  return (
    <div
      ref={textRef}
      className="text-scattered"
      style={{
        top: style.top,
        left: style.left,
        right: style.right,
        bottom: style.bottom,
        transform: `rotate(${style.rotate || '0deg'})`,
        fontSize: style.fontSize || '1rem',
        fontFamily,
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        color,
        mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'],
        zIndex,
        letterSpacing: font === 'mono' ? '0.05em' : '0',
      }}
    >
      {renderText()}
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

interface ScatteredTextProps {
  text: string;
  style?: React.CSSProperties; // Top, left, rotate
  font?: 'serif' | 'sans' | 'mono';
  weight?: string | number;
  italic?: boolean;
  italicHover?: boolean; // Italicize on hover?
  color?: string;
  animationType?: 'fade' | 'typewriter' | 'split' | 'glitch';
  zIndex?: number;
  className?: string; // Added className support
}

export default function ScatteredText({
  text,
  style,
  font = 'sans',
  weight = '400',
  italic = false,
  italicHover = false,
  color = 'currentColor',
  animationType = 'fade',
  zIndex = 1,
  className = '',
}: ScatteredTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Typewriter effect state
  // We use GSAP for most animations, but for typewriter we might need a separate approach or just CSS steps
  // Actually let's use GSAP TextPlugin if available, or just a simple stagger

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset state
    gsap.killTweensOf(el);

    if (animationType === 'fade') {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          }
        }
      );
    }
    else if (animationType === 'split') {
      // Simple split reveal (opacity)
      gsap.fromTo(el,
        { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    }
    else if (animationType === 'typewriter') {
      const chars = text.length;
      // Use clip-path instead of width to prevent layout issues with absolute positioning
      gsap.fromTo(el,
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: chars * 0.05,
          ease: 'steps(' + chars + ')',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          }
        }
      );
    }
    else if (animationType === 'glitch') {
      // Glitch entry
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        }
      });

      tl.fromTo(el, { opacity: 0, skewX: 20 }, { opacity: 1, skewX: 0, duration: 0.2 })
        .to(el, { x: -5, duration: 0.1, color: 'var(--accent-rust)' })
        .to(el, { x: 5, duration: 0.1, color: 'var(--accent-sage)' })
        .to(el, { x: 0, duration: 0.1, color: color });
    }

  }, [animationType, color, text]);

  const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';

  return (
    <motion.div
      ref={ref}
      className={`absolute ${fontClass} ${className}`}
      style={{
        ...style,
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        color,
        zIndex,
        // For typewriter, we use clip-path so overflow visible is fine (or hidden if we want to be safe, but clip-path handles it)
        // overflow: animationType === 'typewriter' ? 'hidden' : 'visible', 
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      <span className={italicHover ? 'transition-all duration-300 hover:italic hover:tracking-widest cursor-none' : ''}>
        {text}
      </span>
    </motion.div>
  );
}

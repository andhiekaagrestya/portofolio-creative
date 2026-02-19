'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface HoverMorphTextProps {
  /** The text to display and animate */
  text: string;
  /** Custom class names */
  className?: string;
  /** Font style: 'serif' | 'sans' | 'mono' */
  font?: 'serif' | 'sans' | 'mono';
  /** Font weight (CSS value) */
  weight?: string | number;
  /** Text color */
  color?: string;
  /** Animation duration (seconds) */
  duration?: number;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Whether to switch to italic on hover (only effective for supported fonts) */
  italicHover?: boolean;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";

export default function HoverMorphText({
  text,
  className = '',
  font = 'sans',
  weight = 400,
  color = 'var(--foreground)',
  duration = 0.5,
  delay = 0,
  italicHover = false,
  style = {},
}: HoverMorphTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const originalText = text;
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const fontFamilies = {
    serif: 'var(--font-serif)',
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  };

  const handleMouseEnter = () => {
    if (!textRef.current) return;

    // Kill any running animation
    if (animationRef.current) animationRef.current.kill();

    // Scramble Text Logic
    const length = originalText.length;
    const progress = { value: 0 };

    animationRef.current = gsap.to(progress, {
      value: 1,
      duration: duration,
      ease: "none",
      onUpdate: () => {
        const p = progress.value;
        let result = "";
        for (let i = 0; i < length; i++) {
          if (i < p * length) {
            result += originalText[i];
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        if (textRef.current) textRef.current.innerText = result;
      },
      onComplete: () => {
        if (textRef.current) textRef.current.innerText = originalText;
      }
    });

    // Tracking expansion
    gsap.to(textRef.current, {
      letterSpacing: "0.1em",
      duration: 0.3,
      ease: "power2.out"
    });

    // Italic switch (if enabled)
    if (italicHover) {
      gsap.to(textRef.current, {
        fontStyle: "italic",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (!textRef.current) return;

    // Kill scramble animation and reset text immediately
    if (animationRef.current) {
      animationRef.current.kill();
      textRef.current.innerText = originalText;
    }

    // Reset Tracking
    gsap.to(textRef.current, {
      letterSpacing: "0em",
      duration: 0.3,
      ease: "power2.out"
    });

    // Reset Italic
    if (italicHover) {
      gsap.to(textRef.current, {
        fontStyle: "normal",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <span
      ref={textRef}
      className={`inline-block cursor-pointer select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontFamily: fontFamilies[font],
        fontWeight: weight,
        color: color,
        position: 'relative',
        display: 'inline-block', // Ensure transforms work
        ...style,
      }}
    >
      {text}
    </span>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// Preset SVG Paths — hand-drawn style
// ============================================
const PRESETS: Record<string, { path: string; viewBox: string; width: number; height: number; }> = {
  // Wavy arrow pointing right
  arrowRight: {
    path: 'M5,25 C15,22 25,28 40,25 C55,22 65,28 80,25 C95,22 105,28 120,25 L115,15 M120,25 L112,33',
    viewBox: '0 0 125 45',
    width: 125,
    height: 45,
  },
  // Wavy arrow pointing down
  arrowDown: {
    path: 'M25,5 C22,20 28,35 25,55 C22,75 28,90 25,110 C22,130 28,145 25,160 L15,152 M25,160 L35,152',
    viewBox: '0 0 50 165',
    width: 50,
    height: 165,
  },
  // Curved arrow pointing down-right (connector)
  arrowCurve: {
    path: 'M5,5 C10,5 20,8 30,18 C40,28 50,50 55,75 C60,100 58,120 55,140 L45,132 M55,140 L63,130',
    viewBox: '0 0 70 145',
    width: 70,
    height: 145,
  },
  // Hand-drawn underline (wobbly)
  underline: {
    path: 'M5,15 C20,12 35,18 55,14 C75,10 95,17 115,13 C135,9 155,16 175,12 C195,8 215,15 235,13',
    viewBox: '0 0 240 30',
    width: 240,
    height: 30,
  },
  // Hand-drawn circle (imperfect)
  circle: {
    path: 'M50,5 C70,3 90,10 100,25 C110,40 108,65 95,80 C82,95 60,102 40,98 C20,94 5,78 3,58 C1,38 10,18 30,8 C40,4 48,5 50,5',
    viewBox: '0 0 115 105',
    width: 115,
    height: 105,
  },
  // Squiggly line (horizontal)
  squiggle: {
    path: 'M5,20 C15,5 25,35 35,20 C45,5 55,35 65,20 C75,5 85,35 95,20 C105,5 115,35 125,20 C135,5 145,35 155,20 C165,5 175,35 185,20',
    viewBox: '0 0 190 40',
    width: 190,
    height: 40,
  },
  // Spiral
  spiral: {
    path: 'M60,55 C60,45 50,38 42,42 C34,46 32,58 38,66 C44,74 58,78 68,70 C78,62 82,44 72,34 C62,24 40,20 28,32 C16,44 12,68 24,82 C36,96 64,100 80,86',
    viewBox: '0 0 95 100',
    width: 95,
    height: 100,
  },
  // Star/asterisk doodle
  star: {
    path: 'M40,5 L40,75 M5,40 L75,40 M12,12 L68,68 M68,12 L12,68',
    viewBox: '0 0 80 80',
    width: 80,
    height: 80,
  },
  // Bracket/brace left
  braceLeft: {
    path: 'M25,5 C15,5 8,12 8,25 C8,38 5,48 2,55 C5,62 8,72 8,85 C8,98 15,105 25,105',
    viewBox: '0 0 30 110',
    width: 30,
    height: 110,
  },
  // Cross/X mark
  crossMark: {
    path: 'M5,5 C15,15 25,25 40,40 C55,55 65,65 75,75 M75,5 C65,15 55,25 40,40 C25,55 15,65 5,75',
    viewBox: '0 0 80 80',
    width: 80,
    height: 80,
  },
};

interface HandDrawnSVGProps {
  /** Preset shape name or custom path */
  preset?: keyof typeof PRESETS;
  /** Custom SVG path (overrides preset) */
  customPath?: string;
  customViewBox?: string;
  /** Size */
  width?: number;
  height?: number;
  /** Positioning */
  style?: React.CSSProperties;
  className?: string;
  /** Stroke color — defaults to accent-warm */
  color?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** ScrollTrigger start position */
  triggerStart?: string;
  /** Z-index */
  zIndex?: number;
  /** Opacity of drawn stroke */
  opacity?: number;
}

export default function HandDrawnSVG({
  preset = 'squiggle',
  customPath,
  customViewBox,
  width,
  height,
  style = {},
  className = '',
  color = 'var(--accent-warm)',
  strokeWidth = 2,
  duration = 1.5,
  delay = 0,
  triggerStart = 'top 80%',
  zIndex = 2,
  opacity = 0.4,
}: HandDrawnSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const presetData = PRESETS[preset];
  const pathD = customPath || presetData.path;
  const viewBox = customViewBox || presetData.viewBox;
  const w = width || presetData.width;
  const h = height || presetData.height;

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll<SVGPathElement>('path');

    paths.forEach((path) => {
      const length = path.getTotalLength();

      // Set initial state — fully hidden
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });

      // Animate on scroll
      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: svgRef.current,
          start: triggerStart,
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === svgRef.current) st.kill();
      });
    };
  }, [duration, delay, triggerStart]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      width={w}
      height={h}
      className={`absolute pointer-events-none ${className}`}
      style={{
        ...style,
        zIndex,
        overflow: 'visible',
      }}
      fill="none"
    >
      <path
        d={pathD}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        style={{ filter: 'url(#hand-drawn-rough)' }}
      />
      {/* SVG filter for slight roughness */}
      <defs>
        <filter id="hand-drawn-rough">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.04"
            numOctaves="4"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

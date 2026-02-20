'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface StickyNoteProps {
  children: React.ReactNode;
  color?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
  rotate?: number;
  style?: React.CSSProperties;
  className?: string;
  pinColor?: string;
}

const colorMap = {
  yellow: {
    bg: '#f5e642',
    shadow: '#c9ba00',
    fold: '#c9ba0060',
  },
  pink: {
    bg: '#ffb3c6',
    shadow: '#cc7a90',
    fold: '#cc7a9060',
  },
  blue: {
    bg: '#a8d8ea',
    shadow: '#6aafcc',
    fold: '#6aafcc60',
  },
  green: {
    bg: '#b8e0a8',
    shadow: '#7dc26a',
    fold: '#7dc26a60',
  },
  orange: {
    bg: '#ffcc99',
    shadow: '#cc9055',
    fold: '#cc905560',
  },
};

export default function StickyNote({
  children,
  color = 'yellow',
  rotate = -3,
  style,
  className = '',
  pinColor = '#c0392b',
}: StickyNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);
  const { bg, shadow, fold } = colorMap[color];

  return (
    <motion.div
      ref={noteRef}
      className={`absolute ${className}`}
      style={{
        rotate,
        ...style,
        transformOrigin: 'top center',
      }}
      initial={{ opacity: 0, y: 30, rotate: rotate - 5 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      whileHover={{
        rotate: rotate * 0.5,
        y: -12,
        scale: 1.04,
        zIndex: 50,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      {/* Push Pin */}
      <div
        className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-10"
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
      >
        {/* Pin head */}
        <div
          className="w-5 h-5 rounded-full mx-auto"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${pinColor}cc, ${pinColor})`,
            boxShadow: `0 2px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)`,
          }}
        />
        {/* Pin needle */}
        <div
          className="w-[2px] h-3 mx-auto"
          style={{ background: `linear-gradient(to bottom, ${pinColor}88, transparent)` }}
        />
      </div>

      {/* Note Body */}
      <div
        className="relative pt-5 px-5 pb-6 min-w-[160px] max-w-[220px]"
        style={{
          background: `linear-gradient(135deg, ${bg} 85%, ${fold} 85%)`,
          boxShadow: `
            3px 3px 0px ${shadow}40,
            6px 6px 15px rgba(0,0,0,0.18),
            inset 0 -1px 0px ${shadow}30
          `,
          // Fold corner effect
          clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
        }}
      >
        {/* Fold triangle overlay */}
        <div
          className="absolute top-0 right-0 w-[22px] h-[22px]"
          style={{
            background: `linear-gradient(225deg, ${shadow}60 50%, transparent 50%)`,
          }}
        />

        {/* Ruled lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20" style={{ borderRadius: 'inherit' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px"
              style={{
                top: `${35 + i * 18}px`,
                background: `${shadow}`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div
          className="relative z-10"
          style={{
            fontFamily: "'Caveat', 'Kalam', 'Patrick Hand', cursive, var(--font-sans)",
            color: '#2a1a00',
            fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
            lineHeight: 1.55,
            letterSpacing: '0.01em',
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

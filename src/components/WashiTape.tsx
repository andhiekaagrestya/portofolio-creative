'use client';

import { motion } from 'framer-motion';

interface WashiTapeProps {
  color?: string;
  pattern?: 'solid' | 'stripes' | 'dots' | 'zigzag';
  width?: number;      // px
  height?: number;     // px
  rotate?: number;     // deg
  style?: React.CSSProperties;
  className?: string;
  opacity?: number;
}

export default function WashiTape({
  color = 'var(--accent-warm)',
  pattern = 'solid',
  width = 180,
  height = 28,
  rotate = 0,
  style,
  className = '',
  opacity = 0.55,
}: WashiTapeProps) {
  const getPatternStyle = (): React.CSSProperties => {
    switch (pattern) {
      case 'stripes':
        return {
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 4px,
            rgba(255,255,255,0.3) 4px,
            rgba(255,255,255,0.3) 8px
          )`,
          backgroundColor: color,
        };
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 2px, transparent 2px)`,
          backgroundSize: '10px 10px',
          backgroundColor: color,
        };
      case 'zigzag':
        return {
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.3) 25%, transparent 25%) -10px 0,
            linear-gradient(225deg, rgba(255,255,255,0.3) 25%, transparent 25%) -10px 0,
            linear-gradient(315deg, rgba(255,255,255,0.3) 25%, transparent 25%),
            linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%)
          `,
          backgroundSize: '20px 20px',
          backgroundColor: color,
        };
      default:
        return { backgroundColor: color };
    }
  };

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width,
        height,
        rotate,
        opacity,
        ...getPatternStyle(),
        // Torn edges via mask
        WebkitMaskImage: `
          linear-gradient(90deg,
            transparent 0px,
            rgba(0,0,0,0.3) 3px,
            black 8px,
            black calc(100% - 8px),
            rgba(0,0,0,0.3) calc(100% - 3px),
            transparent 100%
          )
        `,
        maskImage: `
          linear-gradient(90deg,
            transparent 0px,
            rgba(0,0,0,0.3) 3px,
            black 8px,
            black calc(100% - 8px),
            rgba(0,0,0,0.3) calc(100% - 3px),
            transparent 100%
          )
        `,
        ...style,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  );
}

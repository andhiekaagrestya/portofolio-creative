'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface DioramaLayerProps {
  children: ReactNode;
  /** Speed multiplier: 0 = static with scroll, 1 = normal scroll, >1 = moves faster (foreground), <1 = moves slower (background) */
  speed?: number;
  /** Opacity depth effect */
  fadeOnScroll?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function DioramaLayer({
  children,
  speed = 1,
  fadeOnScroll = false,
  className = '',
  style = {}
}: DioramaLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll position of this absolute block relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate the vertical movement (Y translation) based on speed.
  // Standard parallax transforms Y from positive (below) to negative (above) relative to normal scroll.
  // Speed > 1 means it moves MORE than normal scroll (foreground).
  // Speed < 1 means it moves LESS (background).
  // 100vh range is roughly equivalent to passing through the screen.
  const yShiftRange = (speed - 1) * -100;

  const yParallax = useTransform(
    scrollYProgress,
    [0, 1],
    [`${yShiftRange}vh`, `${-yShiftRange}vh`]
  );

  // Optional: fade out elements as they approach the edges (depth simulation)
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      ref={ref}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        y: speed === 1 ? 0 : yParallax,
        opacity: fadeOnScroll ? opacity : 1,
        ...style
      }}
    >
      <div className="relative w-full h-full pointer-events-auto">
        {children}
      </div>
    </motion.div>
  );
}

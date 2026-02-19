'use client';

import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScannerEffect() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Smooth the velocity to prevent jerky flashes
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Map velocity to distortion intensity (0 to 1)
  const intensity = useTransform(smoothVelocity, [-2000, 0, 2000], [1, 0, 1]);

  // Create aggressive CSS filters based on intensity
  const backdropFilter = useTransform(
    intensity,
    [0, 0.5, 1],
    [
      'brightness(1) contrast(1) blur(0px) sepia(0)',
      'brightness(1.2) contrast(1.2) blur(0.5px) sepia(0.1)',
      'brightness(1.4) contrast(1.5) blur(1px) sepia(0.2)'
    ]
  );

  // The scanner light beam vertical position maps directly to scroll velocity direction/speed
  // Or we can just make it scan rapidly when intensity > 0.3
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    return intensity.onChange((latest) => {
      if (latest > 0.3 && !isScanning) {
        setIsScanning(true);
      } else if (latest <= 0.3 && isScanning) {
        setIsScanning(false);
      }
    });
  }, [intensity, isScanning]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      style={{
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        opacity: useTransform(intensity, [0, 0.3, 1], [0, 0.1, 0.5]) // Only show when scrolling somewhat fast
      }}
    >
      {/* Optional: CRT Scanlines overlay that only appears during fast scroll */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* The bright scanner light beam */}
      {isScanning && (
        <motion.div
          className="absolute left-0 right-0 h-[2vh] bg-white opacity-50"
          style={{
            boxShadow: '0 0 20px 10px rgba(255,255,255,0.4), 0 0 50px 20px rgba(196,149,106,0.2)',
            mixBlendMode: 'overlay'
          }}
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      )}

      {/* Glitch / Color split overlay (Fake chromatic aberration via mix-blend-mode) */}
      <motion.div
        className="absolute inset-0 bg-red-500 mix-blend-screen opacity-5"
        style={{
          x: useTransform(intensity, [0, 1], [0, 5]),
          y: useTransform(intensity, [0, 1], [0, -2])
        }}
      />
      <motion.div
        className="absolute inset-0 bg-cyan-500 mix-blend-screen opacity-5"
        style={{
          x: useTransform(intensity, [0, 1], [0, -5]),
          y: useTransform(intensity, [0, 1], [0, 2])
        }}
      />
    </motion.div>
  );
}

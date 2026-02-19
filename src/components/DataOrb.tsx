'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface DataOrbProps {
  radius?: number; // Size of the orb
  rings?: {
    texts: string[];
    speed: number;
    tiltX: number;
    tiltY: number;
    color: string;
    fontSize?: number;
  }[];
}

export default function DataOrb({
  radius = 300,
  rings = [
    {
      texts: ["AVAILABLE FOR FREELANCE • CREATIVE DEVELOPER • JAKARTA • REMOTE •"],
      speed: 15,
      tiltX: 0,
      tiltY: 0,
      color: 'var(--accent-warm)'
    },
    {
      texts: ["NEXT.JS • REACT • THREE.JS • WEBGL • BLENDER • TYPESCRIPT •"],
      speed: 20,
      tiltX: 60,
      tiltY: 15,
      color: 'var(--accent-sage)',
      fontSize: 14,
    },
    {
      texts: ["THE TRUTH IS OUT THERE • DECODE THE SIGNAL • FOLLOW THE WHITE RABBIT •"],
      speed: 25,
      tiltX: -60,
      tiltY: -15,
      color: 'var(--accent-rust)',
      fontSize: 14,
    },
  ]
}: DataOrbProps) {

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Interaction for manipulating the whole orb
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const [currentRadius, setCurrentRadius] = useState(radius);

  useEffect(() => {
    const handleResize = () => {
      setCurrentRadius(window.innerWidth < 768 ? 150 : 300);
    };
    // Initial set
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(x * 20); // 20deg rotation
      mouseY.set(y * 20);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-[80vh] overflow-hidden bg-[#1a1510] perspective-[1000px] cursor-grab active:cursor-grabbing"
    >
      {/* Glow Core */}
      <div className="absolute w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(212,197,169,0.1)_0%,transparent_70%)] blur-2xl animate-pulse" />

      <motion.div
        className="relative transform-style-3d"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: useTransform(smoothY, (v) => -v), // Invert for natural feel
          rotateY: smoothX,
        }}
      >
        {rings.map((ring, i) => (
          <TextRing
            key={i}
            radius={currentRadius}
            {...ring}
          />
        ))}

        {/* Central Artifact/Nucleus (Optional) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#f4f1e1] rounded-full shadow-[0_0_20px_var(--accent-warm)]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}

function TextRing({
  radius, texts, speed, tiltX, tiltY, color, fontSize = 16
}: {
  radius: number, texts: string[], speed: number, tiltX: number, tiltY: number, color: string, fontSize?: number;
}) {
  // Generate full text string
  const fullText = texts.join("");
  const chars = fullText.split("");
  const count = chars.length;

  // Angle per character using Monospace assumption (~0.6 aspect ratio per char roughly, or just fit circle)
  // Actually for a ring, we distribute chars evenly over 360deg.
  // If text is short, it won't close the ring. If long, it overlaps.
  // We should ideally repeat the text to fill the circle or space it out.
  // Let's assume the text provided is meant to loop or we repeat it.
  // For this demo, let's repeat to fill approx.

  // Circumference = 2 * PI * radius.
  // Char width approx fontSize * 0.6.
  // Max chars = Circumference / (fontSize * 0.6).
  const circumference = 2 * Math.PI * radius;
  const charWidth = fontSize * 0.65;
  const capacity = Math.floor(circumference / charWidth);

  // Repeat text to fill capacity
  let ringChars = [...chars];
  while (ringChars.length < capacity) {
    ringChars = [...ringChars, ...chars];
  }
  // Trim if too long? Or just let it spiral? 
  // Trimming to capacity for perfect ring.
  ringChars = ringChars.slice(0, capacity);

  const stepAngle = 360 / ringChars.length;

  // Rotation Animation
  const rotation = useMotionValue(0);
  useAnimationFrame((t) => {
    // t is ms. 
    // speed = seconds per revolution?
    // rotation = (t / (speed * 1000)) * 360
    const angle = (t / (speed * 1000)) * 360;
    rotation.set(angle % 360);
  });

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        transformStyle: 'preserve-3d',
        rotateX: tiltX,
        rotateY: tiltY,
        // The ring itself rotates around ITS Z-axis (which is tilted).
        // Wait, if we tilt X and Y, the ring's "axis" is changed.
        // We want the text to spin AROUND that axis.
        // Text placement: rotateY(angle) translateZ(radius).
        // Spin: rotateY(animation).
        // So the CONTAINER of the chars should rotate.
      }}
    >
      <motion.div
        className="transform-style-3d"
        style={{
          rotateY: rotation, // Spin the ring
          transformStyle: 'preserve-3d',
        }}
      >
        {ringChars.map((char, i) => (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 origin-center backface-visible font-mono font-bold"
            style={{
              transform: `rotateY(${i * stepAngle}deg) translateZ(${radius}px)`,
              color: color,
              fontSize: `${fontSize}px`,
              backfaceVisibility: 'visible', // Show from behind?
              // To make text readable from behind, maybe distinct color or opacity?
              // Or standard behavior.
              width: `${fontSize}px`,
              height: `${fontSize}px`,
              textAlign: 'center',
              marginTop: `-${fontSize / 2}px`,
              marginLeft: `-${fontSize / 2}px`,
            }}
          >
            {char}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

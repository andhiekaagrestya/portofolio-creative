'use client';

import { useMemo } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

interface DNAHelixProps {
  texts?: string[];
  speed?: number;
  amplitude?: number;
  frequency?: number;
  className?: string;
}

export default function DNAHelix({
  texts = [
    "CREATIVE DEVELOPER • DIGITAL GARDENER • ",
    "REACT • THREE.JS • NEXT.JS • WEBGL • ",
    "EXPLORING THE DIGITAL FRONTIER • ",
    "ORGANIC INTERFACES • GENERATIVE ART • "
  ],
  speed = 0.5, // Slower for structural feel
  amplitude = 100,
  frequency = 0.5,
  className = "",
}: DNAHelixProps) {

  // Merge texts for the strands
  const strand1Text = texts.filter((_, i) => i % 2 === 0).join(" • ");
  const strand2Text = texts.filter((_, i) => i % 2 !== 0).join(" • ");

  // Normalize lengths for pairing
  const text1 = strand1Text.repeat(4);
  const text2 = strand2Text.repeat(4);

  // We strictly pair them up. Length is max of both.
  const maxLength = Math.max(text1.length, text2.length);
  const pairs = useMemo(() => {
    return Array.from({ length: maxLength }).map((_, i) => ({
      char1: text1[i] || '•',
      char2: text2[i] || '•',
      index: i
    }));
  }, [text1, text2, maxLength]);

  const time = useMotionValue(0);

  useAnimationFrame((t, delta) => {
    const current = time.get();
    time.set(current + (delta / 1000) * speed);
  });

  return (
    <div className={`relative flex items-center justify-center w-[120vw] h-[80vh] overflow-visible select-none pointer-events-none ${className}`}>
      {/* Diagonal Rotation Container */}
      <div className="relative w-full h-full rotate-[-15deg] flex items-center justify-center">

        {/* Dust particles (Static for performance or simple separate animation) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Can add particles later if needed */}
        </div>

        <div className="relative flex justify-center items-center whitespace-nowrap">
          {pairs.map((pair) => (
            <HelixPair
              key={pair.index}
              {...pair}
              total={pairs.length}
              time={time}
              amplitude={amplitude}
              frequency={frequency}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HelixPair({ char1, char2, index, total, time, amplitude, frequency }: any) {
  const spacing = 30; // px spacing
  const totalWidth = total * spacing;

  // Shared X logic
  const x = useTransform(time, (t: number) => {
    const currentPos = (index * spacing) - (t * 60);
    const modPos = ((currentPos % totalWidth) + totalWidth) % totalWidth;
    return modPos - (totalWidth / 2);
  });

  // 3D Visual Logic
  // Phase for this pair
  const phaseOffset = index * frequency * 0.5; // Spatial frequency

  // We calculate the visuals based on time + phase
  const rawZ = useTransform(time, (t: number) => Math.cos(phaseOffset + t));
  const rawY = useTransform(time, (t: number) => Math.sin(phaseOffset + t));

  // Derived values
  const scale1 = useTransform(rawZ, (z) => 0.6 + (z + 1) * 0.4); // 0.6 to 1.4
  const scale2 = useTransform(rawZ, (z) => 0.6 + (-z + 1) * 0.4); // Opposite Z

  const opacity1 = useTransform(rawZ, (z) => 0.2 + (z + 1) * 0.4); // 0.2 to 1.0
  const opacity2 = useTransform(rawZ, (z) => 0.2 + (-z + 1) * 0.4);

  const y1 = useTransform(rawY, (y) => y * amplitude);
  const y2 = useTransform(rawY, (y) => -y * amplitude); // Opposite Y

  // Connector Line
  // Visualized as a div scaling/rotating?
  // A vertical div at X, rotating in 3D?
  // 2D projection: Line connecting (x, y1) and (x, y2).
  // Height = y1 - y2 = 2 * y * amp.
  // Opacity = average of strands? Or purely based on Z (if rod is in front).
  // Rod Z is 0 (center of rotation)? No, rod passes through center.
  // Rod technically has parts in front and back. 
  // Simply fading it slightly works.

  const lineHeight = useTransform(rawY, (y) => Math.abs(2 * y * amplitude));
  const lineOpacity = useTransform(rawZ, (z) => 0.1 + Math.abs(z) * 0.2); // Fainter than text

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center"
      style={{ x, zIndex: 0 }} // zIndex handled by order? No.
    >
      {/* Connector Line */}
      <motion.div
        className="w-[1px] bg-[#d4c5a9]"
        style={{
          height: lineHeight,
          opacity: lineOpacity,
        }}
      />

      {/* Text Node 1 */}
      <motion.span
        className="absolute font-serif text-3xl md:text-5xl text-[var(--accent-warm)]"
        style={{
          y: y1,
          scale: scale1,
          opacity: opacity1,
          zIndex: useTransform(rawZ, z => z > 0 ? 10 : 0), // Dynamic Z-index
        }}
      >
        {char1}
      </motion.span>

      {/* Text Node 2 */}
      <motion.span
        className="absolute font-mono text-2xl md:text-4xl text-[var(--accent-sage)]"
        style={{
          y: y2,
          scale: scale2,
          opacity: opacity2,
          zIndex: useTransform(rawZ, z => z < 0 ? 10 : 0),
        }}
      >
        {char2}
      </motion.span>
    </motion.div>
  );
}

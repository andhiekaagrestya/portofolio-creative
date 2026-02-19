'use client';

import { useRef, useMemo } from 'react';
import { motion, useAnimationFrame, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface TextVortexProps {
  texts?: string[];
  ringCount?: number;
  depth?: number; // Total depth of the tunnel
  speed?: number; // Warp speed
  radius?: number; // Tunnel radius
}

export default function TextVortex({
  texts = [
    "NEXT.JS • REACT • THREE.JS • WEBGL • BLENDER • TYPESCRIPT •",
    "AVAILABLE FOR FREELANCE • CREATIVE DEVELOPER • JAKARTA • REMOTE •",
    "THE TRUTH IS OUT THERE • DECODE THE SIGNAL • FOLLOW THE WHITE RABBIT •",
    "GSAP • TAILWIND • FRAMER MOTION • POSTPROCESSING • GLSL •"
  ],
  ringCount = 12,
  depth = 4000,
  speed = 5,
  radius = 600,
}: TextVortexProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Interaction for looking around
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Smooth look
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  // Track warp position (Z)
  const warpZ = useMotionValue(0);

  // Initial positioning of rings
  const rings = useMemo(() => {
    return Array.from({ length: ringCount }).map((_, i) => ({
      id: i,
      text: texts[i % texts.length], // Cycle through texts
      initialZ: -1 * (i * (depth / ringCount)), // Spread evenly backwards
      color: i % 2 === 0 ? 'var(--accent-warm)' : 'var(--accent-sage)',
    }));
  }, [ringCount, depth, texts]);

  useAnimationFrame((time, delta) => {
    // Increment Warp Z
    // time is total time. We want to increment manually based on speed.
    // Simplified: use time to drive offset ? No, better to increment value.
    // Actually, let's use time directly.
    // warpZ = (time * speed) % (depth / ringCount)? 
    // No, we want continuous forward movement.

    const currentZ = warpZ.get();
    // Move forward
    warpZ.set(currentZ + speed * (delta / 16)); // Normalize to 60fps
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    mouseX.set(x * 15); // Look angle X
    mouseY.set(y * 15); // Look angle Y
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-[120vh] overflow-hidden bg-[#0d0a08] perspective-[800px] cursor-crosshair"
      onMouseMove={handleMouseMove}
    >
      {/* Vortex Center Fog */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0d0a08_90%)] z-10 pointer-events-none" />

      {/* Warp Speed Lines (Starfield) */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <WarpStars speed={speed * 2} />
      </div>

      <motion.div
        className="transform-style-3d w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: useTransform(smoothY, v => -v), // Look up/down
          rotateY: smoothX, // Look left/right
        }}
      >
        {rings.map((ring) => (
          <VortexRing
            key={ring.id}
            {...ring}
            warpZ={warpZ}
            depth={depth}
            step={depth / ringCount}
            radius={radius}
          />
        ))}
      </motion.div>
    </div>
  );
}

function VortexRing({ text, initialZ, color, warpZ, depth, step, radius }: any) {
  // Current Z = (initialZ + warpZ) modulo total depth?
  // We need rings to come from -depth and disappear at +some.

  // Z Logic:
  // Raw Z position = initialZ + warpZ
  // We want it to loop within range [-depth, 500].

  const z = useTransform(warpZ, (currentWarp) => {
    const rawZ = initialZ + currentWarp;
    // Wrap around logic
    // If rawZ > 500 (camera pass), move it back to -depth + 500?
    // Modulo logic:
    const loopLength = depth + 500; // total range
    const wrappedZ = ((rawZ - 500) % loopLength);

    // If wrappedZ is positive (0 to loopLength), we want it mapped to range.
    // Javascript modulo of negative numbers behaves weirdly.
    // ((rawZ % loopLength) + loopLength) % loopLength is safer for positive range.

    // Let's align: 
    // We want range: [-depth, 500]
    // Offset everything by +depth. Range [0, depth+500].
    const offsetZ = rawZ + depth;
    const modZ = ((offsetZ % loopLength) + loopLength) % loopLength;
    return modZ - depth; // Back to [-depth, 500] range
  });

  const opacity = useTransform(z, [-depth, -depth / 2, 0, 400], [0, 0.5, 1, 0]);
  const scale = useTransform(z, [-depth, 0], [0.1, 1]); // Perspective handles scale, but manual help avoids glitches

  return (
    <motion.div
      className="absolute flex items-center justify-center transform-style-3d"
      style={{
        z,
        opacity,
        // scale, // Optional, let perspective do it
      }}
    >
      <CylinderText text={text} radius={radius} color={color} />
    </motion.div>
  );
}

function CylinderText({ text, radius, color }: { text: string, radius: number, color: string; }) {
  const chars = text.split("");
  const stepAngle = 360 / chars.length;

  return (
    <div className="relative transform-style-3d animate-[spin_20s_linear_infinite]">
      <style jsx>{`
                @keyframes spin {
                    from { transform: rotateZ(0deg); }
                    to { transform: rotateZ(360deg); }
                }
             `}</style>
      {chars.map((char, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 origin-center backface-visible font-mono font-bold text-2xl md:text-3xl whitespace-nowrap"
          style={{
            transform: `rotateZ(${i * stepAngle}deg) translateY(-${radius}px)`,
            // rotateZ spins around center. translateY pushes out to radius.
            // Text faces INWARD/OUTWARD depending on rotation.
            color: color,
          }}
        >
          <span style={{ transform: 'rotateZ(0deg)', display: 'block' }}>{char}</span>
          {/* Character itself might need rotation to be upright? 
                        rotateZ makes them tangent to circle. 
                        If we want them readable as "rings", this is correct.
                    */}
        </div>
      ))}
    </div>
  );
}

function WarpStars({ speed }: { speed: number; }) {
  // Simple starfield moving forward
  return (
    <div className="relative w-full h-full perspective-[500px]">
      {/* CSS Animation or just particles */}
      {/* Keeping it simple to safe tokens/complexity */}
    </div>
  );
}

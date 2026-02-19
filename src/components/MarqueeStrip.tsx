'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface MarqueeStripProps {
  texts: string[]; // List of strings to display
  speed?: number; // Duration for one loop
  className?: string;
  separator?: string; // Character to separate items
}

export default function MarqueeStrip({
  texts,
  speed = 20,
  className = '',
  separator = '•',
}: MarqueeStripProps) {
  // Generate the full string once
  const fullText = texts.join(` ${separator} `) + ` ${separator} `;

  // We need to render this text multiple times to fill width
  // But for the wave effect, each character needs to be an individual element.
  // So we split the fullText into characters.
  const characters = fullText.split('');

  return (
    <div className={`relative flex w-full overflow-hidden select-none py-12 ${className}`}>
      {/* Track 1 */}
      <SineWaveTrack characters={characters} speed={speed} direction={1} />
      {/* Track 2 (Duplicate for infinite loop) - Actually, standard marquee duplicator */}
      {/* 
                For sine wave, standard CSS marquee transform works IF the wave is relatively consistent.
                However, if we animate Y of chars, and the container moves X, it works.
             */}
    </div>
  );
}

// ------------------------------------------------------------------
// Internal Components
// ------------------------------------------------------------------

function SineWaveTrack({ characters, speed, direction }: { characters: string[], speed: number, direction: number; }) {
  // We create a very wide container that translates.
  // To ensure seamless loop, we render the character set multiple times (e.g. 4x).
  const repeatCount = 4;
  const allChars = Array(repeatCount).fill(characters).flat();

  return (
    <motion.div
      className="flex whitespace-nowrap"
      animate={{ x: direction > 0 ? ['-50%', '0%'] : ['0%', '-50%'] }}
      // Moving from -50% to 0% assumes we have enough content. 
      // Actually standard marquee moves -100% of ONE set.
      // Let's use CSS animation for the track movement for simplicity, and Framer for the wave.
      style={{
        x: 0, // We'll animate this
      }}
    >
      <MarqueeScroller speed={speed} direction={direction}>
        {allChars.map((char, i) => (
          <SineChar key={i} char={char} index={i} total={allChars.length} />
        ))}
      </MarqueeScroller>
    </motion.div>
  );
}

function MarqueeScroller({ children, speed, direction }: { children: React.ReactNode, speed: number, direction: number; }) {
  return (
    <motion.div
      className="flex"
      animate={{ x: direction === 1 ? ['-50%', '0%'] : ['0%', '-50%'] }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
    >
      {/* We need 2 sets of children for the loop seamlessly if we move -50% to 0%? 
                 Actually, usually: [Set1][Set2] -> move left -> [Set2] takes place of Set1.
                 So we render children. Children ideally contains MULTIPLE repetitions already.
             */}
      {children}
    </motion.div>
  );
}

const GLYPHS = '01xy#_@-+=/\\';

function SineChar({ char, index, total }: { char: string, index: number, total: number; }) {
  const [displayChar, setDisplayChar] = useState(char);
  const y = useMotionValue(0);
  const opacity = useMotionValue(1);

  // Wave Physics
  // We use useAnimationFrame to update Y based on time and index
  useAnimationFrame((t) => {
    // t is milliseconds
    const time = t / 1000;

    // Frequency and Amplitude
    const freq = 0.2; // Spatial frequency
    const speed = 3;  // Temporal speed
    const amp = 15;   // Height in px

    // Calculate Sine
    const wave = Math.sin(time * speed + index * freq) * amp;
    y.set(wave);

    // Occasional Glitch/Decode Effect
    // Randomly scramble character if it's not a space
    if (char !== ' ' && Math.random() < 0.001) { // Reduced to 0.1% chance for subtle single glitches
      const randomGlyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      setDisplayChar(randomGlyph);
    } else if (Math.random() < 0.05) {
      // 5% chance to revert to normal per frame
      setDisplayChar(char);
    }
  });

  // Hover Interaction
  // We can't detect hover on single char easily without layout thrashing.
  // Let's rely on CSS hover on parent to trigger "Excited State"?
  // Or just simple periodic glitch.

  // Better Logic:
  // Glitch State
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (char === ' ' || char === '•') return;

    // Random interval to trigger a "glitch burst"
    const interval = setInterval(() => {
      if (Math.random() < 0.05) { // Low chance every 2s
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
      }
    }, 2000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [char]);

  useEffect(() => {
    if (!isGlitching) {
      setDisplayChar(char);
      return;
    }
    const glitchInterval = setInterval(() => {
      setDisplayChar(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
    }, 50);
    return () => clearInterval(glitchInterval);
  }, [isGlitching, char]);


  return (
    <motion.span
      style={{ y, opacity }}
      className={`inline-block ${char === '•' ? 'text-[var(--accent-sepia)] mx-2' : ''}`}
    >
      {char === ' ' ? '\u00A0' : displayChar}
    </motion.span>
  );
}

// ------------------------------------------------------------------
// SineWaveMarquee Export (Replacing MarqueeStrip)
// ------------------------------------------------------------------
// To allow usage of 'MarqueeStrip' name but with new logic.

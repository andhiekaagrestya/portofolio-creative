'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HolidayDecorations({ theme }: { theme: string; }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (theme === 'ramadan') {
    return (
      <div className="fixed inset-0 pointer-events-none z-[9000] overflow-hidden">
        {/* Giant Crescent Moon in the background - Made MUCH more prominent */}
        <motion.div
          initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
          animate={{ opacity: 0.35, rotate: 0, scale: 1.2 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute top-[-5vh] right-[-5vw] md:top-[-10vh] md:right-0"
        >
          <svg width="800" height="800" viewBox="0 0 24 24" fill="var(--accent-rust)">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        </motion.div>

        {/* Hanging Lanterns - Increased Scale & Glow */}
        <HangingLantern x="10vw" yOrigin="-10px" delay={0.5} scale={1.5} duration={5} />
        <HangingLantern x="85vw" yOrigin="-30px" delay={1.2} scale={1.2} duration={6} />
        <HangingLantern x="65vw" yOrigin="0px" delay={2.5} scale={1.0} duration={4.5} />
        <HangingLantern x="40vw" yOrigin="-50px" delay={3.5} scale={0.8} duration={7} />

        {/* Ambient Stars - Increased count and opacity */}
        <AmbientStar top="20vh" left="15vw" delay={0} />
        <AmbientStar top="35vh" left="80vw" delay={1} />
        <AmbientStar top="60vh" left="25vw" delay={2} />
        <AmbientStar top="10vh" left="65vw" delay={3} />
        <AmbientStar top="75vh" left="75vw" delay={1.5} />
        <AmbientStar top="50vh" left="45vw" delay={2.5} />
      </div>
    );
  }

  if (theme === 'christmas') {
    return (
      <div className="fixed inset-0 pointer-events-none z-[9000] overflow-hidden">
        {/* Giant Christmas Tree Silhouette */}
        <motion.div
          initial={{ opacity: 0, translateY: 100, scale: 0.8 }}
          animate={{ opacity: 0.25, translateY: 0, scale: 1.2 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute bottom-[-5vh] left-[-10vw] md:bottom-[-10vh] md:left-[-5vw]"
        >
          <svg viewBox="0 0 800 1200" width="700" height="900" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" />
              </filter>
              <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5f5f5f" />
                <stop offset="100%" stopColor="#1f1f1f" />
              </linearGradient>
              <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6a6a6a" />
                <stop offset="100%" stopColor="#2b2b2b" />
              </linearGradient>
              <radialGradient id="ballGray">
                <stop offset="0%" stopColor="#d9d9d9" />
                <stop offset="100%" stopColor="#555" />
              </radialGradient>
            </defs>

            <path d="M400 80 L520 300 L460 300 L600 520 L520 520 L680 780 L120 780 L280 520 L200 520 L340 300 L280 300 Z" fill="url(#treeGrad)" />
            <polygon points="400,40 415,80 460,80 425,105 440,145 400,120 360,145 375,105 340,80 385,80" fill="#cfcfcf" filter="url(#glow)" />

            <g stroke="#888" strokeWidth="3" fill="none" opacity="0.6">
              <path d="M260 260 Q400 220 540 260" />
              <path d="M220 380 Q400 340 580 380" />
              <path d="M180 520 Q400 480 620 520" />
              <path d="M150 650 Q400 610 650 650" />
            </g>

            <g filter="url(#glow)">
              <circle cx="320" cy="250" r="5" fill="#e0e0e0" />
              <circle cx="460" cy="250" r="5" fill="#e0e0e0" />
              <circle cx="300" cy="370" r="5" fill="#e0e0e0" />
              <circle cx="500" cy="370" r="5" fill="#e0e0e0" />
              <circle cx="270" cy="510" r="5" fill="#e0e0e0" />
              <circle cx="530" cy="510" r="5" fill="#e0e0e0" />
              <circle cx="250" cy="640" r="5" fill="#e0e0e0" />
              <circle cx="560" cy="640" r="5" fill="#e0e0e0" />
            </g>

            <g>
              <circle cx="350" cy="350" r="20" fill="url(#ballGray)" />
              <circle cx="450" cy="420" r="22" fill="url(#ballGray)" />
              <circle cx="310" cy="520" r="18" fill="url(#ballGray)" />
              <circle cx="500" cy="560" r="24" fill="url(#ballGray)" />
              <circle cx="400" cy="650" r="20" fill="url(#ballGray)" />
            </g>

            <g>
              <path d="M380 780 Q400 770 420 780 L435 950 Q400 980 365 950 Z" fill="url(#woodGrad)" />
              <path d="M395 800 Q390 880 400 930" stroke="#4a4a4a" strokeWidth="2" opacity="0.5" />
              <path d="M410 820 Q420 900 405 940" stroke="#2a2a2a" strokeWidth="2" opacity="0.6" />
            </g>

            <ellipse cx="400" cy="970" rx="260" ry="40" fill="#000" opacity="0.25" />

            <g opacity="0.95">
              <ellipse cx="315" cy="970" rx="85" ry="18" fill="#000" opacity="0.15" />
              <ellipse cx="450" cy="995" rx="100" ry="20" fill="#000" opacity="0.15" />
              <ellipse cx="575" cy="975" rx="70" ry="16" fill="#000" opacity="0.15" />
              <rect x="255" y="885" width="115" height="85" rx="14" fill="#555" />
              <rect x="248" y="865" width="130" height="28" rx="10" fill="#777" />
              <rect x="385" y="910" width="125" height="95" rx="16" fill="#666" />
              <rect x="372" y="885" width="150" height="30" rx="12" fill="#888" />
              <rect x="525" y="900" width="95" height="75" rx="14" fill="#444" />
              <rect x="518" y="880" width="110" height="25" rx="10" fill="#777" />
            </g>
          </svg>
        </motion.div>

        {/* Falling Snowflakes - Thicker & More */}
        {[...Array(30)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.2} left={`${Math.random() * 100}vw`} size={Math.random() * 25 + 15} />
        ))}
        {/* Heavy Snow Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
        {/* Thick Garland/Pine branches at top */}
        <div className="absolute top-[-50px] left-0 right-0 h-[150px] opacity-30" style={{ background: 'radial-gradient(ellipse at top, var(--accent-sage) 30%, transparent 80%)' }} />
      </div>
    );
  }

  if (theme === 'lunar') {
    return (
      <div className="fixed inset-0 pointer-events-none z-[9000] overflow-hidden">
        {/* Giant Dragon/Barongsai Silhouette using PNG */}
        <motion.div
          initial={{ opacity: 0, rotate: 15, scale: 0.8 }}
          animate={{ opacity: 0.25, rotate: 0, scale: 1.2 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute bottom-[-10vh] right-[-10vw] md:bottom-[-15vh] md:right-[-5vw]"
        >
          <img
            src="/collage/barongsai.png"
            alt="Barongsai"
            width={700}
            className="w-[60vw] max-w-[700px] min-w-[400px] sepia-[0.3] brightness-150 contrast-[0.9] saturate-[1.5]"
          />
        </motion.div>

        {/* Red Lunar Lanterns - Enlarged and multiplied */}
        <LunarLantern x="5vw" yOrigin="-10px" delay={0.2} scale={1.5} duration={5.5} />
        <LunarLantern x="90vw" yOrigin="-5px" delay={1.5} scale={1.3} duration={4} />
        <LunarLantern x="25vw" yOrigin="-30px" delay={0.8} scale={0.9} duration={6} />
        <LunarLantern x="70vw" yOrigin="-20px" delay={2.1} scale={1.0} duration={4.8} />

        {/* Floating Gold Coins / Sparks - Prominent */}
        <AmbientStar top="20vh" left="15vw" delay={0.5} />
        <AmbientStar top="50vh" left="85vw" delay={1.2} />
        <AmbientStar top="80vh" left="35vw" delay={2.5} />
        <AmbientStar top="40vh" left="45vw" delay={3.0} />

        {/* Strong red clouds bottom */}
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] opacity-30 rounded-full" style={{ background: 'radial-gradient(circle, var(--accent-sage), transparent 70%)' }} />
        <div className="absolute bottom-[50px] left-[-50px] w-[350px] h-[350px] opacity-25 rounded-full" style={{ background: 'radial-gradient(circle, var(--accent-rust), transparent 70%)' }} />
      </div>
    );
  }

  if (theme === 'newyear') {
    return (
      <div className="fixed inset-0 pointer-events-none z-[9000] overflow-hidden">
        {/* Giant 2026/New Year Silhouette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1.1 }}
          transition={{ duration: 4, ease: 'easeOut' }}
          className="absolute top-[30vh] left-[0vw] w-full flex justify-center"
        >
          <svg width="100%" height="400" viewBox="0 0 800 300" fill="var(--accent-cream)">
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="240" fontWeight="900" fontFamily="sans-serif" letterSpacing="15">2026</text>
          </svg>
        </motion.div>

        {/* Heavy Fireworks Flashes */}
        <FireworkFlash top="15vh" left="20vw" delay={0} color="var(--accent-rust)" size={200} />
        <FireworkFlash top="45vh" left="80vw" delay={1.5} color="var(--accent-sepia)" size={250} />
        <FireworkFlash top="70vh" left="15vw" delay={3} color="var(--accent-cream)" size={180} />
        <FireworkFlash top="25vh" left="65vw" delay={1} color="var(--accent-rust)" size={300} />
        <FireworkFlash top="85vh" left="55vw" delay={2.5} color="var(--accent-sepia)" size={220} />

        {/* Dense Golden Confetti */}
        {[...Array(25)].map((_, i) => (
          <ConfettiLine key={i} delay={i * 0.3} left={`${Math.random() * 100}vw`} />
        ))}
      </div>
    );
  }

  return null;
}

// ── Shared Sub-Components ──────────────────────────────────────────

function HangingLantern({ x, yOrigin, delay, scale, duration }: { x: string; yOrigin: string; delay: number; scale: number; duration: number; }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ top: yOrigin, left: x, scale, transformOrigin: 'top center' }}
      initial={{ rotate: -5, y: -100 }}
      animate={{ rotate: [3, -3, 3], y: 0 }}
      transition={{
        y: { type: 'spring', stiffness: 50, damping: 10, delay },
        rotate: { repeat: Infinity, duration, ease: 'easeInOut', delay }
      }}
    >
      {/* String */}
      <div className="w-[2px] h-[150px] bg-gradient-to-b from-black/50 to-[var(--accent-rust)]" />
      {/* Lantern Body */}
      <motion.div
        className="relative"
        animate={{ filter: ['drop-shadow(0 0 10px rgba(207,168,92,0.3))', 'drop-shadow(0 0 30px rgba(207,168,92,0.8))', 'drop-shadow(0 0 10px rgba(207,168,92,0.3))'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150" width="80" height="120">
          <path fill="var(--accent-rust)" opacity="1" d="M35 15 L65 15 L70 30 L30 30 Z M30 35 L70 35 L80 90 L20 90 Z M35 95 L65 95 L60 110 L40 110 Z" />
          <circle cx="50" cy="62" r="15" fill="#fff" opacity="1" />
          <path stroke="var(--accent-rust)" opacity="1" strokeWidth="4" d="M50 0 L50 15 M50 110 L50 140" />
          {/* Intricate lines inside */}
          <path stroke="var(--background)" strokeWidth="2" opacity="0.8" d="M30 35 L50 90 M70 35 L50 90 M20 90 L80 90" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function AmbientStar({ top, left, delay }: { top: string; left: string; delay: number; }) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.5, 0.8], rotate: 180 }}
      transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">
        <path fill="var(--accent-rust)" d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
      </svg>
    </motion.div>
  );
}

function Snowflake({ left, delay, size }: { left: string; delay: number; size: number; }) {
  return (
    <motion.div
      className="absolute top-[-5vh] text-[var(--accent-cream)] opacity-60"
      style={{ left, fontSize: size }}
      initial={{ y: '-10vh', rotate: 0 }}
      animate={{ y: '110vh', rotate: 360, x: [0, 30, -30, 0] }}
      transition={{ repeat: Infinity, duration: 12 + Math.random() * 5, ease: 'linear', delay }}
    >
      ❄
    </motion.div>
  );
}

function LunarLantern({ x, yOrigin, delay, scale, duration }: { x: string; yOrigin: string; delay: number; scale: number; duration: number; }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ top: yOrigin, left: x, scale, transformOrigin: 'top center' }}
      initial={{ rotate: -8 }}
      animate={{ rotate: 8 }}
      transition={{ repeat: Infinity, duration, ease: 'easeInOut', delay, repeatType: 'reverse' }}
    >
      <div className="w-[1px] h-[80px] bg-[var(--accent-rust)] opacity-50" />
      <motion.div
        animate={{ filter: ['drop-shadow(0 0 10px rgba(198,40,40,0.4))', 'drop-shadow(0 0 25px rgba(198,40,40,0.7))'] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay, repeatType: 'reverse' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="70" height="90">
          <ellipse cx="50" cy="50" rx="45" ry="40" fill="var(--accent-sage)" opacity="1" />
          <path d="M25 15 Q50 50 75 15 M20 30 Q50 60 80 30 M20 70 Q50 40 80 70 M25 85 Q50 50 75 85" stroke="var(--accent-rust)" strokeWidth="2.5" fill="none" opacity="0.8" />
          <rect x="35" y="0" width="30" height="15" fill="var(--accent-rust)" />
          <rect x="35" y="85" width="30" height="15" fill="var(--accent-rust)" />
          <path d="M40 100 L40 120 M50 100 L50 135 M60 100 L60 120" stroke="var(--accent-rust)" strokeWidth="3" opacity="1" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function FireworkFlash({ top, left, delay, color, size }: { top: string; left: string; delay: number; color: string; size: number; }) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeOut', delay }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-full h-[4px] rounded-full" style={{ background: color, filter: 'blur(3px)', boxShadow: `0 0 20px ${color}` }} />
        <div className="absolute w-[4px] h-full rounded-full" style={{ background: color, filter: 'blur(3px)', boxShadow: `0 0 20px ${color}` }} />
        <div className="absolute w-full h-[4px] rounded-full rotate-45" style={{ background: color, filter: 'blur(3px)', boxShadow: `0 0 20px ${color}` }} />
        <div className="absolute w-[4px] h-full rounded-full rotate-45" style={{ background: color, filter: 'blur(3px)', boxShadow: `0 0 20px ${color}` }} />
      </div>
    </motion.div>
  );
}

function ConfettiLine({ left, delay }: { left: string; delay: number; }) {
  return (
    <motion.div
      className="absolute top-[-10vh] w-[4px] h-[70px] rounded-full"
      style={{ left, background: 'linear-gradient(to bottom, var(--accent-rust), transparent)', boxShadow: '0 0 10px var(--accent-rust)' }}
      initial={{ y: '-10vh' }}
      animate={{ y: '110vh' }}
      transition={{ repeat: Infinity, duration: 4 + Math.random() * 3, ease: 'linear', delay }}
    />
  );
}

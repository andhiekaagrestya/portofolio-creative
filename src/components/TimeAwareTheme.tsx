'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/*
  Time Phases:
  ☀️ GOLDEN HOUR   (6–11)   — Warm, bright, golden tones
  🌤️ AFTERNOON     (11–17)  — Standard warm palette (default)
  🌅 DUSK          (17–21)  — Deep amber, cinematic golden
  🌙 MIDNIGHT      (21–6)   — Dark, moody, deep blue-tinged
*/

type TimePhase = 'golden' | 'afternoon' | 'dusk' | 'midnight';

interface PhaseConfig {
  label: string;
  icon: string;
  colors: {
    background: string;
    foreground: string;
    accentWarm: string;
    accentSepia: string;
    accentSage: string;
    accentRust: string;
    accentCream: string;
    accentInk: string;
    grainOpacity: string;
    vignetteOpacity: string;
  };
}

const PHASES: Record<TimePhase, PhaseConfig> = {
  golden: {
    label: 'golden hour',
    icon: '☀️',
    colors: {
      background: '#1e1812',
      foreground: '#e0d2b4',
      accentWarm: '#d4a574',
      accentSepia: '#a07828',
      accentSage: '#7d8e6a',
      accentRust: '#b8683a',
      accentCream: '#faf0d8',
      accentInk: '#2c1810',
      grainOpacity: '0.10',
      vignetteOpacity: '0.45',
    },
  },
  afternoon: {
    label: 'afternoon',
    icon: '🌤️',
    colors: {
      background: '#1a1510',
      foreground: '#d4c5a9',
      accentWarm: '#c4956a',
      accentSepia: '#8b6914',
      accentSage: '#6b7c5e',
      accentRust: '#a0522d',
      accentCream: '#f5e6c8',
      accentInk: '#2c1810',
      grainOpacity: '0.12',
      vignetteOpacity: '0.6',
    },
  },
  dusk: {
    label: 'dusk',
    icon: '🌅',
    colors: {
      background: '#16120d',
      foreground: '#c9b898',
      accentWarm: '#d4884a',
      accentSepia: '#9e6a10',
      accentSage: '#5e6e50',
      accentRust: '#c45a28',
      accentCream: '#e8d4aa',
      accentInk: '#1a0e08',
      grainOpacity: '0.14',
      vignetteOpacity: '0.7',
    },
  },
  midnight: {
    label: 'midnight',
    icon: '🌙',
    colors: {
      background: '#0e0c0a',
      foreground: '#b8a88c',
      accentWarm: '#8a7050',
      accentSepia: '#6b5518',
      accentSage: '#4a5840',
      accentRust: '#7a4228',
      accentCream: '#d0c0a0',
      accentInk: '#0a0806',
      grainOpacity: '0.18',
      vignetteOpacity: '0.85',
    },
  },
};

function getPhase(hour: number): TimePhase {
  if (hour >= 6 && hour < 11) return 'golden';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'dusk';
  return 'midnight';
}

export default function TimeAwareTheme() {
  const [phase, setPhase] = useState<TimePhase>('afternoon');
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    const currentPhase = getPhase(hour);
    setPhase(currentPhase);

    // Apply CSS variables with transition
    const config = PHASES[currentPhase];
    const root = document.documentElement;

    // Transition all color changes smoothly
    root.style.transition = 'background-color 2s ease, color 2s ease';

    Object.entries(config.colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });

    // Also update body background for smooth transition
    document.body.style.transition = 'background-color 2s ease';
    document.body.style.backgroundColor = config.colors.background;

    // Check every minute for phase changes (in case user is on site during transition)
    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      const newPhase = getPhase(newHour);
      if (newPhase !== currentPhase) {
        setPhase(newPhase);
        const newConfig = PHASES[newPhase];
        Object.entries(newConfig.colors).forEach(([key, value]) => {
          const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          root.style.setProperty(`--${cssVar}`, value);
        });
        document.body.style.backgroundColor = newConfig.colors.background;
        // Flash indicator on phase change
        setShowIndicator(true);
        setTimeout(() => setShowIndicator(false), 4000);
      }
    }, 60000);

    // Hide indicator after 5s
    const hideTimer = setTimeout(() => setShowIndicator(false), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, []);

  const config = PHASES[phase];

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed top-6 right-6 flex items-center gap-2 px-3 py-2 rounded-sm"
          style={{
            zIndex: 9989,
            background: 'rgba(26,21,16,0.8)',
            border: '1px solid rgba(196,149,106,0.15)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span className="text-sm">{config.icon}</span>
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-warm)',
              opacity: 0.7,
            }}
          >
            {config.label}
          </span>
          {/* Tiny color preview dots */}
          <div className="flex gap-1 ml-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: config.colors.accentWarm }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: config.colors.accentSepia }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: config.colors.accentCream }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

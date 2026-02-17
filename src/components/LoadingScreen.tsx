'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            zIndex: 10000,
            background: '#1a1510',
          }}
        >
          {/* Film countdown circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mb-12"
          >
            {/* Countdown ring */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: 'var(--accent-cream)', opacity: 0.3 }}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border flex items-center justify-center"
                style={{ borderColor: 'var(--accent-warm)', opacity: 0.5 }}
              >
                <span className="text-4xl md:text-5xl font-bold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: 'var(--accent-cream)',
                  }}
                >
                  {Math.min(Math.floor(progress / 20) + 1, 5)}
                </span>
              </div>
            </div>

            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-full h-px" style={{ background: 'rgba(212,197,169,0.15)' }} />
              <div className="absolute h-full w-px" style={{ background: 'rgba(212,197,169,0.15)' }} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl md:text-4xl tracking-[0.3em] uppercase mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--accent-cream)',
              textShadow: '0 0 30px rgba(196,149,106,0.2)',
            }}
          >
            Andhieka Agrestya
          </motion.h1>

          {/* Progress bar */}
          <div className="w-48 md:w-64 h-px relative overflow-hidden" style={{ background: 'rgba(212,197,169,0.15)' }}>
            <motion.div
              className="h-full origin-left"
              style={{
                background: 'linear-gradient(90deg, var(--accent-warm), var(--accent-cream))',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.min(progress / 100, 1) }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 text-xs tracking-[0.4em] uppercase"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--accent-warm)',
            }}
          >
            loading reel
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

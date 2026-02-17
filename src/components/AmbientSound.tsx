'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  // Dismiss tooltip after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const createAmbientLayers = useCallback((ctx: AudioContext, master: GainNode) => {
    const nodes: AudioNode[] = [];

    // ============================================
    // LAYER 1: Vinyl Surface Noise (warm hiss)
    // ============================================
    const vinylNoiseSize = ctx.sampleRate * 3;
    const vinylBuffer = ctx.createBuffer(2, vinylNoiseSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = vinylBuffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < vinylNoiseSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise approximation — warmer than white
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
      }
    }
    const vinylNoise = ctx.createBufferSource();
    vinylNoise.buffer = vinylBuffer;
    vinylNoise.loop = true;

    // Shape it to sound like vinyl surface
    const vinylLP = ctx.createBiquadFilter();
    vinylLP.type = 'lowpass';
    vinylLP.frequency.value = 4500;
    vinylLP.Q.value = 0.7;

    const vinylHP = ctx.createBiquadFilter();
    vinylHP.type = 'highpass';
    vinylHP.frequency.value = 200;

    const vinylGain = ctx.createGain();
    vinylGain.gain.value = 0.09;

    vinylNoise.connect(vinylHP);
    vinylHP.connect(vinylLP);
    vinylLP.connect(vinylGain);
    vinylGain.connect(master);
    vinylNoise.start();
    nodes.push(vinylNoise);

    // ============================================
    // LAYER 2: Vinyl Crackle & Pops
    // ============================================
    const crackleSize = ctx.sampleRate * 4;
    const crackleBuffer = ctx.createBuffer(2, crackleSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = crackleBuffer.getChannelData(ch);
      for (let i = 0; i < crackleSize; i++) {
        // Random pops — sparse
        const rnd = Math.random();
        if (rnd < 0.0008) {
          // Big pop
          const decay = Math.min(60, crackleSize - i);
          for (let d = 0; d < decay; d++) {
            if (i + d < crackleSize) {
              const env = Math.exp(-d / 8);
              data[i + d] += (Math.random() - 0.5) * env * 0.7;
            }
          }
        } else if (rnd < 0.004) {
          // Small tick
          data[i] = (Math.random() - 0.5) * 0.3;
        }
      }
    }
    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;

    const crackleHP = ctx.createBiquadFilter();
    crackleHP.type = 'highpass';
    crackleHP.frequency.value = 600;

    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.18;

    crackleSource.connect(crackleHP);
    crackleHP.connect(crackleGain);
    crackleGain.connect(master);
    crackleSource.start();
    nodes.push(crackleSource);

    // ============================================
    // LAYER 3: Dark Drone — Deep Fundamental
    // ============================================
    const drone1 = ctx.createOscillator();
    drone1.type = 'sine';
    drone1.frequency.value = 55; // A1 — deep root note

    // Slow LFO to modulate drone pitch slightly (eerie wobble)
    const lfo1 = ctx.createOscillator();
    lfo1.type = 'sine';
    lfo1.frequency.value = 0.07; // Very slow wobble
    const lfo1Gain = ctx.createGain();
    lfo1Gain.gain.value = 1.5; // ±1.5 Hz variation
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(drone1.frequency);
    lfo1.start();
    nodes.push(lfo1);

    const drone1Gain = ctx.createGain();
    drone1Gain.gain.value = 0.06;

    const drone1LP = ctx.createBiquadFilter();
    drone1LP.type = 'lowpass';
    drone1LP.frequency.value = 200;

    drone1.connect(drone1LP);
    drone1LP.connect(drone1Gain);
    drone1Gain.connect(master);
    drone1.start();
    nodes.push(drone1);

    // ============================================
    // LAYER 4: Dark Drone — Eerie Fifth
    // ============================================
    const drone2 = ctx.createOscillator();
    drone2.type = 'sine';
    drone2.frequency.value = 82.4; // E2 — a haunting fifth above A1

    const lfo2 = ctx.createOscillator();
    lfo2.type = 'triangle';
    lfo2.frequency.value = 0.04;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 2;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(drone2.frequency);
    lfo2.start();
    nodes.push(lfo2);

    const drone2Gain = ctx.createGain();
    drone2Gain.gain.value = 0.035;

    drone2.connect(drone2Gain);
    drone2Gain.connect(master);
    drone2.start();
    nodes.push(drone2);

    // ============================================
    // LAYER 5: Dark Drone — Sub Bass Pulse
    // ============================================
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 36.7; // D1 — sub bass

    // Slow amplitude modulation — breathing effect
    const subLfo = ctx.createOscillator();
    subLfo.type = 'sine';
    subLfo.frequency.value = 0.12;
    const subLfoGain = ctx.createGain();
    subLfoGain.gain.value = 0.015;
    subLfo.connect(subLfoGain);

    const subGain = ctx.createGain();
    subGain.gain.value = 0.03;
    subLfoGain.connect(subGain.gain);

    sub.connect(subGain);
    subGain.connect(master);
    sub.start();
    subLfo.start();
    nodes.push(sub, subLfo);

    // ============================================
    // LAYER 6: Dark Atmosphere (filtered noise pad)
    // ============================================
    const padSize = ctx.sampleRate * 5;
    const padBuffer = ctx.createBuffer(2, padSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = padBuffer.getChannelData(ch);
      let prev = 0;
      for (let i = 0; i < padSize; i++) {
        // Brown noise — deep rumble
        prev = (prev + Math.random() * 0.02 - 0.01) * 0.998;
        data[i] = prev * 8;
      }
    }
    const padSource = ctx.createBufferSource();
    padSource.buffer = padBuffer;
    padSource.loop = true;

    const padLP = ctx.createBiquadFilter();
    padLP.type = 'lowpass';
    padLP.frequency.value = 300;
    padLP.Q.value = 3; // Slight resonance for eeriness

    // Slowly sweep the filter for movement
    const padLfo = ctx.createOscillator();
    padLfo.type = 'sine';
    padLfo.frequency.value = 0.03;
    const padLfoGain = ctx.createGain();
    padLfoGain.gain.value = 100;
    padLfo.connect(padLfoGain);
    padLfoGain.connect(padLP.frequency);
    padLfo.start();
    nodes.push(padLfo);

    const padGain = ctx.createGain();
    padGain.gain.value = 0.07;

    padSource.connect(padLP);
    padLP.connect(padGain);
    padGain.connect(master);
    padSource.start();
    nodes.push(padSource);

    return nodes;
  }, []);

  const toggleSound = useCallback(() => {
    if (isPlaying) {
      // Fade out gracefully
      if (masterGainRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
        masterGainRef.current.gain.linearRampToValueAtTime(0, now + 1.2);
        setTimeout(() => {
          nodesRef.current.forEach((n) => {
            try { (n as OscillatorNode | AudioBufferSourceNode).stop(); } catch { /* already stopped */ }
          });
          nodesRef.current = [];
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
          masterGainRef.current = null;
        }, 1400);
      }
      setIsPlaying(false);
    } else {
      // Create audio context and start
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      masterGainRef.current = master;

      const nodes = createAmbientLayers(ctx, master);
      nodesRef.current = nodes;

      // Slow fade in for cinematic feel
      const now = ctx.currentTime;
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(0.8, now + 3);

      setIsPlaying(true);
      setShowTooltip(false);
    }
  }, [isPlaying, createAmbientLayers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      nodesRef.current.forEach((n) => {
        try { (n as OscillatorNode | AudioBufferSourceNode).stop(); } catch { /* */ }
      });
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6" style={{ zIndex: 9990 }}>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-full right-0 mb-3 whitespace-nowrap px-3 py-1.5 rounded-sm text-xs"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cream)',
              background: 'rgba(26,21,16,0.9)',
              border: '1px solid rgba(196,149,106,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            ♪ turn on the projector
            <div
              className="absolute -bottom-1 right-4 w-2 h-2 rotate-45"
              style={{ background: 'rgba(26,21,16,0.9)', borderRight: '1px solid rgba(196,149,106,0.2)', borderBottom: '1px solid rgba(196,149,106,0.2)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={toggleSound}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-12 h-12 rounded-full flex items-center justify-center group"
        style={{
          background: isPlaying
            ? 'radial-gradient(circle, rgba(196,149,106,0.15), rgba(26,21,16,0.8))'
            : 'rgba(26,21,16,0.6)',
          border: `1px solid ${isPlaying ? 'rgba(196,149,106,0.4)' : 'rgba(196,149,106,0.15)'}`,
          backdropFilter: 'blur(12px)',
          transition: 'all 0.5s ease',
          cursor: 'pointer',
        }}
        aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
      >
        {/* Animated ring when playing */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(196,149,106,0.2)' }}
              animate={{ scale: [1, 1.5, 1.5], opacity: [0.4, 0, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(196,149,106,0.15)' }}
              animate={{ scale: [1, 1.8, 1.8], opacity: [0.3, 0, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
            />
          </>
        )}

        {/* Icon — Vinyl disc */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isPlaying ? 'var(--accent-cream)' : 'var(--accent-warm)'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'all 0.4s ease', opacity: isPlaying ? 1 : 0.6 }}
        >
          <circle cx="12" cy="12" r="10" strokeDasharray={isPlaying ? '0' : '4 3'} />
          <circle cx="12" cy="12" r="3" fill={isPlaying ? 'var(--accent-warm)' : 'none'} />
          {isPlaying && (
            <circle cx="12" cy="12" r="6" strokeDasharray="2 4" />
          )}
          {!isPlaying && (
            <line x1="4" y1="4" x2="20" y2="20" stroke="var(--accent-rust)" strokeWidth="2" />
          )}
        </svg>

        {/* Label on hover */}
        <span
          className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full text-xs opacity-0 group-hover:opacity-60 transition-opacity whitespace-nowrap"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-warm)' }}
        >
          {isPlaying ? 'sound on' : 'sound off'}
        </span>
      </motion.button>
    </div>
  );
}

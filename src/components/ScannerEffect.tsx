'use client';

import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// ── Realistic scanner sound — mechanical click + motor hum + scan head whir + confirm beep ──
function playScanSound(ctx: AudioContext) {
  const t = ctx.currentTime;

  // ── 1. Mechanical CLICK — scan starts ──
  const clickBuf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
  const clickData = clickBuf.getChannelData(0);
  for (let i = 0; i < clickBuf.length; i++) {
    clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
  }
  const clickSrc = ctx.createBufferSource();
  clickSrc.buffer = clickBuf;
  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.45, t);
  clickSrc.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickSrc.start(t);

  // ── 2. Motor HUM — low frequency motor, like scanner carriage moving ──
  const motor = ctx.createOscillator();
  motor.type = 'sine';
  motor.frequency.setValueAtTime(58, t + 0.04);
  motor.frequency.linearRampToValueAtTime(72, t + 0.3);   // spins up
  motor.frequency.setValueAtTime(72, t + 1.8);
  motor.frequency.linearRampToValueAtTime(50, t + 2.3);   // spins down

  // Slight servo wobble on the motor pitch
  const motorLfo = ctx.createOscillator();
  motorLfo.type = 'sine';
  motorLfo.frequency.value = 8.5;
  const motorLfoGain = ctx.createGain();
  motorLfoGain.gain.value = 3;
  motorLfo.connect(motorLfoGain);
  motorLfoGain.connect(motor.frequency);
  motorLfo.start(t + 0.04);
  motorLfo.stop(t + 2.4);

  const motorGain = ctx.createGain();
  motorGain.gain.setValueAtTime(0, t + 0.04);
  motorGain.gain.linearRampToValueAtTime(0.08, t + 0.25);
  motorGain.gain.setValueAtTime(0.08, t + 1.85);
  motorGain.gain.linearRampToValueAtTime(0, t + 2.4);

  motor.connect(motorGain);
  motorGain.connect(ctx.destination);
  motor.start(t + 0.04);
  motor.stop(t + 2.4);

  // ── 3. Scan HEAD whir — the high-pitched light bar moving noise ──
  const scanSize = Math.floor(ctx.sampleRate * 2.0);
  const scanBuf = ctx.createBuffer(1, scanSize, ctx.sampleRate);
  const scanData = scanBuf.getChannelData(0);
  // Bandpassed noise with amplitude envelope shaped like a sweep pass
  for (let i = 0; i < scanSize; i++) {
    const progress = i / scanSize;
    // Amplitude shape: ramp up, flat, ramp down
    const env = progress < 0.05 ? progress / 0.05
      : progress > 0.9 ? (1 - progress) / 0.1
        : 1.0;
    scanData[i] = (Math.random() * 2 - 1) * env * 0.3;
  }
  const scanSrc = ctx.createBufferSource();
  scanSrc.buffer = scanBuf;

  // Bandpass filter sweeping upward slightly as head moves
  const scanBP = ctx.createBiquadFilter();
  scanBP.type = 'bandpass';
  scanBP.frequency.setValueAtTime(800, t + 0.1);
  scanBP.frequency.linearRampToValueAtTime(1600, t + 2.0);
  scanBP.Q.value = 2.5;

  // HP to remove sub-bass rumble from noise
  const scanHP = ctx.createBiquadFilter();
  scanHP.type = 'highpass';
  scanHP.frequency.value = 400;

  const scanGain = ctx.createGain();
  scanGain.gain.setValueAtTime(0, t + 0.08);
  scanGain.gain.linearRampToValueAtTime(0.55, t + 0.18);
  scanGain.gain.setValueAtTime(0.55, t + 1.85);
  scanGain.gain.linearRampToValueAtTime(0, t + 2.2);

  scanSrc.connect(scanHP);
  scanHP.connect(scanBP);
  scanBP.connect(scanGain);
  scanGain.connect(ctx.destination);
  scanSrc.start(t + 0.08);

  // ── 4. Fluorescent lamp BUZZ — the scanner lamp bzzz ──
  const lamp = ctx.createOscillator();
  lamp.type = 'sawtooth';
  lamp.frequency.value = 120; // 120Hz lamp flicker (2× mains)

  const lampFilter = ctx.createBiquadFilter();
  lampFilter.type = 'lowpass';
  lampFilter.frequency.value = 800;

  const lampGain = ctx.createGain();
  lampGain.gain.setValueAtTime(0, t + 0.1);
  lampGain.gain.linearRampToValueAtTime(0.025, t + 0.2);
  lampGain.gain.setValueAtTime(0.025, t + 1.9);
  lampGain.gain.linearRampToValueAtTime(0, t + 2.1);

  lamp.connect(lampFilter);
  lampFilter.connect(lampGain);
  lampGain.connect(ctx.destination);
  lamp.start(t + 0.1);
  lamp.stop(t + 2.2);

  // ── 5. Done BEEP — confirmation "scan complete" ──
  const beep = ctx.createOscillator();
  beep.type = 'sine';
  beep.frequency.setValueAtTime(1200, t + 2.25);
  beep.frequency.setValueAtTime(1600, t + 2.35);

  const beepGain = ctx.createGain();
  beepGain.gain.setValueAtTime(0, t + 2.25);
  beepGain.gain.linearRampToValueAtTime(0.08, t + 2.27);
  beepGain.gain.setValueAtTime(0.08, t + 2.45);
  beepGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);

  beep.connect(beepGain);
  beepGain.connect(ctx.destination);
  beep.start(t + 2.25);
  beep.stop(t + 2.65);

  // ── 6. Final mechanical CLUNK ──
  const clunkBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
  const clunkData = clunkBuf.getChannelData(0);
  for (let i = 0; i < clunkBuf.length; i++) {
    clunkData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
  }
  const clunkSrc = ctx.createBufferSource();
  clunkSrc.buffer = clunkBuf;

  const clunkFilter = ctx.createBiquadFilter();
  clunkFilter.type = 'lowpass';
  clunkFilter.frequency.value = 300;

  const clunkGain = ctx.createGain();
  clunkGain.gain.value = 0.3;

  clunkSrc.connect(clunkFilter);
  clunkFilter.connect(clunkGain);
  clunkGain.connect(ctx.destination);
  clunkSrc.start(t + 2.2);
}

export default function ScannerEffect() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const intensity = useTransform(smoothVelocity, [-2000, 0, 2000], [1, 0, 1]);

  const backdropFilter = useTransform(
    intensity,
    [0, 0.5, 1],
    [
      'brightness(1) contrast(1) blur(0px) sepia(0)',
      'brightness(1.2) contrast(1.2) blur(0.5px) sepia(0.1)',
      'brightness(1.4) contrast(1.5) blur(1px) sepia(0.2)'
    ]
  );

  const [isScanning, setIsScanning] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const scanSoundCooldown = useRef(false);

  // ── Trigger scan sound when beam appears ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    return intensity.on('change', (latest) => {
      const wasScanning = isScanning;

      if (latest > 0.3 && !wasScanning) {
        setIsScanning(true);

        // Play scan sfx (debounced — max once per 2.5s)
        if (!scanSoundCooldown.current) {
          scanSoundCooldown.current = true;

          try {
            if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
              audioCtxRef.current = new AudioContext();
            }
            if (audioCtxRef.current.state === 'suspended') {
              audioCtxRef.current.resume();
            }
            playScanSound(audioCtxRef.current);
          } catch {
            // Audio not available — silently skip
          }

          setTimeout(() => { scanSoundCooldown.current = false; }, 5000);
        }
      } else if (latest <= 0.3 && wasScanning) {
        setIsScanning(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intensity]);

  // ── Cleanup AudioContext on unmount ──
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      style={{
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        opacity: useTransform(intensity, [0, 0.3, 1], [0, 0.1, 0.5])
      }}
    >
      {/* CRT Scanlines during fast scroll */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Bright scanner light beam */}
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

      {/* Chromatic aberration — red channel */}
      <motion.div
        className="absolute inset-0 bg-red-500 mix-blend-screen opacity-5"
        style={{
          x: useTransform(intensity, [0, 1], [0, 5]),
          y: useTransform(intensity, [0, 1], [0, -2])
        }}
      />
      {/* Chromatic aberration — cyan channel */}
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

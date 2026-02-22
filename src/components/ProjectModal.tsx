'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import HandDrawnSVG from './HandDrawnSVG';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    caseStudy?: React.ReactNode;
    image: string;
    tags: string[];
    color: string;
    link: string;
  } | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  // Mouse parallax setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for mouse movement
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!project) return;
    const { clientX, clientY } = e;
    // Normalize coordinates (-0.5 to 0.5)
    x.set((clientX / window.innerWidth) - 0.5);
    y.set((clientY / window.innerHeight) - 0.5);
  }

  // Parallax transforms
  const bgTextX = useTransform(mouseX, [-0.5, 0.5], [50, -50]);
  const bgTextY = useTransform(mouseY, [-0.5, 0.5], [50, -50]);

  const imgX = useTransform(mouseX, [-0.5, 0.5], [-30, 30]);
  const imgY = useTransform(mouseY, [-0.5, 0.5], [-30, 30]);
  const imgRotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const imgRotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const detailsX = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const detailsY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#0a0806] cursor-none"
          onMouseMove={handleMouseMove}
        >
          {/* Close Button (Fixed Top Right) */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-[10002] group"
          >
            <div className="relative w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
              <HandDrawnSVG preset="crossMark" width={20} height={20} color="var(--accent-cream)" />
            </div>
            <span className="absolute top-full mt-2 right-0 text-[10px] uppercase tracking-widest text-[var(--accent-cream)] opacity-0 group-hover:opacity-100 transition-opacity">
              Close
            </span>
          </button>

          {/* 1. BACKGROUND LAYER: Giant Text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]"
            style={{ x: bgTextX, y: bgTextY }}
          >
            <h1
              className="text-[20vw] font-black leading-none whitespace-nowrap select-none"
              style={{
                fontFamily: 'var(--font-serif)',
                color: project.color,
                transform: 'rotate(-5deg)'
              }}
            >
              {project.title}
            </h1>
          </motion.div>

          {/* Noise Overlay */}
          <div className="absolute inset-0 opacity-15 bg-[url('/noise.png')] pointer-events-none mix-blend-overlay" />

          {/* 2. MIDDLE LAYER: Floating Image (Polaroid Style) */}
          <div className="absolute inset-0 flex items-center justify-center p-8 z-[10000] pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: -2, opacity: 1 }}
              exit={{ scale: 0.9, rotate: -10, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
              style={{
                x: imgX,
                y: imgY,
                rotateX: imgRotateX,
                rotateY: imgRotateY,
                perspective: 1000
              }}
              className="relative w-full max-w-2xl aspect-[4/3] bg-[#1a1510] border-8 border-white p-2 shadow-2xl transform-gpu"
            >
              {/* Tape on image */}
              <div className="absolute -top-6 left-1/3 w-32 h-10 bg-[rgba(255,255,255,0.2)] backdrop-blur-sm -rotate-2 shadow-sm z-10" />

              <div className="relative w-full h-full bg-black overflow-hidden group">
                <div className="absolute inset-0 opacity-20 bg-black mix-blend-overlay z-10" />
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-contain p-8 opacity-90 grayscale-[0.2] contrast-125 group-hover:grayscale-0 transition-all duration-700"
                />
                {/* Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* 3. FOREGROUND LAYER: Deconstructed Content */}
          <div className="absolute inset-0 z-[10001] pointer-events-none">

            {/* Title Block (Top Left) */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute top-10 left-6 md:top-20 md:left-20 max-w-xl pointer-events-auto"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-20 bg-[var(--accent-warm)]" />
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--accent-warm)]">
                  Project No. 0{Math.floor(Math.random() * 9) + 1}
                </span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] mix-blend-difference"
                style={{ fontFamily: 'var(--font-serif)' }}>
                {project.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h2>
            </motion.div>

            {/* Description Note (Bottom Right - Paper Scrap Style) */}
            <motion.div
              initial={{ y: 100, opacity: 0, rotate: 5 }}
              animate={{ y: 0, opacity: 1, rotate: 2 }}
              exit={{ y: 100, opacity: 0, rotate: 5 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ x: detailsX, y: detailsY }}
              className="absolute bottom-10 right-6 md:bottom-20 md:right-20 w-[90vw] md:w-[400px] bg-[#f0e6d2] text-[#1a1510] p-6 md:p-8 shadow-[10px_10px_0px_rgba(0,0,0,0.5)] transform rotate-2 pointer-events-auto"
            >
              {/* Torn paper top edge effect using simple CSS (optional refinement) */}
              <div className="absolute -top-2 left-0 w-full h-2 bg-[#f0e6d2] [clip-path:polygon(0%_100%,5%_0%,10%_100%,15%_0%,20%_100%,25%_0%,30%_100%,35%_0%,40%_100%,45%_0%,50%_100%,55%_0%,60%_100%,65%_0%,70%_100%,75%_0%,80%_100%,85%_0%,90%_100%,95%_0%,100%_100%)]" />

              <HandDrawnSVG
                preset="squiggle"
                width={100}
                height={20}
                color={project.color}
                className="mb-4 opacity-70"
              />

              <p className="font-mono text-xs md:text-sm leading-relaxed mb-6 border-l-2 border-[#1a1510] pl-4">
                {project.description}
                <br /><br />
                {project.caseStudy ? (
                  <span className="opacity-80 leading-relaxed block mt-2" style={{ fontFamily: 'var(--font-sans)' }}>
                    {project.caseStudy}
                  </span>
                ) : (
                  <span className="opacity-60 italic">
                    // Full case study data is currently classified.
                    <br />// Accessing archival fragments...
                  </span>
                )}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[#1a1510] text-[#f0e6d2] text-[10px] uppercase tracking-wider font-bold">
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                className="block w-full text-center py-4 bg-[var(--accent-rust)] text-white font-black uppercase tracking-[0.2em] hover:bg-[#1a1510] transition-colors"
              >
                Launch Project
              </a>
            </motion.div>

            {/* Decorative arrow connecting title to image */}
            <div className="absolute top-[30%] left-[25%] opacity-60 hidden md:block">
              <HandDrawnSVG preset="arrowCurve" width={150} height={100} color="var(--accent-cream)" strokeWidth={2} duration={1} delay={0.5} />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

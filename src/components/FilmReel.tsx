'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

interface ReelProject {
  title: string;
  role: string;
  year: string;
  description: string;
  tags: string[];
  color: string;    // accent color
  accentLight: string;
}

const REEL_PROJECTS: ReelProject[] = [
  {
    title: 'Access Control System',
    role: 'Fullstack Engineer',
    year: '2024',
    description: 'Real-time vehicle & personnel access management with ALPR integration, plate scoring, and Go backend API serving 1k+ daily events.',
    tags: ['Go', 'PostgreSQL', 'Next.js', 'WebSocket'],
    color: '#4a7acc',
    accentLight: '#a8c8f0',
  },
  {
    title: 'Parking Management',
    role: 'Backend + Frontend',
    year: '2024',
    description: 'Multi-site parking SaaS with dynamic pricing, real-time occupancy, role-based access, and finance reporting dashboard.',
    tags: ['Go', 'Redis', 'React', 'Chart.js'],
    color: '#4a8a5a',
    accentLight: '#a0d0a8',
  },
  {
    title: 'nano-banana Portfolio',
    role: 'Creative Tech',
    year: '2025',
    description: 'This very site — an experimental scrollytelling portfolio with collage animation, DioramaLayer parallax, and physics interactions.',
    tags: ['Next.js', 'GSAP', 'Framer Motion', 'TypeScript'],
    color: '#c47a2a',
    accentLight: '#e0c080',
  },
  {
    title: 'VMS API Integration',
    role: 'Backend Engineer',
    year: '2024',
    description: 'Custom middleware to bridge in-house access control with a 3rd-party VMS, handling async card search, ALPR, and image capture.',
    tags: ['Go', 'REST', 'Docker', 'Nginx'],
    color: '#9060c0',
    accentLight: '#d0a8f0',
  },
];

// Film perforation strip (top or bottom)
function FilmPerforations({ side }: { side: 'top' | 'bottom'; }) {
  return (
    <div
      className={`absolute ${side === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 flex gap-3 px-4 py-1`}
      style={{
        background: side === 'top'
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.3))'
          : 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3))',
        height: 32,
        alignItems: 'center',
      }}
    >
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded-sm"
          style={{
            width: 20,
            height: 14,
            background: 'rgba(0,0,0,0.9)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)',
          }}
        />
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: ReelProject; index: number; }) {
  const { title, role, year, description, tags, color, accentLight } = project;

  return (
    <motion.div
      className="flex-shrink-0 relative"
      style={{ width: '38vw', minWidth: 360, maxWidth: 520 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 200, damping: 18 } }}
    >
      {/* Card */}
      <div
        className="relative h-full mx-4 overflow-hidden"
        style={{
          background: `linear-gradient(150deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%)`,
          border: `1px solid ${color}30`,
          boxShadow: `0 0 0 1px ${color}15, 0 20px 60px rgba(0,0,0,0.5)`,
          padding: '2rem',
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

        {/* Number watermark */}
        <div
          className="absolute top-4 right-6 font-bold select-none pointer-events-none"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '5rem',
            lineHeight: 1,
            color: `${color}08`,
            fontWeight: 900,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Year tag */}
        <div
          className="inline-block px-2 py-1 mb-4 text-xs font-bold tracking-widest"
          style={{
            fontFamily: 'var(--font-mono)',
            background: `${color}20`,
            border: `1px solid ${color}40`,
            color: accentLight,
          }}
        >
          {year}
        </div>

        {/* Title */}
        <h3
          className="font-bold mb-1 leading-tight"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            color: '#f4eddd',
          }}
        >
          {title}
        </h3>

        {/* Role */}
        <p
          className="mb-4 text-xs tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-mono)', color: accentLight, opacity: 0.7 }}
        >
          {role}
        </p>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: 'rgba(212,197,169,0.65)', fontFamily: 'var(--font-sans)', maxWidth: '90%' }}
        >
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-bold tracking-wide"
              style={{
                fontFamily: 'var(--font-mono)',
                background: `${color}15`,
                border: `1px solid ${color}30`,
                color: accentLight,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${color}30, transparent)` }} />
      </div>
    </motion.div>
  );
}

export default function FilmReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const totalWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
      {/* Film strip border top + bottom */}
      <FilmPerforations side="top" />
      <FilmPerforations side="bottom" />

      {/* Film color cast */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Grain on film */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 flex items-center h-full"
        style={{ paddingLeft: '5vw', paddingRight: '5vw', gap: '1vw' }}
      >
        {/* INTRO card */}
        <div className="flex-shrink-0 mr-8" style={{ width: '30vw', minWidth: 260 }}>
          <div className="px-4">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-mono)', color: 'rgba(212,197,169,0.4)' }}
            >
              Selected Works
            </p>
            <h2
              className="font-bold leading-none mb-4"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#f4eddd' }}
            >
              THE<br />REEL
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(212,197,169,0.5)', fontFamily: 'var(--font-sans)' }}
            >
              ← scroll to explore
            </p>
          </div>
        </div>

        {/* Project Cards */}
        {REEL_PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}

        {/* END card */}
        <div className="flex-shrink-0 ml-8" style={{ width: '20vw', minWidth: 180 }}>
          <div className="px-4 opacity-30">
            <p
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#f4eddd', letterSpacing: '0.2em', textTransform: 'uppercase', transform: 'rotate(-90deg)', transformOrigin: 'left center', whiteSpace: 'nowrap', marginTop: '8rem' }}
            >
              end of reel · continue scrolling ↓
            </p>
          </div>
        </div>
      </div>

      {/* Frame counter */}
      <div
        className="absolute bottom-10 right-8 z-20"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(212,197,169,0.25)', letterSpacing: '0.15em' }}
      >
        REC ● {REEL_PROJECTS.length} PROJECTS
      </div>
    </div>
  );
}

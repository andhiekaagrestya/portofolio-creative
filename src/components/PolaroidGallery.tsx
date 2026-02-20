'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import Image from 'next/image';
import ProjectModal from './ProjectModal';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  color: string;
  // Wormhole Config
  rotate: number; // Initial rotation for chaos
  xOffset: number; // Horizontal offset from center
  yOffset: number; // Vertical offset from center
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Ethereal Commerce',
    description: 'A 3D shopping experience with floating products.',
    tags: ['Next.js', 'Three.js'],
    image: '/collage/camera.png',
    link: '#',
    color: 'var(--accent-sage)',
    rotate: -5,
    xOffset: -10,
    yOffset: -5,
  },
  {
    id: 2,
    title: 'Noise Machine',
    description: 'Browser-based modular synthesizer.',
    tags: ['React', 'Tone.js'],
    image: '/collage/typewriter.png',
    link: '#',
    color: 'var(--accent-rust)',
    rotate: 8,
    xOffset: 15,
    yOffset: 10,
  },
  {
    id: 3,
    title: 'Void Chat',
    description: 'Encrypted ephemeral messaging.',
    tags: ['Socket.io', 'Crypto'],
    image: '/collage/compass.png',
    link: '#',
    color: 'var(--accent-sepia)',
    rotate: 12,
    xOffset: -20,
    yOffset: 15,
  },
  {
    id: 4,
    title: 'Type / Space',
    description: 'Experimental typography playground.',
    tags: ['GSAP', 'Opentype'],
    image: '/collage/fragments-new.png',
    link: '#',
    color: 'var(--accent-warm)',
    rotate: -9,
    xOffset: 25,
    yOffset: -10,
  },
];

// Configuration
const Z_DISTANCE = 1500; // Distance between projects
const TOTAL_DISTANCE = Z_DISTANCE * PROJECTS.length;

export default function PolaroidGallery() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll for a floaty feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20, mass: 0.5 });

  // Map progress (0-1) to Z-position (0 to TOTAL_DISTANCE)
  // We want to start slightly pushed back so the first item isn't immediately in face
  const zPosition = useTransform(smoothProgress, [0, 1], [0, TOTAL_DISTANCE + 500]);

  // Gyroscopic/Mouse Parallax (Subtle rotation based on mouse)
  const mouseX = useSpring(0, { stiffness: 30, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 10);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      {/* The Scroll Track (Tall Container) */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: `${PROJECTS.length * 100 + 100}vh` }} // Dynamic height based on items
      >
        {/* The Viewport (Sticky Window) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden perspective-[1000px] flex items-center justify-center">

          {/* Ambient Particles / Starfield */}
          <WormholeParticles zPosition={zPosition} />

          {/* The 3D World Container */}
          <motion.div
            className="relative w-full h-full max-w-[1200px] flex items-center justify-center transform-style-3d"
            style={{
              transformStyle: 'preserve-3d',
              rotateX: mouseY,
              rotateY: mouseX,
            }}
          >
            {PROJECTS.map((project, i) => {
              // Reverse index so last item is furthest back initially?
              // Actually, we want index 0 at Z=0, index 1 at Z=-1500, etc.
              const initialZ = -1 * i * Z_DISTANCE;

              return (
                <WormholeCard
                  key={project.id}
                  project={project}
                  initialZ={initialZ}
                  worldZ={zPosition}
                  onClick={() => setSelectedProject(project)}
                />
              );
            })}
          </motion.div>

          {/* Scroll Indicator Hint */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#d4c5a9] text-xs font-mono uppercase tracking-[0.3em] opacity-50"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          >
            Scroll to Travel
          </motion.div>
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function WormholeCard({ project, initialZ, worldZ, onClick }: {
  project: Project;
  initialZ: number;
  worldZ: MotionValue<number>;
  onClick: () => void;
}) {
  // Current Z position relative to camera = initialZ + worldZ
  const currentZ = useTransform(worldZ, (latest) => initialZ + latest);

  // Opacity: Fade in when far, fade out when passing camera (Z > 200)
  const opacity = useTransform(currentZ, [-3000, -500, 0, 300], [0, 1, 1, 0]);

  // Scale: Grow as it gets closer. 
  // Perspective handles this naturally, but we can enhance it or clamp it so it doesn't get infinitely small/large unexpectedly
  // No need to scale manually if using CSS perspective, but let's ensure it's visible.

  // Blur: Depth of field simulation
  const blur = useTransform(currentZ, [-2000, 0, 200], [10, 0, 20]);

  return (
    <motion.div
      className="absolute"
      style={{
        z: currentZ,
        x: `${project.xOffset}%`,
        y: `${project.yOffset}%`,
        rotate: project.rotate,
        opacity,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="w-[300px] md:w-[400px] aspect-[4/5] relative group cursor-pointer"
        initial="rest"
        whileHover="hover"
        variants={{
          rest: { scale: 1, rotate: 0 },
          hover: { scale: 1.05, rotate: 0 }
        }}
        onClick={onClick}
      >
        <div className="w-full h-full bg-[#f4f1e1] p-4 pb-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#d4c5a9]/20 transition-all duration-500">
          {/* Image */}
          <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden filter sepia-[0.3] contrast-[1.1]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-contain opacity-90"
              draggable={false}
            />
          </div>

          {/* Label */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <h3 className="text-2xl font-bold text-[#2c1810]" style={{ fontFamily: 'var(--font-serif)' }}>
              {project.title}
            </h3>
            <p className="text-xs text-[#6e5d50] uppercase tracking-widest mt-1 opacity-60">
              {project.tags[0]} // {project.tags[1]}
            </p>
          </div>

          {/* Tape with interactive peeling effect */}
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#ebe1cd] opacity-90 backdrop-blur-sm"
            style={{
              transformOrigin: 'bottom center', // Peel from the bottom edge
              rotateZ: Math.random() * 4 - 2 // Keep the initial slight random tilt
            }}
            variants={{
              rest: {
                rotateX: 0,
                y: 0,
                z: 0,
                boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
              },
              hover: {
                rotateX: 90, // Dramatic curl upwards
                y: -5,       // Lift significantly away from the top edge
                z: 20,       // Pull toward camera for 3D depth
                boxShadow: "0 15px 15px -5px rgba(0,0,0,0.6)" // Harsh shadow underneath the curled tape
              }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 10, mass: 0.5 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function WormholeParticles({ zPosition }: { zPosition: MotionValue<number>; }) {
  // Generate random particles
  // They also move towards camera, but maybe at different speeds (parallax)
  // For simplicity, let's just make them static in world space, so they fly by as we scroll

  // Need a stable random set
  const [particles] = useState(() => Array.from({ length: 40 }).map((_, i) => ({
    x: Math.random() * 200 - 100 + '%', // -100% to 100%
    y: Math.random() * 200 - 100 + '%',
    z: -1 * Math.random() * 6000,
    scale: Math.random() * 0.5 + 0.2,
  })));

  return (
    <div className="absolute inset-0 pointer-events-none transform-style-3d">
      {particles.map((p, i) => (
        <Particle key={i} data={p} worldZ={zPosition} />
      ))}
    </div>
  );
}

function Particle({ data, worldZ }: { data: any, worldZ: MotionValue<number>; }) {
  const currentZ = useTransform(worldZ, (latest) => data.z + latest);
  const opacity = useTransform(currentZ, [-6000, -1000, 0, 500], [0, 0.4, 0.8, 0]);

  return (
    <motion.div
      className="absolute rounded-full bg-[#d4c5a9] mix-blend-screen"
      style={{
        x: data.x,
        y: data.y,
        z: currentZ,
        width: '4px',
        height: '4px',
        scale: data.scale,
        opacity,
      }}
    />
  );
}

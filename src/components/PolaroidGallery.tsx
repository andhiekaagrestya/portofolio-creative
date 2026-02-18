'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  rotate: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Ethereal Commerce',
    description: 'A 3D shopping experience with floating products and spatial audio.',
    tags: ['Next.js', 'Three.js', 'WebAudio'],
    image: '/collage/camera.png', // Placeholder
    link: '#',
    color: 'var(--accent-sage)',
    rotate: '-3deg',
  },
  {
    id: 2,
    title: 'Noise Machine',
    description: 'Browser-based modular synthesizer with visual patch cables.',
    tags: ['React', 'Tone.js', 'Canvas'],
    image: '/collage/typewriter.png', // Placeholder
    link: '#',
    color: 'var(--accent-rust)',
    rotate: '2deg',
  },
  {
    id: 3,
    title: 'Void Chat',
    description: 'Encrypted ephemeral messaging for the paranoid.',
    tags: ['Socket.io', 'Redis', 'Crypto'],
    image: '/collage/compass.png', // Placeholder
    link: '#',
    color: 'var(--accent-sepia)',
    rotate: '-1deg',
  },
  {
    id: 4,
    title: 'Type / Space',
    description: 'Experimental typography playground with variable fonts.',
    tags: ['Typescript', 'GSAP', 'Opentype'],
    image: '/collage/fragments-new.png', // Placeholder
    link: '#',
    color: 'var(--accent-warm)',
    rotate: '4deg',
  },
];

export default function PolaroidGallery() {
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <>
      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      <div className="relative w-full py-20 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-center">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, rotate: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate: project.rotate,
                transition: { duration: 0.8, delay: i * 0.15 },
              }}
              viewport={{ once: true, margin: '-50px' }}
              className="relative group perspective-1000 w-full max-w-[300px] aspect-[4/5] mx-auto cursor-pointer"
              onClick={() => handleCardClick(project)}
              onMouseEnter={() => setFlippedId(project.id)}
              onMouseLeave={() => setFlippedId(null)}
              style={{ perspective: '1000px' }}
            >
              {/* 3D Flip Container */}
              <div
                className="relative w-full h-full transition-all duration-700 ease-in-out transform"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedId === project.id ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* === FRONT SIDE (Polaroid) === */}
                <div
                  className="absolute inset-0 bg-[#f8f5e6] p-3 pb-12 shadow-xl backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    boxShadow: '2px 4px 12px rgba(0,0,0,0.2)',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  {/* Tape effect */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 opacity-80"
                    style={{
                      background: 'rgba(212, 197, 169, 0.4)',
                      backdropFilter: 'blur(2px)',
                      transform: 'rotate(-2deg)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      zIndex: 10,
                    }}
                  />

                  {/* Image Area */}
                  <div className="relative w-full h-4/5 bg-[#1a1510] overflow-hidden mb-3 filter sepia-[0.3] contrast-[1.1]">
                    <div className="absolute inset-0 opacity-10 bg-black pointer-events-none mix-blend-overlay" />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full opacity-90 group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  {/* Handwritten Title */}
                  <div className="text-center">
                    <h3
                      className="text-xl md:text-2xl font-bold text-[#2c1810]"
                      style={{
                        fontFamily: 'var(--font-serif)',
                        transform: 'rotate(-1deg)',
                      }}
                    >
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* === BACK SIDE (Details) === */}
                <div
                  className="absolute inset-0 bg-[#1a1510] p-6 flex flex-col justify-center items-center text-center backface-hidden border border-[rgba(196,149,106,0.3)]"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'linear-gradient(135deg, #1a1510 0%, #2c1810 100%)',
                  }}
                >
                  {/* Tape (Back) */}
                  <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-8 opacity-40"
                    style={{
                      background: 'rgba(196, 149, 106, 0.3)',
                      transform: 'rotate(2deg)',
                      zIndex: 10,
                    }}
                  />

                  <h4 className="text-xl font-bold mb-3" style={{ color: project.color, fontFamily: 'var(--font-serif)' }}>
                    {project.title}
                  </h4>

                  <p className="text-sm mb-6 leading-relaxed opacity-80" style={{ color: 'var(--foreground)' }}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.65rem] uppercase tracking-wider px-2 py-1 border border-[rgba(196,149,106,0.3)] rounded-full"
                        style={{ color: 'var(--accent-cream)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  <button
                    className="inline-block px-6 py-2 border text-sm tracking-widest uppercase hover:bg-[var(--accent-warm)] hover:text-[#1a1510] transition-colors duration-300"
                    style={{
                      borderColor: project.color,
                      color: project.color,
                      fontFamily: 'var(--font-mono)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('View Case clicked'); // Debug
                      handleCardClick(project);
                    }}
                  >
                    View Case
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

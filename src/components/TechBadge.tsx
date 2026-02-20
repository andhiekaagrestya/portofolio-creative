'use client';

import { motion } from 'framer-motion';

interface TechBadgeProps {
  label: string;
  category?: 'frontend' | 'backend' | 'devops' | 'design' | 'language';
  rotate?: number;
  style?: React.CSSProperties;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  tapeColor?: string;
}

const categoryStyles: Record<string, { bg: string; border: string; text: string; tapeColor: string; }> = {
  frontend: { bg: '#1a2a4a', border: '#4a7acc', text: '#a8c8f0', tapeColor: '#4a7acc' },
  backend: { bg: '#1a3020', border: '#4a8a5a', text: '#a0d0a8', tapeColor: '#4a8a5a' },
  devops: { bg: '#2a1a10', border: '#aa6030', text: '#e0a880', tapeColor: '#aa6030' },
  design: { bg: '#2a1030', border: '#9060c0', text: '#d0a8f0', tapeColor: '#9060c0' },
  language: { bg: '#1a1a1a', border: '#808080', text: '#d4c5a9', tapeColor: '#888888' },
};

const sizeStyles = {
  sm: { px: 'px-3 py-2', text: 'text-xs', tape: 50 },
  md: { px: 'px-4 py-3', text: 'text-sm', tape: 70 },
  lg: { px: 'px-5 py-3.5', text: 'text-base', tape: 90 },
};

function WashiTapeStrip({ color, width }: { color: string; width: number; }) {
  return (
    <div
      className="absolute left-1/2 -top-3 z-10"
      style={{
        width,
        height: 18,
        transform: 'translateX(-50%)',
        background: `${color}88`,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px)`,
        WebkitMaskImage: `linear-gradient(90deg, transparent 0, black 10%, black 90%, transparent 100%)`,
        maskImage: `linear-gradient(90deg, transparent 0, black 10%, black 90%, transparent 100%)`,
      }}
    />
  );
}

export function TechBadge({
  label,
  category = 'language',
  rotate = 0,
  style,
  delay = 0,
  size = 'md',
  tapeColor,
}: TechBadgeProps) {
  const { bg, border, text, tapeColor: defaultTape } = categoryStyles[category];
  const { px, text: textSize, tape } = sizeStyles[size];
  const finalTape = tapeColor ?? defaultTape;

  return (
    <motion.div
      className="absolute"
      style={{ rotate, ...style }}
      initial={{ opacity: 0, scale: 0.7, rotate: rotate + 8 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22, delay }}
      whileHover={{
        scale: 1.12,
        rotate: rotate * 0.3,
        y: -6,
        zIndex: 40,
        transition: { type: 'spring', stiffness: 300, damping: 18 },
      }}
    >
      {/* Washi tape on top */}
      <WashiTapeStrip color={finalTape} width={tape} />

      {/* Badge body */}
      <div
        className={`relative ${px} cursor-default select-none`}
        style={{
          background: bg,
          border: `1.5px solid ${border}40`,
          boxShadow: `
            0 2px 8px rgba(0,0,0,0.4),
            inset 0 0 0 1px rgba(255,255,255,0.05),
            0 0 0 1px ${border}20
          `,
        }}
      >
        {/* Jitter texture lines — graph paper feel */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="absolute w-full h-px" style={{ top: `${i * 8 + 4}px`, background: text }} />
          ))}
        </div>

        <span
          className={`relative z-10 font-bold ${textSize} tracking-wider uppercase`}
          style={{
            fontFamily: 'var(--font-mono)',
            color: text,
            textShadow: `0 0 12px ${border}50`,
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}

// Data definition — exported for reuse
export const TECH_BADGES: (Omit<TechBadgeProps, 'style'> & { posStyle: React.CSSProperties; })[] = [
  // Frontend
  { label: 'Next.js', category: 'frontend', rotate: -6, size: 'lg', delay: 0, posStyle: { top: '8%', left: '5%' } },
  { label: 'React', category: 'frontend', rotate: 4, size: 'md', delay: 0.05, posStyle: { top: '8%', left: '22%' } },
  { label: 'TypeScript', category: 'frontend', rotate: -3, size: 'md', delay: 0.08, posStyle: { top: '8%', left: '36%' } },
  { label: 'Tailwind CSS', category: 'frontend', rotate: 7, size: 'sm', delay: 0.1, posStyle: { top: '8%', left: '51%' } },
  { label: 'GSAP', category: 'frontend', rotate: -5, size: 'sm', delay: 0.12, posStyle: { top: '8%', left: '65%' } },
  { label: 'Framer Motion', category: 'frontend', rotate: 3, size: 'sm', delay: 0.14, posStyle: { top: '8%', right: '4%' } },

  // Backend
  { label: 'Go', category: 'backend', rotate: -8, size: 'lg', delay: 0.06, posStyle: { top: '30%', left: '8%' } },
  { label: 'Node.js', category: 'backend', rotate: 5, size: 'md', delay: 0.1, posStyle: { top: '30%', left: '22%' } },
  { label: 'PostgreSQL', category: 'backend', rotate: -4, size: 'md', delay: 0.12, posStyle: { top: '30%', left: '38%' } },
  { label: 'Redis', category: 'backend', rotate: 6, size: 'sm', delay: 0.15, posStyle: { top: '30%', left: '55%' } },
  { label: 'Prisma', category: 'backend', rotate: -2, size: 'sm', delay: 0.18, posStyle: { top: '30%', left: '67%' } },

  // DevOps
  { label: 'Docker', category: 'devops', rotate: -7, size: 'lg', delay: 0.08, posStyle: { top: '52%', left: '6%' } },
  { label: 'Nginx', category: 'devops', rotate: 4, size: 'md', delay: 0.12, posStyle: { top: '52%', left: '20%' } },
  { label: 'Linux', category: 'devops', rotate: -3, size: 'md', delay: 0.15, posStyle: { top: '52%', left: '34%' } },
  { label: 'Git', category: 'devops', rotate: 8, size: 'sm', delay: 0.18, posStyle: { top: '52%', left: '48%' } },
  { label: 'CI/CD', category: 'devops', rotate: -5, size: 'sm', delay: 0.2, posStyle: { top: '52%', left: '60%' } },

  // Design / Language
  { label: 'Figma', category: 'design', rotate: 6, size: 'md', delay: 0.1, posStyle: { top: '72%', left: '10%' } },
  { label: 'JavaScript', category: 'language', rotate: -4, size: 'md', delay: 0.14, posStyle: { top: '72%', left: '26%' } },
  { label: 'Python', category: 'language', rotate: 5, size: 'sm', delay: 0.17, posStyle: { top: '72%', left: '41%' } },
  { label: 'SQL', category: 'backend', rotate: -6, size: 'sm', delay: 0.2, posStyle: { top: '72%', left: '53%' } },
];

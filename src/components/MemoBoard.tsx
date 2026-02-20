'use client';

import { motion } from 'framer-motion';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  color?: 'white' | 'yellow' | 'blue' | 'pink' | 'green';
  rotate?: number;
  pinColor?: string;
  delay?: number;
  posStyle: React.CSSProperties;
}

const colorMap = {
  white: { bg: '#f8f4ed', border: '#e0d8cc', textColor: '#2a1a00', pin: '#c0392b' },
  yellow: { bg: '#fff9c4', border: '#f0e060', textColor: '#2a1a00', pin: '#e67e22' },
  blue: { bg: '#dce9f8', border: '#a8c8f0', textColor: '#1a3050', pin: '#2471a3' },
  pink: { bg: '#fde8ee', border: '#f5b8cc', textColor: '#50101a', pin: '#8e44ad' },
  green: { bg: '#e4f4e0', border: '#a8d8a0', textColor: '#0a2a10', pin: '#1a7a4a' },
};

function PushPin({ color }: { color: string; }) {
  return (
    <div
      className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))' }}
    >
      <div
        className="w-6 h-6 rounded-full"
        style={{
          background: `radial-gradient(circle at 38% 35%, ${color}dd, ${color})`,
          boxShadow: `0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4)`,
        }}
      />
      <div
        className="w-[2px] h-4"
        style={{ background: `linear-gradient(to bottom, ${color}99, #88888880, transparent)` }}
      />
    </div>
  );
}

function TestimonialCard({ name, role, text, color = 'white', rotate = 0, pinColor, delay = 0, posStyle }: Testimonial) {
  const { bg, border, textColor, pin } = colorMap[color];
  const finalPinColor = pinColor ?? pin;

  return (
    <motion.div
      className="absolute"
      style={{ rotate, ...posStyle }}
      initial={{ opacity: 0, y: 40, rotate: rotate - 4 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 160, damping: 22, delay }}
      whileHover={{
        y: -16,
        rotate: rotate * 0.4,
        scale: 1.05,
        zIndex: 50,
        transition: { type: 'spring', stiffness: 280, damping: 18 },
      }}
    >
      <PushPin color={finalPinColor} />

      <div
        className="relative pt-6 px-5 pb-5 w-[190px] md:w-[225px]"
        style={{
          background: bg,
          border: `1px solid ${border}`,
          boxShadow: `2px 4px 0px ${border}, 5px 10px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.5)`,
        }}
      >
        {/* Big quote glyph */}
        <div
          className="absolute top-3 left-4 text-4xl leading-none opacity-20 select-none"
          style={{ color: textColor, fontFamily: 'Georgia, serif' }}
        >
          &#8220;
        </div>

        <p
          className="text-sm leading-relaxed mb-4 mt-2 relative"
          style={{
            fontFamily: "'Caveat', cursive, var(--font-sans)",
            color: textColor,
            fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
          }}
        >
          {text}
        </p>

        <div className="w-full h-px mb-2 opacity-25" style={{ background: textColor }} />

        <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-mono)', color: textColor, letterSpacing: '0.05em' }}>
          — {name}
        </p>
        <p className="text-xs opacity-55 mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: textColor }}>
          {role}
        </p>
      </div>
    </motion.div>
  );
}

export default function MemoBoard() {
  return (
    <div className="relative w-full h-full">
      {/* Subtle cork texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(180,130,80,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(140,100,60,0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* Row 1 */}
      <TestimonialCard
        name="Rizky H."
        role="Lead Engineer, Startup SaaS"
        text="Andhieka delivered a production-ready API under insane deadlines. Clean code, zero drama."
        color="white"
        rotate={-5}
        delay={0}
        posStyle={{ top: '6%', left: '5%' }}
      />
      <TestimonialCard
        name="Dinda P."
        role="Product Manager"
        text="He turned a half-baked Figma mockup into something I'd actually use. Fast, precise, creative."
        color="pink"
        rotate={4}
        pinColor="#a04080"
        delay={0.1}
        posStyle={{ top: '4%', left: '33%' }}
      />
      <TestimonialCard
        name="Bimo S."
        role="CTO, Fintech Startup"
        text="The kind of developer who asks the right questions before touching a single line of code."
        color="blue"
        rotate={-7}
        pinColor="#1a5276"
        delay={0.2}
        posStyle={{ top: '5%', right: '4%' }}
      />

      {/* Row 2 */}
      <TestimonialCard
        name="Sera A."
        role="UI/UX Designer"
        text="Rare to find a dev who actually respects the design spec AND improves it."
        color="yellow"
        rotate={6}
        delay={0.15}
        posStyle={{ top: '52%', left: '18%' }}
      />
      <TestimonialCard
        name="Farhan M."
        role="Freelance Client"
        text="Shipped in 3 days what another team quoted 3 weeks for. Genuinely impressive work."
        color="green"
        rotate={-3}
        pinColor="#155a30"
        delay={0.25}
        posStyle={{ top: '50%', right: '15%' }}
      />
    </div>
  );
}

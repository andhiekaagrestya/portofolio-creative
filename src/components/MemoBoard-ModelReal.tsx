'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Three.js tape roll — loaded only on client (no SSR, needs WebGL)
const TapeRoll3D = dynamic(
  () => import('./TapeRoll3D-ModelReal').then((m) => ({ default: m.TapeRoll3D })),
  { ssr: false, loading: () => <div style={{ width: 320, height: 260 }} /> },
);

// ── Types ───────────────────────────────────────────────────────────
interface Note {
  id: string;
  name: string;
  role: string;
  message: string;
  color: string;
  rotate: number;
  pos_top: string;
  pos_left: string;
  created_at: string;
}

// Seed cards shown while DB loads / as fallback
const SEED_CARDS: Note[] = [
  { id: 'seed-1', name: 'Rizky H.', role: 'Lead Engineer, Startup SaaS', message: 'Andhieka delivered a production-ready API under insane deadlines. Clean code, zero drama.', color: 'white', rotate: -5, pos_top: '6%', pos_left: '5%', created_at: '' },
  { id: 'seed-2', name: 'Dinda P.', role: 'Product Manager', message: "He turned a half-baked Figma mockup into something I'd actually use. Fast, precise, creative.", color: 'pink', rotate: 4, pos_top: '4%', pos_left: '33%', created_at: '' },
  { id: 'seed-3', name: 'Bimo S.', role: 'CTO, Fintech Startup', message: 'The kind of developer who asks the right questions before touching a single line of code.', color: 'blue', rotate: -7, pos_top: '5%', pos_left: '66%', created_at: '' },
  { id: 'seed-4', name: 'Sera A.', role: 'UI/UX Designer', message: 'Rare to find a dev who actually respects the design spec AND improves it.', color: 'yellow', rotate: 6, pos_top: '52%', pos_left: '18%', created_at: '' },
  { id: 'seed-5', name: 'Farhan M.', role: 'Freelance Client', message: 'Shipped in 3 days what another team quoted 3 weeks for. Genuinely impressive work.', color: 'green', rotate: -3, pos_top: '50%', pos_left: '62%', created_at: '' },
];

// ── Color map ───────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; border: string; textColor: string; pin: string; }> = {
  white: { bg: '#f8f4ed', border: '#e0d8cc', textColor: '#2a1a00', pin: '#c0392b' },
  yellow: { bg: '#fff9c4', border: '#f0e060', textColor: '#2a1a00', pin: '#e67e22' },
  blue: { bg: '#dce9f8', border: '#a8c8f0', textColor: '#1a3050', pin: '#2471a3' },
  pink: { bg: '#fde8ee', border: '#f5b8cc', textColor: '#50101a', pin: '#8e44ad' },
  green: { bg: '#e4f4e0', border: '#a8d8a0', textColor: '#0a2a10', pin: '#1a7a4a' },
};

// ── PushPin ─────────────────────────────────────────────────────────
function PushPin({ color, isDragging }: { color: string; isDragging: boolean; }) {
  return (
    <motion.div
      className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))' }}
      animate={isDragging ? { y: -6, scale: 1.15 } : { y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <div className="w-6 h-6 rounded-full" style={{
        background: `radial-gradient(circle at 38% 35%, ${color}dd, ${color})`,
        boxShadow: `0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4)`,
      }} />
      <div className="w-[2px] h-4" style={{ background: `linear-gradient(to bottom, ${color}99, #88888880, transparent)` }} />
    </motion.div>
  );
}

// ── DraggableCard ───────────────────────────────────────────────────
function DraggableCard({ note, zBase, onFocus }: { note: Note; zBase: number; onFocus: () => void; }) {
  const { bg, border, textColor, pin } = colorMap[note.color] ?? colorMap.white;
  const [isDragging, setIsDragging] = useState(false);
  const [localZ, setLocalZ] = useState(zBase);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setLocalZ(zBase + 100);
    onFocus();
  }, [zBase, onFocus]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.06}
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      className="absolute touch-none"
      style={{
        top: note.pos_top,
        left: note.pos_left,
        rotate: isDragging ? note.rotate * 0.3 : note.rotate,
        zIndex: isDragging ? localZ + 100 : localZ,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      whileDrag={{ scale: 1.07, rotate: note.rotate * 0.3 }}
      whileHover={!isDragging ? { y: -8, scale: 1.03, transition: { type: 'spring', stiffness: 280, damping: 20 } } : {}}
    >
      <PushPin color={pin} isDragging={isDragging} />

      <div
        className="relative pt-6 px-5 pb-5 w-[190px] md:w-[215px] select-none"
        style={{
          background: bg,
          border: `1px solid ${border}`,
          boxShadow: isDragging
            ? `4px 8px 0px ${border}, 12px 24px 50px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.5)`
            : `2px 4px 0px ${border}, 5px 10px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.5)`,
          transition: 'box-shadow 0.2s ease',
        }}
      >
        <div className="absolute top-3 left-4 text-4xl leading-none opacity-20 select-none" style={{ color: textColor, fontFamily: 'Georgia, serif' }}>&#8220;</div>

        <p className="text-sm leading-relaxed mb-4 mt-2 relative" style={{
          fontFamily: "'Caveat', cursive, var(--font-sans)",
          color: textColor,
          fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
        }}>
          {note.message}
        </p>

        <div className="w-full h-px mb-2 opacity-25" style={{ background: textColor }} />
        <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-mono)', color: textColor, letterSpacing: '0.05em' }}>— {note.name}</p>
        <p className="text-xs opacity-55 mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: textColor }}>{note.role}</p>

        {!isDragging && (
          <motion.div className="absolute bottom-2 right-3 text-[9px] opacity-20 select-none pointer-events-none"
            style={{ fontFamily: 'var(--font-mono)', color: textColor }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >drag me</motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Submit Form — Torn Notepad Page ────────────────────────────────
function AddNoteForm({ onAdded, onClose }: { onAdded: (note: Note) => void; onClose: () => void; }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pinned, setPinned] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setPinned(true);
    try {
      const res = await fetch('/api/memoboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, message, website: '' }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Gagal submit.'); setPinned(false); return; }
      onAdded(data);
      setTimeout(onClose, 400);
    } catch {
      setError('Network error. Coba lagi.');
      setPinned(false);
    } finally {
      setLoading(false);
    }
  };

  const lineInput: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1.5px solid rgba(42,26,0,0.2)', outline: 'none', resize: 'none',
    color: '#2a1a00', padding: '4px 0 6px', lineHeight: 2.05,
    fontFamily: "'Caveat', cursive, Georgia, serif", fontSize: 19,
    caretColor: '#a0522d',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center z-[9995] px-4"
      style={{ backdropFilter: 'blur(6px)', background: 'rgba(8,6,3,0.65)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 60, rotate: -3, opacity: 0 }}
        animate={{ y: 0, rotate: pinned ? 0 : -1, opacity: 1 }}
        exit={{ y: 40, rotate: 4, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        className="relative w-full max-w-[420px]"
        onClick={(e) => e.stopPropagation()}
        style={{ filter: 'drop-shadow(0 24px 60px rgba(0,0,0,0.6))' }}
      >
        {/* Torn top edge */}
        <svg viewBox="0 0 420 28" className="w-full block" style={{ marginBottom: -1 }}>
          <path d="M0,28 L0,14 Q8,4 16,10 Q24,18 32,8 Q40,0 48,10 Q56,20 64,8 Q72,0 80,12 Q88,22 96,10 Q104,2 112,14 Q120,24 128,10 Q136,0 144,12 Q152,22 160,8 Q168,0 176,12 Q184,24 192,8 Q200,0 208,14 Q216,26 224,10 Q232,0 240,12 Q248,22 256,8 Q264,0 272,14 Q280,26 288,10 Q296,0 304,12 Q312,22 320,8 Q328,0 336,12 Q344,22 352,8 Q360,0 368,14 Q376,26 384,10 Q392,0 400,12 Q410,22 420,14 L420,28 Z" fill="#f5f0e4" />
        </svg>

        {/* Paper body */}
        <form onSubmit={handleSubmit} style={{
          background: '#f5f0e4',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(42,26,0,0.1) 31px, rgba(42,26,0,0.1) 32px)',
          backgroundPositionY: '52px',
          padding: '16px 32px 32px',
          position: 'relative', overflow: 'hidden',
        }}>
          <input name="website" type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          {/* Red margin line */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 60, width: 1, background: 'rgba(180,60,60,0.22)' }} />
          {/* Washi tape top-left */}
          <div style={{ position: 'absolute', top: -4, left: 12, width: 72, height: 22, background: 'rgba(196,149,106,0.55)', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 5px)', transform: 'rotate(-8deg)' }} />
          {/* Washi tape top-right */}
          <div style={{ position: 'absolute', top: -3, right: 20, width: 52, height: 22, background: 'rgba(107,124,94,0.5)', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 5px)', transform: 'rotate(6deg)' }} />

          {/* Push-pin */}
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <motion.div animate={pinned ? { y: [-8, 2, 0], scale: [1.2, 0.9, 1] } : { y: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #e55, #a00)', boxShadow: '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 2px rgba(255,255,255,0.4)', margin: '0 auto' }} />
              <div style={{ width: 2, height: 10, background: 'linear-gradient(#c0392b99, transparent)', margin: '0 auto' }} />
            </motion.div>
          </div>

          {/* MEMO stamp */}
          <div style={{ marginTop: 30, marginBottom: 18, paddingLeft: 32, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'rgba(160,82,45,0.65)', border: '1.5px solid rgba(160,82,45,0.35)', padding: '2px 8px', display: 'inline-block', transform: 'rotate(-1deg)' }}>MEMO</span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(42,26,0,0.3)' }}>
              {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div style={{ paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'rgba(42,26,0,0.3)', marginBottom: 2 }}>From</div>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required style={lineInput} placeholder="Your name..." />
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'rgba(42,26,0,0.3)', marginBottom: 2 }}>Role / Company</div>
              <input value={role} onChange={(e) => setRole(e.target.value)} maxLength={60} required style={lineInput} placeholder="What you do..." />
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'rgba(42,26,0,0.3)', marginBottom: 2 }}>
                Note &nbsp;<span style={{ opacity: 0.45 }}>({message.length}/250)</span>
              </div>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={250} minLength={10} required rows={4}
                style={{ ...lineInput, lineHeight: 2.05 }} placeholder="Write something honest..." />
            </div>

            {error && <p style={{ fontSize: 11, color: '#a0522d', fontFamily: 'var(--font-mono)', margin: 0 }}>↳ {error}</p>}

            <motion.button
              type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.02, rotate: -0.5 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              style={{ marginTop: 6, padding: '11px 0', width: '100%', background: 'transparent', border: '2px solid rgba(42,26,0,0.28)', borderRadius: 0, cursor: loading ? 'not-allowed' : 'pointer', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(42,26,0,0.04) 0px, rgba(42,26,0,0.04) 1px, transparent 1px, transparent 8px)' }} />
              <span style={{ position: 'relative', zIndex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: loading ? 'rgba(42,26,0,0.35)' : '#2a1a00' }}>
                {loading ? '— pinning —' : '📌  pin to board'}
              </span>
            </motion.button>

            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 10, color: 'rgba(42,26,0,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textAlign: 'center' }}>
              nevermind, close
            </button>
          </div>
        </form>

        {/* Torn bottom edge */}
        <svg viewBox="0 0 420 24" className="w-full block" style={{ marginTop: -1 }}>
          <path d="M0,0 L0,10 Q10,20 20,12 Q30,4 40,14 Q50,22 60,12 Q70,2 80,14 Q90,24 100,12 Q110,2 120,14 Q130,24 140,10 Q150,0 160,14 Q170,24 180,12 Q190,2 200,14 Q210,24 220,10 Q230,0 240,14 Q250,24 260,12 Q270,2 280,14 Q290,24 300,10 Q310,0 320,14 Q330,24 340,12 Q350,2 360,14 Q370,24 380,12 Q390,2 400,14 Q410,22 420,10 L420,0 Z" fill="#f5f0e4" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ── Tape Measure trigger (GLB model) ────────────────────────────────
function WashiTapeRoll({ onClick }: { onClick: () => void; }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute"
      style={{
        top: '35%', left: '42%',
        rotate: '-8deg',
        zIndex: 200,
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 180, damping: 20 }}
    >
      <TapeRoll3D spinning={hovered} />
    </motion.div>
  );
}

// ── Main MemoBoard ──────────────────────────────────────────────────
export default function MemoBoard() {
  const [notes, setNotes] = useState<Note[]>(SEED_CARDS);
  const [showForm, setShowForm] = useState(false);
  const [topZ, setTopZ] = useState(10);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  useEffect(() => {
    fetch('/api/memoboard')
      .then((r) => r.json())
      .then((data: Note[]) => {
        if (Array.isArray(data) && data.length > 0) setNotes(data);
        setFetchedOnce(true);
      })
      .catch(() => setFetchedOnce(true));
  }, []);

  const handleAdded = useCallback((note: Note) => {
    setNotes((prev) => [note, ...prev]);
  }, []);

  const handleFocus = useCallback(() => {
    setTopZ((z) => z + 1);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Cork texture overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(180,130,80,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(140,100,60,0.06) 0%, transparent 50%)
        `,
      }} />

      {/* Cards */}
      {notes.map((note, i) => (
        <DraggableCard key={note.id} note={note} zBase={i + 2} onFocus={handleFocus} />
      ))}

      {/* Washi Tape Roll trigger */}
      {fetchedOnce && (
        <WashiTapeRoll onClick={() => setShowForm(true)} />
      )}

      {/* Submit form modal */}
      <AnimatePresence>
        {showForm && (
          <AddNoteForm onAdded={handleAdded} onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

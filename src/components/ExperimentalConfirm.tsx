import { motion, AnimatePresence } from 'framer-motion';

interface ExperimentalConfirmProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExperimentalConfirm({ isOpen, message, onConfirm, onCancel }: ExperimentalConfirmProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 13, 10, 0.85)' }}
        >
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

          <motion.div
            initial={{ scale: 0.9, y: 20, rotate: -2 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.95, y: -10, rotate: 1, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm"
          >
            {/* Torn paper effect background */}
            <div className="absolute inset-0 bg-[#f8f4ed] shadow-2xl" style={{
              clipPath: 'polygon(0% 2%, 100% 0%, 98% 98%, 2% 100%, 0% 95%, 1% 50%)',
              border: '1px solid #e0d8cc'
            }} />

            <div className="relative p-8 flex flex-col items-center text-center">
              {/* Warning Stamp */}
              <div
                className="absolute top-4 right-4 border-2 border-[#c0392b] text-[#c0392b] font-mono text-[10px] uppercase font-bold px-2 py-0.5"
                style={{ transform: 'rotate(12deg)', opacity: 0.8, letterSpacing: '0.1em' }}
              >
                Warning
              </div>

              <h3 className="text-xl font-serif font-black text-[#2a1a00] mb-3 mt-4" style={{ letterSpacing: '-0.02em' }}>
                SHRED THIS NOTE?
              </h3>

              <p className="text-sm font-mono text-[#555] mb-8" style={{ lineHeight: 1.6 }}>
                {message}
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 text-xs font-mono tracking-widest text-[#666] uppercase hover:text-[#2a1a00] transition-colors relative group"
                >
                  <span className="relative z-10">KEEP IT</span>
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#e0d8cc] transition-colors" style={{ clipPath: 'polygon(2% 5%, 98% 0%, 100% 95%, 0% 100%)' }} />
                </button>

                <button
                  onClick={onConfirm}
                  className="flex-1 py-3 text-xs font-mono tracking-widest text-[#f8f4ed] bg-[#a0522d] uppercase hover:bg-[#8b4513] transition-colors relative group overflow-hidden"
                  style={{ clipPath: 'polygon(0% 0%, 100% 2%, 98% 98%, 2% 100%)' }}
                >
                  <span className="relative z-10 font-bold">SHRED IT</span>
                  {/* Glitch hover effect */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                  {/* Subtle red line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#c0392b] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Washi tape detail */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[rgba(196,149,106,0.6)]" style={{
              transform: 'rotate(-4deg)',
              mixBlendMode: 'multiply',
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 5px)'
            }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

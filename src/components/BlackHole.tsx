'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const CV_URL = '/Curriculum Vitae - Andhieka.pdf';

type Phase = 'idle' | 'sucking' | 'collapsed' | 'shaking' | 'expanding';

interface TargetEl {
  el: HTMLElement;
  cx: number;
  cy: number;
  dist: number;
  savedTransform: string;
  savedOpacity: string;
  savedZIndex: string;
  savedTransition: string;
  savedFilter: string;
  anim: Animation | null;
}

// ── Collect all visible content elements within main ──────────────
function collectTargets(main: HTMLElement, bhX: number, bhY: number): TargetEl[] {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const inViewport = (rect: DOMRect) =>
    rect.width > 20 && rect.height > 8 &&
    rect.bottom > 80 && rect.top < H - 80 &&
    rect.right > 0 && rect.left < W;

  const set = new Set<HTMLElement>();

  // Absolutely positioned elements — Tailwind class + inline style
  main.querySelectorAll<HTMLElement>(
    '.absolute, [style*="position: absolute"], [style*="position:absolute"]'
  ).forEach(el => {
    if (inViewport(el.getBoundingClientRect())) set.add(el);
  });

  // Images
  main.querySelectorAll<HTMLElement>('img').forEach(el => {
    if (inViewport(el.getBoundingClientRect())) set.add(el);
  });

  const all = Array.from(set);

  // Deduplicate: keep only top-level — remove el if any ancestor is also in set
  const deduped = all.filter(el => {
    let p = el.parentElement;
    while (p && p !== main) {
      if (set.has(p)) return false;
      p = p.parentElement;
    }
    return true;
  });

  return deduped
    .map(el => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return {
        el,
        cx, cy,
        dist: Math.hypot(cx - bhX, cy - bhY),
        savedTransform: el.style.transform,
        savedOpacity: el.style.opacity,
        savedZIndex: el.style.zIndex,
        savedTransition: el.style.transition,
        savedFilter: el.style.filter,
        anim: null,
      };
    })
    .sort((a, b) => b.dist - a.dist) // farthest first → closest last (drain effect)
    .slice(0, 22);
}

const PULL_RADIUS = 420; // px from BH center where pull starts

export default function BlackHole() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [fakeCursor, setFakeCursor] = useState<{ x: number; y: number } | null>(null);
  const [proximity, setProximity] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const holeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const proximityRafRef = useRef<number>(0);
  const originRef = useRef({ x: 0, y: 0 });
  const phaseRef = useRef<Phase>('idle');
  const phaseStartRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const fakeCursorRef = useRef({ x: 0, y: 0 });
  const targetsRef = useRef<TargetEl[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Magnetic snap — cursor jumps to BH center when within PULL_RADIUS
  useEffect(() => {
    // Use a stable style element keyed by id to avoid duplicates across re-renders
    const STYLE_ID = 'bh-cursor-none';
    const getOrCreateStyle = () => {
      let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
      if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        el.textContent = '*, *::before, *::after { cursor: none !important; }';
      }
      return el;
    };
    const hideGlobalCursor = () => {
      const el = getOrCreateStyle();
      if (!el.isConnected) document.head.appendChild(el);
    };
    const showGlobalCursor = () => {
      document.getElementById(STYLE_ID)?.remove();
    };

    if (phase !== 'idle') {
      cancelAnimationFrame(proximityRafRef.current);
      showGlobalCursor();
      setProximity(null);
      return () => showGlobalCursor();
    }

    const tick = () => {
      const bh = holeRef.current?.getBoundingClientRect();
      if (bh) {
        // Use the event horizon center: inset 18px from 110px container
        const bhX = bh.left + bh.width / 2;
        const bhY = bh.top + bh.height / 2;
        const { x: mx, y: my } = mouseRef.current;
        const dist = Math.hypot(mx - bhX, my - bhY);

        if (dist < PULL_RADIUS) {
          hideGlobalCursor();
          setProximity({ x: bhX, y: bhY });
        } else {
          showGlobalCursor();
          setProximity(null);
        }
      }
      proximityRafRef.current = requestAnimationFrame(tick);
    };

    proximityRafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(proximityRafRef.current);
      showGlobalCursor();
      setProximity(null);
    };
  }, [phase]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const triggerDownload = useCallback(() => {
    const a = document.createElement('a');
    a.href = CV_URL;
    a.download = 'Curriculum Vitae - Andhieka Agrestya.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  // EFFECT: Spaghettification — stretch terarah ke BH, squish perpendicular, fisika relativitas
  const suckElement = useCallback((target: TargetEl) => {
    const { x: ox, y: oy } = originRef.current;
    const rect = target.el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ox - cx;
    const dy = oy - cy;
    const θ = Math.atan2(dy, dx) * (180 / Math.PI);
    const pfx = target.savedTransform ? `${target.savedTransform} ` : '';

    target.el.style.zIndex = '99985';

    const keyframes: Keyframe[] = [
      { transform: target.savedTransform || 'none', opacity: target.savedOpacity || '1', filter: 'blur(0px)', offset: 0 },
      // 7% — rubber band resist
      { transform: `${pfx}translate(${-dx * 0.04}px, ${-dy * 0.04}px) scale(1.03)`, opacity: '1', filter: 'blur(0px)', offset: 0.07 },
      // 25% — first stretch toward BH, squish perpendicular
      { transform: `translate(${dx * 0.18}px, ${dy * 0.18}px) rotate(${θ}deg) scaleX(1.7) scaleY(0.6) rotate(${-θ}deg)`, opacity: '1', filter: 'blur(0.5px)', offset: 0.25 },
      // 52% — strong spaghettification
      { transform: `translate(${dx * 0.52}px, ${dy * 0.52}px) rotate(${θ}deg) scaleX(4) scaleY(0.22) rotate(${-θ}deg)`, opacity: '0.9', filter: 'blur(2px)', offset: 0.52 },
      // 78% — extreme noodle approaching event horizon
      { transform: `translate(${dx * 0.84}px, ${dy * 0.84}px) rotate(${θ}deg) scaleX(10) scaleY(0.06) rotate(${-θ}deg)`, opacity: '0.45', filter: 'blur(6px)', offset: 0.78 },
      // 92% — crumples past horizon
      { transform: `translate(${dx * 0.97}px, ${dy * 0.97}px) scale(0.08)`, opacity: '0.1', filter: 'blur(10px)', offset: 0.92 },
      // 100% — gone
      { transform: `translate(${dx}px, ${dy}px) scale(0.01)`, opacity: '0', filter: 'blur(14px)', offset: 1 },
    ];

    const anim = target.el.animate(keyframes, {
      duration: 850,
      easing: 'cubic-bezier(0.12, 0, 0.95, 1)',
      fill: 'forwards',
    });
    target.anim = anim;
  }, []);

  // Restore one element back to original — burst out from BH with overshoot + settle
  const restoreElement = useCallback((target: TargetEl) => {
    const { x: ox, y: oy } = originRef.current;
    const dx = ox - target.cx; // same vector as suck: FROM original position TO BH
    const dy = oy - target.cy;
    // angle FROM BH TOWARD element's original position (reverse of suck)
    const θOut = Math.atan2(-dy, -dx) * (180 / Math.PI);
    const endTransform = target.savedTransform || 'none';
    const endOp = target.savedOpacity || '1';

    // Cancel the suck animation and force the BH end-state as inline style
    // so the restore animation starts visually from there
    if (target.anim) {
      target.anim.cancel();
      target.anim = null;
    }
    target.el.style.transform = `translate(${dx}px, ${dy}px) scale(0.01)`;
    target.el.style.opacity = '0';
    target.el.style.filter = 'blur(14px)';
    target.el.style.zIndex = target.savedZIndex;
    void target.el.offsetHeight; // force reflow so inline style registers before anim starts

    const keyframes: Keyframe[] = [
      // 0% — collapsed at BH
      { transform: `translate(${dx}px, ${dy}px) scale(0.01)`, opacity: '0', filter: 'blur(14px)', offset: 0 },
      // 20% — burst out still elongated (reverse spaghettification)
      { transform: `translate(${dx * 0.14}px, ${dy * 0.14}px) rotate(${θOut}deg) scaleX(4.5) scaleY(0.18) rotate(${-θOut}deg)`, opacity: '0.5', filter: 'blur(4px)', offset: 0.2 },
      // 45% — overshoot past original
      { transform: `translate(${-dx * 0.06}px, ${-dy * 0.06}px) scale(1.1)`, opacity: '0.9', filter: 'blur(1px)', offset: 0.45 },
      // 65% — slight undershoot
      { transform: `translate(${dx * 0.02}px, ${dy * 0.02}px) scale(0.97)`, opacity: endOp, filter: 'blur(0px)', offset: 0.65 },
      // 82% — micro bounce
      { transform: `scale(1.015)`, opacity: endOp, filter: 'blur(0px)', offset: 0.82 },
      // 100% — at rest
      { transform: endTransform, opacity: endOp, filter: 'blur(0px)', offset: 1 },
    ];

    const anim = target.el.animate(keyframes, {
      duration: 1100,
      easing: 'linear',
      fill: 'forwards',
    });
    target.anim = anim;

    // After animation, cancel fill and restore all original inline styles
    const t = setTimeout(() => {
      if (target.anim) { target.anim.cancel(); target.anim = null; }
      target.el.style.transform = target.savedTransform;
      target.el.style.opacity = target.savedOpacity;
      target.el.style.zIndex = target.savedZIndex;
      target.el.style.filter = target.savedFilter;
      target.el.style.transition = target.savedTransition;
    }, 1150);
    timeoutsRef.current.push(t);
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== 'idle') return;

    const rect = holeRef.current?.getBoundingClientRect();
    if (!rect) return;
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;

    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;
    originRef.current = { x: ox, y: oy };
    fakeCursorRef.current = { ...mouseRef.current };

    // Collect targets now (before anything moves)
    targetsRef.current = collectTargets(main, ox, oy);

    document.body.style.cursor = 'none';
    phaseRef.current = 'sucking';
    phaseStartRef.current = performance.now();
    setPhase('sucking');
    setFakeCursor({ ...mouseRef.current });
  }, [phase]);

  // Staggered suck-in when phase becomes 'sucking'
  useEffect(() => {
    if (phase !== 'sucking') return;
    clearTimeouts();

    const STAGGER = 100; // 0.1s between each element
    const targets = targetsRef.current;

    targets.forEach((target, i) => {
      const t = setTimeout(() => suckElement(target), i * STAGGER);
      timeoutsRef.current.push(t);
    });

    // After all elements are sucked in, move to collapsed
    const totalMs = (targets.length - 1) * STAGGER + 900;
    const doneT = setTimeout(() => {
      triggerDownload();
      phaseRef.current = 'collapsed';
      phaseStartRef.current = performance.now();
      setPhase('collapsed');
    }, totalMs);
    timeoutsRef.current.push(doneT);
  }, [phase, suckElement, triggerDownload, clearTimeouts]);

  // After collapsed, go to shaking
  useEffect(() => {
    if (phase !== 'collapsed') return;
    const t = setTimeout(() => {
      phaseRef.current = 'shaking';
      phaseStartRef.current = performance.now();
      setPhase('shaking');
    }, 400);
    return () => clearTimeout(t);
  }, [phase]);

  // After shaking, go to expanding
  useEffect(() => {
    if (phase !== 'shaking') return;
    const t = setTimeout(() => {
      phaseRef.current = 'expanding';
      phaseStartRef.current = performance.now();
      setPhase('expanding');
    }, 900);
    return () => clearTimeout(t);
  }, [phase]);

  // Staggered expand when phase becomes 'expanding'
  useEffect(() => {
    if (phase !== 'expanding') return;
    clearTimeouts();

    const STAGGER = 200;
    const targets = [...targetsRef.current].reverse(); // reverse order

    targets.forEach((target, i) => {
      const t = setTimeout(() => restoreElement(target), i * STAGGER);
      timeoutsRef.current.push(t);
    });

    // After all restored, reset to idle
    const totalMs = (targets.length - 1) * STAGGER + 1000;
    const doneT = setTimeout(() => {
      phaseRef.current = 'idle';
      setPhase('idle');
      setFakeCursor(null);
      document.body.style.cursor = '';
      targetsRef.current = [];
    }, totalMs);
    timeoutsRef.current.push(doneT);
  }, [phase, restoreElement, clearTimeouts]);

  // Cleanup on unmount
  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  // Canvas animation loop — atmosphere only
  useEffect(() => {
    if (phase === 'idle') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width;
    const H = canvas.height;

    // Particles
    const particles = Array.from({ length: 260 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0, vy: 0,
      size: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      hue: [30, 40, 50, 20][Math.floor(Math.random() * 4)],
    }));

    const animate = (now: number) => {
      const { x: ox, y: oy } = originRef.current;
      const currentPhase = phaseRef.current;
      const elapsed = now - phaseStartRef.current;
      ctx.clearRect(0, 0, W, H);

      const isSucking = currentPhase === 'sucking';
      const isExpanding = currentPhase === 'expanding';
      const isShaking = currentPhase === 'shaking';
      const isCollapsed = currentPhase === 'collapsed';

      // Dark vignette
      if (isSucking || isCollapsed || isShaking) {
        const vigAlpha = isCollapsed || isShaking ? 0.88 : Math.min(elapsed / 8000, 0.7);
        const vig = ctx.createRadialGradient(ox, oy, 50, ox, oy, Math.max(W, H));
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(0.5, `rgba(0,0,0,${vigAlpha * 0.4})`);
        vig.addColorStop(1, `rgba(0,0,0,${vigAlpha})`);
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);
      }

      if (isExpanding) {
        const t = Math.min(elapsed / (targetsRef.current.length * 100 + 1000), 1);
        const fadeAlpha = Math.max(0, 0.7 - t * 0.7);
        ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Shaking: full black + flicker
      if (isShaking) {
        ctx.fillStyle = 'rgba(0,0,0,0.97)';
        ctx.fillRect(0, 0, W, H);
        if (Math.random() < 0.18) {
          ctx.fillStyle = `rgba(255,170,40,${Math.random() * 0.15})`;
          ctx.fillRect(0, 0, W, H);
        }
      }

      // Spiral particles
      particles.forEach(p => {
        if (isSucking || isCollapsed) {
          const dx = ox - p.x;
          const dy = oy - p.y;
          const dist = Math.max(Math.hypot(dx, dy), 1);
          const pull = Math.min(4000 / (dist * dist), 8);
          const angle = Math.atan2(dy, dx) + 0.42;
          p.vx = p.vx * 0.9 + Math.cos(angle) * pull * 0.1;
          p.vy = p.vy * 0.9 + Math.sin(angle) * pull * 0.1;
          p.x += p.vx; p.y += p.vy;
          if (dist < 12) {
            p.x = Math.random() * W; p.y = Math.random() < 0.5 ? 0 : H;
            p.vx = 0; p.vy = 0;
          }
          ctx.globalAlpha = Math.max(0, p.alpha * (1 - dist / 500));
        } else if (isExpanding) {
          p.vx *= 0.97; p.vy *= 0.97;
          p.x += p.vx; p.y += p.vy;
          p.alpha *= 0.995;
          ctx.globalAlpha = Math.max(0, p.alpha);
        } else {
          ctx.globalAlpha = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${p.hue}, 38%, 68%)`;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Expanding: explode particles outward from BH
      if (isExpanding && elapsed < 100) {
        particles.forEach(p => {
          p.x = ox + (Math.random() - 0.5) * 40;
          p.y = oy + (Math.random() - 0.5) * 40;
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 16 + 4;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.size = Math.random() * 4 + 1;
          p.alpha = 1;
        });
      }

      // Accretion disk glow at BH
      const shakeX = isShaking ? (Math.random() - 0.5) * 14 : 0;
      const shakeY = isShaking ? (Math.random() - 0.5) * 14 : 0;
      const glowIntensity = isShaking ? 0.8 + Math.sin(elapsed * 0.03) * 0.3 : 0.55;
      const glowR = isShaking
        ? 35 + Math.sin(elapsed * 0.025) * 20
        : isCollapsed ? 55 : 28;

      const glow = ctx.createRadialGradient(ox + shakeX, oy + shakeY, 0, ox + shakeX, oy + shakeY, glowR * 3.5);
      glow.addColorStop(0, 'rgba(0,0,0,1)');
      glow.addColorStop(0.2, 'rgba(5,3,1,1)');
      glow.addColorStop(0.5, `rgba(140,75,20,${glowIntensity})`);
      glow.addColorStop(0.8, `rgba(60,25,5,${glowIntensity * 0.5})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ox + shakeX, oy + shakeY, glowR * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Fake cursor
      const fc = fakeCursorRef.current;
      if (isSucking || isCollapsed) {
        fc.x += (ox - fc.x) * (0.015 + (isSucking ? 0.01 : 0.03));
        fc.y += (oy - fc.y) * (0.015 + (isSucking ? 0.01 : 0.03));
      } else if (isShaking) {
        fc.x = ox + shakeX; fc.y = oy + shakeY;
      } else if (isExpanding) {
        fc.x += (mouseRef.current.x - fc.x) * 0.08;
        fc.y += (mouseRef.current.y - fc.y) * 0.08;
      }
      setFakeCursor({ x: fc.x, y: fc.y });

      if (phaseRef.current !== 'idle') {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  return (
    <>
      {/* ── Idle black hole ─────────────────────────────────────── */}
      <div
        ref={holeRef}
        className="relative cursor-pointer"
        style={{ width: 110, height: 110 }}
        aria-label="Gravitational anomaly"
        data-blackhole="true"
      >
        {/* Invisible click zone — radius matches CursorTrail pull radius (260px) */}
        <div
          onClick={handleClick}
          className="absolute pointer-events-auto"
          style={{
            width: 520,
            height: 520,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
          }}
        />
        {/* Outer ambient corona — faint gravitational heat */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: -28,
            borderRadius: '50%',
            background: 'radial-gradient(circle, transparent 36%, rgba(160,60,5,0.07) 54%, rgba(100,35,3,0.12) 70%, transparent 86%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Accretion disk — flat ellipse, Doppler brightened on lower-left */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '58%',
            width: 138,
            height: 32,
            marginLeft: -69,
            marginTop: -16,
            borderRadius: '50%',
            // conic-gradient creates the one-sided Doppler brightening
            background: 'conic-gradient(from 160deg, rgba(255,210,70,0.95) 0%, rgba(255,140,15,0.75) 18%, rgba(200,75,8,0.45) 35%, rgba(90,28,4,0.18) 50%, transparent 60%, rgba(80,25,3,0.12) 72%, rgba(200,100,18,0.52) 86%, rgba(255,210,70,0.95) 100%)',
            filter: 'blur(2px)',
            zIndex: 2,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
        />

        {/* Disk heat shimmer — second faster layer adds depth */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '55%',
            width: 118,
            height: 22,
            marginLeft: -59,
            marginTop: -11,
            borderRadius: '50%',
            background: 'conic-gradient(from 320deg, rgba(255,240,120,0.6) 0%, transparent 22%, rgba(255,160,30,0.3) 48%, transparent 60%, rgba(255,100,10,0.4) 80%, rgba(255,240,120,0.6) 100%)',
            filter: 'blur(3px)',
            zIndex: 2,
          }}
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />

        {/* Event horizon shadow — pure black, slightly larger than "true" horizon (gravitational lensing) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: 18,
            background: '#000',
            boxShadow: '0 0 0 1px rgba(255,150,20,0.08)',
            zIndex: 3,
          }}
        />

        {/* Photon sphere ring — thin, bright, right at event horizon edge */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: 15,
            border: '1.5px solid rgba(255,175,45,0.5)',
            boxShadow: '0 0 10px 4px rgba(255,120,15,0.25), inset 0 0 6px rgba(255,120,15,0.12)',
            filter: 'blur(0.5px)',
            zIndex: 4,
          }}
          animate={{ opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Top lensing arc — gravitationally bent image of the far-side disk */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '24%',
            width: 68,
            height: 11,
            marginLeft: -34,
            marginTop: -5,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(255,160,35,0.65) 0%, rgba(220,95,10,0.3) 55%, transparent 85%)',
            filter: 'blur(2.5px)',
            zIndex: 4,
          }}
          animate={{ opacity: [0.35, 0.72, 0.35], scaleX: [0.88, 1.08, 0.88] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Relativistic jet — faint vertical glow from poles */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            width: 3,
            height: 90,
            marginLeft: -1.5,
            marginTop: -45,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(180,100,20,0.14) 30%, rgba(200,120,30,0.1) 50%, rgba(180,100,20,0.14) 70%, transparent 100%)',
            filter: 'blur(5px)',
            zIndex: 1,
          }}
          animate={{ opacity: [0.15, 0.45, 0.15], scaleY: [0.85, 1.15, 0.85] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* proximity state used only for cursor hide logic — no visual rendered */}

      {/* ── Portal: canvas + fake cursor ───────────────────────── */}
      {mounted && phase !== 'idle' && createPortal(
        <>
          <canvas
            ref={canvasRef}
            style={{ position: 'fixed', inset: 0, zIndex: 99990, pointerEvents: 'none' }}
          />
          {fakeCursor && (
            <div
              style={{
                position: 'fixed',
                left: fakeCursor.x - 7,
                top: fakeCursor.y - 7,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: phase === 'shaking' || phase === 'collapsed'
                  ? 'rgba(255,160,40,0.95)'
                  : 'rgba(212,197,169,0.85)',
                boxShadow: phase === 'shaking' || phase === 'collapsed'
                  ? '0 0 16px 5px rgba(255,160,40,0.7)'
                  : '0 0 6px 2px rgba(212,197,169,0.3)',
                zIndex: 99999,
                pointerEvents: 'none',
              }}
            />
          )}
        </>,
        document.body
      )}
    </>
  );
}

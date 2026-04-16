'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ClothHeroSection from './ClothHeroSection';

gsap.registerPlugin(ScrollTrigger);

// ─── Seeded RNG (LCG) — deterministic, no external deps ─────────────────────
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const LEVELS = [
  { z: -1_000,     fadeAt: 1_000,     baseOpacity: 1.0,   count: 8  },
  { z: -5_000,     fadeAt: 5_000,     baseOpacity: 0.9,   count: 14 },
  { z: -15_000,    fadeAt: 15_000,    baseOpacity: 0.8,   count: 24 },
  { z: -40_000,    fadeAt: 40_000,    baseOpacity: 0.6,   count: 35 },
  { z: -100_000,   fadeAt: 100_000,   baseOpacity: 0.4,   count: 55 },
  { z: -250_000,   fadeAt: 250_000,   baseOpacity: 0.2,   count: 75 },
  { z: -600_000,   fadeAt: 600_000,   baseOpacity: 0.1,   count: 100 },
];

// ─── Cluster Galaxy Centers (x, y in %, rx, ry in %) ─────────────────────────
const CLUSTERS = [
  { cx: 15, cy: 15, rx: 14, ry: 10 }, // Area 1: Kiri Atas (Lebih proporsional)
  { cx: 85, cy: 12, rx: 12, ry:  8 }, // Area 2: Kanan Atas (Lebih pipih tipis)
  { cx: 50, cy: 40, rx: 10, ry:  5 }, // Area 3: Bawah title (Sangat oval mendatar)
  { cx: 85, cy: 55, rx: 10, ry: 10 }, // Area 4: Kanan Bawah
];

const POSITIONS_PER_LEVEL: { top: string; left: string; type: 'scatter' | 'ring-static' | 'ring-float' | 'float-upward' }[][] = LEVELS.map(({ count }, li) => {
  const rng = makeRng(li * 997 + 42);
  return Array.from({ length: count }, () => {
    
    // Cincinnya terbentuk makin jauh ke dalam (hanya mengental untuk layer dengan z yang dalam)
    let probScatter = 1.0; 
    if (li >= 5) probScatter = 0.2; // Layer paliiing dalam: 80% cincin, 20% sebar
    else if (li >= 3) probScatter = 0.4; // Layer menengah: 60% cincin, 40% sebar
    else probScatter = 0.95; // Layer depan/dekat: 95% potrait menyebar acak

    if (rng() < probScatter) {
      let type: 'scatter' | 'float-upward' = 'scatter';
      let topVal = (rng() * 200 - 50).toFixed(1) + '%';
      
      // Untuk lapis potrait paling dekat (li <= 2), sisihkan sekitar 35% nya untuk animasi melayang ke atas layaknya balon
      if (li <= 2 && rng() < 0.35) {
        type = 'float-upward';
        topVal = '50%'; // Kunci origin Y di tengah agar perhitungan Y offset dari jendela konsisten
      }

      return {
        top: topVal,
        left: `${(rng() * 200 - 50).toFixed(1)}%`,
        type,
      };
    }

    // Sisanya akan membentuk formasi cluster
    const cluster = CLUSTERS[Math.floor(rng() * CLUSTERS.length)];
    
    // Sistem Formasi Lingkaran Berongga (Hollow Ring)
    // Area ring dirampingkan menjadi 0.7 - 1.0 agar bentukan cincin tidak memakan terlalu banyak ruang
    const r = 0.7 + rng() * 0.3; 
    
    const theta = rng() * Math.PI * 2;
    
    // Sebaran radius ditekan agar profil lingkaran tidak bleber
    const noiseX = (rng() - 0.5) * 3;
    const noiseY = (rng() - 0.5) * 3;

    const left = cluster.cx + r * Math.cos(theta) * cluster.rx + noiseX;
    const top  = cluster.cy + r * Math.sin(theta) * cluster.ry + noiseY;

    // Untuk cincin galaksi, 40% darinya ikut melayang lepas, 60% diam mengambang menjaga bentuk
    const type = rng() < 0.4 ? 'ring-float' : 'ring-static';

    return {
      top:  `${top.toFixed(1)}%`,
      left: `${left.toFixed(1)}%`,
      type
    };
  });
});

const ROTATIONS_PER_LEVEL: string[][] = LEVELS.map(({ count }, li) => {
  const rng = makeRng(li * 1337 + 77);
  return Array.from({ length: count }, () => {
    return `${Math.round(rng() * 360)}deg`;
  });
});

const PHOTO_SRCS: (string | null)[][] = LEVELS.map(({ count }) =>
  Array(count).fill(null)
);

const PERSPECTIVE = 20_000;

export default function WorldHeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameTitleRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const clothWrapRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<HTMLDivElement[]>([]);

  // Entry animation
  useEffect(() => {
    if (!nameTitleRef.current) return;
    gsap.fromTo(
      nameTitleRef.current,
      { opacity: 0, y: 30, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, delay: 0.3, ease: 'power3.out' }
    );
  }, []);

  // Wave animation on name/title characters (Continuous Infinite Sine Wave)
  useEffect(() => {
    if (!nameTitleRef.current) return;
    
    // Pisahkan huruf nama dan huruf title
    const nameChars = nameTitleRef.current.querySelector('h1')?.querySelectorAll('.wave-char');
    const titleChars = nameTitleRef.current.querySelector('p')?.querySelectorAll('.wave-char');
    
    // Konfigurasi animasi gelombang sinus yang mengalir tanpa akhir (tidak putar balik)
    const animSettings: gsap.TweenVars = {
      y: 12, 
      rotation: 3, 
      duration: 1.4, // Sedikit lebih lambat agar terasa mengambang (fluid)
      ease: 'sine.inOut',
      yoyo: true, 
      repeat: -1, 
      delay: 1.7, // Tunggu animasi masuk selesai
      stagger: {
        each: 0.06,
        from: 'start',
      }
    };

    // Jalankan secara paralel untuk Name dan Title agar sejajar sempurna
    const tween1 = gsap.to(nameChars, animSettings);
    const tween2 = gsap.to(titleChars, animSettings);

    return () => { 
      tween1.kill(); 
      tween2.kill();
    };
  }, []);

  // Drift and Float Animations
  useEffect(() => {
    if (!worldRef.current) return;
    
    // Helper to generate deterministic fake-random values
    const getRnd = (seed: number) => {
      let s = seed >>> 0;
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 0xffffffff;
    };

    const wh = window.innerHeight;

    const floatNodes = worldRef.current.querySelectorAll('.polaroid-drift');
    floatNodes.forEach((node, i) => {
      const el = node as HTMLElement;
      const isRingStatic = el.classList.contains('ring-static');
      const isFloatUpward = el.classList.contains('float-upward');
      
      const rng1 = getRnd(i * 11);
      const rng2 = getRnd(i * 22);
      const rng3 = getRnd(i * 33);
      
      if (isFloatUpward) {
        // Melayang ke atas melewati layar penuh, muncul dari bawah lagi.
        gsap.fromTo(el, 
          {
            y: wh * 1.5 + rng1 * wh, // Mulai dari sangat jauh di bawah layar
            x: (rng2 - 0.5) * 300,   // Geser sedikit secara horizontal sebagai origin
            rotation: (rng3 - 0.5) * 45
          },
          {
            y: -wh * 1.5 - rng1 * wh, // Naik sampai sangat jauh melewati batas atas layar
            x: "+=" + ((rng1 - 0.5) * 200), // Sambil naik, ia juga melesat sedikit miring ke kiri/kanan
            rotation: "+=" + ((rng2 - 0.5) * 180), // Berputar seiringan jalan
            duration: 15 + rng3 * 15, // Waktu mengambangnya (15 hingga 30 detik)
            ease: "none", // Konstan agar ilusi looping ke angkasa mulus
            repeat: -1,   // Looping abadi
            delay: rng1 * 40 // Delay acak (0-40 detik) menciptakan ilusi keluarnya bergelombang (kadang 2, kadang 3)
          }
        );
      } else if (isRingStatic) {
        // Mereka (60% pembentuk cincin) menjaga bentuk cincin tapi tetap bernapas (sedikit bergerak bolak-balik)
        gsap.to(el, {
          x: (rng1 - 0.5) * 15,
          y: (rng2 - 0.5) * 15,
          rotation: (rng3 - 0.5) * 6,
          duration: 4 + rng1 * 3,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: rng2 * 3
        });
      } else {
        // Yang menyebar secara global (scatter) & cincin terbang (ring-float) 
        // melayang lambat secara linear ke kejauhan ke segala arah ala luar angkasa
        const dist = 60 + rng1 * 150; 
        const angle = rng2 * Math.PI * 2;
        
        gsap.to(el, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          rotation: (rng3 - 0.5) * 60,
          duration: 15 + rng1 * 15, // Gerakan luar angkasa yang lambat & fluid
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: -rng2 * 10 
        });
      }
    });
  }, []);

  // ─── Native GSAP ScrollTrigger: Name recedes, cloth rises ────────────────
  useEffect(() => {
    if (!nameTitleRef.current || !clothWrapRef.current || !worldRef.current || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%', // Pin untuk 100vh jarak scroll
        pin: true,
        scrub: true, // Ubah ke true agar responsif. Lenis sudah mengurus kelembutan native scroll.
      }
    });

    // Name recedes: scale down, move up slightly, fade out (40% pertama)
    // Meniadakan efek transisi 'filter: blur()' saat melakukan ScrollTrigger.scrub 
    // karena membebani thread GPU dan membuat lag parah/berat saat di-scroll
    tl.fromTo(nameTitleRef.current, {
      scale: 1,
      z: 0,
      opacity: 1,
    }, {
      scale: 0.6,
      z: -800,
      opacity: 0,
      duration: 0.4,
      ease: 'none',
    }, 0);

    // Starfield also recedes with name (40% pertama)
    tl.fromTo(worldRef.current, {
      scale: 1,
      opacity: 1,
    }, {
      scale: 0.85,
      opacity: 0.2,
      duration: 0.4,
      ease: 'none',
    }, 0);

    // Cloth slides up from below to cover (keseluruhan durasi timeline)
    tl.fromTo(clothWrapRef.current,
      { y: '65vh' },
      { y: '0vh', duration: 0.6, ease: 'none' },
      0
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '160vh', // Harus cukup tinggi menutupi besaran height cloth (160vh)
        overflowX: 'hidden',
        overflowY: 'clip', // Clip hides horizontal overflows from space, but let Native Lenis scroll vertically seamlessly!
        perspective: `${PERSPECTIVE}px`,
        perspectiveOrigin: '50% 50%',
        background: '#111',
      }}
    >
      {/* 3D world container */}
      <div
        ref={worldRef}
        style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
      >
        {LEVELS.map((level, li) => (
          <div
            key={li}
            ref={el => { if (el) layerRefs.current[li] = el; }}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: level.baseOpacity,
              transformStyle: 'preserve-3d',
            }}
          >
            {POSITIONS_PER_LEVEL[li].map((pos, pi) => {
              const src = PHOTO_SRCS[li]?.[pi] ?? null;
              return (
                <div
                  key={pi}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    transform: `translateZ(${level.z}px) scale(${[1.2, 0.9, 0.6, 0.4, 0.2, 0.08, 0.03, 0.01][li] || 1})`,
                    willChange: 'transform',
                  }}
                >
                  <div 
                    className={`polaroid-drift ${pos.type}`}
                    style={{
                      position: 'relative',
                      rotate: ROTATIONS_PER_LEVEL[li][pi],
                      width: 90,
                      background: '#f4f1e1',
                      padding: '6px 6px 22px 6px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                      userSelect: 'none',
                      willChange: 'transform',
                    }}
                  >
                    <div style={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: `translateX(-50%) rotate(${parseFloat(ROTATIONS_PER_LEVEL[li][pi]) * 0.5}deg)`,
                    width: 40,
                    height: 12,
                    background: 'rgba(235,225,205,0.95)',
                  }} />
                  <div style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    background: '#0a0a0a',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={`level ${li + 1} photo ${pi + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 18, height: 14, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1 }} />
                        <div style={{ color: 'rgba(255,255,255,0.12)', fontSize: 7, fontFamily: 'monospace' }}>
                          {li + 1}·{pi + 1}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: 4,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontFamily: 'var(--font-serif)',
                    fontSize: 7,
                    color: '#6e5d50',
                    opacity: 0.5,
                    letterSpacing: 1,
                  }}>
                    {li + 1} — {pi + 1}
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Name + Title — centered, single line */}
      <div
        ref={nameTitleRef}
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0,
          willChange: 'transform, opacity, filter',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 7rem)',
            fontWeight: 900,
            color: 'var(--accent-cream)',
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {"Andhieka Agrestya".split('').map((char, i) => (
            <span key={i} className="wave-char" style={{ display: 'inline-block', whiteSpace: 'pre', willChange: 'transform' }}>{char}</span>
          ))}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)',
            fontWeight: 400,
            color: 'var(--accent-warm)',
            opacity: 0.7,
            marginTop: '0.75rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {"Software Engineer".split('').map((char, i) => (
            <span key={`p-${i}`} className="wave-char" style={{ display: 'inline-block', whiteSpace: 'pre', willChange: 'transform' }}>{char}</span>
          ))}
        </p>
      </div>

      {/* Cloth — peeking from below, slides up on scroll */}
      <div
        ref={clothWrapRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 30,
          transform: 'translateY(65vh)',
          willChange: 'transform',
          pointerEvents: 'auto',
        }}
      >
        <ClothHeroSection embedded />
      </div>
    </div>
    </div>
  );
}

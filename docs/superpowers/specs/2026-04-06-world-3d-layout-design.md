# World 3D Layout — Design Spec

## Goal

Buat route `/world` dengan konsep **3D world layout** — semua konten ditempatkan di koordinat 3D menggunakan CSS perspective, bukan stacked sections. Pengalaman utamanya adalah fly-through camera saat scroll, diikuti ClothAboutSection.

## Architecture

- **Route baru:** `src/app/world/page.tsx`
- **Komponen baru:** `src/components/sections/WorldHeroSection.tsx`
- **Komponen reused:** `ScatteredText`, `ClothAboutSection` (existing, tanpa modifikasi)

`page.tsx` hanya render:
```tsx
<WorldHeroSection />
<ClothAboutSection />
```

---

## WorldHeroSection

### Layout & Container

- Full viewport (`100vw × 100vh`), `position: sticky; top: 0`
- Outer div: `perspective: 1200px; transform-style: preserve-3d`
- Background gelap (selaras dengan dark mode existing)
- Overflow hidden

### Name + Title Block

**Posisi:** center viewport, `translateZ(0)` (paling depan), z-index tertinggi

**Konten:**
```
Andhieka Agrestya   ← font serif, bold, large (clamp ~4rem–8rem)
Software Engineer   ← font mono, lighter, smaller (clamp ~1rem–1.5rem), muted opacity
```

**Wave animation (GSAP loop):**
```js
gsap.to(containerRef.current, {
  y: 10,
  rotation: 1.2,
  duration: 2.8,
  yoyo: true,
  repeat: -1,
  ease: 'sine.inOut',
})
```
Seluruh blok mengayun bersama — tidak per-huruf. Sinkron secara ritme dengan gerakan cloth.

---

### ScatteredText Depth Layers

CSS perspective membuat object dengan `translateZ` lebih besar terlihat lebih dekat. Opacity awal mencerminkan jarak — yang jauh lebih redup.

#### Layer Close (`translateZ(-150px)`) — opacity 1.0, bergerak ke atas

GSAP loop animasi `y` ke atas (infinite, slow):
```js
gsap.to(closeLayerRefs, {
  y: -30,
  duration: 6,
  stagger: 1.5,
  yoyo: true,
  repeat: -1,
  ease: 'sine.inOut',
})
```

Konten:
| Teks | Posisi (approx) | Style |
|------|----------------|-------|
| `"curiosity drove everything"` | top: 20%, left: 10% | serif, italic, weight 300 |
| `"late nights. broken code. breakthrough."` | top: 70%, right: 8% | sans, weight 300 |
| `"// first_line_of_code"` | top: 45%, left: 60% | mono |

#### Layer Mid (`translateZ(-500px)`) — opacity 0.55, statis

Konten:
| Teks | Posisi (approx) | Style |
|------|----------------|-------|
| `"WHERE IT ALL BEGAN"` | top: 15%, left: 40% | serif, weight 900 |
| `"console.log('hello world');"` | top: 60%, left: 5% | mono |
| `"motion is the message"` | top: 80%, right: 20% | sans, italic |

#### Layer Far (`translateZ(-900px)`) — opacity 0.25, statis

Konten:
| Teks | Posisi (approx) | Style |
|------|----------------|-------|
| `"crafted with intention"` | top: 25%, right: 15% | sans, weight 300 |
| `"design × engineering"` | top: 55%, left: 30% | mono |
| `"make it move"` | top: 75%, left: 15% | serif, italic |

---

### Fly-Through Camera (Scroll Mechanic)

Gunakan `useScrollHijack` (existing hook di `src/hooks/useScrollHijack.ts`) yang menghasilkan `progress` 0→1 dari wheel events.

```ts
const { sectionRef, progress } = useScrollHijack({ sensitivity: 0.001 })
```

GSAP `useEffect` watch `progress`:

```ts
useEffect(() => {
  // Mid layer: opacity 0.55 → 1.0 saat progress 0 → 0.5
  const midOpacity = Math.min(1, 0.55 + (progress / 0.5) * 0.45)
  gsap.to(midLayerRefs, { opacity: midOpacity, duration: 0 })

  // Far layer: opacity 0.25 → 1.0 saat progress 0.5 → 1.0
  const farProgress = Math.max(0, (progress - 0.5) / 0.5)
  const farOpacity = Math.min(1, 0.25 + farProgress * 0.75)
  gsap.to(farLayerRefs, { opacity: farOpacity, duration: 0 })
}, [progress])
```

Saat `progress = 1` → `useScrollHijack` otomatis melepas scroll lock, user scroll normal ke ClothAboutSection.

**Tidak ada size change** — hanya opacity yang berubah saat kamera mendekat.

---

## ClothAboutSection

Dirender langsung setelah `WorldHeroSection` di `page.tsx`. Tidak ada modifikasi. Pakai mode standalone (bukan embedded), background putih/abu.

---

## Constraints & Notes

- `ScatteredText` dipakai langsung tanpa modifikasi, hanya `style` prop yang di-set untuk posisi + `translateZ`
- `animationType='fade'` atau `'split'` untuk entry animation awal (sebelum fly-through mulai)
- Tidak ada perubahan pada route `/` (main portfolio tidak tersentuh)
- Gambar/objek 3D nyata bisa menggantikan ScatteredText di iterasi berikutnya ketika stock gambar tersedia
- Responsive: posisi ScatteredText perlu disesuaikan untuk mobile (atau disembunyikan sebagian untuk layer far)

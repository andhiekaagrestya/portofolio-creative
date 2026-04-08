'use client';

import dynamic from 'next/dynamic';
import WorldHeroSection from '@/components/sections/WorldHeroSection';

const CursorTrail = dynamic(() => import('@/components/CursorTrail'), { ssr: false });

export default function WorldPage() {
  return (
    <main style={{ background: '#111', minHeight: '100vh' }}>
      <CursorTrail />
      <WorldHeroSection />
    </main>
  );
}

'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import AdminPage from './page';

const CursorTrail = dynamic(() => import('@/components/CursorTrail'), { ssr: false });

export default function AdminLayout() {
  return (
    <Suspense fallback={<div className="hide-native-cursor" style={{ background: '#0f0d0a', minHeight: '100vh' }} />}>
      <div className="hide-native-cursor">
        <CursorTrail />
        <AdminPage />
      </div>
    </Suspense>
  );
}

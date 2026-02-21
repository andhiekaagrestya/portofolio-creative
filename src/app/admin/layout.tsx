import { Suspense } from 'react';
import AdminPage from './page';

export default function AdminLayout() {
  return (
    <Suspense fallback={<div style={{ background: '#0f0d0a', minHeight: '100vh' }} />}>
      <AdminPage />
    </Suspense>
  );
}

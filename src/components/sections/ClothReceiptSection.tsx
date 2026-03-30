'use client';

import { useEffect, useRef } from 'react';

export default function ClothReceiptSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // cleanup placeholder
    return () => {};
  }, []);

  return (
    <section
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        background: '#e5e5e5',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
      />
    </section>
  );
}

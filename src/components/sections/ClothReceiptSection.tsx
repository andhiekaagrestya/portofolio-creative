'use client';

import { useEffect, useRef } from 'react';

function buildReceiptTexture(): HTMLCanvasElement {
  const texCanvas = document.createElement('canvas');
  texCanvas.width = 1024;
  texCanvas.height = 2048;
  const ctx = texCanvas.getContext('2d');
  if (!ctx) throw new Error('buildReceiptTexture: failed to get 2D context');
  ctx.scale(2, 2);
  const W = 512;

  // Paper background
  ctx.fillStyle = '#f8f8f4';
  ctx.fillRect(0, 0, W, 1024);
  ctx.fillStyle = '#1a1a1a';

  // Header
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('THE FLORNRM SHOP', W / 2, 80);
  ctx.font = '22px monospace';
  ctx.fillText('42 Mesh Lane, WebGL City', W / 2, 125);
  ctx.fillText('Tel: (555) 042-1337', W / 2, 160);

  // Meta info
  ctx.textAlign = 'left';
  ctx.fillText('Date: 2026-02-23  14:17', 40, 230);
  ctx.fillText('Order: #00382', 40, 270);

  // Divider
  ctx.textAlign = 'center';
  ctx.fillText('- - - - - - - - - - - - - - - - - -', W / 2, 320);

  // Items
  ctx.textAlign = 'left';
  const startY = 380;
  const lineH = 45;
  const items = [
    ['Vertex Shader', '$4.20'],
    ['Fragment Shader', '$3.50'],
    ['Normal Map', '$2.80'],
    ['UV Unwrap', '$1.50'],
    ['Cloth Simulation', '$6.00'],
  ];
  items.forEach(([name, price], i) => {
    ctx.textAlign = 'left';
    ctx.fillText(name, 40, startY + lineH * i);
    ctx.textAlign = 'right';
    ctx.fillText(price, W - 40, startY + lineH * i);
  });

  // Divider
  ctx.textAlign = 'center';
  ctx.fillText('- - - - - - - - - - - - - - - - - -', W / 2, 610);

  // Subtotal & tax
  ctx.textAlign = 'left';
  ctx.fillText('Subtotal', 40, 670);
  ctx.fillText('Tax (8%)', 40, 715);
  ctx.textAlign = 'right';
  ctx.fillText('$18.00', W - 40, 670);
  ctx.fillText('$1.44', W - 40, 715);

  // Total
  ctx.fillRect(40, 755, W - 80, 5);
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('TOTAL', 40, 815);
  ctx.textAlign = 'right';
  ctx.fillText('$19.44', W - 40, 815);

  // Footer
  ctx.font = '22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Thank you for visiting!', W / 2, 920);
  ctx.font = '18px monospace';
  ctx.fillStyle = '#555';
  ctx.fillText('github.com/flornkm', W / 2, 960);

  return texCanvas;
}

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

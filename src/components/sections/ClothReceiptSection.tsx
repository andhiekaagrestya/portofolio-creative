'use client';

import { useEffect, useRef } from 'react';

const VS_SOURCE = `
  attribute vec3 a_pos;
  attribute vec3 a_norm;
  attribute vec2 a_uv;
  uniform mat4 u_proj;
  uniform mat4 u_view;
  varying vec3 v_norm;
  varying vec2 v_uv;
  void main() {
    v_norm = a_norm;
    v_uv = a_uv;
    gl_Position = u_proj * u_view * vec4(a_pos, 1.0);
  }
`;

const FS_SOURCE = `
  precision mediump float;
  varying vec3 v_norm;
  varying vec2 v_uv;
  uniform sampler2D u_tex;
  void main() {
    vec3 norm = normalize(v_norm);
    if (!gl_FrontFacing) norm = -norm;
    vec3 lightDir1 = normalize(vec3(0.4, 0.8, 0.6));
    vec3 lightDir2 = normalize(vec3(-0.5, -0.2, 0.8));
    float diff1 = max(dot(norm, lightDir1), 0.0);
    float diff2 = max(dot(norm, lightDir2), 0.0);
    float ambient = 0.55;
    vec4 texColor = texture2D(u_tex, v_uv);
    vec3 finalColor = texColor.rgb * (ambient + diff1 * 0.4 + diff2 * 0.2);
    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function setPerspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number) {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = (2 * far * near) * nf;
}

function setTranslation(out: Float32Array, x: number, y: number, z: number) {
  out.fill(0);
  out[0] = 1; out[5] = 1; out[10] = 1; out[15] = 1;
  out[12] = x; out[13] = y; out[14] = z;
}

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

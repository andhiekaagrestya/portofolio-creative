'use client';

import { useEffect, useRef } from 'react';

interface ClothReceiptSectionProps {
  embedded?: boolean;
}

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

interface Particle {
  x: number; y: number; z: number;
  ox: number; oy: number; oz: number;
  origX: number; origY: number; origZ: number;
}

interface Constraint {
  p1: number; p2: number; rest: number;
}

function buildCloth(numX: number, numY: number, width: number, height: number) {
  const particles: Particle[] = [];
  const uvData = new Float32Array(numX * numY * 2);

  for (let y = 0; y < numY; y++) {
    for (let x = 0; x < numX; x++) {
      const px = (x / (numX - 1) - 0.5) * width;
      const py = -(y / (numY - 1)) * height;
      const pz = 0;
      const i = y * numX + x;
      particles.push({ x: px, y: py, z: pz, ox: px, oy: py, oz: pz, origX: px, origY: py, origZ: pz });
      uvData[i * 2] = x / (numX - 1);
      uvData[i * 2 + 1] = y / (numY - 1);
    }
  }

  const constraints: Constraint[] = [];
  const addC = (i1: number, i2: number) => {
    const dx = particles[i2].x - particles[i1].x;
    const dy = particles[i2].y - particles[i1].y;
    const dz = particles[i2].z - particles[i1].z;
    constraints.push({ p1: i1, p2: i2, rest: Math.sqrt(dx * dx + dy * dy + dz * dz) });
  };

  for (let y = 0; y < numY; y++) {
    for (let x = 0; x < numX; x++) {
      const i = y * numX + x;
      if (x < numX - 1) addC(i, i + 1);
      if (y < numY - 1) addC(i, i + numX);
      if (x < numX - 1 && y < numY - 1) { addC(i, i + numX + 1); addC(i + 1, i + numX); }
      if (x < numX - 2) addC(i, i + 2);
      if (y < numY - 2) addC(i, i + numX * 2);
    }
  }

  const indices: number[] = [];
  for (let y = 0; y < numY - 1; y++) {
    for (let x = 0; x < numX - 1; x++) {
      const i = y * numX + x;
      indices.push(i, i + 1, i + numX);
      indices.push(i + 1, i + numX + 1, i + numX);
    }
  }

  return { particles, constraints, uvData, indices };
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

export default function ClothReceiptSection({ embedded = false }: ClothReceiptSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embeddedRef = useRef(embedded);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;

    // Resize — follow parent container, not window
    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    // Texture
    const texCanvas = buildReceiptTexture();
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Shader program
    const vertShader = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE)!;
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE)!;
    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
    gl.useProgram(program);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    const aNorm = gl.getAttribLocation(program, 'a_norm');
    const aUv = gl.getAttribLocation(program, 'a_uv');
    const uProj = gl.getUniformLocation(program, 'u_proj');
    const uView = gl.getUniformLocation(program, 'u_view');

    // Cloth geometry
    const NUM_X = 25, NUM_Y = 50;
    const { particles, constraints, uvData, indices } = buildCloth(NUM_X, NUM_Y, 3.0, 6.0);
    const numParticles = NUM_X * NUM_Y;

    const posData = new Float32Array(numParticles * 3);
    const normalData = new Float32Array(numParticles * 3);

    const posBuf = gl.createBuffer();
    const normBuf = gl.createBuffer();
    const uvBuf = gl.createBuffer();
    const idxBuf = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST);

    const projMatrix = new Float32Array(16);
    const viewMatrix = new Float32Array(16);
    const camPos = { x: 0, y: -2.0, z: 5.5 };
    const fov = 65 * Math.PI / 180;

    // Interaction
    let pointerX = 0, pointerY = 0;
    let grabbedIndex = -1;
    let grabDepth = 0;

    const getAspect = () => canvas.width / canvas.height;

    const getRay = () => {
      const aspect = getAspect();
      const tanFov = Math.tan(fov / 2);
      const dx = pointerX * aspect * tanFov;
      const dy = pointerY * tanFov;
      const dz = -1;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      return { origin: { ...camPos }, dir: { x: dx / len, y: dy / len, z: dz / len } };
    };

    const updatePointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onDown = (e: PointerEvent) => {
      updatePointer(e);
      const ray = getRay();
      let minDist = Infinity;
      let bestIdx = -1;
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        const vx = p.x - ray.origin.x;
        const vy = p.y - ray.origin.y;
        const vz = p.z - ray.origin.z;
        const t = vx * ray.dir.x + vy * ray.dir.y + vz * ray.dir.z;
        const px = ray.origin.x + ray.dir.x * t;
        const py = ray.origin.y + ray.dir.y * t;
        const pz = ray.origin.z + ray.dir.z * t;
        const dist = Math.sqrt((p.x - px) ** 2 + (p.y - py) ** 2 + (p.z - pz) ** 2);
        if (dist < minDist && dist < 1.0) { minDist = dist; bestIdx = i; grabDepth = t; }
      }
      if (bestIdx !== -1) { grabbedIndex = bestIdx; canvas.style.cursor = 'grabbing'; }
    };

    const onMove = (e: PointerEvent) => {
      updatePointer(e);
      if (grabbedIndex !== -1) {
        const ray = getRay();
        const p = particles[grabbedIndex];
        p.x = ray.origin.x + ray.dir.x * grabDepth;
        p.y = ray.origin.y + ray.dir.y * grabDepth;
        p.z = ray.origin.z + ray.dir.z * grabDepth;
        p.ox = p.x; p.oy = p.y; p.oz = p.z;
      }
    };

    const onUp = () => {
      if (grabbedIndex !== -1 && grabbedIndex < NUM_X) {
        const p = particles[grabbedIndex];
        p.x = p.origX; p.y = p.origY; p.z = p.origZ;
        p.ox = p.origX; p.oy = p.origY; p.oz = p.origZ;
      }
      grabbedIndex = -1;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    // Render loop
    let time = 0;
    let rafId: number;

    const render = () => {
      time += 0.016;

      // Physics
      const windX = Math.sin(time * 1.5) * 0.0015;
      const windZ = Math.cos(time * 1.1) * 0.0015;
      for (let i = 0; i < numParticles; i++) {
        if (i < NUM_X || i === grabbedIndex) continue;
        const p = particles[i];
        const vx = (p.x - p.ox) * 0.985;
        const vy = (p.y - p.oy) * 0.985;
        const vz = (p.z - p.oz) * 0.985;
        p.ox = p.x; p.oy = p.y; p.oz = p.z;
        const windFactor = p.y / -6.0;
        p.x += vx + windX * windFactor;
        p.y += vy - 0.007;
        p.z += vz + windZ * windFactor;
      }

      // Constraints
      for (let iter = 0; iter < 15; iter++) {
        for (let i = 0; i < constraints.length; i++) {
          const c = constraints[i];
          const p1 = particles[c.p1];
          const p2 = particles[c.p2];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dz = p2.z - p1.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const w1 = (c.p1 < NUM_X || c.p1 === grabbedIndex) ? 0 : 1;
          const w2 = (c.p2 < NUM_X || c.p2 === grabbedIndex) ? 0 : 1;
          const wSum = w1 + w2;
          if (wSum > 0) {
            const diff = (dist - c.rest) / (dist * wSum);
            if (w1) { p1.x += dx * diff; p1.y += dy * diff; p1.z += dz * diff; }
            if (w2) { p2.x -= dx * diff; p2.y -= dy * diff; p2.z -= dz * diff; }
          }
        }
      }

      // Update pos & normals
      normalData.fill(0);
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        posData[i * 3] = p.x; posData[i * 3 + 1] = p.y; posData[i * 3 + 2] = p.z;
      }
      for (let i = 0; i < indices.length; i += 3) {
        const i1 = indices[i], i2 = indices[i + 1], i3 = indices[i + 2];
        const v1x = posData[i1*3], v1y = posData[i1*3+1], v1z = posData[i1*3+2];
        const v2x = posData[i2*3], v2y = posData[i2*3+1], v2z = posData[i2*3+2];
        const v3x = posData[i3*3], v3y = posData[i3*3+1], v3z = posData[i3*3+2];
        const nx = (v2y-v1y)*(v3z-v1z) - (v2z-v1z)*(v3y-v1y);
        const ny = (v2z-v1z)*(v3x-v1x) - (v2x-v1x)*(v3z-v1z);
        const nz = (v2x-v1x)*(v3y-v1y) - (v2y-v1y)*(v3x-v1x);
        normalData[i1*3]+=nx; normalData[i1*3+1]+=ny; normalData[i1*3+2]+=nz;
        normalData[i2*3]+=nx; normalData[i2*3+1]+=ny; normalData[i2*3+2]+=nz;
        normalData[i3*3]+=nx; normalData[i3*3+1]+=ny; normalData[i3*3+2]+=nz;
      }

      // Draw
      if (embeddedRef.current) {
        gl.clearColor(0, 0, 0, 0); // transparent — let ProcessSection background show
      } else {
        gl.clearColor(0.898, 0.898, 0.898, 1.0);
      }
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      setPerspective(projMatrix, fov, getAspect(), 0.1, 100.0);
      setTranslation(viewMatrix, -camPos.x, -camPos.y, -camPos.z);
      gl.uniformMatrix4fv(uProj, false, projMatrix);
      gl.uniformMatrix4fv(uView, false, viewMatrix);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, posData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
      gl.bufferData(gl.ARRAY_BUFFER, normalData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aNorm);
      gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
    };
  }, []);

  if (embedded) {
    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(480px, 70vw)',
          height: '60vh',
          display: 'block',
          cursor: 'grab',
          zIndex: 15,
        }}
      />
    );
  }

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
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          width: '100%',
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          color: '#888',
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: '0.5px',
          fontFamily: 'monospace',
        }}
      >
        Grab and drag the receipt
      </div>
    </section>
  );
}

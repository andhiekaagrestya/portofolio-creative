'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
// import { Center } from '@react-three/drei';

// ── GLB type ─────────────────────────────────
type TapeGLTF = GLTF & {
  nodes: {
    Attache__0: THREE.Mesh;
    Bouton__0: THREE.Mesh;
    Cube__0: THREE.Mesh;
    EmboutMetre__0: THREE.Mesh;
    Metre__0: THREE.Mesh;
    sANGLE__0: THREE.Mesh;
  };
  materials: {
    ['Scene_-_Root']: THREE.MeshPhysicalMaterial;
  };
};

// ── Mouse tracker ───────────────────────────
const mouse2d = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouse2d.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse2d.y = (e.clientY / window.innerHeight) * 2 - 1;
  });
}

// ── Scene ───────────────────────────────────
function TapeScene({ hovered }: { hovered: boolean; }) {
  const { nodes, materials } = useGLTF('/models/tape.glb') as unknown as TapeGLTF;
  const mat = materials['Scene_-_Root'];

  const groupRef = useRef<THREE.Group>(null);
  const bladeRef = useRef<THREE.Mesh>(null);
  const hookRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Group>(null);

  const bladeExtend = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current || !bladeRef.current || !hookRef.current) return;

    // extend logic
    const target = hovered ? 1 : 0;
    bladeExtend.current = THREE.MathUtils.lerp(bladeExtend.current, target, delta * 6);

    const extendOffset = bladeExtend.current * 420;

    // REAL extension
    const baseScale = 100;
    const scaleBoost = 1 + bladeExtend.current * 1.2;
    bladeRef.current.scale.z = baseScale * scaleBoost;

    // Because the base has been rotated horizontally by Math.PI * 0.35, 
    // the local Z extension pushes the blade in the wrong visual direction.
    // Let's adjust its local X and Z to make it shoot out visibly.
    const angleOffset = Math.PI * 0.45; // Tweak this for the visual angle we want
    const moveZ = Math.cos(angleOffset) * extendOffset;
    const moveX = Math.sin(angleOffset) * extendOffset;

    bladeRef.current.position.z = -111.968 - moveZ;
    bladeRef.current.position.x = -moveX;

    const hookExtra = bladeExtend.current * 80;
    hookRef.current.position.z = -111.968 - moveZ - hookExtra;
    hookRef.current.position.x = -moveX;

    // move label to middle of blade
    if (labelRef.current) {
      labelRef.current.position.z = -moveZ * 0.55;
      labelRef.current.position.x = -moveX * 0.55;
      labelRef.current.position.y = 8;
    }

    // housing tilt
    // Base rotation from props was Math.PI * 0.35, adding Math.PI to rotate 180 degrees horizontally
    const baseY = Math.PI * 0.15;
    const baseX = Math.PI * 0.05;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      baseY + mouse2d.x * 0.55,
      delta * 3
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      baseX - mouse2d.y * 0.52,
      delta * 3
    );

    // floating idle
    groupRef.current.position.y = Math.sin(Date.now() * 0.0015) * 0.02;
  });

  return (
    // <Center>
      <group
        ref={groupRef}
        scale={0.0035}
        dispose={null}
        rotation={[Math.PI * 0.05, Math.PI * 0.35, Math.PI * -0.05]}
        position={[0, -0.6, 0]}
      >
        {/* Body */}
        <mesh
          geometry={nodes.Cube__0.geometry}
          material={mat}
          position={[199.852, -39.591, -111.968]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />

        <mesh
          geometry={nodes.Attache__0.geometry}
          material={mat}
          position={[4.558, -68.794, -15.288]}
          rotation={[-Math.PI / 2, 0, -1.563]}
          scale={100}
        />

        <mesh
          geometry={nodes.Bouton__0.geometry}
          material={mat}
          position={[0, -67.915, -111.968]}
          rotation={[Math.PI, 0, Math.PI / 2]}
          scale={100}
        />

        <mesh
          geometry={nodes.sANGLE__0.geometry}
          material={mat}
          position={[194.835, -47.913, -111.968]}
          rotation={[-Math.PI / 2, -0.037, 0]}
          scale={100}
        />

        {/* ── Blade ── */}
        <mesh
          ref={bladeRef}
          geometry={nodes.Metre__0.geometry}
          material={mat}
          position={[0, -67.915, -111.968]}
          rotation={[Math.PI, 0, Math.PI / 2]}
          scale={100}
        >
          {/* LABEL INSIDE TAPE */}
          {hovered && (
            <group ref={labelRef}>
              <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
                <div
                  style={{
                    fontFamily: "'Caveat', cursive, var(--font-sans)",
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: '#222',
                    transform: 'rotate(-90deg) translateY(-4px)',
                    animation: 'fadeInLabel 0.3s ease forwards',
                    whiteSpace: 'nowrap',
                    textShadow: '0 1px 2px rgba(255,255,255,0.4)',
                  }}
                >
                  add yours
                </div>
              </Html>
            </group>
          )}
        </mesh>

        {/* Hook */}
        <mesh
          ref={hookRef}
          geometry={nodes.EmboutMetre__0.geometry}
          material={mat}
          position={[0, -67.915, -111.968]}
          rotation={[Math.PI, 0, Math.PI / 2]}
          scale={100}
        />
      </group>
    // </Center>
  );
}

// fade animation
const LABEL_CSS = `
@keyframes fadeInLabel {
  from { opacity: 0; transform: translateY(4px) rotate(-90deg); }
  to   { opacity: 1; transform: translateY(0) rotate(-90deg); }
}
`;

// ── Canvas wrapper ──────────────────────────
export function TapeRoll3D({ spinning: hovered }: { spinning: boolean; }) {
  return (
    <>
      <style>{LABEL_CSS}</style>
      <Canvas
        style={{ width: 320, height: 260, display: 'block' }}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.6, 4.8], fov: 34 }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={1.8} />
        <pointLight position={[-2, 2, 2]} intensity={0.5} />
        <TapeScene hovered={hovered} />
      </Canvas>
    </>
  );
}

useGLTF.preload('/models/tape.glb');
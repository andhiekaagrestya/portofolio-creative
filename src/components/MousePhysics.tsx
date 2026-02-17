'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface PhysicsElement {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
  mass: number;
}

interface MousePhysicsProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  radius?: number;
  strength?: number;
  springStiffness?: number;
  damping?: number;
}

export default function MousePhysics({
  children,
  className = '',
  style,
  radius = 250,
  strength = 80,
  springStiffness = 0.03,
  damping = 0.85,
}: MousePhysicsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const elementsRef = useRef<PhysicsElement[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all physics-enabled children
    const physicsEls = containerRef.current.querySelectorAll('[data-physics]');
    elementsRef.current = Array.from(physicsEls).map((el) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      return {
        el: el as HTMLElement,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        originX: rect.left + rect.width / 2,
        originY: rect.top + rect.height / 2,
        mass: parseFloat((el as HTMLElement).dataset.mass || '1'),
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = () => {
      // Explosion on click
      elementsRef.current.forEach((item) => {
        const rect = item.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - mouseRef.current.x;
        const dy = cy - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius * 1.5) {
          const force = ((1 - dist / (radius * 1.5)) * strength * 3) / item.mass;
          item.vx += (dx / dist) * force;
          item.vy += (dy / dist) * force;
        }
      });
    };

    const animate = () => {
      elementsRef.current.forEach((item) => {
        const rect = item.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Mouse repulsion
        const dx = cx - mouseRef.current.x;
        const dy = cy - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius && dist > 0) {
          const force = ((1 - dist / radius) * strength * 0.5) / item.mass;
          item.vx += (dx / dist) * force;
          item.vy += (dy / dist) * force;
        }

        // Spring back to origin
        item.vx += -item.x * springStiffness;
        item.vy += -item.y * springStiffness;

        // Apply damping
        item.vx *= damping;
        item.vy *= damping;

        // Update position
        item.x += item.vx;
        item.y += item.vy;

        // Calculate rotation based on velocity
        const rotation = item.vx * 0.5;

        item.el.style.transform = `translate(${item.x}px, ${item.y}px) rotate(${rotation}deg)`;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [radius, strength, springStiffness, damping]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}

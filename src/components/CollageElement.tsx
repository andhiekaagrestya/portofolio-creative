'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface CollageElementProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  style: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    rotate?: string;
    zIndex?: number;
  };
  parallaxSpeed?: number;
  scrollStart?: string;
  scrollEnd?: string;
  animateFrom?: 'left' | 'right' | 'top' | 'bottom' | 'scale';
  blendMode?: string;
  magnetic?: boolean;
}

export default function CollageElement({
  src,
  alt,
  width,
  height,
  style,
  parallaxSpeed = 0.5,
  scrollStart = 'top bottom',
  scrollEnd = 'bottom top',
  animateFrom = 'scale',
  blendMode,
  magnetic = false,
}: CollageElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const magneticPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!elementRef.current) return;

    const el = elementRef.current;

    // Entry animation
    const fromVars: Record<string, number | string> = { opacity: 0 };
    const toVars: Record<string, number | string> = { opacity: 1, duration: 1.5, ease: 'power2.out' };

    switch (animateFrom) {
      case 'left':
        fromVars.x = -200;
        fromVars.rotation = -15;
        toVars.x = 0;
        toVars.rotation = parseFloat(style.rotate || '0');
        break;
      case 'right':
        fromVars.x = 200;
        fromVars.rotation = 15;
        toVars.x = 0;
        toVars.rotation = parseFloat(style.rotate || '0');
        break;
      case 'top':
        fromVars.y = -200;
        fromVars.rotation = -10;
        toVars.y = 0;
        toVars.rotation = parseFloat(style.rotate || '0');
        break;
      case 'bottom':
        fromVars.y = 200;
        fromVars.rotation = 10;
        toVars.y = 0;
        toVars.rotation = parseFloat(style.rotate || '0');
        break;
      case 'scale':
        fromVars.scale = 0;
        fromVars.rotation = Math.random() * 30 - 15;
        toVars.scale = 1;
        toVars.rotation = parseFloat(style.rotate || '0');
        break;
    }

    gsap.fromTo(el, fromVars, {
      ...toVars,
      scrollTrigger: {
        trigger: el,
        start: scrollStart,
        end: scrollEnd,
        toggleActions: 'play none none reverse',
      },
    });

    // Parallax
    gsap.to(el, {
      yPercent: -100 * parallaxSpeed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Magnetic effect
    if (magnetic) {
      const handleMouse = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        const radius = 300;

        if (dist < radius) {
          const force = (1 - dist / radius) * 30;
          magneticPos.current = {
            x: (distX / dist) * force,
            y: (distY / dist) * force,
          };
        } else {
          magneticPos.current = { x: 0, y: 0 };
        }

        gsap.to(el, {
          x: magneticPos.current.x,
          y: magneticPos.current.y,
          duration: 0.6,
          ease: 'power2.out',
        });
      };

      window.addEventListener('mousemove', handleMouse);
      return () => window.removeEventListener('mousemove', handleMouse);
    }
  }, [animateFrom, magnetic, parallaxSpeed, scrollEnd, scrollStart, style.rotate]);

  return (
    <div
      ref={elementRef}
      className="absolute collage-img"
      style={{
        top: style.top,
        left: style.left,
        right: style.right,
        bottom: style.bottom,
        transform: `rotate(${style.rotate || '0deg'})`,
        zIndex: style.zIndex || 1,
        mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'],
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="pointer-events-none select-none"
        style={{
          filter: 'saturate(1.2) contrast(1.05)',
        }}
        priority
      />
    </div>
  );
}

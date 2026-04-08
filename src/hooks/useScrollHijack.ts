'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollHijackOptions {
  sensitivity?: number;   // how fast progress accumulates per scroll unit
  threshold?: number;     // how much of the section must be visible to activate (0-1)
}

export function useScrollHijack<T extends HTMLElement>({
  sensitivity = 0.0008,
  threshold = 0.6,
}: UseScrollHijackOptions = {}) {
  const sectionRef = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const isActive = useRef(false);
  const accDelta = useRef(0);

  const release = useCallback(() => {
    isActive.current = false;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActive.current = entry.intersectionRatio >= threshold;
        if (!isActive.current) {
          // reset when leaving section
          accDelta.current = 0;
          setProgress(0);
        }
      },
      { threshold }
    );
    observer.observe(el);

    const onWheel = (e: WheelEvent) => {
      if (!isActive.current) return;

      const next = Math.max(0, Math.min(1, accDelta.current + e.deltaY * sensitivity));

      // If at boundaries, let native scroll happen
      if (next <= 0 && e.deltaY < 0) return;
      if (next >= 1 && e.deltaY > 0) return;

      e.preventDefault();
      accDelta.current = next;
      setProgress(next);
    };

    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', onWheel);
    };
  }, [sensitivity, threshold]);

  return { sectionRef, progress, release };
}

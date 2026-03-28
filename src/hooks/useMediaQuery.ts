'use client';

import { useState, useEffect } from 'react';

interface MediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useMediaQuery(): MediaQueryResult {
  const [result, setResult] = useState<MediaQueryResult>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 767px)');
    const tabletMq = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const update = () => {
      setResult({
        isMobile: mobileMq.matches,
        isTablet: tabletMq.matches,
        isDesktop: desktopMq.matches,
      });
    };

    update();
    mobileMq.addEventListener('change', update);
    tabletMq.addEventListener('change', update);
    desktopMq.addEventListener('change', update);

    return () => {
      mobileMq.removeEventListener('change', update);
      tabletMq.removeEventListener('change', update);
      desktopMq.removeEventListener('change', update);
    };
  }, []);

  return result;
}

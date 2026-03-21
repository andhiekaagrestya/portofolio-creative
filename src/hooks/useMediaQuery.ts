'use client';

import { useState, useEffect } from 'react';

export interface Breakpoints {
  isMobile: boolean;  // < 768px
  isTablet: boolean;  // 768px – 1023px
  isDesktop: boolean; // >= 1024px
}

const DEFAULT_BREAKPOINTS: Breakpoints = {
  isMobile: false,
  isTablet: false,
  isDesktop: false,
};

export function useMediaQuery(): Breakpoints {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>(DEFAULT_BREAKPOINTS);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

    const update = () => {
      const mobile = mobileQuery.matches;
      const tablet = tabletQuery.matches;
      setBreakpoints({
        isMobile: mobile,
        isTablet: tablet,
        isDesktop: !mobile && !tablet,
      });
    };

    update();

    mobileQuery.addEventListener('change', update);
    tabletQuery.addEventListener('change', update);

    return () => {
      mobileQuery.removeEventListener('change', update);
      tabletQuery.removeEventListener('change', update);
    };
  }, []);

  return breakpoints;
}

'use client';

import { ReactNode } from 'react';
import { useActiveTheme, HolidayTheme } from '@/lib/holidays';
import HolidayDecorations from './HolidayDecorations';

const THEMES: HolidayTheme[] = ['default', 'ramadan', 'christmas', 'newyear', 'lunar'];

export default function ThemeProvider({ children }: { children: ReactNode; }) {
  const { theme, setTheme } = useActiveTheme();

  return (
    <>
      <div className={`theme-${theme} contents`}>
        {children}
      </div>
      <HolidayDecorations theme={theme} />

      {/* Theme Debug Toggle (Commented out for Production) */}
      {/* 
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          onClick={() => {
            const nextIdx = (THEMES.indexOf(theme) + 1) % THEMES.length;
            setTheme(THEMES[nextIdx]);
          }}
          className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-mono bg-[#1a1510] border border-[var(--accent-warm)] text-[var(--accent-warm)] opacity-50 hover:opacity-100 transition-opacity"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          Theme: {theme}
        </button>
      </div>
      */}
    </>
  );
}

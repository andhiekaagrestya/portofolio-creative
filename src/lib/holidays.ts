'use client';

import { useState, useEffect } from 'react';
import * as HijriConverter from 'hijri-converter';
import { Solar, Lunar } from 'lunar-javascript';

export type HolidayTheme = 'default' | 'ramadan' | 'christmas' | 'newyear' | 'lunar';

export function useActiveTheme() {
  const [theme, setTheme] = useState<HolidayTheme>('default');

  useEffect(() => {
    // Determine the theme on the client after mount to prevent hydration mismatches
    setTheme(detectActiveHoliday());
  }, []);

  return { theme, setTheme };
}

function detectActiveHoliday(): HolidayTheme {
  const now = new Date();

  // Calculate if it's past 18:00 (6 PM) local time to adjust for sunset-based calendars
  const isPostSunset = now.getHours() >= 18;

  // Base current date for calculations
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate(); // 1-31

  // 1. New Year's Eve (Dec 31 post sunset => Jan 1)
  if ((month === 12 && day === 31 && isPostSunset) || (month === 1 && day === 1)) {
    return 'newyear';
  }

  // 2. Christmas (Dec 25 - Dec 30)
  if (month === 12 && day >= 25 && day <= 30) {
    return 'christmas';
  }

  // 3. Ramadan (Hijri Calendar)
  // We offset the date by +1 day if past sunset (since Hijri days start at Maghrib)
  const calculationDate = new Date(now);
  if (isPostSunset) {
    calculationDate.setDate(calculationDate.getDate() + 1);
  }

  // Convert Gregorian to Hijri
  const hijri = HijriConverter.toHijri(
    calculationDate.getFullYear(),
    calculationDate.getMonth() + 1,
    calculationDate.getDate()
  );

  // hijri month: 9 = Ramadan, 10 = Shawwal
  const iMonth = hijri.hm;
  const iDate = hijri.hd;

  // Ramadan is active for the whole 9th month, and stops after 1 Shawwal (Eid)
  if (iMonth === 9 || (iMonth === 10 && iDate === 1)) {
    return 'ramadan';
  }

  // 4. Lunar New Year (Imlek)
  // Converting Gregorian to Lunar
  const solar = Solar.fromDate(now);
  const lunar = Lunar.fromSolar(solar);
  // Lunar New Year is the 1st day of the 1st lunar month.
  // The Spring Festival typically lasts 15 days (until Lantern Festival).
  if (lunar.getMonth() === 1 && lunar.getDay() >= 1 && lunar.getDay() <= 15) {
    return 'lunar';
  }

  // Fallback
  return 'default';
}

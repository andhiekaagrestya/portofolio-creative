declare module 'hijri-converter' {
  export function toHijri(year: number, month: number, day: number): {
    hy: number;
    hm: number;
    hd: number;
  };
}

declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
  }
  export class Lunar {
    static fromSolar(solar: Solar): Lunar;
    getDay(): number;
    getMonth(): number;
    getYear(): number;
  }
}

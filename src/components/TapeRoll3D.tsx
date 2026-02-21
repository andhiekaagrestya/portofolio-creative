import React from "react";

export default function TapeRoll3D() {
  return (
    <div className="group relative flex py-12 px-8 w-max cursor-pointer font-serif">
      
      {/* Dekorasi: Pita Pembatas Buku (Bookmark Ribbon) Hijau Tua */}
      <div className="absolute bottom-0 right-14 w-8 h-20 bg-[#2C3E35] -rotate-6 z-20 shadow-[2px_4px_4px_rgba(0,0,0,0.4)] border-l border-[#1A251F]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}>
         <div className="w-full h-full opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
      </div>

      {/* Dekorasi: Segel Lilin Merah (Red Wax Seal) & Kertas Usang */}
      <div className="absolute top-2 left-2 w-24 h-14 bg-[#D4C4A8] -rotate-[8deg] z-30 shadow-[2px_2px_5px_rgba(0,0,0,0.5)] border border-[#A89A7C]" style={{ clipPath: 'polygon(2% 5%, 95% 0%, 100% 90%, 5% 100%)' }}>
        <div className="w-full h-full opacity-40 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#5D4037 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
        {/* Segel Lilin */}
        <div className="absolute -top-3 -right-2 w-10 h-10 bg-[#8B1E1E] rounded-full shadow-[2px_3px_4px_rgba(0,0,0,0.6),inset_1px_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center border border-[#5A0C0C]">
           <div className="w-7 h-7 rounded-full border-[1.5px] border-[#5A0C0C] flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
             <span className="text-[#F5DEB3] font-serif font-black text-[10px] opacity-80">V</span>
           </div>
        </div>
      </div>

      {/* Wrapper Utama - Bouncy ease dan rotasi */}
      <div className="relative flex items-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[-2deg] group-hover:scale-[1.03]">

        {/* Pita (Tape) - Kertas Perkamen / Manuskrip Kuno */}
        <div
          className="absolute left-[3.5rem] h-16 bg-[#F0E6D2] border-y-[4px] border-double border-[#5D4037] border-r-[2px] origin-left transition-all overflow-hidden z-0 w-12 group-hover:w-[360px] sm:group-hover:w-[460px] duration-500 group-hover:duration-700 ease-[cubic-bezier(0.47,1.64,0.41,0.8)] shadow-[5px_5px_0px_rgba(44,30,22,0.8)] rotate-[1deg] group-hover:rotate-0 flex items-center"
        >
          {/* Tekstur Kertas Tua */}
          <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.1) 50px, rgba(93,64,55,0.1) 52px)' }} />

          {/* Garis-garis Manuskrip Pudar */}
          <div className="absolute inset-0 flex flex-col justify-evenly py-2 pointer-events-none opacity-20">
            <div className="w-full h-[1px] bg-[#5D4037]" />
            <div className="w-full h-[1px] bg-[#5D4037]" />
            <div className="w-full h-[1px] bg-[#5D4037]" />
          </div>

          {/* Teks "ADD YOURS" - Gaya Manuskrip Buku Klasik */}
          <div className="absolute inset-0 flex items-center pl-24 sm:pl-28 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] delay-100 group-hover:delay-200">
            <div className="flex gap-2 items-center">

              {/* Kata "ADD" - Illuminated Initial / Drop Cap Style */}
              <div className="flex items-end shadow-[2px_2px_0_#2C1E16] bg-[#F0E6D2] border border-[#5D4037] p-0.5 -rotate-[2deg]">
                <span className="bg-[#5D4037] text-[#F0E6D2] font-serif font-black text-2xl px-2 py-1 border border-[#2C1E16]">A</span>
                <span className="text-[#5D4037] font-serif italic font-bold text-xl px-1">dd</span>
              </div>

              {/* Kata "YOURS" - Stempel Pudar & Susunan Klasik */}
              <div className="flex gap-1.5 ml-2 items-center">
                <span className="text-[#8B1E1E] font-serif font-black text-3xl rotate-[4deg] mix-blend-multiply opacity-90 border-b border-[#8B1E1E] border-dashed">Y</span>
                <span className="text-[#2C1E16] font-serif font-bold text-2xl -rotate-[2deg] opacity-80 mt-1">o</span>
                <span className="bg-[#D4C4A8] text-[#2C1E16] font-mono font-bold text-xl px-1.5 py-0.5 rotate-[6deg] border border-[#A89A7C] shadow-[1px_1px_0_#5D4037]">U</span>
                <span className="text-[#2C1E16] font-serif font-bold text-2xl -rotate-[5deg] opacity-90">r</span>
                <span className="text-[#5D4037] font-serif italic font-black text-3xl rotate-[3deg]">s</span>
              </div>

            </div>
          </div>
        </div>

        {/* Bodi (Tape Body) - Sampul Kulit Buku Kuno (Antique Leather Bound) */}
        <div className="relative z-10 w-32 h-32 bg-[#4A2F1D] rounded-full flex items-center justify-center border-[4px] border-[#2C1E16] shadow-[8px_8px_0px_#2C1E16] rotate-[4deg] group-hover:rotate-[0deg] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">

          {/* Tekstur Kulit (Leather Crackle) */}
          <div className="absolute inset-0 rounded-full opacity-30 overflow-hidden mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle, transparent 2px, #2C1E16 2px, #2C1E16 3px)', backgroundSize: '6px 6px' }} />

          {/* Emboss Emas Klasik (Gold Tooling) di pinggir */}
          <div className="absolute inset-1.5 rounded-full border-[1px] border-[#B8860B] border-dashed opacity-60 pointer-events-none shadow-[inset_0_0_2px_#B8860B]" />

          {/* Lingkaran Tengah (Spool) - Pusat Gulungan Perkamen */}
          <div className="w-14 h-14 bg-[#D4C4A8] rounded-full flex items-center justify-center relative z-10 border-[3px] border-[#2C1E16] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5)]">
            <div className="w-8 h-8 rounded-full border-[1.5px] border-[#A89A7C] flex items-center justify-center">
               <div className="w-4 h-4 rounded-full border-[1px] border-[#8C7A5C] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#2C1E16] rounded-full" />
               </div>
            </div>
          </div>

          {/* Stiker Label Katalog Perpustakaan Kuno */}
          <div className="absolute top-2 left-2 bg-[#F5F5DC] text-[#2C1E16] text-[8px] font-mono font-bold px-1.5 py-0.5 -rotate-[15deg] shadow-[1px_1px_2px_#2C1E16] border border-[#2C1E16] flex flex-col items-center">
            <span className="border-b border-[#2C1E16] pb-[1px] mb-[1px]">VOL</span>
            <span className="font-serif">IV</span>
          </div>

          {/* Celah/Besi bergaya Sudut Logam Kuningan (Brass Corner) penahan perkamen */}
          <div className="absolute top-1/2 -right-3.5 transform -translate-y-1/2 w-6 h-14 border-[2.5px] border-[#2C1E16] z-20 shadow-[3px_3px_0px_#2C1E16] flex flex-col items-center justify-between py-2 -rotate-[3deg] rounded-sm bg-gradient-to-b from-[#C5A059] to-[#8B6508]">
            <div className="w-2 h-2 bg-[#2C1E16] rounded-full shadow-[inset_0.5px_0.5px_1px_#FFF5]" />
            <div className="w-2 h-2 bg-[#2C1E16] rounded-full shadow-[inset_0.5px_0.5px_1px_#FFF5]" />
          </div>

        </div>
      </div>
    </div>
  );
}
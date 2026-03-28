'use client';

import dynamic from 'next/dynamic';
import CollageElement from '@/components/CollageElement';
import ScatteredText from '@/components/ScatteredText';

const HoverMorphText = dynamic(() => import('@/components/HoverMorphText'), { ssr: false });
const DioramaLayer = dynamic(() => import('@/components/DioramaLayer'), { ssr: false });

export default function VisionSection() {
  return (
    <div className="relative overflow-hidden" style={{ height: '200vh' }}>
      {/* --- BACKGROUND LAYER --- */}
      <DioramaLayer speed={0.4} className="z-0" fadeOnScroll>
        <div className="absolute w-175 h-175 rounded-full opacity-6"
          style={{ top: '20%', left: '30%', background: 'radial-gradient(circle, rgba(196,149,106,0.2), transparent)', filter: 'blur(120px)' }} />

        <CollageElement
          src="/collage/compass.png"
          alt="Future"
          width={380}
          height={380}
          style={{ top: '18%', left: '25%', rotate: '-4deg', zIndex: 1 }}
          parallaxSpeed={0}
          animateFrom="scale"
          magnetic
        />
      </DioramaLayer>

      {/* --- MIDGROUND LAYER --- */}
      <DioramaLayer speed={1} className="z-5">
        <HoverMorphText
          text="WHAT'S NEXT"
          className="reveal-text"
          font="serif"
          weight={900}
          color="var(--foreground)"
          italicHover
          style={{
            position: 'absolute',
            top: '5%',
            left: '15%',
            rotate: '3deg',
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            zIndex: 5
          }}
        />

        <ScatteredText
          text="the future is unwritten code"
          style={{ top: '14%', right: '10%', rotate: '-3deg', fontSize: 'clamp(0.9rem, 1.5vw, 1.3rem)' }}
          font="sans"
          weight="300"
          italic
          color="var(--accent-warm)"
          animationType="fade"
        />

        <ScatteredText
          text="// TODO: change the world"
          style={{ top: '40%', left: '5%', rotate: '1deg', fontSize: 'clamp(0.7rem, 1.2vw, 1rem)' }}
          font="mono"
          color="var(--accent-sage)"
          animationType="typewriter"
        />

        <ScatteredText
          text="INFINITE"
          style={{ top: '48%', left: '20%', rotate: '-6deg', fontSize: 'clamp(5rem, 14vw, 12rem)' }}
          font="serif"
          weight="900"
          color="var(--accent-sepia)"
          animationType="glitch"
          zIndex={6}
        />

        <ScatteredText
          text="POSSIBILITIES"
          style={{ top: '55%', right: '5%', rotate: '8deg', fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          font="serif"
          weight="900"
          color="var(--accent-warm)"
          animationType="split"
          zIndex={5}
        />
      </DioramaLayer>

      {/* --- FOREGROUND LAYER --- */}
      <DioramaLayer speed={1.7} className="z-10">
        <CollageElement
          src="/collage/fragments-new.png"
          alt="Vision"
          width={250}
          height={250}
          style={{ top: '25%', right: '10%', rotate: '14deg', zIndex: 10, filter: 'blur(3px)' }}
          parallaxSpeed={0}
          animateFrom="right"
        />

        <CollageElement
          src="/collage/banana-plant.png"
          alt="Infinite banana"
          width={350} // Made slightly larger for deeper foreground feel
          height={350}
          style={{ top: '55%', left: '30%', rotate: '-20deg', zIndex: 11, filter: 'blur(1px)' }}
          parallaxSpeed={0}
          animateFrom="bottom"
        />
      </DioramaLayer>

      {/* Contact scattered */}
      <div className="absolute" style={{ top: '72%', left: 0, right: 0, height: '28%' }}>
        <ScatteredText
          text="LET'S CONNECT"
          style={{ top: '5%', left: '30%', rotate: '-2deg', fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          font="serif"
          weight="700"
          color="var(--accent-cream)"
          animationType="split"
          zIndex={5}
        />

        {/* USB Flash Drive CV Download */}
        {/* <div className="absolute z-20" style={{ top: '15%', right: '10%' }}>
          <div className="scale-75 md:scale-100 origin-center">
            <UsbDriveDownload />
          </div>
        </div> */}

        <ScatteredText
          text="andhiekaagrestya.netlify.app"
          style={{ top: '30%', left: '20%', rotate: '3deg', fontSize: 'clamp(1rem, 2.5vw, 2rem)' }}
          font="mono"
          color="var(--accent-warm)"
          animationType="typewriter"
          zIndex={4}
        />

        <ScatteredText
          text="github.com/andhiekaagrestya"
          style={{ top: '45%', right: '15%', rotate: '-4deg', fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}
          font="mono"
          color="var(--accent-sage)"
          animationType="typewriter"
          zIndex={4}
        />

        <ScatteredText
          text="@agresstya"
          style={{ top: '60%', left: '45%', rotate: '6deg', fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}
          font="mono"
          color="var(--accent-rust)"
          animationType="typewriter"
          zIndex={4}
        />

        <CollageElement
          src="/collage/typewriter.png"
          alt="Final"
          width={200}
          height={200}
          style={{ top: '20%', left: '5%', rotate: '25deg', zIndex: 1 }}
          parallaxSpeed={0.3}
          animateFrom="left"
        />

        <CollageElement
          src="/collage/books.png"
          alt="Final books"
          width={280}
          height={280}
          style={{ top: '40%', right: '5%', rotate: '-15deg', zIndex: 1 }}
          parallaxSpeed={0.5}
          animateFrom="right"
        />
      </div>

      {/* Final fade-out text */}
      <ScatteredText
        text="© Andhieka Agrestya 2026"
        style={{ bottom: '2%', left: '40%', rotate: '0deg', fontSize: 'clamp(0.6rem, 0.8vw, 0.8rem)' }}
        font="mono"
        color="rgba(212,197,169,0.3)"
        animationType="fade"
      />
    </div>
  );
}

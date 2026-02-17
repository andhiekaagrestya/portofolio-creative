'use client';

export default function GrainOverlay() {
  return (
    <>
      {/* Old film grain */}
      <div className="grain-overlay" />
      {/* Vignette - dark projector edges */}
      <div className="film-vignette" />
      {/* Film scratches */}
      <div className="film-scratches" />
      {/* Warm light leak */}
      <div className="film-lightleak" />
    </>
  );
}

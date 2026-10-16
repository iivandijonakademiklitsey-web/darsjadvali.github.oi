import React from 'react';

export const OceanSunsetBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Image with TV Ocean Sway Animation */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ocean-sway-layer"
        style={{
          backgroundImage: "url('/src/assets/images/ocean_sunset_waves_1792155951902.jpg')",
          willChange: 'transform',
        }}
      />

      {/* 2. Animated Water Ripple / Wave Sway Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 ocean-wave-shimmer opacity-35" />

      {/* 3. Golden Sunset Ray Warmth & Atmospheric Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071923]/92 via-[#0b2a3a]/75 to-[#0b2a3a]/65" />

      {/* 4. Cinematic TV Vignette (Dark curved corners like a premium TV display) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(4, 15, 23, 0.75) 100%)',
        }}
      />
    </div>
  );
};

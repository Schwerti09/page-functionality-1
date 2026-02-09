import React from 'react';

export const StarField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute inset-0 bg-slate-950"></div>
    <div 
      className="absolute top-0 left-0 w-full h-full from-indigo-900/40 via-slate-950 to-slate-950"
      style={{ backgroundImage: 'radial-gradient(ellipse at top, var(--tw-gradient-stops))' }}
    ></div>
    {/* Grid Overlay */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)'
      }}
    ></div>
  </div>
);

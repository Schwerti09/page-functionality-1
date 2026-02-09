import React from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  className?: string;
}

export const GlowButton = ({ children, primary = false, onClick, className = "" }: GlowButtonProps) => (
  <button 
    onClick={onClick}
    className={`relative group px-8 py-4 rounded-lg font-mono font-bold tracking-wider uppercase transition-all duration-300 ${
      primary 
        ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]' 
        : 'bg-transparent border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-white hover:bg-slate-800/50'
    } ${className}`}
  >
    <span className="relative z-10 flex items-center gap-2 justify-center">{children}</span>
    {primary && <div className="absolute inset-0 rounded-lg bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>}
  </button>
);

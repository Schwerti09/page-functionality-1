import React from 'react';

interface StatProps {
  val: string;
  label: string;
}

export const Stat = ({ val, label }: StatProps) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{val}</div>
    <div className="text-xs font-mono text-cyan-500 uppercase tracking-widest">{label}</div>
  </div>
);

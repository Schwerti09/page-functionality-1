import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const FeatureCard = ({ icon: Icon, title, desc }: FeatureCardProps) => (
  <div className="group relative p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-500/50 transition-all duration-500">
        <Icon className="w-7 h-7 text-cyan-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 font-mono">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

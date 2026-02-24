import React from 'react';
import { Zap, Download, Plus } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onAdd: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onAdd }) => {
  return (
    <header className="bg-brand-dark/80 backdrop-blur-xl border-b border-brand-border sticky top-0 z-40 px-6 py-5">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-neon/10 rounded-xl flex items-center justify-center border border-brand-neon/20 neon-glow">
            <Zap className="w-6 h-6 text-brand-neon" />
          </div>
          <div>
            <h1 className="text-xl font-display font-extrabold text-white tracking-tight">
              PHYSIO<span className="text-brand-neon">CORE</span>
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Performance & Recovery Lab
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button 
            onClick={onExport}
            className="p-2 sm:p-2.5 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-neon/50 transition-all text-slate-400 hover:text-brand-neon"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={onAdd}
            className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-brand-neon text-brand-dark font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-neon/20"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden xs:inline">REGISTRAR</span>
          </button>
        </div>
      </div>
    </header>
  );
};

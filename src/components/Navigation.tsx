import React from 'react';
import { LayoutDashboard, History, BookOpen, FolderOpen } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  activeTab: 'dashboard' | 'history' | 'education' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'history' | 'education' | 'reports') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Painel' },
    { id: 'history', icon: History, label: 'Evolução' },
    { id: 'reports', icon: FolderOpen, label: 'Pasta' },
    { id: 'education', icon: BookOpen, label: 'Lab' }
  ] as const;

  return (
    <nav className="flex bg-brand-surface p-1.5 rounded-2xl border border-brand-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
            activeTab === tab.id 
              ? "bg-brand-border text-brand-neon shadow-inner" 
              : "text-slate-500 hover:text-slate-300"
          )}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

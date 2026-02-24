import React, { useMemo } from 'react';
import { Activity, Zap, BrainCircuit, TrendingUp, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { format, parseISO } from 'date-fns';
import { IntensityChart } from './IntensityChart';
import { SymptomLog } from '../types';

interface DashboardProps {
  logs: SymptomLog[];
  chartData: any[];
  isAnalyzing: boolean;
  analysis: string | null;
  onAnalyze: () => void;
  onArchive: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  logs, 
  chartData, 
  isAnalyzing, 
  analysis, 
  onAnalyze,
  onArchive
}) => {
  const regionCharts = useMemo(() => {
    const regionData: Record<string, { date: string; intensity: number }[]> = {};

    // Group logs by region
    [...logs].reverse().forEach(log => {
      log.selectedRegions.forEach(region => {
        if (!regionData[region.name]) {
          regionData[region.name] = [];
        }
        regionData[region.name].push({
          date: format(parseISO(log.date), 'dd/MM'),
          intensity: log.intensity
        });
      });
    });

    // Filter regions with at least 2 logs
    return Object.entries(regionData)
      .filter(([_, data]) => data.length >= 2)
      .map(([name, data]) => ({ name, data }));
  }, [logs]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500">Intensidade Geral</h2>
            <Activity className="w-4 h-4 text-brand-neon" />
          </div>
          <div className="h-48 w-full">
            <IntensityChart data={chartData} />
          </div>
        </section>

        <section className="bg-brand-neon p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-brand-dark font-mono text-xs uppercase tracking-widest font-bold mb-2">Status do Lab</h2>
            <p className="text-brand-dark text-2xl font-display font-extrabold leading-tight">
              {logs.length < 3 
                ? "Continue registrando para desbloquear análise." 
                : "Padrões identificados. Pronto para análise."}
            </p>
          </div>
          <button 
            onClick={onAnalyze}
            disabled={isAnalyzing || logs.length < 3}
            className="relative z-10 mt-6 w-full py-4 bg-brand-dark text-brand-neon rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-brand-neon border-t-transparent rounded-full animate-spin" />
            ) : (
              <BrainCircuit className="w-5 h-5" />
            )}
            {analysis ? 'RE-ANALISAR' : 'GERAR ANÁLISE'}
          </button>
          <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-brand-dark/5 group-hover:scale-110 transition-transform" />
        </section>
      </div>

      {regionCharts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-brand-neon" />
            <h2 className="text-lg font-display font-bold text-white">Progressão por Região</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regionCharts.map((region) => (
              <div key={region.name} className="glass-card p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{region.name}</h3>
                  <span className="text-[10px] font-mono text-slate-500">{region.data.length} registros</span>
                </div>
                <div className="h-32 w-full">
                  <IntensityChart data={region.data} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {analysis && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl border-brand-neon/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-brand-neon" />
                <h2 className="text-lg font-display font-bold text-white">Relatório de Percepção</h2>
              </div>
              <button 
                onClick={onArchive}
                disabled={!analysis}
                className="flex items-center gap-2 px-4 py-2 bg-brand-neon/10 border border-brand-neon/20 rounded-xl text-[10px] font-mono font-bold text-brand-neon hover:bg-brand-neon/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FolderPlus className="w-4 h-4" />
                <span className="hidden xs:inline">ARQUIVAR NA PASTA</span>
                <span className="xs:hidden">ARQUIVAR</span>
              </button>
            </div>
            <div className="prose prose-invert prose-brand max-w-none text-slate-400 leading-relaxed font-sans">
              <Markdown>{analysis}</Markdown>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

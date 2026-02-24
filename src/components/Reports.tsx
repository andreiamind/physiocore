import React, { useState } from 'react';
import { FolderOpen, Calendar, ChevronRight, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SavedReport } from '../types';

interface ReportsProps {
  reports: SavedReport[];
  onDelete: (id: string) => void;
}

export const Reports: React.FC<ReportsProps> = ({ reports, onDelete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (reports.length === 0) {
    return (
      <div className="glass-card p-12 rounded-[2.5rem] text-center space-y-4">
        <div className="w-16 h-16 bg-brand-border rounded-2xl flex items-center justify-center mx-auto">
          <FolderOpen className="w-8 h-8 text-slate-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-display font-bold text-white">Pasta Vazia</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Suas análises e registros arquivados aparecerão aqui.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <FolderOpen className="w-5 h-5 text-brand-neon" />
        <h2 className="text-lg font-display font-bold text-white">Pasta de Análises</h2>
      </div>

      {reports.map((report) => (
        <div key={report.id} className="glass-card rounded-3xl overflow-hidden">
          <div 
            onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
            className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-neon/10 rounded-2xl flex items-center justify-center border border-brand-neon/20">
                <FileText className="w-6 h-6 text-brand-neon" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase tracking-tight">
                  Relatório de Percepção
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
                  <Calendar className="w-3 h-3" />
                  {format(parseISO(report.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono bg-brand-border px-2 py-1 rounded-lg text-slate-400">
                {report.logs.length} REGISTROS
              </span>
              {expandedId === report.id ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedId === report.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-brand-border"
              >
                <div className="p-8 space-y-8">
                  <div className="prose prose-invert prose-brand max-w-none text-slate-400 leading-relaxed font-sans">
                    <Markdown>{report.analysis}</Markdown>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Registros Arquivados</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {report.logs.map((log) => (
                        <div key={log.id} className="bg-brand-dark/50 border border-brand-border p-4 rounded-2xl">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono text-brand-neon">{format(parseISO(log.date), 'dd/MM')}</span>
                            <span className="text-[10px] font-mono text-slate-500">{log.period}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {log.selectedRegions.map(r => (
                              <span key={r.name} className="text-[9px] bg-brand-border px-1.5 py-0.5 rounded text-slate-300">
                                {r.name}
                              </span>
                            ))}
                          </div>
                          <div className="grid grid-cols-1 gap-1 text-[8px] font-mono uppercase">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Melhora:</span>
                              <span className="text-emerald-500">{log.betterWith.slice(0, 2).join(', ') || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Piora:</span>
                              <span className="text-red-500">{log.worseWith.slice(0, 2).join(', ') || '-'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-brand-border flex justify-end">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(report.id);
                      }}
                      className="flex items-center gap-2 text-xs font-bold text-red-500/70 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      EXCLUIR RELATÓRIO
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

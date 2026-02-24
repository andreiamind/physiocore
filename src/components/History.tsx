import React from 'react';
import { History as HistoryIcon, Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { SymptomLog, INTENSITY_LEVELS } from '../types';
import { cn } from '../lib/utils';

interface HistoryProps {
  logs: SymptomLog[];
  onEdit: (log: SymptomLog) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const History: React.FC<HistoryProps> = ({ logs, onEdit, onDelete, onAdd }) => {
  if (logs.length === 0) {
    return (
      <div className="glass-card p-12 rounded-3xl text-center space-y-4 border-dashed">
        <div className="w-16 h-16 bg-brand-border rounded-full flex items-center justify-center mx-auto">
          <HistoryIcon className="w-8 h-8 text-slate-600" />
        </div>
        <div className="space-y-1">
          <p className="text-white font-bold">Nenhum registro ainda</p>
          <p className="text-xs text-slate-500">Seus registros de evolução aparecerão aqui após você registrar o primeiro.</p>
        </div>
        <button 
          onClick={onAdd}
          className="text-brand-neon text-xs font-bold uppercase tracking-widest hover:underline"
        >
          + Criar primeiro registro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="glass-card p-6 rounded-3xl group hover:border-brand-neon/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  {format(parseISO(log.date), "dd MMM yyyy")}
                </span>
                <span className="px-2 py-0.5 rounded bg-brand-border text-slate-400 text-[9px] font-bold uppercase">
                  {log.period}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  INTENSITY_LEVELS.find(p => p.value >= log.intensity)?.color
                )} />
                <h3 className="text-xl font-display font-bold text-white">Intensidade {log.intensity}</h3>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(log)}
                className="p-2 text-slate-600 hover:text-brand-neon transition-colors"
                title="Editar registro"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(log.id)} 
                className="p-2 text-slate-600 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {log.selectedRegions.map(r => (
                <div key={r.name} className="px-3 py-1.5 rounded-xl bg-brand-neon/5 border border-brand-neon/10 text-brand-neon text-[10px] font-bold">
                  {r.name}: {r.symptoms.join(', ')}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border">
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Relacionado a</p>
                <p className="text-xs text-slate-300">{log.relatedTo.join(', ') || 'Nenhum'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Melhora com</p>
                <p className="text-xs text-slate-300">{log.betterWith.join(', ') || 'Nenhum'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest">Piora com</p>
                <p className="text-xs text-slate-300">{log.worseWith.join(', ') || 'Nenhum'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border">
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Estado Emocional</p>
                <p className="text-xs text-slate-300">{log.emotions.join(', ') || 'Nenhum'}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

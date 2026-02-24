import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { 
  SymptomLog, 
  PERIODS, 
  INTENSITY_LEVELS, 
  BODY_MAP, 
  RELATED_TO,
  BETTER_WITH,
  WORSE_WITH,
  COMMON_EMOTIONS 
} from '../types';
import { cn } from '../lib/utils';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: Partial<SymptomLog>) => void;
  editingLog?: Partial<SymptomLog> | null;
}

export const LogModal: React.FC<LogModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingLog 
}) => {
  const initialData: Partial<SymptomLog> = {
    date: new Date().toISOString().split('T')[0],
    period: 'Manhã',
    intensity: 0,
    selectedRegions: [],
    relatedTo: [],
    betterWith: [],
    worseWith: [],
    emotions: [],
    notes: ''
  };

  const [formData, setFormData] = useState<Partial<SymptomLog>>(editingLog || initialData);
  const [activeRegionIndex, setActiveRegionIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(editingLog || initialData);
      setActiveRegionIndex(null);
    }
  }, [isOpen, editingLog]);

  const toggleRegionSymptom = (regionName: string, symptom: string) => {
    const currentRegions = [...(formData.selectedRegions || [])];
    const regionIdx = currentRegions.findIndex(r => r.name === regionName);

    if (regionIdx === -1) {
      currentRegions.push({ name: regionName, symptoms: [symptom] });
    } else {
      const symptoms = currentRegions[regionIdx].symptoms;
      if (symptoms.includes(symptom)) {
        currentRegions[regionIdx].symptoms = symptoms.filter(s => s !== symptom);
        if (currentRegions[regionIdx].symptoms.length === 0) {
          currentRegions.splice(regionIdx, 1);
        }
      } else {
        currentRegions[regionIdx].symptoms.push(symptom);
      }
    }
    setFormData({ ...formData, selectedRegions: currentRegions });
  };

  const toggleSimpleItem = (list: string[], item: string, key: keyof SymptomLog) => {
    const newList = list.includes(item) 
      ? list.filter(i => i !== item) 
      : [...list, item];
    setFormData({ ...formData, [key]: newList });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl bg-brand-surface rounded-3xl sm:rounded-[2.5rem] border border-brand-border shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col"
          >
            <div className="p-6 sm:p-8 border-b border-brand-border flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  {editingLog ? 'EDITAR REGISTRO' : 'NOVO REGISTRO'}
                </h2>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Sincronização de Dados</p>
              </div>
              <button onClick={onClose} className="p-2 sm:p-3 bg-brand-border rounded-xl sm:rounded-2xl hover:text-white transition-all">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 sm:space-y-10 flex-1 custom-scrollbar">
              {/* Meta Row */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Data</label>
                  <input 
                    type="date" value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-brand-dark border border-brand-border rounded-2xl p-4 text-sm outline-none focus:border-brand-neon transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Período</label>
                  <div className="flex bg-brand-dark p-1 rounded-2xl border border-brand-border">
                    {PERIODS.map(p => (
                      <button
                        key={p}
                        onClick={() => setFormData({...formData, period: p as any})}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-[10px] font-bold transition-all",
                          formData.period === p ? "bg-brand-border text-brand-neon" : "text-slate-500"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Intensity */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Intensidade</label>
                  <span className={cn(
                    "text-3xl font-display font-black",
                    INTENSITY_LEVELS.find(p => p.value >= (formData.intensity || 0))?.color.replace('bg-', 'text-')
                  )}>
                    {formData.intensity}
                  </span>
                </div>
                <div className="relative h-2 bg-brand-dark rounded-full border border-brand-border overflow-hidden">
                  <motion.div 
                    className={cn("h-full", INTENSITY_LEVELS.find(p => p.value >= (formData.intensity || 0))?.color)}
                    animate={{ width: `${(formData.intensity || 0) * 10}%` }}
                  />
                  <input 
                    type="range" min="0" max="10" step="1"
                    value={formData.intensity}
                    onChange={(e) => setFormData({...formData, intensity: parseInt(e.target.value)})}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Interactive Body Map */}
              <div className="space-y-4">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Mapa do Sintoma (Selecione a Região)</label>
                <div className="space-y-3">
                  {BODY_MAP.map((region, idx) => {
                    const isSelected = formData.selectedRegions?.some(r => r.name === region.region);
                    const activeRegion = formData.selectedRegions?.find(r => r.name === region.region);
                    
                    return (
                      <div key={region.region} className="space-y-2">
                        <button
                          onClick={() => setActiveRegionIndex(activeRegionIndex === idx ? null : idx)}
                          className={cn(
                            "w-full p-5 rounded-2xl border transition-all flex items-center justify-between group",
                            isSelected 
                              ? "bg-brand-neon/5 border-brand-neon/30" 
                              : "bg-brand-dark border-brand-border hover:border-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-2 h-2 rounded-full transition-all",
                              isSelected ? "bg-brand-neon neon-glow" : "bg-slate-700"
                            )} />
                            <span className={cn("font-bold text-sm", isSelected ? "text-white" : "text-slate-400")}>{region.region}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {activeRegion && (
                              <span className="text-[10px] text-brand-neon font-mono">{activeRegion.symptoms.length} selecionados</span>
                            )}
                            <ChevronRight className={cn("w-4 h-4 transition-transform", activeRegionIndex === idx && "rotate-90")} />
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {activeRegionIndex === idx && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-brand-dark/50 rounded-2xl border border-brand-border p-4"
                            >
                              <div className="grid grid-cols-1 gap-2">
                                {region.options.map(opt => (
                                  <button
                                    key={opt}
                                    onClick={() => toggleRegionSymptom(region.region, opt)}
                                    className={cn(
                                      "w-full p-3 rounded-xl text-left text-xs flex items-center justify-between transition-all",
                                      activeRegion?.symptoms.includes(opt)
                                        ? "bg-brand-neon text-brand-dark font-bold"
                                        : "text-slate-500 hover:bg-brand-border"
                                    )}
                                  >
                                    {opt}
                                    {activeRegion?.symptoms.includes(opt) && <CheckCircle2 className="w-4 h-4" />}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contextual Data */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Relacionado a</label>
                    <div className="flex flex-wrap gap-2">
                      {RELATED_TO.map(item => (
                        <button
                          key={item}
                          onClick={() => toggleSimpleItem(formData.relatedTo || [], item, 'relatedTo')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all",
                            formData.relatedTo?.includes(item) 
                              ? "bg-white text-brand-dark border-white" 
                              : "bg-brand-dark border-brand-border text-slate-500"
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Melhora com</label>
                    <div className="flex flex-wrap gap-2">
                      {BETTER_WITH.map(item => (
                        <button
                          key={item}
                          onClick={() => toggleSimpleItem(formData.betterWith || [], item, 'betterWith')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all",
                            formData.betterWith?.includes(item) 
                              ? "bg-emerald-500 text-white border-emerald-500" 
                              : "bg-brand-dark border-brand-border text-slate-500"
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Piora com</label>
                    <div className="flex flex-wrap gap-2">
                      {WORSE_WITH.map(item => (
                        <button
                          key={item}
                          onClick={() => toggleSimpleItem(formData.worseWith || [], item, 'worseWith')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all",
                            formData.worseWith?.includes(item) 
                              ? "bg-red-500 text-white border-red-500" 
                              : "bg-brand-dark border-brand-border text-slate-500"
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Emoções</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_EMOTIONS.map(e => (
                      <button
                        key={e}
                        onClick={() => toggleSimpleItem(formData.emotions || [], e, 'emotions')}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-bold border transition-all",
                          formData.emotions?.includes(e) 
                            ? "bg-white text-brand-dark border-white" 
                            : "bg-brand-dark border-brand-border text-slate-500"
                        )}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Observações</label>
                <textarea 
                  placeholder="Algum detalhe extra?"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-brand-dark border border-brand-border rounded-2xl p-4 text-sm outline-none focus:border-brand-neon transition-all min-h-[100px]"
                />
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-brand-dark border-t border-brand-border">
              <button 
                onClick={() => onSave(formData)}
                className="w-full bg-brand-neon text-brand-dark py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand-neon/20"
              >
                SALVAR REGISTRO
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { Thermometer, Zap, Clock, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Education: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const items = [
    { 
      title: "Gelo ou Calor?", 
      icon: Thermometer,
      color: "text-blue-400",
      short: "Saiba qual usar para aliviar seus sintomas.",
      content: `
        **Gelo (Crioterapia):** Use em pancadas recentes, inchaços ou inflamações agudas. O tempo ideal é de 15 a 20 minutos.
        
        **Calor (Termoterapia):** Ideal para tensões musculares antigas, rigidez ou para relaxar antes de dormir. Também por 15 a 20 minutos.
        
        *Dica: Sempre proteja a pele com um pano fino para evitar queimaduras.*
      `
    },
    { 
      title: "O Mito do Repouso", 
      icon: Zap,
      color: "text-orange-400",
      short: "Por que ficar parado nem sempre é a solução.",
      content: `
        Ficar parado demais pode "enferrujar" suas articulações e enfraquecer os músculos. 
        
        O movimento leve e orientado pelo seu fisioterapeuta ajuda na circulação e acelera a cicatrização dos tecidos.
        
        *Regra de ouro: Movimento é vida, mas respeite sempre o limite da dor aguda.*
      `
    },
    { 
      title: "Pausas Inteligentes", 
      icon: Clock,
      color: "text-brand-neon",
      short: "Pequenas mudanças que salvam seu dia.",
      content: `
        Nosso corpo não foi feito para ficar na mesma posição por 8 horas seguidas. 
        
        Tente levantar, espreguiçar ou simplesmente mudar a posição da cadeira a cada 1 hora. 
        
        *Dica: Use o alarme do celular para lembrar de "resetar" sua postura e dar um alívio aos seus tecidos.*
      `
    },
    { 
      title: "A Lógica da Dor", 
      icon: Search,
      color: "text-purple-400",
      short: "Entenda por que seu sintoma muda de horário.",
      content: `
        Nada é por acaso! Entender o comportamento da dor ajuda muito no seu tratamento:
        
        **Dor ao acordar:** Geralmente ligada a processos inflamatórios ou posições ao dormir. O corpo está "frio" e rígido.
        
        **Dor que aumenta no dia:** Geralmente ligada à sobrecarga, cansaço ou esforço repetitivo.
        
        *Anotar esses horários aqui no app ajuda seu fisioterapeuta a descobrir a causa real do problema.*
      `
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Zap className="w-5 h-5 text-brand-neon" />
        <h2 className="text-lg font-display font-bold text-white">Laboratório de Conhecimento</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, i) => (
          <div key={i} className="glass-card rounded-3xl overflow-hidden">
            <button 
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-brand-dark flex items-center justify-center border border-brand-border ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white uppercase tracking-tight">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.short}</p>
                </div>
              </div>
              {expandedIndex === i ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>

            <AnimatePresence>
              {expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-brand-border"
                >
                  <div className="p-6 text-sm text-slate-400 leading-relaxed whitespace-pre-line font-sans">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-center text-slate-600 font-mono uppercase tracking-widest pt-4">
        Conteúdo educativo. Não substitui consulta profissional.
      </p>
    </div>
  );
};

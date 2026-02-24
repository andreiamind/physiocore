export interface RegionSymptom {
  region: string;
  options: string[];
}

export interface SymptomLog {
  id: string;
  date: string;
  period: 'Manhã' | 'Tarde' | 'Noite' | 'Madrugada' | 'Dor constante';
  intensity: number;
  selectedRegions: {
    name: string;
    symptoms: string[];
  }[];
  relatedTo: string[];
  betterWith: string[];
  worseWith: string[];
  emotions: string[];
  notes: string;
}

export interface SavedReport {
  id: string;
  date: string;
  analysis: string;
  logs: SymptomLog[];
}

export const PERIODS = ['Manhã', 'Tarde', 'Noite', 'Madrugada', 'Dor constante'];

export const BODY_MAP: RegionSymptom[] = [
  { region: 'Cabeça', options: ['Enxaqueca', 'Pressão', 'Tontura', 'Sensibilidade à luz', 'Dor frontal', 'Dor posterior', 'Dor nas laterais'] },
  { region: 'Face', options: ['Dor na mandíbula (ATM)', 'Tensão facial', 'Sinusite', 'Zumbido no ouvido'] },
  { region: 'Cervical (Pescoço)', options: ['Torcicolo', 'Dor de cabeça', 'Peso nos ombros', 'Irradiação p/ braços', 'Dor central', 'Dor muscular'] },
  { region: 'Ombros', options: ['Dor ao levantar', 'Fraqueza', 'Estalidos', 'Dificuldade p/ dormir', 'Dor em trapézio', 'Dor pontual'] },
  { region: 'Torácica (região média da coluna)', options: ['Pontada ao respirar', 'Rigidez', 'Queimação entre as escápulas', 'Dor nas costelas', 'Dor na coluna', 'Dor muscular', 'Desconforto pulmonar'] },
  { region: 'Lombar (região final da coluna)', options: ['Travamento', 'Irradiação p/ pernas', 'Dor em barra', 'Dor em um dos lados', 'Rins', 'Dor na coluna', 'Dor muscular'] },
  { region: 'Abdome', options: ['Inchaço', 'Cólica', 'Peso', 'Desconforto digestivo', 'Desconforto em algum órgão específico'] },
  { region: 'Braços / Mãos', options: ['Formigamento', 'Falta de força', 'Inchaço', 'Choque', 'Dor'] },
  { region: 'Quadril', options: ['Dor ao caminhar', 'Rigidez matinal', 'Estalido ao mover', 'Dor em alguns movimentos'] },
  { region: 'Coxa', options: ['Região Anterior', 'Região Posterior', 'Região Lateral', 'Região Medial', 'Dor Profunda', 'Dor Superficial', 'Queimação'] },
  { region: 'Joelhos', options: ['Inchaço', 'Instabilidade', 'Dor ao subir escada', 'Bloqueio', 'Região Anterior', 'Região Posterior', 'Região Medial', 'Região Lateral'] },
  { region: 'Perna', options: ['Região Anterior', 'Região Posterior', 'Região Lateral', 'Região Medial', 'Dor Profunda', 'Dor Superficial', 'Queimação'] },
  { region: 'Pés / Tornozelos', options: ['Dor ao pisar', 'Rigidez', 'Inchaço', 'Câimbra', 'Sola do pé', 'Dorso do pé', 'Atrás do calcâneo'] },
];

export const INTENSITY_LEVELS = [
  { value: 0, label: 'Zen', color: 'bg-slate-800' },
  { value: 2, label: 'Leve', color: 'bg-emerald-500' },
  { value: 4, label: 'Ok', color: 'bg-yellow-400' },
  { value: 6, label: 'Atenção', color: 'bg-orange-500' },
  { value: 8, label: 'Forte', color: 'bg-red-500' },
  { value: 10, label: 'Crítico', color: 'bg-purple-600' },
];

export const COMMON_SYMPTOMS = [
  'Rigidez', 'Pontada', 'Queimação', 'Formigamento', 'Fraqueza', 'Inchaço', 'Tensão'
];

export const RELATED_TO = [
  'Trabalho', 'Sono', 'Estresse', 'Atividade Física', 'Alimentação', 'Postura Mantida', 'Clima/Frio'
];

export const BETTER_WITH = [
  'Repouso', 'Movimento Leve', 'Gelo', 'Calor', 'Alongamento', 'Massagem', 'Medicação', 'Sono'
];

export const WORSE_WITH = [
  'Ficar em pé', 'Ficar sentado', 'Carregar peso', 'Movimentos rápidos', 'Esforço repetitivo', 'Subir escadas', 'Ao tossir/espirrar'
];

export const COMMON_EMOTIONS = [
  'Estresse', 'Ansiedade', 'Calma', 'Cansaço', 'Irritação', 'Tristeza', 'Alegria'
];

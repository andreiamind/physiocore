import { format } from 'date-fns';
import { SymptomLog } from '../types';

export const exportReport = (logs: SymptomLog[]) => {
  const reportTitle = `Physio_Report_${format(new Date(), 'yyyy_MM_dd')}.txt`;
  const content = logs.map(l => (
    `DATA: ${l.date} | PERÍODO: ${l.period}\n` +
    `INTENSIDADE: ${l.intensity}/10\n` +
    `REGIÕES:\n${l.selectedRegions.map(r => `  - ${r.name}: ${r.symptoms.join(', ')}`).join('\n')}\n` +
    `RELACIONADO A: ${l.relatedTo.join(', ')}\n` +
    `MELHORA COM: ${l.betterWith.join(', ')}\n` +
    `PIORA COM: ${l.worseWith.join(', ')}\n` +
    `EMOÇÕES: ${l.emotions.join(', ')}\n` +
    `NOTAS: ${l.notes}\n` +
    `====================================\n`
  )).join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = reportTitle;
  a.click();
  URL.revokeObjectURL(url);
};

import { useState, useEffect } from 'react';
import { SymptomLog, SavedReport } from '../types';

export function useSymptomLogs() {
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [reports, setReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    const savedLogs = localStorage.getItem('physio_logs_v2');
    const savedReports = localStorage.getItem('physio_reports_v2');
    
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to load logs", e);
      }
    }

    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error("Failed to load reports", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('physio_logs_v2', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('physio_reports_v2', JSON.stringify(reports));
  }, [reports]);

  const addLog = (newLog: Partial<SymptomLog>) => {
    const log: SymptomLog = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      date: newLog.date || new Date().toISOString().split('T')[0],
      period: (newLog.period as any) || 'Manhã',
      intensity: newLog.intensity ?? 0,
      selectedRegions: newLog.selectedRegions || [],
      relatedTo: newLog.relatedTo || [],
      betterWith: newLog.betterWith || [],
      worseWith: newLog.worseWith || [],
      emotions: newLog.emotions || [],
      notes: newLog.notes || ''
    };
    setLogs(prev => [log, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
  };

  const updateLog = (id: string, updatedData: Partial<SymptomLog>) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, ...updatedData } as SymptomLog : l));
  };

  const deleteLog = (id: string) => {
    if (confirm('Deseja excluir este registro?')) {
      setLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const archiveAnalysis = (analysis: string, logsToArchive: SymptomLog[]) => {
    if (!analysis || logsToArchive.length === 0) return;

    const newReport: SavedReport = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      date: new Date().toISOString(),
      analysis,
      logs: [...logsToArchive]
    };

    setReports(prev => [newReport, ...prev]);
    
    // Remove archived logs from active logs
    const archivedIds = new Set(logsToArchive.map(l => l.id));
    setLogs(prev => prev.filter(l => !archivedIds.has(l.id)));
  };

  const deleteReport = (id: string) => {
    if (confirm('Deseja excluir este relatório arquivado?')) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  return { logs, reports, addLog, updateLog, deleteLog, archiveAnalysis, deleteReport };
}

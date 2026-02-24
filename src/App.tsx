/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { FolderOpen } from 'lucide-react';

import { SymptomLog } from './types';
import { analyzePatterns } from './services/geminiService';
import { useSymptomLogs } from './hooks/useSymptomLogs';
import { exportReport } from './lib/report';

// Components
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Education } from './components/Education';
import { Reports } from './components/Reports';
import { LogModal } from './components/LogModal';

export default function App() {
  const { logs, reports, addLog, updateLog, deleteLog, archiveAnalysis, deleteReport } = useSymptomLogs();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingLog, setEditingLog] = useState<SymptomLog | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(() => {
    return localStorage.getItem('physio_analysis_v2');
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'education' | 'reports'>('dashboard');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAnalyze = async () => {
    if (analysis && logs.length > 0) {
      const proceed = confirm('Você já tem uma análise ativa. Deseja gerar uma nova e descartar a atual? (Dica: arquive a atual na pasta primeiro se quiser guardá-la)');
      if (!proceed) return;
    }

    setIsAnalyzing(true);
    const result = await analyzePatterns(logs);
    setAnalysis(result);
    if (result) {
      localStorage.setItem('physio_analysis_v2', result);
    }
    setIsAnalyzing(false);
  };

  const handleArchive = () => {
    if (analysis && logs.length > 0) {
      archiveAnalysis(analysis, logs);
      setAnalysis(null);
      localStorage.removeItem('physio_analysis_v2');
      
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Navigate to reports
      setActiveTab('reports');
    } else {
      alert('Não há análise ou registros para arquivar.');
    }
  };

  const chartData = useMemo(() => {
    return [...logs]
      .reverse()
      .slice(-10) 
      .map(log => ({
        date: format(parseISO(log.date), 'dd/MM'),
        intensity: log.intensity,
      }));
  }, [logs]);

  const onSaveLog = (data: Partial<SymptomLog>) => {
    if (editingLog) {
      updateLog(editingLog.id, data);
    } else {
      addLog(data);
    }
    setIsAdding(false);
    setEditingLog(null);
  };

  const onEditLog = (log: SymptomLog) => {
    setEditingLog(log);
    setIsAdding(true);
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-24 text-slate-300">
      <Header 
        onExport={() => exportReport(logs)} 
        onAdd={() => setIsAdding(true)} 
      />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'dashboard' && (
          <Dashboard 
            logs={logs}
            chartData={chartData}
            isAnalyzing={isAnalyzing}
            analysis={analysis}
            onAnalyze={handleAnalyze}
            onArchive={handleArchive}
          />
        )}

        {activeTab === 'history' && (
          <History 
            logs={logs}
            onEdit={onEditLog}
            onDelete={deleteLog}
            onAdd={() => setIsAdding(true)}
          />
        )}

        {activeTab === 'reports' && (
          <Reports 
            reports={reports}
            onDelete={deleteReport}
          />
        )}

        {activeTab === 'education' && <Education />}
      </main>

      <LogModal 
        key={editingLog?.id || 'new'}
        isOpen={isAdding}
        onClose={() => {
          setIsAdding(false);
          setEditingLog(null);
        }}
        onSave={onSaveLog}
        editingLog={editingLog}
      />

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-brand-neon text-brand-dark px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2"
          >
            <FolderOpen className="w-5 h-5" />
            Análise arquivada com sucesso!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

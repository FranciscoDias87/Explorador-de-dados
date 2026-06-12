import { useState, useEffect } from 'react';
import Header from './components/Header';
import StudyGuide from './components/StudyGuide';
import QuizGame from './components/QuizGame';
import InteractiveSandbox from './components/InteractiveSandbox';
import { AppTab, Badge } from './types';
import { Award, Sparkles, X, Info, ChevronRight, BarChart3, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('aprender');
  const [totalXP, setTotalXP] = useState<number>(() => {
    const saved = localStorage.getItem('explorador_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('explorador_badges');
    const initialBadges: Badge[] = [
      { id: 'first_step', titulo: 'Primeiro Passo', descricao: 'Explorou o laboratório ou começou o desafio de dados.', icone: 'Award', desbloqueado: false },
      { id: 'form_master', titulo: 'Mestre dos Formulários', descricao: 'Acertou as perguntas sobre estruturas de formulários digitais (Q2, Q4, Q5).', icone: 'ClipboardCheck', desbloqueado: false },
      { id: 'stats_conscious', titulo: 'Estatístico Consciente', descricao: 'Acertou as hipóteses e amostragem na análise de dados (Q3, Q6).', icone: 'Table', desbloqueado: false },
      { id: 'colab_magician', titulo: 'Mágico do Colab', descricao: 'Rodou todas as células do simulador ou resolveu o código Python (Q8, Q10).', icone: 'Terminal', desbloqueado: false },
      { id: 'perfect_score', titulo: 'Cientista Supremo', descricao: 'Gabaritou o desafio escolar, acertando 10 de 10 perguntas.', icone: 'Trophy', desbloqueado: false },
    ];

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        return initialBadges.map(b => ({
          ...b,
          desbloqueado: !!parsed[b.id]
        }));
      } catch (e) {
        return initialBadges;
      }
    }
    return initialBadges;
  });

  // Achievement notification state
  const [toast, setToast] = useState<{ title: string; desc: string } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('explorador_xp', String(totalXP));
  }, [totalXP]);

  useEffect(() => {
    const statusMap = badges.reduce((acc, curr) => {
      acc[curr.id] = curr.desbloqueado;
      return acc;
    }, {} as Record<string, boolean>);
    localStorage.setItem('explorador_badges', JSON.stringify(statusMap));
  }, [badges]);

  // Handle XP Addition
  const addXP = (amount: number) => {
    setTotalXP(prev => prev + amount);
  };

  // Unlock Badge mechanism
  const unlockBadge = (badgeId: string) => {
    setBadges(prev => {
      const isAlreadyUnlocked = prev.find(b => b.id === badgeId)?.desbloqueado;
      if (isAlreadyUnlocked) return prev;

      // Unlocked! Let's display simple animation toast
      const updated = prev.map(b => {
        if (b.id === badgeId) {
          setToast({ title: b.titulo, desc: b.descricao });
          // Add massive XP bonus for achievements
          setTotalXP(x => x + 250);
          return { ...b, desbloqueado: true };
        }
        return b;
      });
      return updated;
    });
  };

  // Automatically hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const unlockedCount = badges.filter(b => b.desbloqueado).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900 leading-relaxed antialiased">
      
      {/* Dynamic Toast for achievements */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-500 p-4 text-white shadow-2xl flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white animate-pulse">
                <Award className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-yellow-100 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Conquista Desbloqueada! (+250 XP)
                </span>
                <h4 className="font-sans text-sm font-extrabold leading-none">{toast.title}</h4>
                <p className="text-[11px] text-amber-50 leading-snug">{toast.desc}</p>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-0">
        
        {/* Navigation & Header */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          totalXP={totalXP} 
          unlockedBadgesCount={unlockedCount} 
        />

        {/* Main Content Area */}
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'aprender' && (
                <StudyGuide 
                  onStartQuiz={() => setActiveTab('quiz')} 
                  onGoToLab={() => setActiveTab('laboratorio')} 
                  addXP={addXP} 
                />
              )}

              {activeTab === 'quiz' && (
                <QuizGame 
                  addXP={addXP} 
                  unlockBadge={unlockBadge} 
                  badges={badges} 
                />
              )}

              {activeTab === 'laboratorio' && (
                <InteractiveSandbox 
                  addXP={addXP} 
                  unlockBadge={unlockBadge} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer Educational Stamp */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl space-y-3">
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-500" />
            <span className="font-sans font-bold text-slate-600">Explorador de Dados Escolar</span>
            <span className="text-slate-350">|</span>
            <Database className="h-4 w-4 text-teal-500" />
            <span className="font-sans font-semibold text-slate-500">Google Colab & Forms Simulator</span>
          </div>
          <p className="max-w-xl mx-auto text-slate-400">
            Este aplicativo interativo apoia professores e estudantes no ensino de análise de dados, estatística básica, formulação científica e automação com planilhas. Feito com ❤️ para facilitar o aprendizado.
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-mono text-slate-400">
            <span>AMBIENTE SEGURO DE ESTUDO</span>
            <span>•</span>
            <span>100% OFFLINE & PERSISTENTE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

import { AppTab } from '../types';
import { BookOpen, Trophy, Terminal, Award, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  totalXP: number;
  unlockedBadgesCount: number;
}

export default function Header({ activeTab, setActiveTab, totalXP, unlockedBadgesCount }: HeaderProps) {
  const tabs = [
    { id: 'aprender', label: '1. Guia de Estudos', icon: BookOpen, color: 'text-emerald-500' },
    { id: 'quiz', label: '2. Desafio do Conhecimento', icon: Trophy, color: 'text-amber-500' },
    { id: 'laboratorio', label: '3. Lab Simulador', icon: Terminal, color: 'text-sky-500' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row md:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white shadow-md shadow-indigo-100">
            <Award className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold tracking-tight text-slate-800">
              Explorador de Dados
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Formulários e Google Colab
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-800 shadow-sm shadow-slate-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? tab.color : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-1.5 font-sans">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">XP</span>
            <span className="font-mono text-sm font-bold text-indigo-600">{totalXP}</span>
          </div>
          
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-1.5 font-sans">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="font-mono text-sm font-bold text-slate-700">{unlockedBadgesCount}/5</span>
          </div>
        </div>
      </div>
    </header>
  );
}

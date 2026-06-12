import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, CheckCircle2, XCircle, ChevronRight, HelpCircle, AlertCircle, RefreshCw, 
  Sparkles, Award, Lightbulb, Terminal, ArrowRight, Table, ToggleLeft, ClipboardCheck
} from 'lucide-react';
import { questions } from '../data/questions';
import { Question, Badge } from '../types';

interface QuizGameProps {
  addXP: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  badges: Badge[];
}

export default function QuizGame({ addXP, unlockBadge, badges }: QuizGameProps) {
  // Game states
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<Record<number, number>>({}); // tracks attempts per question
  const [correctAnswersList, setCorrectAnswersList] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  
  // Custom Interactive States for Q4 (Matchmaker)
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);
  const [selectedC, setSelectedC] = useState<string | null>(null);
  const [selectedD, setSelectedD] = useState<string | null>(null);

  // Custom Interactive States for Q5 (V ou F)
  const [vfAnswers, setVfAnswers] = useState<Record<number, 'V' | 'F' | null>>({
    0: null, // Statement 1 (Linear Scale)
    1: null, // Statement 2 (Paragraph easy to analyze - F)
    2: null, // Statement 3 (Multiple Choice restricts to 1 - V)
    3: null, // Statement 4 (Checkbox can mark plural - V)
    4: null, // Statement 5 (Each question has target aligned - V)
  });

  const question: Question = questions[currentIndex];

  // Helper when clicking an option
  const handleSelectOption = (key: string) => {
    if (isSubmitted) return;
    setSelectedOption(key);
  };

  // Submit Answer
  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;

    const isCorrect = selectedOption === question.respostaCorreta;
    const currentQuestionAttempt = attempts[question.id] || 0;
    
    // Save attempts
    setAttempts({
      ...attempts,
      [question.id]: currentQuestionAttempt + 1
    });

    setIsSubmitted(true);
    setCorrectAnswersList({
      ...correctAnswersList,
      [question.id]: isCorrect
    });

    if (isCorrect) {
      // Award XP
      const xpToAward = currentQuestionAttempt === 0 ? 100 : 40;
      addXP(xpToAward);

      // Check specific badges
      if (question.id === 1) {
        unlockBadge('first_step');
      }
    }
  };

  // Move to next question or complete
  const handleNext = () => {
    // Check key badges at intermediary levels
    checkIntermediaryBadges();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      
      // Reset temporary custom UIs
      setSelectedA(null);
      setSelectedB(null);
      setSelectedC(null);
      setSelectedD(null);
    } else {
      // Finish quiz entirely
      setQuizFinished(true);
      unlockBadge('quiz_completo');
      
      // Calculate final correct count
      const totalCorrect = Object.values(correctAnswersList).filter(Boolean).length;
      if (totalCorrect === questions.length) {
        unlockBadge('perfect_score');
      }
    }
  };

  const checkIntermediaryBadges = () => {
    // Formulário Perfeito (Q2, Q4, Q5)
    const formsCorrect = 
      correctAnswersList[2] && 
      correctAnswersList[4] && 
      correctAnswersList[5];
    if (formsCorrect) {
      unlockBadge('form_master');
    }

    // Mágico do Colab (Q8, Q10)
    const colabCorrect = 
      correctAnswersList[8] && 
      correctAnswersList[10];
    if (colabCorrect) {
      unlockBadge('colab_magician');
    }

    // Estatístico Consciente (Q3, Q6)
    const statsCorrect = 
      correctAnswersList[3] && 
      correctAnswersList[6];
    if (statsCorrect) {
      unlockBadge('stats_conscious');
    }
  };

  // Restart Quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAttempts({});
    setCorrectAnswersList({});
    setQuizFinished(false);
    setSelectedA(null);
    setSelectedB(null);
    setSelectedC(null);
    setSelectedD(null);
    setVfAnswers({
      0: null,
      1: null,
      2: null,
      3: null,
      4: null,
    });
  };

  // Synchronize Q4 Interactive selections to the question's matching choice format
  useEffect(() => {
    if (question.id === 4) {
      // Correct choice is: A-2, B-3, C-1, D-4 (Option A)
      if (selectedA === '2' && selectedB === '3' && selectedC === '1' && selectedD === '4') {
        setSelectedOption('A');
      } else if (selectedA || selectedB || selectedC || selectedD) {
        // If wrong arrangement or incomplete, let the user map it
        // Or let them choose the options directly.
      }
    }
  }, [selectedA, selectedB, selectedC, selectedD, question.id]);

  // Synchronize Q5 Interactive True/False selections to the correct option index
  useEffect(() => {
    if (question.id === 5) {
      // Sequence is: V, F, V, V, V (Option A)
      const allSelected = Object.values(vfAnswers).every((v) => v !== null);
      if (allSelected) {
        const seq = `${vfAnswers[0]}-${vfAnswers[1]}-${vfAnswers[2]}-${vfAnswers[3]}-${vfAnswers[4]}`;
        if (seq === 'V-F-V-V-V') {
          setSelectedOption('A');
        } else if (seq === 'V-V-F-V-V') {
          setSelectedOption('B');
        } else if (seq === 'F-F-V-F-V') {
          setSelectedOption('C');
        } else if (seq === 'V-F-F-V-F') {
          setSelectedOption('D');
        } else {
          setSelectedOption(null);
        }
      }
    }
  }, [vfAnswers, question.id]);

  // Total statistics for result page
  const correctCount = Object.values(correctAnswersList).filter(Boolean).length;
  const accuracyPercent = Math.round((correctCount / questions.length) * 100);

  // Quick Badge mapping helper
  const getBadgeIcon = (id: string) => {
    switch(id) {
      case 'first_step': return 'Award';
      case 'form_master': return 'ClipboardCheck';
      case 'stats_conscious': return 'Table';
      case 'colab_magician': return 'Terminal';
      case 'perfect_score': return 'Trophy';
      default: return 'Sparkles';
    }
  };

  return (
    <div className="space-y-6 py-4">
      
      {!quizFinished ? (
        <div className="mx-auto max-w-4xl space-y-6" id="active-quiz-container">
          
          {/* Top progress bar & difficulty */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Desafio Ativo
                </span>
                <span className="text-slate-300">•</span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  question.dificuldade === 'Fácil' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : question.dificuldade === 'Médio'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-rose-50 text-rose-700'
                }`}>
                  Nível {question.dificuldade}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 uppercase font-mono">
                  {question.categoria === 'AED' && '📊 Estatística & AED'}
                  {question.categoria === 'Formularios' && '📝 Formulários'}
                  {question.categoria === 'Planilhas' && '🟢 Planilhas'}
                  {question.categoria === 'Colab' && '🐍 Google Colab'}
                </span>
              </div>
              <h4 className="font-sans text-sm font-bold text-slate-700">
                Questão {currentIndex + 1} de {questions.length}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress visual bar */}
              <div className="h-2 w-32 sm:w-48 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <span className="font-mono text-xs font-bold text-slate-400">
                {Math.round(((currentIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Core Question Layout */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden">
            
            {/* Context (if any) */}
            {question.contexto && (
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center gap-3 text-xs font-medium text-slate-500">
                <HelpCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                <p>{question.contexto}</p>
              </div>
            )}

            {/* Question title */}
            <div className="p-6 md:p-8 space-y-6">
              <h2 className="font-sans text-lg md:text-xl font-bold text-slate-800 leading-snug">
                {question.pergunta}
              </h2>

              {/* SPECIAL INTERACTIVE WORKSPACE FOR INTERACTIVE QUESTIONS */}
              
              {/* Q4 Matchmaker Workspace */}
              {question.id === 4 && (
                <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 p-5 space-y-4">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5 font-mono uppercase">
                    <Sparkles className="h-3.5 w-3.5" /> Workspace Interativo: Faça as Associações!
                  </span>
                  <p className="text-xs text-slate-500">
                    Clique nas caixas abaixo para relacionar o <strong>Tipo de Pergunta</strong> com o seu <strong>Objetivo Principal</strong>, ou responda diretamente selecionando uma alternativa.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Left choices */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded-lg bg-white border border-slate-100 p-2.5">
                        <span className="font-bold text-slate-700">A. Múltipla Escolha</span>
                        <select 
                          id="match-select-a"
                          value={selectedA || ''} 
                          onChange={(e) => setSelectedA(e.target.value)}
                          disabled={isSubmitted}
                          className="rounded border border-slate-200 px-2 py-1 bg-white font-mono text-slate-600 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">Escolher...</option>
                          <option value="1">1. Avaliar concordância</option>
                          <option value="2">2. Escolher uma opção entre várias</option>
                          <option value="3">3. Permitir várias respostas</option>
                          <option value="4">4. Resposta objetiva e curta</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-white border border-slate-100 p-2.5">
                        <span className="font-bold text-slate-700">B. Caixa De Seleção</span>
                        <select 
                          id="match-select-b"
                          value={selectedB || ''} 
                          onChange={(e) => setSelectedB(e.target.value)}
                          disabled={isSubmitted}
                          className="rounded border border-slate-200 px-2 py-1 bg-white font-mono text-slate-600 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">Escolher...</option>
                          <option value="1">1. Avaliar concordância</option>
                          <option value="2">2. Escolher uma opção entre várias</option>
                          <option value="3">3. Permitir várias respostas</option>
                          <option value="4">4. Resposta objetiva e curta</option>
                        </select>
                      </div>
                    </div>

                    {/* Right choices */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded-lg bg-white border border-slate-100 p-2.5">
                        <span className="font-bold text-slate-700">C. Escala Linear</span>
                        <select 
                          id="match-select-c"
                          value={selectedC || ''} 
                          onChange={(e) => setSelectedC(e.target.value)}
                          disabled={isSubmitted}
                          className="rounded border border-slate-200 px-2 py-1 bg-white font-mono text-slate-600 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">Escolher...</option>
                          <option value="1">1. Avaliar concordância</option>
                          <option value="2">2. Escolher uma opção entre várias</option>
                          <option value="3">3. Permitir várias respostas</option>
                          <option value="4">4. Resposta objetiva e curta</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-white border border-slate-100 p-2.5">
                        <span className="font-bold text-slate-700">D. Resposta Curta</span>
                        <select 
                          id="match-select-d"
                          value={selectedD || ''} 
                          onChange={(e) => setSelectedD(e.target.value)}
                          disabled={isSubmitted}
                          className="rounded border border-slate-200 px-2 py-1 bg-white font-mono text-slate-600 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">Escolher...</option>
                          <option value="1">1. Avaliar concordância</option>
                          <option value="2">2. Escolher uma opção entre várias</option>
                          <option value="3">3. Permitir várias respostas</option>
                          <option value="4">4. Resposta objetiva e curta</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Q5 True/False Builder Workspace */}
              {question.id === 5 && (
                <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 p-5 space-y-4">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5 font-mono uppercase">
                    <ToggleLeft className="h-4 w-4" /> Simulador de V ou F: Teste as Sentenças!
                  </span>
                  <p className="text-xs text-slate-500">
                    Atribua Verdadeiro (V) ou Falso (F) para cada afirmação e veja qual alternativa ela constrói abaixo!
                  </p>

                  <div className="space-y-2">
                    {[
                      "Escala linear serve para medir grau de satisfação ou frequência.",
                      "Perguntas abertas por parágrafo são as melhores/mais fáceis de analisar em dados.",
                      "Em múltipla escolha, o participante só seleciona uma única opção.",
                      "Caixas de seleção servem para marcar mais de uma alternativa.",
                      "Cada pergunta do formulário precisa ter um objetivo claro e alinhado."
                    ].map((statement, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-white border border-slate-100 p-2.5 text-xs">
                        <span className="text-slate-600 leading-tight">
                          {idx + 1}. "{statement}"
                        </span>
                        <div className="flex gap-1 shrink-0">
                          <button
                            id={`vf-v-btn-${idx}`}
                            onClick={() => !isSubmitted && setVfAnswers({ ...vfAnswers, [idx]: 'V' })}
                            className={`px-3 py-1 rounded font-bold transition-all ${
                              vfAnswers[idx] === 'V'
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            V
                          </button>
                          <button
                            id={`vf-f-btn-${idx}`}
                            onClick={() => !isSubmitted && setVfAnswers({ ...vfAnswers, [idx]: 'F' })}
                            className={`px-3 py-1 rounded font-bold transition-all ${
                              vfAnswers[idx] === 'F'
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            F
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Realtime generated code string */}
                  <div className="flex items-center gap-2 bg-slate-900 text-slate-100 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">Sequência montada:</span>
                    <span className="text-amber-400 font-bold">
                      {Object.values(vfAnswers).map((a) => a || '?').join(' - ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Q10 Python block presentation */}
              {question.id === 10 && (
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] pb-1 border-b border-slate-800 font-sans uppercase">
                    <Terminal className="h-3 h-3 text-sky-400" /> Célula de Comando - Google Colab
                  </div>
                  <span className="text-slate-400"># João escreveu este algoritmo para carregar a planilha CSV:</span>
                  <div className="text-white">
                    <span className="text-emerald-400">dados</span> = pd.read_csv(<span className="text-amber-300">"https://exemplo.com/dados.csv"</span>)
                  </div>
                  <div className="text-emerald-400">
                    dados <span className="text-slate-500"># O que esta chamada pura na última linha faz?</span>
                  </div>
                </div>
              )}

              {/* Standard Options selector */}
              <div className="space-y-3.5 pt-2">
                {question.opcoes.map((opcao) => {
                  const isSelected = selectedOption === opcao.key;
                  const isCorrect = opcao.key === question.respostaCorreta;
                  
                  let optionStyle = 'border-slate-150 bg-white text-slate-700 hover:border-slate-300';
                  
                  if (isSelected && !isSubmitted) {
                    optionStyle = 'border-indigo-500 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-100';
                  } else if (isSubmitted) {
                    if (isSelected && isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-100 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-300 bg-rose-50/50 text-rose-900 ring-2 ring-rose-100';
                    } else if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/30 text-emerald-950 font-semibold';
                    } else {
                      optionStyle = 'border-slate-100 bg-white text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opcao.key}
                      id={`option-${opcao.key}`}
                      onClick={() => handleSelectOption(opcao.key)}
                      disabled={isSubmitted}
                      className={`w-full flex items-start gap-4 rounded-xl border p-4.5 text-left text-sm transition-all duration-200 ${optionStyle}`}
                    >
                      <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : isSubmitted && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {opcao.key}
                      </div>
                      <span className="leading-relaxed">{opcao.texto}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Answer Feedbacks & Explanations */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-100 bg-slate-50/80 p-6 md:p-8 space-y-4"
                  id="explanation-panel"
                >
                  <div className="flex items-start gap-3">
                    {selectedOption === question.respostaCorreta ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                        <XCircle className="h-5 w-5" />
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <h4 className="font-sans text-sm font-bold text-slate-800">
                        {selectedOption === question.respostaCorreta 
                          ? 'Muito bem! Resposta correta!' 
                          : 'Quase lá! A alternativa correta era: ' + question.respostaCorreta}
                      </h4>
                      <p className="font-mono text-[10px] text-indigo-600 font-bold tracking-widest uppercase">
                        {selectedOption === question.respostaCorreta ? 'RECOMPENSA: +100 XP' : 'TENTE NOVAMENTE NA PRÓXIMA'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border border-slate-100 p-5 space-y-3 shadow-xs">
                    <span className="font-sans text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4 text-indigo-500" /> Por que esta é a resposta certa?
                    </span>
                    <p className="font-sans text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {question.explicacao}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions Bar Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                {isSubmitted ? 'Clique em avançar' : 'Escolha uma alternativa para validar'}
              </span>

              {!isSubmitted ? (
                <button
                  id="submit-answer-btn"
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                  className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all duration-200 ${
                    selectedOption
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-100'
                      : 'bg-slate-200 text-slate-400 cursor-default shadow-none'
                  }`}
                >
                  Confirmar Resposta
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  id="next-question-btn"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-all duration-200"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Ver Meu Resultado'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* QUIZ SUMMARY & HIGHLIGHT RESULTS PAGE */
        <div className="mx-auto max-w-2xl text-center space-y-8" id="quiz-summary-view">
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-800 p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 h-44 w-44 translate-x-14 -translate-y-14 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-teal-400/20 blur-lg"></div>

            <div className="relative flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-inner">
                <Trophy className="h-10 w-10 text-amber-300 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h2 className="font-sans text-2xl font-black tracking-tight sm:text-3xl">
                  {accuracyPercent >= 80 ? '🏅 Excelente Trabalho!' : accuracyPercent >= 50 ? '👍 Ótimo Começo!' : '📚 Hora de Revisar!'}
                </h2>
                <p className="text-xs text-slate-200 max-w-sm mx-auto">
                  Parabéns por completar o Desafio de Análise de Dados! Você está se tornando um verdadeiro cientista escolar.
                </p>
              </div>

              {/* Visual Stats */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">Acertos</span>
                  <span className="block font-mono text-xl font-bold">{correctCount} / {questions.length}</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">Aproveitamento</span>
                  <span className="block font-mono text-xl font-bold">{accuracyPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges unlocked this session or currently unlocked */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-left">
            <h3 className="font-sans text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" /> Suas Conquistas Desbloqueadas
            </h3>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {badges.map((badge) => {
                return (
                  <div 
                    key={badge.id} 
                    id={`badge-summary-${badge.id}`}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                      badge.desbloqueado 
                        ? 'bg-amber-50/50 border-amber-200' 
                        : 'bg-slate-50 border-slate-100 opacity-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg shrink-0 ${
                      badge.desbloqueado ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs block text-slate-700 font-sans">
                        {badge.titulo}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {badge.descricao}
                      </p>
                      {badge.desbloqueado && (
                        <span className="inline-block mt-1 font-mono text-[9px] uppercase tracking-wider text-amber-600 bg-amber-100/50 px-1.5 rounded">
                          Atormentado ★
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              id="restart-quiz-btn"
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Jogar Novamente</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

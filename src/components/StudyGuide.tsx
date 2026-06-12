import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Lightbulb, CheckCircle2, ChevronRight, HelpCircle, BarChart3, Database, FileSpreadsheet, Eye, Play, ListTodo, Users, Sparkles } from 'lucide-react';

interface StudyGuideProps {
  onStartQuiz: () => void;
  onGoToLab: () => void;
  addXP: (amount: number) => void;
}

export default function StudyGuide({ onStartQuiz, onGoToLab, addXP }: StudyGuideProps) {
  const [activeCard, setActiveCard] = useState<number>(0);
  const [completedTopic, setCompletedTopic] = useState<Record<number, boolean>>({});

  const lessons = [
    {
      id: 1,
      title: "Análise Exploratória & Hipóteses",
      description: "Como observar dados de forma inteligente antes de tomar conclusões.",
      icon: BarChart3,
      themeColor: "from-emerald-500 to-teal-400 font-medium",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            A <strong>Análise Exploratória de Dados (AED)</strong> é a nossa primeira conversa com os dados. Em vez de adivinhar o futuro ou jogar dados em um gráfico de qualquer jeito, nós usamos a AED para <strong>observar, resumir e interpretar padrões</strong> ocultos.
          </p>
          <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 flex gap-3 text-sm text-emerald-800">
            <Lightbulb className="h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <span className="font-bold">Hipóteses científicas:</span> Uma hipótese relaciona duas ou mais variáveis que podem ser comparadas. 
              <p className="mt-1">
                <em>Exemplo do Daniel:</em> Daniel observou que levar lanche saudável de casa diminui o consumo de industrializados. Sua hipótese é que a <strong>origem do lanche</strong> está associada ao <strong>tipo de alimento</strong> ingerido.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs space-y-2">
            <span className="font-bold text-slate-700">Regra de Ouro para Apresentação:</span>
            <ul className="list-disc leading-relaxed pl-4 space-y-1 text-slate-500">
              <li>Sempre use um <strong>título descritivo</strong> claro.</li>
              <li>Explique a origem dos dados e como foram coletados.</li>
              <li>Evite jargões e siglas sem explicação (ex: nunca deixe <code className="text-red-500">QTD</code> ou <code className="text-red-500">HRS</code> sem definir o que são).</li>
              <li>Lembre-se: Gráficos bem coloridos não se explicam sozinhos! Eles precisam de eixos rotulados e contexto claro.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Formulando Perguntas Perfeitas",
      description: "Como usar o Google Forms para coletar respostas de qualidade.",
      icon: ListTodo,
      themeColor: "from-violet-500 to-purple-400 font-medium",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            Para que uma pesquisa gere conclusões reais, as perguntas devem <strong>se conectar diretamente com os objetivos</strong> da análise.
          </p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="text-xs font-bold text-purple-600 block mb-1">Múltipla Escolha</span>
              <p className="text-xs text-slate-500">O usuário seleciona <strong>apenas uma</strong> alternativa entre várias disponíveis.</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="text-xs font-bold text-purple-600 block mb-1">Caixa de Seleção</span>
              <p className="text-xs text-slate-500">O usuário pode marcar <strong>múltiplas</strong> alternativas ao mesmo tempo.</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="text-xs font-bold text-purple-600 block mb-1">Escala Linear</span>
              <p className="text-xs text-slate-500">Perfeita para medir <strong>intensidade, frequência ou concordância</strong> (ex: de 1 a 5).</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="text-xs font-bold text-purple-600 block mb-1">Resposta Curta</span>
              <p className="text-xs text-slate-500">Para dados diretos, precisos e objetivos (como nomes ou idades).</p>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex gap-3 text-sm text-red-800">
            <div className="font-extrabold text-red-500">⚠️</div>
            <div>
              <span className="font-bold">O Perigo de Perguntas Abertas:</span> Usar campos abertos ("Parágrafo") para tudo parece fácil, mas é a pior escolha! Dados textuais longos exigem leitura manual exaustiva e impedem que sejam totalizados ou plotados em gráficos rápidos de forma fácil.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Ética, Amostragem e Planilhas",
      description: "Como garantir a idoneidade dos dados e exportá-los para o Google Sheets.",
      icon: Users,
      themeColor: "from-amber-500 to-orange-400 font-medium",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            Na estatística, os dados precisam representar o mundo real. Veja duas etapas cruciais para isso:
          </p>
          <div className="space-y-3">
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <span className="font-bold text-amber-800 flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" /> Amostragem Representativa
              </span>
              <p className="text-xs text-slate-600 mt-1">
                Convidar apenas os seus amigos mais próximos dá menos trabalho, mas gera <strong>viés de amostragem</strong>. Se você quer entender a escola inteira, deve incentivar alunos de dezenas de turmas diferentes para obter diversidade.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <span className="font-bold text-emerald-800 flex items-center gap-2 text-sm">
                <FileSpreadsheet className="h-4 w-4" /> Integração com Planilhas
              </span>
              <p className="text-xs text-slate-600 mt-1">
                No Google Forms, após obter as respostas, você não precisa fazer capturas de tela ou copiar manualmente. Vá até a aba <strong>'Respostas'</strong> e dê um clique simples no <strong>ícone quadrado de planilha verde</strong>. Isso criará uma planilha formatada automaticamente no Planilhas Google!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Arquivos CSV & Google Colab",
      description: "Lendo e visualizando conjuntos de tabelas estruturadas com Python.",
      icon: Database,
      themeColor: "from-sky-500 to-indigo-400 font-medium",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            Para usarmos linguagens poderosas de análise como o Python dentro do <strong>Google Colab</strong>, precisamos disponibilizar as planilhas em formatos amigáveis.
          </p>
          <div className="space-y-3">
            <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
              <span className="font-bold text-sky-800 text-sm">O que é um arquivo CSV?</span>
              <p className="text-xs text-slate-600 mt-1">
                O arquivo <strong>CSV (Comma-Separated Values)</strong> é um arquivo de texto simples onde cada linha representa uma linha da planilha e as células são delimitadas por vírgulas. É o formato mais leve e comum de se utilizar.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400 mb-2 border-b border-slate-800 pb-1.5 font-sans">
                <span>Célula de Código no Google Colab</span>
                <span className="text-sky-400">Python</span>
              </div>
              <p className="text-emerald-400">import <span className="text-white">pandas</span> as <span className="text-white">pd</span></p>
              <p className="text-slate-400"># Carregando a planilha da internet de forma ultra rápida</p>
              <p className="text-white">dados = pd.read_csv(<span className="text-amber-300">"https://exemplo.com/dados.csv"</span>)</p>
              <p className="text-sky-400">dados <span className="text-slate-400"># Exibe a tabela interativa na tela!</span></p>
            </div>

            <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 text-xs text-indigo-900">
              <span className="font-bold">Resultado na tela do Notebook:</span> Ao colocar a variável <strong><code>dados</code></strong> como a última instrução de uma célula de código no Colab, o ambiente renderiza automaticamente uma <strong>tabela linda e formatada</strong> com todas as colunas e linhas prontas para exploração visual direto na interface!
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleLessonComplete = (index: number) => {
    if (!completedTopic[index]) {
      setCompletedTopic({ ...completedTopic, [index]: true });
      addXP(50); // Give XP for reading.
    }
    if (activeCard < lessons.length - 1) {
      setActiveCard(activeCard + 1);
    }
  };

  const completedCount = Object.keys(completedTopic).length;

  return (
    <div id="study-guide-view" className="space-y-8 py-4">
      {/* Hero Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-teal-500 p-8 text-white shadow-xl shadow-indigo-100">
        <div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-0 left-1/3 h-28 w-28 translate-y-12 rounded-full bg-teal-300/10 blur-lg"></div>
        <div className="relative max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
            <Sparkles className="h-3 h-3 text-amber-300" />
            <span>Guia Interativo de Estudos</span>
          </div>
          <h2 className="font-sans text-2xl font-extrabold sm:text-3xl tracking-tight">
            Aprenda os Conceitos em Minutos!
          </h2>
          <p className="text-sm font-medium text-slate-100 leading-relaxed">
            Aqui está um guia prático desenhado com as explicações certas sobre formulários, coleta inteligente, representatividade estatística e análise no Python. Leia cada lição abaixo, ganhe pontos e prepare-se para o desafio!
          </p>
        </div>
      </div>

      {/* Grid containing lessons lists (left side) and details (right side) */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Side: Lesson Checklist */}
        <div className="space-y-3 lg:col-span-4">
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-slate-400">
            Tópicos do Curso
          </h3>
          <div className="space-y-2">
            {lessons.map((lesson, index) => {
              const Icon = lesson.icon;
              const isActive = activeCard === index;
              const isCompleted = completedTopic[index];
              return (
                <button
                  key={lesson.id}
                  id={`lesson-btn-${index}`}
                  onClick={() => setActiveCard(index)}
                  className={`w-full flex items-center justify-between gap-3 text-left p-3.5 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50/80 border-indigo-200 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-tr ${lesson.themeColor} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 font-mono">LIÇÃO {lesson.id}</span>
                      <span className="block text-sm font-bold text-slate-700 leading-tight">
                        {lesson.title}
                      </span>
                    </div>
                  </div>
                  <div>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? 'text-indigo-500 translate-x-1' : 'text-slate-300'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> Progresso da leitura</span>
              <span className="font-mono text-indigo-600">{completedCount}/{lessons.length}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500 rounded-full" 
                style={{ width: `${(completedCount / lessons.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 text-center font-mono">
              Ganhe +50 XP por lição concluída!
            </p>
          </div>
        </div>

        {/* Right Side: Active Lesson Panel */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden"
              id={`lesson-panel-${activeCard}`}
            >
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase font-mono">
                    Módulo Ativo
                  </span>
                  <h3 className="font-sans text-xl font-bold text-slate-800">
                    {lessons[activeCard].title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lessons[activeCard].description}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${lessons[activeCard].themeColor} text-white shadow-md shadow-indigo-100`}>
                  {(() => {
                    const ActiveIcon = lessons[activeCard].icon;
                    return <ActiveIcon className="h-6 w-6" />;
                  })()}
                </div>
              </div>

              {/* Card Main Content */}
              <div className="p-6 flex-1 text-slate-700 leading-relaxed font-sans prose prose-slate">
                {lessons[activeCard].content}
              </div>

              {/* Card Actions Footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  id={`mark-complete-btn-${activeCard}`}
                  onClick={() => handleLessonComplete(activeCard)}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 ${
                    completedTopic[activeCard]
                      ? 'bg-slate-200 text-slate-500 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {completedTopic[activeCard] ? 'Matéria Concluída ✓' : 'Marcar como Concluída (+50 XP)'}
                  </span>
                </button>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    id="goto-lab-shortcut"
                    onClick={onGoToLab}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-xs font-bold"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Ir para Simuladores</span>
                  </button>

                  <button
                    id="goto-quiz-shortcut"
                    onClick={onStartQuiz}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-all duration-200"
                  >
                    <span>Testar Conhecimento</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Play, Trash2, Plus, HelpCircle, LayoutGrid, CheckSquare, ListPlus, 
  ArrowRight, FileSpreadsheet, Sparkles, Sliders, AlignLeft, Info, Search
} from 'lucide-react';

interface InteractiveSandboxProps {
  addXP: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
}

export default function InteractiveSandbox({ addXP, unlockBadge }: InteractiveSandboxProps) {
  const [sandboxMode, setSandboxMode] = useState<'forms' | 'colab'>('forms');

  // FORMS STATE
  const [qTitle, setQTitle] = useState<string>('Como você avalia a merenda escolar?');
  const [qType, setQType] = useState<'mc' | 'cb' | 'ls' | 'sa'>('ls');
  const [qOptions, setQOptions] = useState<string[]>([
    'Muito Saudável',
    'Industrializada',
    'Falta Opções'
  ]);
  const [newOptionText, setNewOptionText] = useState<string>('');
  const [formsResponses, setFormsResponses] = useState<any[]>([]);
  const [userSelection, setUserSelection] = useState<any>(null); // current user selected option in forms preview

  // COLAB STATE
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [isCellRunning, setIsCellRunning] = useState<boolean>(false);
  const [colabOutputs, setColabOutputs] = useState<Record<number, boolean>>({});

  // Sample data for Colab simulator
  const dataset = [
    { id: 1, carimbo: "12/06/2026 10:15", ano: "2º Ano EM", origem: "Lanche de Casa", tipo: "Natural", frequencia_reciclagem: 5 },
    { id: 2, carimbo: "12/06/2026 10:18", ano: "2º Ano EM", origem: "Comprei Cantina", tipo: "Industrializado", frequencia_reciclagem: 2 },
    { id: 3, carimbo: "12/06/2026 10:20", ano: "1º Ano EM", origem: "Lanche de Casa", tipo: "Natural", frequencia_reciclagem: 4 },
    { id: 4, carimbo: "12/06/2026 10:22", ano: "3º Ano EM", origem: "Comprei Cantina", tipo: "Industrializado", frequencia_reciclagem: 1 },
    { id: 5, carimbo: "12/06/2026 10:25", ano: "2º Ano EM", origem: "Lanche de Casa", tipo: "Natural", frequencia_reciclagem: 5 },
    { id: 6, carimbo: "12/06/2026 10:30", ano: "3º Ano EM", origem: "Lanche de Casa", tipo: "Natural", frequencia_reciclagem: 3 },
  ];

  // Forms option handlers
  const handleAddOption = () => {
    if (!newOptionText.trim()) return;
    setQOptions([...qOptions, newOptionText.trim()]);
    setNewOptionText('');
  };

  const handleDeleteOption = (idx: number) => {
    setQOptions(qOptions.filter((_, i) => i !== idx));
  };

  const handleSimulateResponse = () => {
    if (userSelection === null && qType !== 'sa') return;
    
    let answerText = '';
    if (qType === 'sa') {
      answerText = userSelection || 'Resposta livre do Aluno';
    } else if (qType === 'cb') {
      answerText = Array.isArray(userSelection) ? userSelection.join(', ') : 'Nenhuma';
    } else {
      answerText = String(userSelection);
    }

    const newResponse = {
      timestamp: new Date().toLocaleTimeString(),
      pergunta: qTitle,
      tipo: qType === 'mc' ? 'Múltipla Escolha' : qType === 'cb' ? 'Caixa de Seleção' : qType === 'ls' ? 'Escala Linear' : 'Resposta Curta',
      resposta: answerText
    };

    setFormsResponses([newResponse, ...formsResponses]);
    setUserSelection(null);
    addXP(15);
    unlockBadge('first_step'); // Ensure first step unlocked if they play around!
  };

  const runColabCell = (cellId: number) => {
    setIsCellRunning(true);
    setActiveCell(cellId);
    setTimeout(() => {
      setIsCellRunning(false);
      setColabOutputs({ ...colabOutputs, [cellId]: true });
      addXP(25);
      
      // If run all four cells, unlock Colab Magician or reward them!
      const allDone = [1, 2, 3, 4].every(id => id === cellId || colabOutputs[id]);
      if (allDone) {
        unlockBadge('colab_magician');
      }
    }, 800);
  };

  return (
    <div id="sandbox-view" className="space-y-6 py-4">
      
      {/* Selector tab for Sandbox */}
      <div className="flex border-b border-slate-200">
        <button
          id="btn-sandbox-forms"
          onClick={() => setSandboxMode('forms')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
            sandboxMode === 'forms'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>1. Simulador de Google Forms</span>
        </button>

        <button
          id="btn-sandbox-colab"
          onClick={() => setSandboxMode('colab')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
            sandboxMode === 'colab'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>2. Google Colab (Python/Pandas)</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {sandboxMode === 'forms' ? (
          /* =======================================
             GOOGLE FORMS SIMULATOR
             ======================================= */
          <motion.div
            key="sandbox-forms"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            {/* Left Col: Editor Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <span className="text-xs font-bold text-indigo-600 font-mono tracking-wider uppercase">
                  Painel do Criador (Forms)
                </span>
                
                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Escreva sua Pergunta:</label>
                  <input
                    id="forms-question-input"
                    type="text"
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                  />
                </div>

                {/* Question Type Choice */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Tipo da Pergunta:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'mc', label: 'Múltipla Escolha', icon: LayoutGrid },
                      { id: 'cb', label: 'Caixa de Seleção', icon: CheckSquare },
                      { id: 'ls', label: 'Escala Linear', icon: Sliders },
                      { id: 'sa', label: 'Resposta Curta', icon: AlignLeft },
                    ].map((type) => {
                      const Icon = type.icon;
                      const isSel = qType === type.id;
                      return (
                        <button
                          key={type.id}
                          id={`qtype-btn-${type.id}`}
                          onClick={() => {
                            setQType(type.id as any);
                            setUserSelection(type.id === 'cb' ? [] : null);
                          }}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-[11px] font-bold text-left transition-all ${
                            isSel 
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span>{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Option editor (except Response Curta/Escala Linear) */}
                {qType !== 'sa' && qType !== 'ls' && (
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-slate-600 block">Opções Adicionais:</label>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {qOptions.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                          <span className="flex-1 text-slate-600 truncate">{opt}</span>
                          <button 
                            id={`delete-opt-${oIdx}`}
                            onClick={() => handleDeleteOption(oIdx)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2.5">
                      <input
                        id="new-option-input"
                        type="text"
                        placeholder="Adicionar alternativa..."
                        value={newOptionText}
                        onChange={(e) => setNewOptionText(e.target.value)}
                        className="flex-1 text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-700 bg-slate-50 focus:bg-white focus:outline-indigo-500"
                      />
                      <button
                        id="add-option-btn"
                        onClick={handleAddOption}
                        className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Educational advice card */}
                <div className="rounded-xl bg-indigo-50/50 border border-indigo-100/50 p-3.5 space-y-2 text-xs">
                  <span className="font-bold text-indigo-800 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" /> Dica de Ciência de Dados
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {qType === 'mc' && 'Múltipla escolha é excelente para quando as respostas se excluem mutuamente. O aluno escolhe exatamente uma.'}
                    {qType === 'cb' && 'Caixas de seleção geram listas quando exportadas. Tenha atenção ao analisar pois uma linha terá vários valores delimitados por vírgula nesta mesma célula.'}
                    {qType === 'ls' && 'Escalas lineares ajudam a calcular estatísticas numéricas como Média, Mediana e Desvio Padrão instantaneamente sobre os hábitos!'}
                    {qType === 'sa' && 'Resposta Curta é o pior formato para tabulações em larga escala, pois erros ortográficos (ex: "salvel", "salvável", "sau") criam categorias repetidas incorretamente.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Preview & Simulator response */}
            <div className="lg:col-span-7 space-y-4">
              {/* Sandbox Google Forms simulator rendered layout */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase">
                    Visualização do Aluno (Simulação ativa)
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>

                {/* Question title rendered */}
                <div className="space-y-3">
                  <span className="text-sm font-bold text-slate-800 leading-tight block">
                    {qTitle || 'Pergunta ativa'}
                  </span>

                  {/* Render based on selected Forms question type */}
                  <div className="pt-2">
                    
                    {qType === 'mc' && (
                      <div className="space-y-2">
                        {qOptions.map((opt, oIdx) => (
                          <label 
                            key={oIdx} 
                            className="flex items-center gap-3 bg-slate-50/80 hover:bg-slate-100 p-3 rounded-xl border border-slate-150 cursor-pointer text-xs"
                          >
                            <input
                              type="radio"
                              name="simulated-mc"
                              value={opt}
                              checked={userSelection === opt}
                              onChange={() => setUserSelection(opt)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-slate-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {qType === 'cb' && (
                      <div className="space-y-2">
                        {qOptions.map((opt, oIdx) => {
                          const currentArr = Array.isArray(userSelection) ? userSelection : [];
                          const isChecked = currentArr.includes(opt);
                          return (
                            <label 
                              key={oIdx} 
                              className="flex items-center gap-3 bg-slate-50/80 hover:bg-slate-100 p-3 rounded-xl border border-slate-150 cursor-pointer text-xs"
                            >
                              <input
                                type="checkbox"
                                value={opt}
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setUserSelection([...currentArr, opt]);
                                  } else {
                                    setUserSelection(currentArr.filter(item => item !== opt));
                                  }
                                }}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-slate-700">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {qType === 'ls' && (
                      <div className="space-y-4">
                        <p className="text-[11px] text-slate-400">Classifique de 1 (Pior) a 5 (Melhor):</p>
                        <div className="flex justify-between max-w-sm mx-auto bg-slate-50 border border-slate-100 rounded-xl p-3">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              id={`simulated-ls-val-${val}`}
                              onClick={() => setUserSelection(val)}
                              className={`h-11 w-11 rounded-full font-mono text-xs font-bold transition-all ${
                                userSelection === val 
                                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                                  : 'bg-white border border-slate-150 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {qType === 'sa' && (
                      <div className="space-y-2">
                        <input
                          id="simulated-sa-input"
                          type="text"
                          placeholder="Digite sua resposta curta..."
                          value={userSelection || ''}
                          onChange={(e) => setUserSelection(e.target.value)}
                          className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                        />
                      </div>
                    )}

                  </div>
                </div>

                {/* Response action button */}
                <div className="bg-slate-50 border-t border-slate-100 -mx-6 -my-6 mt-6 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs leading-none">
                  <span className="text-slate-400 font-mono">Simule preenchimentos para construir sua própria base</span>
                  <button
                    id="simulate-response-btn"
                    onClick={handleSimulateResponse}
                    disabled={userSelection === null && qType !== 'sa'}
                    className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold transition-all shadow ${
                      userSelection !== null || qType === 'sa'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-100'
                        : 'bg-slate-250 text-slate-400 shadow-none cursor-default'
                    }`}
                  >
                    Simular Resposta (+15 XP)
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CSV/Planilha simulated output list */}
              {formsResponses.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Base de Respostas Simulada (Estilo CSV)
                    </span>
                    <button
                      id="clear-simulated-responses"
                      onClick={() => setFormsResponses([])}
                      className="text-slate-400 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-wider"
                    >
                      Limpar Base
                    </button>
                  </div>
                  <div className="overflow-x-auto border border-slate-150 rounded-xl">
                    <table className="w-full font-sans text-xs text-left text-slate-600">
                      <thead className="bg-slate-50 font-bold border-b border-slate-150 text-slate-700">
                        <tr>
                          <th className="px-4 py-2.5">Carimbo (Time)</th>
                          <th className="px-4 py-2.5">Formato</th>
                          <th className="px-4 py-2.5">Pergunta</th>
                          <th className="px-4 py-2.5">Resposta Gravada</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formsResponses.map((res, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-mono text-[10px] text-slate-400">{res.timestamp}</td>
                            <td className="px-4 py-2.5 font-semibold text-indigo-600">{res.tipo}</td>
                            <td className="px-4 py-2.5 truncate max-w-[150px]">{res.pergunta}</td>
                            <td className="px-4 py-2.5 font-mono text-emerald-600 whitespace-nowrap">{res.resposta}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* =======================================
             GOOGLE COLAB SIMULATOR (PYTHON CELLS)
             ======================================= */
          <motion.div
            key="sandbox-colab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            {/* Left side: Jupyter/Colab Code notebook cells */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Introduction Banner to Pandas */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <span className="text-xs font-bold text-sky-600 flex items-center gap-1.5 font-mono">
                  <Terminal className="h-4 w-4" /> Google Colab & Biblioteca Pandas
                </span>
                <p className="text-xs text-slate-650 leading-relaxed">
                  No Google Colab, nós rodamos código Python. A biblioteca mais conhecida para analisar planilhas é o <strong>Pandas</strong> (importado comumente como <code>pd</code>). 
                </p>
                <p className="text-xs text-slate-500">
                  Execute as células abaixo em sequência e assista como o notebook do Colab carrega os arquivos e analisa amostras instantaneamente!
                </p>
              </div>

              {/* Jupyter cell list */}
              <div className="space-y-3">
                
                {/* Cell 1 */}
                <div id="colab-cell-1" className="rounded-2xl border border-slate-250 bg-slate-900 overflow-hidden font-mono text-xs">
                  <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 font-sans">
                    <span className="flex items-center gap-1.5"><Play className="h-3.5 w-3.5 text-sky-400" /> Célula [1] : Carregar Planilha Google</span>
                    <span className="text-sky-450 font-bold font-mono">import pandas as pd</span>
                  </div>
                  <div className="p-4 space-y-1.5 text-slate-100">
                    <div className="text-emerald-400">import <span className="text-white">pandas</span> as <span className="text-white">pd</span></div>
                    <div>dados = pd.read_csv(<span className="text-amber-300">"https://escolasustentavel.org/pesquisa.csv"</span>)</div>
                    <div className="text-emerald-400">dados</div>
                  </div>
                  <div className="bg-slate-850 border-t border-slate-800 px-4 py-3 flex justify-between items-center bg-slate-950 font-sans">
                    <span className="text-[11px] text-slate-400">Objetivo: Importar pandas, carregar CSV e exibir tabela interativa</span>
                    <button
                      id="run-cell-btn-1"
                      onClick={() => runColabCell(1)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold"
                    >
                      <Play className="h-3 w-3" /> Executar
                    </button>
                  </div>
                </div>

                {/* Cell 2 */}
                <div id="colab-cell-2" className="rounded-2xl border border-slate-250 bg-slate-900 overflow-hidden font-mono text-xs">
                  <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 font-sans">
                    <span className="flex items-center gap-1.5"><Play className="h-3.5 w-3.5 text-sky-400" /> Célula [2] : Visualizar Cabeçalho</span>
                    <span className="text-sky-450 font-bold font-mono">dados.head()</span>
                  </div>
                  <div className="p-4 space-y-1.5 text-slate-100">
                    <span className="text-slate-500"># O comando .head() filtra apenas os 5 primeiros registros.</span>
                    <div className="text-emerald-400">dados.head()</div>
                  </div>
                  <div className="bg-slate-850 border-t border-slate-800 px-4 py-3 flex justify-between items-center bg-slate-955 font-sans">
                    <span className="text-[11px] text-slate-400">Objetivo: Limitar visualização rápida para verificar colunas</span>
                    <button
                      id="run-cell-btn-2"
                      onClick={() => runColabCell(2)}
                      disabled={!colabOutputs[1]}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold ${
                        colabOutputs[1] ? 'bg-sky-600 hover:bg-sky-500 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Play className="h-3 w-3" /> Executar
                    </button>
                  </div>
                </div>

                {/* Cell 3 */}
                <div id="colab-cell-3" className="rounded-2xl border border-slate-255 bg-slate-900 overflow-hidden font-mono text-xs">
                  <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 font-sans">
                    <span className="flex items-center gap-1.5"><Play className="h-3.5 w-3.5 text-sky-400" /> Célula [3] : Descritivos Estatísticos</span>
                    <span className="text-sky-450 font-bold font-mono">dados.describe()</span>
                  </div>
                  <div className="p-4 space-y-1.5 text-slate-100">
                    <span className="text-slate-500 text-[11px]"># .describe() resume contagem, máximos, médias e recorrências</span>
                    <div className="text-emerald-400">dados.describe()</div>
                  </div>
                  <div className="bg-slate-850 border-t border-slate-800 px-4 py-3 flex justify-between items-center bg-slate-960 font-sans">
                    <span className="text-[11px] text-slate-400">Objetivo: Resumo rápido de frequências e dados numéricos</span>
                    <button
                      id="run-cell-btn-3"
                      onClick={() => runColabCell(3)}
                      disabled={!colabOutputs[1]}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold ${
                        colabOutputs[1] ? 'bg-sky-600 hover:bg-sky-500 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Play className="h-3 w-3" /> Executar
                    </button>
                  </div>
                </div>

                {/* Cell 4 */}
                <div id="colab-cell-4" className="rounded-2xl border border-slate-260 bg-slate-900 overflow-hidden font-mono text-xs">
                  <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 font-sans">
                    <span className="flex items-center gap-1.5"><Play className="h-3.5 w-3.5 text-sky-400" /> Célula [4] : Tabelas de Validação (Cruzamento)</span>
                    <span className="text-sky-455 font-bold font-mono">pd.crosstab()</span>
                  </div>
                  <div className="p-4 space-y-1.5 text-slate-100">
                    <span className="text-slate-500 text-[11px]"># Cruzamos Daniel's hypothesis: Origem_Lanche x Tipo_Alimento</span>
                    <div className="text-emerald-400">pd.crosstab(dados[<span className="text-amber-300">'Origem_Lanche'</span>], dados[<span className="text-amber-300">'Tipo_Alimento'</span>])</div>
                  </div>
                  <div className="bg-slate-850 border-t border-slate-800 px-4 py-3 flex justify-between items-center bg-slate-965 font-sans">
                    <span className="text-[11px] text-slate-400">Objetivo: Confirmar se o lanche de casa realmente induz comida natural!</span>
                    <button
                      id="run-cell-btn-4"
                      onClick={() => runColabCell(4)}
                      disabled={!colabOutputs[1]}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold ${
                        colabOutputs[1] ? 'bg-sky-600 hover:bg-sky-500 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Play className="h-3 w-3" /> Executar
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Right side: Inter-active results screen */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-h-[400px] flex flex-col">
                <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase pb-3 border-b border-indigo-50 block">
                  Console do Google Colab (Área de Saída)
                </span>

                <div className="flex-1 flex flex-col justify-center py-6">
                  {isCellRunning ? (
                    <div className="text-center space-y-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
                      <p className="text-xs font-mono text-indigo-600">Calculando matrizes e carregando pandas...</p>
                    </div>
                  ) : activeCell === null ? (
                    <div className="text-center space-y-3 max-w-sm mx-auto">
                      <Terminal className="h-10 w-10 text-slate-300 mx-auto" />
                      <p className="font-sans text-xs font-bold text-slate-650">Nenhum comando foi executado ainda.</p>
                      <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
                        Clique nos botões <strong>"Executar"</strong> nas células de código para ver os dados gerados de forma interativa.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Active Output Render */}
                      
                      {activeCell === 1 && (
                        <div className="space-y-3 font-sans">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
                              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Output: dados [Google Planilhas carregada]
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">6 linhas x 5 colunas</span>
                          </div>

                          <div className="overflow-x-auto border border-slate-150 rounded-xl max-h-60 overflow-y-auto">
                            <table className="w-full text-[11px] text-left text-slate-600">
                              <thead className="bg-slate-50 border-b border-slate-150 font-bold text-slate-750">
                                <tr>
                                  <th className="px-3 py-2">Carimbo</th>
                                  <th className="px-3 py-2">Ano_Escolar</th>
                                  <th className="px-3 py-2">Origem_Lanche</th>
                                  <th className="px-3 py-2">Tipo_Alimento</th>
                                  <th className="px-3 py-2">Recicla_Frequencia</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                                {dataset.map((row) => (
                                  <tr key={row.id} className="hover:bg-slate-50/40">
                                    <td className="px-3 py-2 whitespace-nowrap text-slate-400">{row.carimbo}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{row.ano}</td>
                                    <td className="px-3 py-2 whitespace-nowrap font-bold text-indigo-700">{row.origem}</td>
                                    <td className="px-3 py-2 whitespace-nowrap font-bold text-slate-800">{row.tipo}</td>
                                    <td className="px-3 py-2 text-center font-bold text-emerald-600">{row.frequencia_reciclagem}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="rounded-xl border border-indigo-150 bg-indigo-50/50 p-3 text-xs leading-relaxed text-indigo-900 font-sans">
                            <strong className="block mb-0.5">💡 Visão do Colab:</strong> Como visto na <strong>Questão 10</strong>, chamar apenas o termo <code>dados</code> na última linha faz com que o notebook carregue os dados instantaneamente em uma <strong>linha/grade de tabela formatada</strong> de alta legibilidade!
                          </div>
                        </div>
                      )}

                      {activeCell === 2 && (
                        <div className="space-y-3 font-sans">
                          <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full block w-max font-mono">
                            Header output: dados.head()
                          </span>
                          <p className="text-xs text-slate-500 leading-snug">Visualizando o topo do DataFrame (limite estrito de 5 linhas):</p>
                          
                          <div className="overflow-x-auto border border-slate-150 rounded-xl">
                            <table className="w-full text-[11px] text-left text-slate-600">
                              <thead className="bg-slate-50 border-b border-slate-150 text-slate-700 font-bold">
                                <tr>
                                  <th className="px-3 py-2">Carimbo</th>
                                  <th className="px-3 py-2">Ano_Escolar</th>
                                  <th className="px-3 py-2">Origem_Lanche</th>
                                  <th className="px-3 py-2">Tipo_Alimento</th>
                                  <th className="px-3 py-2">Recicla_Frequencia</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-500 font-mono">
                                {dataset.slice(0, 5).map((row) => (
                                  <tr key={row.id}>
                                    <td className="px-3 py-2">{row.carimbo}</td>
                                    <td className="px-3 py-2">{row.ano}</td>
                                    <td className="px-3 py-2 font-bold text-indigo-700">{row.origem}</td>
                                    <td className="px-3 py-2 font-bold text-slate-800">{row.tipo}</td>
                                    <td className="px-3 py-2">{row.frequencia_reciclagem}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {activeCell === 3 && (
                        <div className="space-y-3 font-sans">
                          <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full block w-max font-mono">
                            Statistics output: dados.describe()
                          </span>
                          <p className="text-xs text-slate-500">Pandas calculou as frequências para as colunas categóricas automaticamente:</p>
                          
                          <div className="overflow-x-auto border border-slate-150 rounded-xl">
                            <table className="w-full text-[11px] text-left text-slate-600">
                              <thead className="bg-slate-50 border-b border-slate-150 text-slate-700 font-bold">
                                <tr>
                                  <th className="px-3 py-2">Fato estatístico</th>
                                  <th className="px-3 py-2">Ano_Escolar</th>
                                  <th className="px-3 py-2">Origem_Lanche</th>
                                  <th className="px-3 py-2">Tipo_Alimento</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-500 font-mono">
                                <tr>
                                  <td className="px-3 py-2 font-bold">count (Votos)</td>
                                  <td className="px-3 py-2">6</td>
                                  <td className="px-3 py-2">6</td>
                                  <td className="px-3 py-2">6</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-bold">unique (Opções)</td>
                                  <td className="px-3 py-2">3</td>
                                  <td className="px-3 py-2">2</td>
                                  <td className="px-3 py-2">2</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-bold">top (Moda)</td>
                                  <td className="px-3 py-2">2º Ano EM</td>
                                  <td className="px-3 py-2">Lanche de Casa</td>
                                  <td className="px-3 py-2 font-bold text-emerald-600">Natural</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-bold">freq (Ocorrência)</td>
                                  <td className="px-3 py-2">3 vezes</td>
                                  <td className="px-3 py-2">4 vezes</td>
                                  <td className="px-3 py-2">4 vezes</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {activeCell === 4 && (
                        <div className="space-y-3 font-sans">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full block w-max font-mono">
                            Tabulação Cruzada: pd.crosstab()
                          </span>
                          <p className="text-xs text-slate-550">
                            Veja a distribuição de alimentação de acordo com quem compra ou leva o lanche da sua comunidade:
                          </p>

                          <div className="overflow-x-auto border border-indigo-100 rounded-xl bg-white p-3 shadow-xs max-w-sm">
                            <table className="w-full text-xs text-left text-slate-600">
                              <thead>
                                <tr className="border-b border-indigo-100 font-bold bg-indigo-50/50">
                                  <th className="px-3 py-1.5 text-indigo-900">Origem Lanche \ Tipo</th>
                                  <th className="px-3 py-1.5 text-indigo-900 text-center">Natural</th>
                                  <th className="px-3 py-1.5 text-indigo-900 text-center">Industrial</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-mono">
                                <tr className="hover:bg-slate-50">
                                  <td className="px-3 py-2 font-bold text-slate-700">Lanche de Casa</td>
                                  <td className="px-3 py-2 text-center text-emerald-600 font-extrabold bg-emerald-50/30">4 respondentes</td>
                                  <td className="px-3 py-2 text-center text-slate-400">0 respondentes</td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                  <td className="px-3 py-2 font-bold text-slate-700">Comprei Cantina</td>
                                  <td className="px-3 py-2 text-center text-slate-400 font-mono">0 respondentes</td>
                                  <td className="px-3 py-2 text-center text-rose-500 font-extrabold bg-rose-50/35">2 respondentes</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-900 leading-relaxed font-sans">
                            <span className="font-extrabold block">✓ Hipótese Confirmada!</span>
                            A tabela de cruzamento indica que 100% de quem levou de casa consumiu lanches do tipo <strong>Natural</strong>, e todos da cantina consumiram <strong>Industrializado</strong>. Daniel tinha razão!
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    pergunta: "Qual descrição melhor define uma análise exploratória de dados?",
    contexto: "Ao iniciar qualquer projeto científico ou de análise de dados, o primeiro passo é sempre compreender as informações que temos em mãos.",
    opcoes: [
      { key: "A", texto: "Um método para prever o futuro e entender o que os dados mostram." },
      { key: "B", texto: "O processo de observar e interpretar dados para entender padrões." },
      { key: "C", texto: "A coleta de dados sem um objetivo específico." },
      { key: "D", texto: "Um tipo de gráfico usado para representar dados." }
    ],
    respostaCorreta: "B",
    explicacao: "A Análise Exploratória de Dados (AED ou EDA) é uma abordagem para analisar conjuntos de dados, resumindo suas principais características e frequentemente usando métodos visuais (como gráficos), tabelas e resumos estatísticos. O objetivo principal é descobrir padrões, identificar anomalias, testar hipóteses e verificar suposições sobre as informações coletadas antes de avançar para análises mais complexas.",
    categoria: "AED",
    dificuldade: "Fácil"
  },
  {
    id: 2,
    pergunta: "Durante um projeto sobre sustentabilidade, alguns estudantes estão criando perguntas para entender os hábitos de reciclagem da sua comunidade. Nesse sentido, qual critério eles devem considerar como importante para formular essas perguntas?",
    contexto: "A elaboração de um bom questionário é o que garante a confiabilidade de toda a pesquisa posterior.",
    opcoes: [
      { key: "A", texto: "Garantir que todas as perguntas sejam abertas." },
      { key: "B", texto: "Usar termos técnicos complexos para parecer mais científico." },
      { key: "C", texto: "Criar perguntas que se conectem com os objetivos da análise." },
      { key: "D", texto: "Fazer perguntas longas com várias ideias para obter mais respostas." }
    ],
    respostaCorreta: "C",
    explicacao: "Cada pergunta de um formulário deve ser desenhada com um propósito claro. Perguntas que não se alinham ao objetivo da pesquisa geram dados desnecessários que apenas confundem a análise. Perguntas curtas, diretas e conectadas à sua hipótese são essenciais para manter o foco do estudo.",
    categoria: "Formularios",
    dificuldade: "Fácil"
  },
  {
    id: 3,
    pergunta: "Durante um projeto sobre hábitos alimentares, Daniel observou que quem levava lanche de casa consumia menos produtos industrializados. Sua hipótese é que há uma relação entre a origem do lanche e o _________ do alimento. Qual termo preenche a lacuna da hipótese de Daniel?",
    contexto: "Hipóteses são suposições testáveis que relacionam variáveis e ajudam a guiar a análise.",
    opcoes: [
      { key: "A", texto: "Sabor." },
      { key: "B", texto: "Preço." },
      { key: "C", texto: "Tipo." },
      { key: "D", texto: "Horário." }
    ],
    respostaCorreta: "C",
    explicacao: "A relação que Daniel percebeu foi de consumo: 'levar lanche de casa' (origem) está associado a 'consumir produtos menos industrializados' (que define o tipo do alimento - industrializado ou natural). Logo, a hipótese relaciona a origem e o 'tipo' de alimento. Preencher com 'sabor', 'preço' ou 'horário' tiraria o foco do padrão direto de alimentação saudável x industrializada que ele observou.",
    categoria: "AED",
    dificuldade: "Médio"
  },
  {
    id: 4,
    pergunta: "Durante a preparação para uma pesquisa sobre qualidade de vida na escola, uma turma do 2º Ano do Ensino Médio decidiu revisar os tipos de perguntas que poderiam ser usadas no formulário digital. Relacione cada tipo com seu objetivo principal:",
    contexto: "Compreender os tipos de dados do Google Forms nos ajuda a escolher o melhor tratamento visual e analítico.",
    opcoes: [
      { key: "A", texto: "A-2, B-3, C-1, D-4" },
      { key: "B", texto: "A-1, B-2, C-4, D-3" },
      { key: "C", texto: "A-3, B-4, C-2, D-1" },
      { key: "D", texto: "A-4, B-1, C-3, D-2" }
    ],
    respostaCorreta: "A",
    explicacao: "Analisando as associações corretas:\n\n• A. Múltipla Escolha -> 2. Escolher uma única opção entre várias (ex: Gênero, Ano Escolar)\n• B. Caixa de Seleção -> 3. Permitir várias respostas em uma única pergunta (ex: Meios de transporte utilizados)\n• C. Escala Linear -> 1. Avaliar concordância ou intensidade de sentimento (ex: Avaliar de 1 a 5 o nível de estresse)\n• D. Resposta Curta -> 4. Coletar resposta objetiva e curta de texto livre (ex: Nome, Idade)",
    categoria: "Formularios",
    dificuldade: "Médio"
  },
  {
    id: 5,
    pergunta: "Durante a criação de um formulário digital para investigar hábitos alimentares, os estudantes discutiram diferentes formatos de perguntas e suas funções. Analise as afirmações, identificando as verdadeiras (V) e as falsas (F):",
    contexto: "Determinar o tipo ideal de pergunta define a facilidade para tabular seus dados digitais.",
    opcoes: [
      { key: "A", texto: "V - F - V - V - V" },
      { key: "B", texto: "V - V - F - V - V" },
      { key: "C", texto: "F - F - V - F - V" },
      { key: "D", texto: "V - F - F - V - F" }
    ],
    respostaCorreta: "A",
    explicacao: "Examinando as afirmações:\n\n1. (V) Escalas lineares de fato medem graus/nível ou frequência.\n2. (F) Perguntas de parágrafo livre são as mais DIFÍCEIS de analisar, pois geram textos longos impedindo uma contagem ou geração de gráficos estatísticos imediatos.\n3. (V) Múltipla escolha limita a exatamente uma escolha marcável.\n4. (V) Caixas de seleção servem para escolhas múltiplas simultâneas.\n5. (V) Cada questão deve possuir clareza e alinhamento com a pesquisa.\n\nPor isso, a sequência correta é V - F - V - V - V.",
    categoria: "Formularios",
    dificuldade: "Difícil"
  },
  {
    id: 6,
    pergunta: "Após montar um formulário sobre o impacto do uso de telas no dia a dia, Júlia percebeu que poucas pessoas haviam respondido e gostaria de que mais pessoas participassem. Pensando nisso, qual prática ajudaria Júlia a expandir a amostra de maneira ética e produtiva?",
    contexto: "Em estatística, o tamanho e a diversidade da amostra determinam a aplicabilidade dos resultados para toda a população.",
    opcoes: [
      { key: "A", texto: "Utilizar um único mural na escola a fim de centralizar o acesso ao link da pesquisa." },
      { key: "B", texto: "Convidar colegas da própria sala a fim de organizar os dados com mais facilidade." },
      { key: "C", texto: "Selecionar amigos mais próximos a fim de obter respostas de forma mais rápida." },
      { key: "D", texto: "Incentivar alunos de diferentes turmas a fim de alcançar uma amostra mais diversa." }
    ],
    respostaCorreta: "D",
    explicacao: "Amostragem de conveniência (apenas amigos ou apenas pessoas da sua sala de aula) gera um viés nos resultados. Incentivar a participação de alunos de diferentes turmas, turnos e idades aumenta a representatividade e a variabilidade dos perfis da amostra, tornando a pesquisa muito mais confiável e rica metodologicamente.",
    categoria: "AED",
    dificuldade: "Médio"
  },
  {
    id: 7,
    pergunta: "Durante uma pesquisa sobre hábitos alimentares na escola, Beatriz criou um formulário online e recebeu várias respostas. Agora, o que ela deve fazer para visualizar os dados organizados no Google Planilhas?",
    contexto: "O ecossistema do Google Forms é integrado por padrão com o Planilhas (Sheets).",
    opcoes: [
      { key: "A", texto: "Clicar em Imprimir respostas e depois exportar os gráficos." },
      { key: "B", texto: "Clicar em Respostas e selecionar o ícone de planilha verde." },
      { key: "C", texto: "Ativar a opção Resumo automático e colar as informações manualmente em uma planilha." },
      { key: "D", texto: "Fazer uma captura de tela das respostas e colar no Google Planilhas." }
    ],
    respostaCorreta: "B",
    explicacao: "Para exportar e analisar os dados estruturados do Google Forms, basta ir na aba 'Respostas' (Responses) no painel de edição do formulário e clicar no quadrado verde que possui uma cruz branca. Isso gera uma planilha do Planilhas Google vinculada em tempo real com todas as respostas, onde cada coluna é uma pergunta e cada linha um respondente.",
    categoria: "Planilhas",
    dificuldade: "Fácil"
  },
  {
    id: 8,
    pergunta: "Para garantir que o Google Colab consiga ler um arquivo, Carla salvou a planilha no formato ______, pois esse formato organiza os valores separados por vírgulas.",
    contexto: "Arquivos de dados estruturados são comumente exportados para formatos simples de texto para consumo em plataformas como Python e R.",
    opcoes: [
      { key: "A", texto: "Página da web." },
      { key: "B", texto: "TSV." },
      { key: "C", texto: "CSV." },
      { key: "D", texto: "PDF." }
    ],
    respostaCorreta: "C",
    explicacao: "O formato CSV significa Comma-Separated Values (Valores Separados por Vírgulas). É um arquivo texto simples onde cada campo de dados na linha é separado por um caractere delimitador (tipicamente vírgula ou ponto-e-vírgula em países latinos). Devido à sua simplicidade extrema e leveza, é o arquivo padrão mundial para ler tabelas em linguagens de análise como Python usando o Pandas.",
    categoria: "Planilhas",
    dificuldade: "Fácil"
  },
  {
    id: 9,
    pergunta: "Durante a revisão dos materiais produzidos pela turma, o professor sugeriu que os estudantes se perguntassem: “será que qualquer pessoa conseguiria entender do que se trata nossa pesquisa só olhando o material?”. Analise as afirmações, considerando (V) para verdadeira e (F) para falsa:",
    contexto: "A comunicação clara e visual de dados é uma competência fundamental na análise de dados para o público externo.",
    opcoes: [
      { key: "A", texto: "V - F - F - V - F" },
      { key: "B", texto: "V - V - F - V - F" },
      { key: "C", texto: "F - V - V - F - V" },
      { key: "D", texto: "V - F - V - F - V" }
    ],
    respostaCorreta: "D",
    explicacao: "Analisando os pontos:\n\n1. (V) Título claro foca o leitor no assunto.\n2. (F) Siglas obscuras como QTD, VAL e HRS ocultam o sentido imediato das colunas aos leigos.\n3. (V) Explicar a coleta demonstra rigor científico.\n4. (F) Um gráfico colorido sem eixos rotulados ou títulos não transmite informação alguma!\n5. (V) Textos contextuais curtos ajudam muito no entendimento.\n\nA sequência é V - F - V - F - V.",
    categoria: "AED",
    dificuldade: "Difícil"
  },
  {
    id: 10,
    pergunta: "João está aprendendo a trabalhar com dados usando o Google Colab e seu professor pediu que ele analisasse um conjunto de dados disponível em um arquivo CSV na internet. Para isso, João usou o código abaixo. O que o Colab deve exibir na saída?",
    contexto: "No final de uma célula de código no Jupyter / Google Colab, escrever o nome da variável aciona a visualização interativa do objeto.",
    opcoes: [
      { key: "A", texto: "Uma área sem conteúdo, indicando que o código foi executado." },
      { key: "B", texto: "Um quadro de registros, mostrando os números digitados." },
      { key: "C", texto: "Um gráfico automático com as informações contidas no arquivo." },
      { key: "D", texto: "Uma tabela formatada com os dados carregados do link." }
    ],
    respostaCorreta: "D",
    explicacao: "Em ambientes Jupyter Notebook e Google Colab, ao ler uma planilha com `pd.read_csv()` e colocar simplesmente o nome da variável (neste caso `dados`) na última linha da célula, o ambiente automaticamente renderiza uma tabela HTML formatada, interativa, com cores alternadas nas linhas, paginação e visualizador de colunas. Isso facilita incrivelmente a exploração visual rápida de dados.",
    categoria: "Colab",
    dificuldade: "Difícil"
  }
];

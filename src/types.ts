export interface Question {
  id: number;
  pergunta: string;
  contexto?: string;
  opcoes: {
    key: string; // 'A', 'B', 'C', 'D'
    texto: string;
  }[];
  respostaCorreta: string; // 'A' | 'B' | 'C' | 'D'
  explicacao: string;
  categoria: 'AED' | 'Formularios' | 'Planilhas' | 'Colab';
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
}

export interface QuizProgress {
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionId -> selectedOptionKey
  isAnswered: boolean;
  score: number;
  showExplanation: boolean;
  quizCompleted: boolean;
}

export interface Badge {
  id: string;
  titulo: string;
  descricao: string;
  icone: string; // lucide icon name
  desbloqueado: boolean;
}

export type AppTab = 'aprender' | 'quiz' | 'laboratorio';

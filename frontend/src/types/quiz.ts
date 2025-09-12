export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  showResults: boolean;
}

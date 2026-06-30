/* ───────────────────────────────────────────
   Types · Quiz, Calification & Results
   ─────────────────────────────────────────── */

export type QuizType = 'quiz' | 'task' | 'exam';
export type QuestionType = 'single' | 'multiple' | 'open';

export interface QuizOption {
  id: string;
  letter: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  number: number;
  text: string;
  type: QuestionType;
  options: QuizOption[];
}

export interface Calification {
  id: string;
  title: string;
  type: QuizType;
  totalPoints: number;
  maxAttempts: number;
  timeLimitMinutes?: number;
  lessonId?: string;
  lesson?: import('./course').Lesson;
}

export interface QuizAttempt {
  id: string;
  calificationId: string;
  score: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  timeUsedSeconds: number;
  attemptNumber: number;
  completedAt: string;
}

export interface QuizAnswerReview {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizResults {
  attempt: QuizAttempt;
  topicBreakdown: { topic: string; percentage: number }[];
  answers: QuizAnswerReview[];
}


export enum QuestionStatus {
  NOT_VISITED = 'NOT_VISITED',
  NOT_ANSWERED = 'NOT_ANSWERED',
  ANSWERED = 'ANSWERED',
  MARKED_FOR_REVIEW = 'MARKED_FOR_REVIEW',
  ANSWERED_AND_MARKED_FOR_REVIEW = 'ANSWERED_AND_MARKED_FOR_REVIEW'
}

export enum QuestionType {
  MCQ = 'MCQ',
  MSQ = 'MSQ',
  NAT = 'NAT'
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: number; // For MCQ
  correctAnswers?: number[]; // For MSQ
  correctValue?: number | string; // For NAT (as string to handle precision if needed)
  correctRange?: { min: number; max: number }; // For NAT range validation
  image?: string;
}

export interface UserProgress {
  selectedOption: number | null; // For MCQ
  selectedOptions: number[]; // For MSQ
  natValue: string; // For NAT
  status: QuestionStatus;
}

export enum AppState {
  LOGIN = 'LOGIN',
  INSTRUCTIONS = 'INSTRUCTIONS',
  EXAM = 'EXAM',
  RESULT = 'RESULT'
}

export interface UserInfo {
  name: string;
  systemId: string;
  subject: string;
}

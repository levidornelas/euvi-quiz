export interface Question {
  id: number;
  image?: string;
  mediaAfter?: string;
  question: string;
  options: string[];
  correct: number
}

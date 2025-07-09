export interface Question {
  id: number;
  image?: string;
  question: string;
  options: string[];
  correct: number
}

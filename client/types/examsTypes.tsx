export type AnswerType = "type" | "whiteboard" | "upload" | "graph" | "construction";

export type Answer = {
  subQuestionId: string;
  type: AnswerType;
  content: string;
  whiteboardData?: string;
  graphData?: string;
  constructionData?: string;
  uploadData?: { name: string; data: string; type: string } | null;
};
export type ExamMode = "practice" | "exam"; // ← NEW

export type SubQuestion = {
  id: string;
  label: string;
  text: string;
  marks?: number;
  imageUrl?: string; // ← NEW: optional image for sub-question
  modelAnswer?: string; // ← NEW: official solution (shown in exam after submit, or after AI score in practice)
};

export type Question = {
  id: number;
  title: string;
  imageUrl?: string; // ← NEW: optional question-level image
  subQuestions: SubQuestion[];
};

// ← NEW: per-sub-question AI result
export type AIResult = {
  score: number;
  maxScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  showSolution: boolean;
};

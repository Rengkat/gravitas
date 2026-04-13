export type ExamCategory = "SECONDARY" | "PROFESSIONAL";
export type ExamType =
  | "JAMB"
  | "WAEC"
  | "NECO"
  | "NABTEB"
  | "BECE"
  | "JUNIOR_NECO"
  | "PROFESSIONAL";
export type QuestionType = "MCQ" | "THEORY" | "PRACTICAL" | "ALL";
export type ProfessionalExam = "ICAN" | "NMCN" | "CIPM" | "NIM" | "NIESV";

export interface PracticeConfig {
  examType: ExamType | null;
  professionalExam?: ProfessionalExam;
  year?: string;
  subject?: string; // single subject (non-JAMB)
  subjects?: string[]; // multi-subject (JAMB)
  questionType?: QuestionType;
  numQuestions?: number;
  timeLimit?: number;
}

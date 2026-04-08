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

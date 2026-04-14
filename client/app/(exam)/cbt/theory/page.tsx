"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, LogOut, Calculator, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import SubmitModel from "../../components/SubmitModel";
import TimeUpModal from "../../components/TimeUpModal";
import AiTotalScoreSummary from "../../components/AiTotalScoreSummary";
import Instructions from "./Instructions";
import { AIResult, Answer, AnswerType, ExamMode, SubQuestion } from "@/types/examsTypes";
import { essayQuestions } from "@/lib/mock/theoryQuestion";
import { formatTime } from "@/utils/formartTimer";
import SubQuestionAnswer from "./SubQuestionAnswer";
import CalculatorModal from "../../components/CalculatorModal";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────
   AI SCORING  — real Anthropic API call
───────────────────────────────────────────────────────── */
async function scoreWithAI(
  questionText: string,
  studentAnswer: string,
  marks: number,
  modelAnswer?: string,
): Promise<AIResult> {
  const systemPrompt = `You are an expert Nigerian secondary school and JAMB examiner. 
Score student answers fairly and provide constructive feedback.
Respond ONLY with valid JSON — no markdown, no preamble.
JSON shape:
{
  "score": <integer 0–${marks}>,
  "feedback": "<2-3 sentence overall comment>",
  "strengths": ["<point>", ...],
  "improvements": ["<point>", ...]
}`;

  const userContent = `Question (${marks} marks): ${questionText}

Student's Answer: ${studentAnswer || "(No answer provided)"}
${modelAnswer ? `\nMark Scheme / Model Answer:\n${modelAnswer}` : ""}

Score the student's answer out of ${marks} marks.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
      }),
    });
    const data = await response.json();
    const text =
      data.content
        ?.map((b: { type: string; text?: string }) => (b.type === "text" ? b.text : ""))
        .join("") ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return {
      score: Math.min(parsed.score ?? 0, marks),
      maxScore: marks,
      feedback: parsed.feedback ?? "",
      strengths: parsed.strengths ?? [],
      improvements: parsed.improvements ?? [],
      showSolution: false,
    };
  } catch {
    return {
      score: 0,
      maxScore: marks,
      feedback: "Could not connect to AI scoring service. Please try again.",
      strengths: [],
      improvements: [],
      showSolution: false,
    };
  }
}

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
function buildInitialAnswers(): Answer[] {
  return essayQuestions.flatMap((q) =>
    q.subQuestions.map((sub) => ({
      subQuestionId: sub.id,
      type: "type" as AnswerType,
      content: "",
      whiteboardData: undefined,
      graphData: undefined,
      constructionData: undefined,
      uploadData: null,
    })),
  );
}

/* ─────────────────────────────────────────────────────────
   Page component
───────────────────────────────────────────────────────── */
export default function CBTEssayPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [examStarted, setExamStarted] = useState(false);
  const [mode, setMode] = useState<ExamMode>("practice");
  const [timeRemaining, setTimeRemaining] = useState(2 * 60 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [aiResults, setAiResults] = useState<Record<string, AIResult>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  const isSubmittedRef = useRef(false);

  // Timer — only runs after exam starts and before submission
  useEffect(() => {
    if (!examStarted || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isSubmittedRef.current) {
            isSubmittedRef.current = true;
            setIsSubmitted(true);
            setShowTimeUpModal(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, isSubmitted]);

  const getAnswer = (id: string): Answer =>
    answers.find((a) => a.subQuestionId === id) ?? {
      subQuestionId: id,
      type: "type",
      content: "",
      whiteboardData: undefined,
      graphData: undefined,
      constructionData: undefined,
      uploadData: null,
    };

  const updateAnswer = (id: string, newAnswer: Answer) =>
    setAnswers((prev) => prev.map((a) => (a.subQuestionId === id ? newAnswer : a)));

  const isAnswered = (a: Answer) =>
    !!(a.content.trim() || a.whiteboardData || a.graphData || a.constructionData || a.uploadData);

  const handleAIScore = async (subQuestion: SubQuestion) => {
    const answer = getAnswer(subQuestion.id);
    setAiLoading((prev) => ({ ...prev, [subQuestion.id]: true }));
    const result = await scoreWithAI(
      subQuestion.text,
      answer.content || (answer.whiteboardData ? "[Handwritten / visual answer]" : ""),
      subQuestion.marks ?? 10,
      subQuestion.modelAnswer,
    );
    setAiResults((prev) => ({ ...prev, [subQuestion.id]: result }));
    setAiLoading((prev) => ({ ...prev, [subQuestion.id]: false }));
  };

  const handleToggleSolution = (subId: string) => {
    setAiResults((prev) => ({
      ...prev,
      [subId]: { ...prev[subId], showSolution: !prev[subId].showSolution },
    }));
  };

  const confirmSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitModal(false);
  };

  const isLowTime = timeRemaining < 300;

  // Show instructions screen until the student starts
  if (!examStarted)
    return (
      <Instructions
        onStart={(m) => {
          setMode(m);
          setAnswers(buildInitialAnswers()); // initialise answers on user action, not in an effect
          setExamStarted(true);
        }}
      />
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav
        className="bg-green-800 text-white sticky top-0 z-40 shadow-lg"
        aria-label="Exam toolbar">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Exit exam">
              <LogOut size={16} />
              <span className="text-[13px] font-medium">Exit</span>
            </Link>
            <button
              onClick={() => setShowCalculator(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open calculator">
              <Calculator size={16} />
              <span className="text-[13px] font-medium">Calc</span>
            </button>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Report issue">
              <AlertCircle size={16} />
              <span className="text-[13px] font-medium">Report</span>
            </button>
          </div>

          {/* Mode badge + timer */}
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                mode === "practice" ? "bg-yellow-400 text-yellow-900" : "bg-blue-400 text-blue-900"
              }`}>
              {mode === "practice" ? "PRACTICE" : "EXAM"}
            </span>
            <div
              className={`px-4 py-1.5 rounded-lg font-mono font-bold text-[15px] flex items-center gap-2 transition-colors ${
                isLowTime ? "bg-red-500 text-white" : "bg-yellow-400 text-green-900"
              }`}
              aria-live="polite"
              aria-label={`Time remaining: ${formatTime(timeRemaining)}`}>
              <Clock size={16} aria-hidden="true" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Identity + submit bar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center text-yellow-300 font-serif text-lg"
            aria-hidden="true">
            A
          </div>
          <div>
            <div className="text-[13px] font-bold text-green-800 uppercase">Alienyi Daniel</div>
            <div className="text-[11px] text-gray-500">Student Pro · JAMB UTME 2025</div>
          </div>
        </div>
        {!isSubmitted ? (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-green-800 text-white px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-green-700 transition-all">
            Submit
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
            <CheckCircle size={16} />
            Submitted
          </div>
        )}
      </div>

      {/* Calculator modal */}
      {showCalculator && <CalculatorModal onClose={() => setShowCalculator(false)} />}

      {/* Questions */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {essayQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-white rounded-xl border overflow-hidden"
            style={{ borderColor: "rgba(30,80,50,0.1)" }}>
            <div className="border-b p-5 bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" aria-hidden="true" />
                <span className="text-[15px] font-bold text-green-800">Question {question.id}</span>
              </div>
              <p className="text-[15px] font-medium text-gray-800 mt-2">{question.title}</p>
              {question.imageUrl && (
                <div className="mt-3">
                  <Image
                    src={question.imageUrl}
                    width={500}
                    height={500}
                    alt={`Diagram for Question ${question.id}`}
                    className="max-w-full rounded-lg border border-gray-200 max-h-72 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="p-5 space-y-6">
              {question.subQuestions.map((sub) => (
                <div key={sub.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-green-800 text-base shrink-0">{sub.label}</span>
                    <span className="text-sm text-gray-700 leading-relaxed flex-1">{sub.text}</span>
                    {sub.marks && (
                      <span className="text-xs text-green-700 font-semibold shrink-0 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        {sub.marks} marks
                      </span>
                    )}
                  </div>
                  {sub.imageUrl && (
                    <div className="mt-2 mb-3">
                      <Image
                        src={sub.imageUrl}
                        height={500}
                        width={500}
                        alt={`Diagram for sub-question ${sub.label}`}
                        className="max-w-full rounded-lg border border-gray-200 max-h-60 object-contain"
                      />
                    </div>
                  )}
                  {aiLoading[sub.id] && (
                    <div className="mt-3 flex items-center gap-2 text-green-700 text-sm">
                      <Loader2 size={16} className="animate-spin" />
                      <span>AI is scoring your answer…</span>
                    </div>
                  )}
                  <SubQuestionAnswer
                    subQuestion={sub}
                    answer={getAnswer(sub.id)}
                    onAnswerChange={(a) => updateAnswer(sub.id, a)}
                    mode={mode}
                    isSubmitted={isSubmitted}
                    aiResult={aiResults[sub.id]}
                    onAIScore={() => handleAIScore(sub)}
                    onToggleSolution={() => handleToggleSolution(sub.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {isSubmitted && mode === "practice" && Object.keys(aiResults).length > 0 && (
          <AiTotalScoreSummary aiResults={aiResults} essayQuestions={essayQuestions} />
        )}
      </div>

      {showSubmitModal && (
        <SubmitModel
          mode={mode}
          answers={answers}
          isAnswered={isAnswered}
          setShowSubmitModal={setShowSubmitModal}
          confirmSubmit={confirmSubmit}
        />
      )}

      {showTimeUpModal && (
        <TimeUpModal
          answers={answers}
          isAnswered={isAnswered}
          setShowTimeUpModal={setShowTimeUpModal}
          sessionId={sessionId}
        />
      )}
    </div>
  );
}

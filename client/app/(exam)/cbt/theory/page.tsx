// app/dashboard/practice/essay/[id]/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  LogOut,
  Calculator,
  AlertCircle,
  CheckCircle,
  FileText,
  Send,
  Play,
  Upload,
  Trash2,
  Type,
  PenTool,
  Bold,
  Italic,
  Underline,
  Eraser,
  HelpCircle,
  BarChart2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  Hash,
  Crosshair,
  Ruler,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Loader2,
  Star,
} from "lucide-react";
import TimeUpModal from "../../components/TimeUpModal";
import SubmitModel from "../mcq/SubmitModel";
import AiTotalScoreSummary from "../../components/AiTotalScoreSummary";
import Instructions from "./Instructions";
import { AIResult, Answer, AnswerType, ExamMode, SubQuestion } from "@/types/examsTypes";
import { essayQuestions } from "@/lib/mock/theoryQuestion";

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
   SUB-QUESTION ANSWER
───────────────────────────────────────────────────────── */
function SubQuestionAnswer({
  subQuestion,
  answer,
  onAnswerChange,
  mode,
  isSubmitted,
  aiResult,
  onAIScore,
  onToggleSolution,
}: {
  subQuestion: SubQuestion;
  answer: Answer;
  onAnswerChange: (a: Answer) => void;
  mode: ExamMode;
  isSubmitted: boolean;
  aiResult?: AIResult;
  onAIScore: () => void;
  onToggleSolution: () => void;
}) {
  const [activeTab, setActiveTab] = useState<AnswerType>(answer.type);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelRef = useRef<{ start: number; end: number } | null>(null);

  useEffect(() => {
    if (pendingSelRef.current && textareaRef.current) {
      const { start, end } = pendingSelRef.current;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
      pendingSelRef.current = null;
    }
  });

  const handleTypeChange = (content: string) =>
    onAnswerChange({ ...answer, type: "type", content });
  const handleWhiteboardSave = (data: string) =>
    onAnswerChange({ ...answer, type: "whiteboard", content: "", whiteboardData: data });
  const handleGraphSave = (data: string) =>
    onAnswerChange({ ...answer, type: "graph", content: "", graphData: data });
  const handleConstructionSave = (data: string) =>
    onAnswerChange({ ...answer, type: "construction", content: "", constructionData: data });
  const handleFileUpload = (file: File) => {
    const r = new FileReader();
    r.onload = (e) =>
      onAnswerChange({
        ...answer,
        type: "upload",
        content: "",
        uploadData: { name: file.name, data: e.target?.result as string, type: file.type },
      });
    r.readAsDataURL(file);
  };
  const removeUpload = () => {
    onAnswerChange({ ...answer, type: "upload", content: "", uploadData: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const insertFormatting = (before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = answer.content;
    const newText =
      text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
    pendingSelRef.current = { start: start + before.length, end: end + before.length };
    handleTypeChange(newText);
  };
  const insertSymbol = (sym: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const newText = answer.content.substring(0, start) + sym + answer.content.substring(start);
    pendingSelRef.current = { start: start + sym.length, end: start + sym.length };
    handleTypeChange(newText);
  };

  const wordCount = answer.content.trim() ? answer.content.trim().split(/\s+/).length : 0;
  const tabs: { id: AnswerType; label: string; icon: React.ReactNode }[] = [
    { id: "type", label: "Type", icon: <Type size={13} /> },
    { id: "whiteboard", label: "Whiteboard", icon: <PenTool size={13} /> },
    { id: "graph", label: "Graph Sheet", icon: <BarChart2 size={13} /> },
    { id: "construction", label: "Construction", icon: <Ruler size={13} /> },
    { id: "upload", label: "Upload", icon: <Upload size={13} /> },
  ];

  // In exam mode post-submit: show solution directly without scoring button
  const showDirectSolution = mode === "exam" && isSubmitted && subQuestion.modelAnswer;

  return (
    <div className="mt-4">
      {/* Tabs */}
      {!isSubmitted && (
        <div className="flex gap-0.5 border-b mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                onAnswerChange({ ...answer, type: tab.id });
              }}
              className={`px-3 py-2 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab.id ? "text-green-800 border-green-800 bg-green-50/50" : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"}`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Type panel */}
      {(!isSubmitted && activeTab === "type") || (isSubmitted && answer.type === "type") ? (
        <div>
          {!isSubmitted && (
            <div className="flex gap-0.5 mb-2 p-2 bg-gray-50 rounded-lg border flex-wrap">
              <button
                onClick={() => insertFormatting("**", "**")}
                title="Bold"
                className="p-1.5 rounded hover:bg-gray-200 transition-colors">
                <Bold size={13} />
              </button>
              <button
                onClick={() => insertFormatting("*", "*")}
                title="Italic"
                className="p-1.5 rounded hover:bg-gray-200 transition-colors">
                <Italic size={13} />
              </button>
              <button
                onClick={() => insertFormatting("__", "__")}
                title="Underline"
                className="p-1.5 rounded hover:bg-gray-200 transition-colors">
                <Underline size={13} />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
              {["²", "³", "½", "±", "×", "÷", "°", "π", "√", "∞", "≤", "≥", "≠", "∝"].map((sym) => (
                <button
                  key={sym}
                  onClick={() => insertSymbol(sym)}
                  className="px-1.5 py-1 rounded text-xs font-mono hover:bg-gray-200 transition-colors text-gray-700"
                  title={`Insert ${sym}`}>
                  {sym}
                </button>
              ))}
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={answer.content}
            readOnly={isSubmitted}
            onChange={(e) => handleTypeChange(e.target.value)}
            placeholder={`Write your answer for ${subQuestion.label} here…`}
            className={`w-full min-h-[180px] p-4 border rounded-xl text-sm leading-relaxed transition-all font-sans ${isSubmitted ? "bg-gray-50 text-gray-700 resize-none" : "resize-y focus:outline-none focus:ring-2 focus:ring-green-800/30 focus:border-green-700"}`}
            style={{ borderColor: "rgba(30,80,50,0.2)" }}
          />
          {!isSubmitted && (
            <div className="flex justify-between mt-1.5 text-[11px] text-gray-400 px-1">
              <span>
                {wordCount} word{wordCount !== 1 ? "s" : ""}
              </span>
              <span>{answer.content.length} chars</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Whiteboard */}
      {!isSubmitted && activeTab === "whiteboard" && (
        <LinedCanvas
          subQuestionId={subQuestion.id}
          onSave={handleWhiteboardSave}
          initialData={answer.whiteboardData}
        />
      )}
      {isSubmitted && answer.type === "whiteboard" && answer.whiteboardData && (
        <img
          src={answer.whiteboardData}
          alt="Your whiteboard answer"
          className="rounded-xl border max-w-full"
        />
      )}

      {/* Graph */}
      {!isSubmitted && activeTab === "graph" && (
        <GraphCanvas
          subQuestionId={subQuestion.id}
          onSave={handleGraphSave}
          initialData={answer.graphData}
        />
      )}
      {isSubmitted && answer.type === "graph" && answer.graphData && (
        <img
          src={answer.graphData}
          alt="Your graph answer"
          className="rounded-xl border max-w-full"
        />
      )}

      {/* Construction */}
      {!isSubmitted && activeTab === "construction" && (
        <ConstructionCanvas
          subQuestionId={subQuestion.id}
          onSave={handleConstructionSave}
          initialData={answer.constructionData}
        />
      )}
      {isSubmitted && answer.type === "construction" && answer.constructionData && (
        <img
          src={answer.constructionData}
          alt="Your construction answer"
          className="rounded-xl border max-w-full"
        />
      )}

      {/* Upload */}
      {!isSubmitted && activeTab === "upload" && (
        <div>
          {!answer.uploadData ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFileUpload(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all hover:border-green-700 hover:bg-green-50"
              style={{ borderColor: "rgba(30,80,50,0.25)" }}>
              <Upload size={36} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-600">
                Click or drag &amp; drop to upload
              </p>
              <p className="text-xs text-gray-400 mt-1">Supports images (JPG, PNG) and PDF files</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border rounded-xl p-4" style={{ borderColor: "rgba(30,80,50,0.15)" }}>
              {answer.uploadData.type.startsWith("image/") ? (
                <img
                  src={answer.uploadData.data}
                  alt="Uploaded answer"
                  className="max-w-full max-h-80 rounded-lg mx-auto object-contain"
                />
              ) : (
                <div className="text-center py-10">
                  <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">{answer.uploadData.name}</p>
                </div>
              )}
              <div className="flex justify-center mt-4 gap-3">
                <button
                  onClick={removeUpload}
                  className="text-red-600 text-xs flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-all">
                  <Trash2 size={13} />
                  Remove
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-green-700 text-xs flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-50 transition-all">
                  <Upload size={13} />
                  Replace
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {isSubmitted && answer.type === "upload" && answer.uploadData && (
        <div className="border rounded-xl p-4" style={{ borderColor: "rgba(30,80,50,0.15)" }}>
          {answer.uploadData.type.startsWith("image/") ? (
            <img
              src={answer.uploadData.data}
              alt="Uploaded answer"
              className="max-w-full max-h-80 rounded-lg mx-auto object-contain"
            />
          ) : (
            <div className="text-center py-6">
              <FileText size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium">{answer.uploadData.name}</p>
            </div>
          )}
        </div>
      )}

      {/* ── POST-SUBMIT ACTIONS ── */}
      {isSubmitted && (
        <div className="mt-4">
          {/* Practice mode: AI Score button */}
          {mode === "practice" && !aiResult && (
            <button
              onClick={onAIScore}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-800 to-green-700 text-white rounded-xl text-sm font-bold hover:from-green-700 hover:to-green-600 transition-all shadow-sm">
              <Sparkles size={15} />
              Score with AI &amp; See Solution
            </button>
          )}

          {/* Exam mode: show solution directly */}
          {showDirectSolution && !aiResult && (
            <div className="mt-2 p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-[11px] font-bold text-green-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <BookOpen size={12} />
                Model Answer
              </p>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {subQuestion.modelAnswer}
              </pre>
            </div>
          )}

          {/* AI result panel */}
          {aiResult && (
            <AIResultPanel
              result={aiResult}
              modelAnswer={subQuestion.modelAnswer}
              onToggleSolution={onToggleSolution}
              mode={mode}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function CBTEssayPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [examStarted, setExamStarted] = useState(false);
  const [mode, setMode] = useState<ExamMode>("practice");
  const [timeRemaining, setTimeRemaining] = useState(2 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // ← NEW: per-sub-question AI results & loading states
  const [aiResults, setAiResults] = useState<Record<string, AIResult>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  // Calc state
  const [calcInput, setCalcInput] = useState("0");
  const [calcExpr, setCalcExpr] = useState("");
  const [calcMemory, setCalcMemory] = useState(0);
  const [calcHistory, setCalcHistory] = useState<string[]>([]);
  const [calcShift, setCalcShift] = useState(false);
  const [calcError, setCalcError] = useState(false);
  const isSubmittedRef = useRef(false);

  useEffect(() => {
    if (!examStarted) return;
    setAnswers(
      essayQuestions.flatMap((q) =>
        q.subQuestions.map((sub) => ({
          subQuestionId: sub.id,
          type: "type" as AnswerType,
          content: "",
          whiteboardData: undefined,
          graphData: undefined,
          constructionData: undefined,
          uploadData: null,
        })),
      ),
    );
  }, [examStarted]);

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
  const totalMarks = essayQuestions.reduce(
    (acc, q) => acc + q.subQuestions.reduce((s, sub) => s + (sub.marks ?? 0), 0),
    0,
  );

  // ← NEW: score a single sub-question with AI
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

  // ← NEW: toggle solution visibility
  const handleToggleSolution = (subId: string) => {
    setAiResults((prev) => ({
      ...prev,
      [subId]: { ...prev[subId], showSolution: !prev[subId].showSolution },
    }));
  };

  // Exam mode: on submit show all model answers immediately
  const confirmSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitModal(false);
  };

  // Calculator
  const calcEval = (expr: string): number => {
    const sanitized = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π/g, String(Math.PI))
      .replace(/e(?![0-9])/g, String(Math.E));
    // eslint-disable-next-line no-eval
    return eval(sanitized);
  };
  const handleCalcBtn = (val: string) => {
    setCalcError(false);
    const operators = ["+", "-", "×", "÷", "^"];
    if (val === "SHIFT") {
      setCalcShift((s) => !s);
      return;
    }
    if (val === "AC") {
      setCalcInput("0");
      setCalcExpr("");
      setCalcShift(false);
      return;
    }
    if (val === "CE") {
      setCalcInput((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
      return;
    }
    if (val === "=") {
      try {
        const full = calcExpr + calcInput;
        const result = calcEval(full);
        const r = Number.isInteger(result)
          ? String(result)
          : parseFloat(result.toFixed(10)).toString();
        setCalcHistory((h) => [`${full} = ${r}`, ...h.slice(0, 9)]);
        setCalcExpr("");
        setCalcInput(r);
      } catch {
        setCalcInput("Error");
        setCalcExpr("");
        setCalcError(true);
      }
      setCalcShift(false);
      return;
    }
    if (val === "M+") {
      setCalcMemory((m) => m + parseFloat(calcInput));
      return;
    }
    if (val === "M-") {
      setCalcMemory((m) => m - parseFloat(calcInput));
      return;
    }
    if (val === "MR") {
      setCalcInput(String(calcMemory));
      return;
    }
    if (val === "MC") {
      setCalcMemory(0);
      return;
    }
    const unary: Record<string, (n: number) => number> = {
      sin: (n) => Math.sin(calcShift ? (n * Math.PI) / 180 : n),
      cos: (n) => Math.cos(calcShift ? (n * Math.PI) / 180 : n),
      tan: (n) => Math.tan(calcShift ? (n * Math.PI) / 180 : n),
      asin: (n) => Math.asin(n),
      acos: (n) => Math.acos(n),
      atan: (n) => Math.atan(n),
      log: (n) => Math.log10(n),
      ln: (n) => Math.log(n),
      "√": (n) => Math.sqrt(n),
      "x²": (n) => n * n,
      "x³": (n) => n * n * n,
      "1/x": (n) => 1 / n,
      "10^x": (n) => Math.pow(10, n),
      "e^x": (n) => Math.exp(n),
      "n!": (n) => {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
      },
    };
    if (val in unary) {
      try {
        const n = parseFloat(calcInput);
        const result = unary[val](n);
        const r = parseFloat(result.toFixed(10)).toString();
        setCalcExpr(`${val}(${calcInput})`);
        setCalcInput(r);
      } catch {
        setCalcInput("Error");
        setCalcError(true);
      }
      setCalcShift(false);
      return;
    }
    if (val === "π") {
      setCalcInput(String(Math.PI));
      return;
    }
    if (val === "e") {
      setCalcInput(String(Math.E));
      return;
    }
    if (operators.includes(val)) {
      setCalcExpr((prev) => prev + calcInput + val);
      setCalcInput("0");
      return;
    }
    if (val === "(" || val === ")") {
      setCalcExpr((prev) => prev + val);
      return;
    }
    if (val === ".") {
      setCalcInput((d) => (d.includes(".") ? d : d + "."));
      return;
    }
    if (val === "+/-") {
      setCalcInput((d) => (d.startsWith("-") ? d.slice(1) : "-" + d));
      return;
    }
    setCalcInput((d) => (d === "0" ? val : d + val));
  };

  const isLowTime = timeRemaining < 300;
  if (!examStarted)
    return (
      <Instructions
        onStart={(m) => {
          setMode(m);
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
              onClick={() => setShowCalculator(!showCalculator)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Calculator">
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
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${mode === "practice" ? "bg-yellow-400 text-yellow-900" : "bg-blue-400 text-blue-900"}`}>
              {mode === "practice" ? "PRACTICE" : "EXAM"}
            </span>
            <div
              className={`px-4 py-1.5 rounded-lg font-mono font-bold text-[15px] flex items-center gap-2 transition-colors ${isLowTime ? "bg-red-500 text-white" : "bg-yellow-400 text-green-900"}`}
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
        {!isSubmitted && (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-green-800 text-white px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-green-700 transition-all">
            Submit
          </button>
        )}
        {isSubmitted && (
          <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
            <CheckCircle size={16} />
            Submitted
          </div>
        )}
      </div>

      {/* Calculator */}
      {showCalculator && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-label="Scientific Calculator">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-green-900 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calculator size={16} className="text-green-300" />
                <span className="font-bold text-sm">Scientific Calculator</span>
                {calcShift && (
                  <span className="text-[10px] bg-yellow-400 text-yellow-900 font-bold px-1.5 py-0.5 rounded">
                    SHIFT
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-white/60 hover:text-white text-xl leading-none">
                ✕
              </button>
            </div>
            <div className="bg-green-950 px-4 py-3">
              <div className="text-green-400 text-xs font-mono min-h-[16px] text-right truncate mb-1">
                {calcExpr || " "}
              </div>
              <div
                className={`text-right font-mono font-bold text-3xl truncate ${calcError ? "text-red-400" : "text-white"}`}>
                {calcInput}
              </div>
              {calcMemory !== 0 && (
                <div className="text-right text-[10px] text-green-400 font-mono mt-0.5">
                  M = {calcMemory}
                </div>
              )}
            </div>
            {calcHistory.length > 0 && (
              <div className="bg-green-900/20 border-b px-3 py-1 max-h-16 overflow-y-auto">
                {calcHistory.slice(0, 3).map((h, i) => (
                  <div key={i} className="text-[10px] text-gray-400 font-mono text-right truncate">
                    {h}
                  </div>
                ))}
              </div>
            )}
            <div className="p-3 grid grid-cols-5 gap-1.5 bg-gray-50">
              {[
                { label: "SHIFT", type: "shift" },
                { label: "MC", type: "mem" },
                { label: "MR", type: "mem" },
                { label: "M+", type: "mem" },
                { label: "M-", type: "mem" },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={() => handleCalcBtn(b.label)}
                  className={`py-2 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${b.type === "shift" ? (calcShift ? "bg-yellow-400 text-yellow-900" : "bg-green-700 text-white hover:bg-green-600") : "bg-green-100 text-green-800 hover:bg-green-200"}`}>
                  {b.label}
                </button>
              ))}
              {[
                { label: calcShift ? "asin" : "sin", val: calcShift ? "asin" : "sin" },
                { label: calcShift ? "acos" : "cos", val: calcShift ? "acos" : "cos" },
                { label: calcShift ? "atan" : "tan", val: calcShift ? "atan" : "tan" },
                { label: "log", val: "log" },
                { label: "ln", val: "ln" },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={() => handleCalcBtn(b.val)}
                  className="py-2 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all active:scale-95">
                  {b.label}
                </button>
              ))}
              {["x²", "x³", "√", "10^x", "e^x"].map((b) => (
                <button
                  key={b}
                  onClick={() => handleCalcBtn(b)}
                  className="py-2 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all active:scale-95">
                  {b}
                </button>
              ))}
              {["1/x", "n!", "π", "e", "^"].map((b) => (
                <button
                  key={b}
                  onClick={() => handleCalcBtn(b)}
                  className="py-2 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all active:scale-95">
                  {b}
                </button>
              ))}
              {["(", ")", "AC", "CE", "÷"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcBtn(btn)}
                  className={`py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${btn === "AC" ? "bg-red-100 text-red-700 hover:bg-red-200" : btn === "CE" ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : btn === "÷" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                  {btn}
                </button>
              ))}
              {["7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcBtn(btn)}
                  className={`py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${["×", "-", "+"].includes(btn) ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-white border border-gray-200 text-gray-800 hover:bg-gray-100"}`}>
                  {btn}
                </button>
              ))}
              <button
                onClick={() => handleCalcBtn("+/-")}
                className="py-2.5 rounded-lg text-sm font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all active:scale-95">
                +/-
              </button>
              <button
                onClick={() => handleCalcBtn("0")}
                className="py-2.5 rounded-lg text-sm font-bold bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 transition-all active:scale-95">
                0
              </button>
              <button
                onClick={() => handleCalcBtn(".")}
                className="py-2.5 rounded-lg text-sm font-bold bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 transition-all active:scale-95">
                .
              </button>
              <button
                onClick={() => handleCalcBtn("=")}
                className="col-span-2 py-2.5 rounded-lg text-sm font-bold bg-green-800 text-white hover:bg-green-700 transition-all active:scale-95">
                =
              </button>
            </div>
          </div>
        </div>
      )}

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
              {/* ← NEW: question-level image */}
              {question.imageUrl && (
                <div className="mt-3">
                  <img
                    src={question.imageUrl}
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
                  {/* ← NEW: sub-question image */}
                  {sub.imageUrl && (
                    <div className="mt-2 mb-3">
                      <img
                        src={sub.imageUrl}
                        alt={`Diagram for sub-question ${sub.label}`}
                        className="max-w-full rounded-lg border border-gray-200 max-h-60 object-contain"
                      />
                    </div>
                  )}
                  {/* Loading indicator */}
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

        {/* Total AI score summary (practice, after scoring all) */}
        {isSubmitted && mode === "practice" && Object.keys(aiResults).length > 0 && (
          <AiTotalScoreSummary aiResults={aiResults} essayQuestions={essayQuestions} />
        )}
      </div>

      {/* Submit modal */}
      {showSubmitModal && (
        <SubmitModel
          mode={mode}
          answers={answers}
          isAnswered={isAnswered}
          setShowSubmitModal={setShowSubmitModal}
          confirmSubmit={confirmSubmit}
        />
      )}

      {/* Time up modal */}
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

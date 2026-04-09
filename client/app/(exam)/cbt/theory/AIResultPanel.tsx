import { AIResult, ExamMode } from "@/types/examsTypes";
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   AI RESULT PANEL  ← NEW
───────────────────────────────────────────────────────── */
export default function AIResultPanel({
  result,
  modelAnswer,
  onToggleSolution,
  mode,
}: {
  result: AIResult;
  modelAnswer?: string;
  onToggleSolution: () => void;
  mode: ExamMode;
}) {
  const pct = Math.round((result.score / result.maxScore) * 100);
  const color = pct >= 70 ? "text-green-700" : pct >= 50 ? "text-yellow-600" : "text-red-600";
  const barColor = pct >= 70 ? "bg-green-600" : pct >= 50 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div
      className="mt-4 rounded-xl border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.15)" }}>
      {/* Score header */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-yellow-300" />
          <span className="text-white text-sm font-bold">AI Assessment</span>
        </div>
        <div className={`text-white font-mono font-bold text-lg`}>
          {result.score}
          <span className="text-green-300 text-sm font-normal">/{result.maxScore}</span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className={`h-full ${barColor} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="p-4 space-y-3 bg-white">
        {/* Feedback */}
        <p className="text-sm text-gray-700 leading-relaxed">{result.feedback}</p>
        {/* Strengths */}
        {result.strengths.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-green-700 uppercase tracking-wide mb-1.5">
              Strengths
            </p>
            <ul className="space-y-1">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600">
                  <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Improvements */}
        {result.improvements.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wide mb-1.5">
              Areas to Improve
            </p>
            <ul className="space-y-1">
              {result.improvements.map((s, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600">
                  <span className="text-orange-500 mt-0.5 shrink-0">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Model answer toggle (always shown in exam post-submit; toggle in practice) */}
        {modelAnswer && (
          <div>
            <button
              onClick={onToggleSolution}
              className="flex items-center gap-2 text-xs font-semibold text-green-800 hover:text-green-600 transition-colors mt-1">
              <BookOpen size={13} />
              {result.showSolution ? "Hide Model Answer" : "Show Model Answer"}
              {result.showSolution ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {result.showSolution && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-[11px] font-bold text-green-800 uppercase tracking-wide mb-1.5">
                  Model Answer / Mark Scheme
                </p>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {modelAnswer}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

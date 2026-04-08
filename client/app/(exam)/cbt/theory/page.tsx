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

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type SubQuestion = {
  id: string;
  label: string;
  text: string;
  marks?: number;
  imageUrl?: string; // ← NEW: optional image for sub-question
  modelAnswer?: string; // ← NEW: official solution (shown in exam after submit, or after AI score in practice)
};

type Question = {
  id: number;
  title: string;
  imageUrl?: string; // ← NEW: optional question-level image
  subQuestions: SubQuestion[];
};

type AnswerType = "type" | "whiteboard" | "upload" | "graph" | "construction";

type Answer = {
  subQuestionId: string;
  type: AnswerType;
  content: string;
  whiteboardData?: string;
  graphData?: string;
  constructionData?: string;
  uploadData?: { name: string; data: string; type: string } | null;
};

// ← NEW: per-sub-question AI result
type AIResult = {
  score: number;
  maxScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  showSolution: boolean;
};

type ExamMode = "practice" | "exam"; // ← NEW

/* ─────────────────────────────────────────────────────────
   MOCK DATA  (in production, fetched from dashboard API)
───────────────────────────────────────────────────────── */
const essayQuestions: Question[] = [
  {
    id: 1,
    title: "Newton's Laws of Motion and Applications",
    subQuestions: [
      {
        id: "1a",
        label: "(a)",
        text: "State Newton's three laws of motion.",
        marks: 6,
        modelAnswer:
          "1st Law (Inertia): A body remains at rest or in uniform motion unless acted upon by an external force.\n2nd Law: The rate of change of momentum is proportional to the applied force and acts in its direction; F = ma.\n3rd Law: For every action there is an equal and opposite reaction.",
      },
      {
        id: "1b",
        label: "(b)",
        text: "A car of mass 1200 kg accelerates from rest to 20 m/s in 8 seconds. Calculate the force exerted by the engine (ignore friction).",
        marks: 8,
        modelAnswer:
          "Using F = ma, first find acceleration:\na = (v - u)/t = (20 - 0)/8 = 2.5 m/s²\nThen F = ma = 1200 × 2.5 = 3000 N",
      },
      {
        id: "1c",
        label: "(c)",
        text: "(i) Define impulse. (ii) A force of 50 N acts on a body for 0.2 seconds. Calculate the impulse.",
        marks: 6,
        modelAnswer:
          "(i) Impulse is the product of force and the time for which it acts. J = F × t. It equals the change in momentum of the body.\n(ii) J = F × t = 50 × 0.2 = 10 Ns",
      },
    ],
  },
  {
    id: 2,
    title: "Thermodynamics and Heat Transfer",
    // imageUrl: "/questions/thermo-diagram.png",  ← example of question image
    subQuestions: [
      {
        id: "2a",
        label: "(a)",
        text: "Explain the three methods of heat transfer, giving one example of each.",
        marks: 10,
        modelAnswer:
          "1. Conduction: Transfer of heat through a material by direct contact without bulk movement. Example: Heat along a metal rod.\n2. Convection: Transfer by bulk movement of a fluid (liquid or gas). Example: Boiling water — hot water rises, cool water sinks.\n3. Radiation: Transfer by electromagnetic waves without needing a medium. Example: Heat from the Sun reaching Earth.",
      },
      {
        id: "2b",
        label: "(b)",
        text: "A metal rod of length 0.5 m has a temperature difference of 100°C between its ends. If the thermal conductivity is 200 W/mK and cross-sectional area is 0.01 m², calculate the rate of heat transfer.",
        marks: 10,
        modelAnswer:
          "Using Fourier's Law: Q/t = kA(ΔT/L)\nQ/t = 200 × 0.01 × (100/0.5)\nQ/t = 200 × 0.01 × 200\nQ/t = 400 W",
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getEventCoords(
  e: React.MouseEvent | React.TouchEvent,
  canvas: HTMLCanvasElement,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
  return {
    x: Math.max(0, Math.min(canvas.width, (clientX - rect.left) * scaleX)),
    y: Math.max(0, Math.min(canvas.height, (clientY - rect.top) * scaleY)),
  };
}

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
   SHARED DRAWING TOOLBAR
───────────────────────────────────────────────────────── */
interface DrawingToolbarProps {
  tool: "draw" | "erase";
  setTool: (t: "draw" | "erase") => void;
  color: string;
  setColor: (c: string) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  onClear: () => void;
  onDownload: () => void;
  colors?: string[];
  extraRight?: React.ReactNode;
}

function DrawingToolbar({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  onClear,
  onDownload,
  colors = ["#1a4a2e", "#c0392b", "#2980b9", "#8e44ad", "#e67e22", "#1a1a1a"],
  extraRight,
}: DrawingToolbarProps) {
  return (
    <div className="bg-gray-50 p-2.5 flex flex-wrap gap-2 items-center border-b">
      <button
        onClick={() => setTool("draw")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${tool === "draw" ? "bg-green-800 text-white shadow-sm" : "bg-white border hover:bg-gray-100"}`}>
        <PenTool size={13} />
        Draw
      </button>
      <button
        onClick={() => setTool("erase")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${tool === "erase" ? "bg-green-800 text-white shadow-sm" : "bg-white border hover:bg-gray-100"}`}>
        <Eraser size={13} />
        Erase
      </button>
      <button
        onClick={onClear}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all">
        Clear All
      </button>
      <div className="h-5 w-px bg-gray-300 mx-0.5" />
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => {
            setColor(c);
            setTool("draw");
          }}
          title={c}
          className={`w-6 h-6 rounded-full border-2 transition-all ${color === c && tool === "draw" ? "border-green-800 scale-110 shadow-md" : "border-gray-300 hover:scale-105"}`}
          style={{ backgroundColor: c }}
        />
      ))}
      <div className="h-5 w-px bg-gray-300 mx-0.5" />
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-500 font-medium">Size:</span>
        <input
          type="range"
          min="1"
          max="14"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-20 accent-green-800"
        />
        <span className="text-[11px] text-gray-500 w-4">{brushSize}</span>
      </div>
      <div className="ml-auto flex items-center gap-1">
        {extraRight}
        <button
          onClick={onDownload}
          title="Download"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border hover:bg-green-50 hover:border-green-400 hover:text-green-700 flex items-center gap-1.5 transition-all">
          <Download size={13} />
          Save
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LINED CANVAS (Whiteboard)
───────────────────────────────────────────────────────── */
function LinedCanvas({
  subQuestionId,
  onSave,
  initialData,
}: {
  subQuestionId: string;
  onSave: (d: string) => void;
  initialData?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const toolRef = useRef<"draw" | "erase">("draw");
  const colorRef = useRef("#1a4a2e");
  const brushSizeRef = useRef(2);
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [color, setColor] = useState("#1a4a2e");
  const [brushSize, setBrushSize] = useState(2);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    colorRef.current = color;
  }, [color]);
  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  const drawLines = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.strokeStyle = "#d6e4d8";
    ctx.lineWidth = 0.8;
    for (let y = 30; y < h; y += 28) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(50, h);
    ctx.strokeStyle = "#e8a87c";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 800;
    canvas.height = rect.height || 300;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fef9ef";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawLines(ctx, canvas.width, canvas.height);
    if (initialData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = initialData;
    }
  }, [drawLines, initialData]);
  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    lastPosRef.current = getEventCoords(e, canvasRef.current!);
  };
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = toolRef.current === "erase" ? "#fef9ef" : colorRef.current;
    ctx.lineWidth = toolRef.current === "erase" ? brushSizeRef.current * 4 : brushSizeRef.current;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPosRef.current = { x, y };
  };
  const stop = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const c = canvasRef.current;
    if (c) onSave(c.toDataURL());
  };
  const clearCanvas = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#fef9ef";
    ctx.fillRect(0, 0, c.width, c.height);
    drawLines(ctx, c.width, c.height);
    onSave(c.toDataURL());
  };

  return (
    <div
      className="border rounded-xl overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.15)" }}>
      <DrawingToolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        onClear={clearCanvas}
        onDownload={() => {
          const a = document.createElement("a");
          a.href = canvasRef.current!.toDataURL("image/png");
          a.download = `whiteboard-${subQuestionId}.png`;
          a.click();
        }}
      />
      <canvas
        ref={canvasRef}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
        className="w-full cursor-crosshair touch-none"
        style={{ background: "#fef9ef", minHeight: "300px" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CONSTRUCTION CANVAS
───────────────────────────────────────────────────────── */
function ConstructionCanvas({
  subQuestionId,
  onSave,
  initialData,
}: {
  subQuestionId: string;
  onSave: (d: string) => void;
  initialData?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const toolRef = useRef<"draw" | "erase">("draw");
  const colorRef = useRef("#1a1a1a");
  const brushSizeRef = useRef(2);
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [color, setColor] = useState("#1a1a1a");
  const [brushSize, setBrushSize] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    colorRef.current = color;
  }, [color]);
  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (initialData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = initialData;
    }
  }, [initialData]);
  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    lastPosRef.current = getEventCoords(e, canvasRef.current!);
  };
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = toolRef.current === "erase" ? "#ffffff" : colorRef.current;
    ctx.lineWidth = toolRef.current === "erase" ? brushSizeRef.current * 5 : brushSizeRef.current;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPosRef.current = { x, y };
  };
  const stop = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const c = canvasRef.current;
    if (c) onSave(c.toDataURL());
  };
  const clearCanvas = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    onSave(c.toDataURL());
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all ${isFullscreen ? "fixed inset-4 z-50 shadow-2xl flex flex-col" : ""}`}
      style={{ borderColor: "rgba(30,80,50,0.15)", background: "#fff" }}>
      <div className="bg-green-900 text-green-100 px-4 py-1 flex items-center gap-3 text-[11px] font-mono">
        <Ruler size={13} className="text-green-400" />
        <span className="text-green-400 font-semibold">CONSTRUCTION SHEET</span>
        <button
          onClick={() => setIsFullscreen((f) => !f)}
          className="ml-auto px-2.5 py-1 rounded border border-green-700 bg-green-800 hover:bg-green-700 transition-all text-xs flex items-center gap-1">
          {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>
      <DrawingToolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        onClear={clearCanvas}
        onDownload={() => {
          const a = document.createElement("a");
          a.href = canvasRef.current!.toDataURL("image/png");
          a.download = `construction-${subQuestionId}.png`;
          a.click();
        }}
        colors={["#1a1a1a", "#c0392b", "#2980b9", "#1a4a2e", "#8e44ad", "#e67e22", "#7f8c8d"]}
      />
      <div
        className="overflow-auto"
        style={{
          maxHeight: isFullscreen ? "calc(100vh - 120px)" : "520px",
          background: "#e8e8e8",
        }}>
        <div style={{ margin: "12px", display: "inline-block" }}>
          <canvas
            ref={canvasRef}
            onMouseDown={start}
            onMouseMove={draw}
            onMouseUp={stop}
            onMouseLeave={stop}
            onTouchStart={start}
            onTouchMove={draw}
            onTouchEnd={stop}
            className="block touch-none shadow-lg"
            style={{ cursor: "crosshair", border: "1px solid #ccc", background: "#fff" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   GRAPH CANVAS  (unchanged from original)
───────────────────────────────────────────────────────── */
type GraphMode = "draw" | "erase" | "point" | "crosshair";
const GRID = {
  majorSize: 50,
  minorDivs: 5,
  cols: 16,
  rows: 12,
  marginLeft: 50,
  marginTop: 30,
  marginRight: 20,
  marginBottom: 40,
} as const;

function GraphCanvas({
  subQuestionId,
  onSave,
  initialData,
}: {
  subQuestionId: string;
  onSave: (d: string) => void;
  initialData?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const toolRef = useRef<GraphMode>("draw");
  const colorRef = useRef("#c0392b");
  const brushSizeRef = useRef(2);
  const overlayInitRef = useRef(false);
  const [tool, setTool] = useState<GraphMode>("draw");
  const [color, setColor] = useState("#c0392b");
  const [brushSize, setBrushSize] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    colorRef.current = color;
  }, [color]);
  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  const drawGraphSheet = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      const { majorSize, minorDivs, cols, rows, marginLeft, marginTop } = GRID;
      const minorSize = majorSize / minorDivs;
      const gridW = cols * majorSize;
      const gridH = rows * majorSize;
      ctx.strokeStyle = "#c8dfc8";
      ctx.lineWidth = 0.4;
      for (let x = 0; x <= cols * minorDivs; x++) {
        ctx.beginPath();
        ctx.moveTo(marginLeft + x * minorSize, marginTop);
        ctx.lineTo(marginLeft + x * minorSize, marginTop + gridH);
        ctx.stroke();
      }
      for (let y = 0; y <= rows * minorDivs; y++) {
        ctx.beginPath();
        ctx.moveTo(marginLeft, marginTop + y * minorSize);
        ctx.lineTo(marginLeft + gridW, marginTop + y * minorSize);
        ctx.stroke();
      }
      ctx.strokeStyle = "#5aaa5a";
      ctx.lineWidth = 0.9;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(marginLeft + x * majorSize, marginTop);
        ctx.lineTo(marginLeft + x * majorSize, marginTop + gridH);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(marginLeft, marginTop + y * majorSize);
        ctx.lineTo(marginLeft + gridW, marginTop + y * majorSize);
        ctx.stroke();
      }
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(marginLeft, marginTop + gridH);
      ctx.lineTo(marginLeft + gridW, marginTop + gridH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(marginLeft, marginTop);
      ctx.lineTo(marginLeft, marginTop + gridH);
      ctx.stroke();
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.moveTo(marginLeft + gridW + 8, marginTop + gridH);
      ctx.lineTo(marginLeft + gridW, marginTop + gridH - 4);
      ctx.lineTo(marginLeft + gridW, marginTop + gridH + 4);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(marginLeft, marginTop - 8);
      ctx.lineTo(marginLeft - 4, marginTop);
      ctx.lineTo(marginLeft + 4, marginTop);
      ctx.fill();
      if (showLabels) {
        ctx.fillStyle = "#333";
        ctx.font = "bold 11px 'Courier New',monospace";
        ctx.textAlign = "center";
        for (let x = 0; x <= cols; x++) {
          if (x % 2 === 0)
            ctx.fillText(String(x), marginLeft + x * majorSize, marginTop + gridH + 18);
        }
        ctx.textAlign = "right";
        for (let y = 0; y <= rows; y++) {
          if (y % 2 === 0)
            ctx.fillText(String(rows - y), marginLeft - 6, marginTop + y * majorSize + 4);
        }
        ctx.fillStyle = "#1a4a2e";
        ctx.font = "bold 12px 'Courier New',monospace";
        ctx.textAlign = "center";
        ctx.fillText("x", marginLeft + gridW + 18, marginTop + gridH + 4);
        ctx.textAlign = "left";
        ctx.fillText("y", marginLeft + 6, marginTop - 12);
      }
      ctx.fillStyle = "#555";
      ctx.font = "10px 'Courier New',monospace";
      ctx.textAlign = "right";
      ctx.fillText("0", marginLeft - 4, marginTop + gridH + 14);
      ctx.restore();
    },
    [showLabels],
  );

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas) return;
    const { cols, rows, majorSize, marginLeft, marginTop, marginRight, marginBottom } = GRID;
    const w = cols * majorSize + marginLeft + marginRight + 20;
    const h = rows * majorSize + marginTop + marginBottom;
    canvas.width = w;
    canvas.height = h;
    if (overlay && !overlayInitRef.current) {
      overlay.width = w;
      overlay.height = h;
      overlayInitRef.current = true;
    }
    const ctx = canvas.getContext("2d")!;
    drawGraphSheet(ctx, w, h);
    if (initialData) {
      const img = new Image();
      img.onload = () => canvas.getContext("2d")?.drawImage(img, 0, 0);
      img.src = initialData;
    }
  }, [drawGraphSheet, initialData]);
  useEffect(() => {
    initCanvas();
  }, [initCanvas]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL();
    const ctx = canvas.getContext("2d")!;
    drawGraphSheet(ctx, canvas.width, canvas.height);
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = snapshot;
  }, [showLabels, drawGraphSheet]);

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    return getEventCoords(e, canvas);
  };
  const getGridCoords = (cx: number, cy: number) => {
    const { majorSize, marginLeft, marginTop, rows } = GRID;
    return {
      gx: Math.round(((cx - marginLeft) / majorSize) * 10) / 10,
      gy: Math.round((rows - (cy - marginTop) / majorSize) * 10) / 10,
    };
  };
  const plotPoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = colorRef.current;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    onSave(canvasRef.current!.toDataURL());
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoords(e);
    const { gx, gy } = getGridCoords(x, y);
    setCursorPos({ x: gx, y: gy });
    if (toolRef.current === "crosshair") {
      const overlay = overlayRef.current;
      const canvas = canvasRef.current;
      if (!overlay || !canvas) return;
      if (overlay.width !== canvas.width) overlay.width = canvas.width;
      if (overlay.height !== canvas.height) overlay.height = canvas.height;
      const octx = overlay.getContext("2d")!;
      octx.clearRect(0, 0, overlay.width, overlay.height);
      octx.setLineDash([4, 4]);
      octx.strokeStyle = "rgba(41,128,185,0.7)";
      octx.lineWidth = 1;
      octx.beginPath();
      octx.moveTo(x, 0);
      octx.lineTo(x, overlay.height);
      octx.stroke();
      octx.beginPath();
      octx.moveTo(0, y);
      octx.lineTo(overlay.width, y);
      octx.stroke();
      octx.setLineDash([]);
    }
    if (!isDrawingRef.current) return;
    if (toolRef.current !== "draw" && toolRef.current !== "erase") return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = toolRef.current === "erase" ? "#ffffff" : colorRef.current;
    ctx.lineWidth = toolRef.current === "erase" ? brushSizeRef.current * 5 : brushSizeRef.current;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPosRef.current = { x, y };
  };
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const { x, y } = getCoords(e);
    if (toolRef.current === "point") {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) plotPoint(ctx, x, y);
      return;
    }
    if (toolRef.current === "crosshair") return;
    isDrawingRef.current = true;
    lastPosRef.current = { x, y };
  };
  const handleMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas && (toolRef.current === "draw" || toolRef.current === "erase"))
      onSave(canvas.toDataURL());
  };
  const handleMouseLeave = () => {
    isDrawingRef.current = false;
    setCursorPos(null);
    const overlay = overlayRef.current;
    if (overlay) {
      const octx = overlay.getContext("2d");
      if (octx) octx.clearRect(0, 0, overlay.width, overlay.height);
    }
  };
  const clearGraph = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawGraphSheet(ctx, canvas.width, canvas.height);
    onSave(canvas.toDataURL());
  };

  const tools: { id: GraphMode; label: string; icon: React.ReactNode; title: string }[] = [
    { id: "draw", label: "Draw", icon: <PenTool size={13} />, title: "Free draw" },
    { id: "erase", label: "Erase", icon: <Eraser size={13} />, title: "Erase" },
    { id: "point", label: "Plot Point", icon: <Hash size={13} />, title: "Plot point" },
    { id: "crosshair", label: "Read", icon: <Crosshair size={13} />, title: "Read coords" },
  ];
  const plotColors = ["#c0392b", "#2980b9", "#1a4a2e", "#8e44ad", "#e67e22", "#1a1a1a"];
  const cursorStyle = tool === "crosshair" ? "crosshair" : tool === "point" ? "cell" : "crosshair";

  return (
    <div
      ref={containerRef}
      className={`border rounded-xl overflow-hidden transition-all ${isFullscreen ? "fixed inset-4 z-50 shadow-2xl" : ""}`}
      style={{ borderColor: "rgba(30,80,50,0.15)", background: "#fff" }}>
      <div className="bg-gray-50 border-b p-2.5 flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.title}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${tool === t.id ? "bg-green-800 text-white shadow-sm" : "bg-white border hover:bg-gray-100"}`}>
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="h-5 w-px bg-gray-300" />
        {plotColors.map((c) => (
          <button
            key={c}
            onClick={() => {
              setColor(c);
              if (tool === "erase" || tool === "crosshair") setTool("draw");
            }}
            className={`w-5 h-5 rounded-full border-2 transition-all flex-shrink-0 ${color === c ? "border-green-800 scale-110 shadow" : "border-gray-300 hover:scale-105"}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <div className="h-5 w-px bg-gray-300" />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">Pen:</span>
          <input
            type="range"
            min="1"
            max="10"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-16 accent-green-800"
          />
        </div>
        <div className="h-5 w-px bg-gray-300" />
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="p-1.5 rounded border bg-white hover:bg-gray-100 transition-all"
            title="Zoom out">
            <ZoomOut size={13} />
          </button>
          <span className="text-[11px] font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
            className="p-1.5 rounded border bg-white hover:bg-gray-100 transition-all"
            title="Zoom in">
            <ZoomIn size={13} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded border bg-white hover:bg-gray-100 transition-all"
            title="Reset zoom">
            <RotateCcw size={13} />
          </button>
        </div>
        <div className="h-5 w-px bg-gray-300" />
        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-medium text-gray-600">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
            className="accent-green-800 w-3.5 h-3.5"
          />
          Labels
        </label>
        <div className="ml-auto flex gap-1">
          <button
            onClick={clearGraph}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all">
            Clear
          </button>
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = canvasRef.current!.toDataURL("image/png");
              a.download = `graph-${subQuestionId}.png`;
              a.click();
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border hover:bg-green-50 hover:text-green-700 hover:border-green-400 flex items-center gap-1 transition-all">
            <Download size={12} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border hover:bg-gray-100 transition-all"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>
      <div className="bg-green-900 text-green-100 px-4 py-1 flex items-center gap-4 text-[11px] font-mono">
        <span className="text-green-400 font-semibold">GRAPH SHEET</span>
        <span>|</span>
        {cursorPos ? (
          <>
            <span>
              x = <strong className="text-white">{cursorPos.x.toFixed(1)}</strong>
            </span>
            <span>
              y = <strong className="text-white">{cursorPos.y.toFixed(1)}</strong>
            </span>
          </>
        ) : (
          <span className="text-green-500">Hover to read coordinates</span>
        )}
        <span className="ml-auto text-green-400">
          {tool === "point" && "Click to plot a data point"}
          {tool === "crosshair" && "Move to read coordinates"}
          {tool === "draw" && "Draw freely on graph"}
          {tool === "erase" && "Erase drawn marks"}
        </span>
      </div>
      <div
        className="overflow-auto"
        style={{
          maxHeight: isFullscreen ? "calc(100vh - 160px)" : "480px",
          background: "#f0f4f0",
        }}>
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            display: "inline-block",
            margin: "12px",
          }}>
          <div className="relative" style={{ display: "inline-block" }}>
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              className="block touch-none shadow-lg"
              style={{ cursor: cursorStyle, border: "1px solid #ccc" }}
            />
            <canvas
              ref={overlayRef}
              className="absolute top-0 left-0 pointer-events-none"
              style={{ opacity: tool === "crosshair" ? 1 : 0 }}
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t px-4 py-2 flex flex-wrap gap-4 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-6" style={{ background: "#5aaa5a", height: "2px" }} />
          <span>Major grid (1 unit)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6" style={{ background: "#c8dfc8", height: "1px" }} />
          <span>Minor grid (0.2 unit)</span>
        </div>
        <div className="ml-auto text-[11px] text-gray-400">
          16×12 major squares · 5 minor divisions each
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   AI RESULT PANEL  ← NEW
───────────────────────────────────────────────────────── */
function AIResultPanel({
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

/* ─────────────────────────────────────────────────────────
   INSTRUCTIONS PAGE
───────────────────────────────────────────────────────── */
function InstructionsPage({ onStart, mode }: { onStart: (m: ExamMode) => void; mode?: ExamMode }) {
  const [selectedMode, setSelectedMode] = useState<ExamMode>("practice");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-800 text-white p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-yellow-300" />
          </div>
          <h1 className="font-serif text-2xl mb-2">JAMB UTME CBT Examination</h1>
          <p className="text-white/70">Physics (Essay) · 2 Questions · 2 Hours 30 Mins</p>
        </div>
        <div className="p-8">
          {/* Mode selector */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-700 mb-3">Select session type:</p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  [
                    "practice",
                    "Practice Mode",
                    "Get AI scoring and model answers after each sub-question.",
                  ],
                  ["exam", "Exam Mode", "Timed exam — model answers shown after submission only."],
                ] as const
              ).map(([m, title, desc]) => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${selectedMode === m ? "border-green-800 bg-green-50" : "border-gray-200 hover:border-green-400"}`}>
                  <p
                    className={`text-sm font-bold mb-1 ${selectedMode === m ? "text-green-800" : "text-gray-700"}`}>
                    {title}
                  </p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <h2 className="font-bold text-green-800 mb-4 flex items-center gap-2">
            <HelpCircle size={18} />
            Instructions
          </h2>
          <div className="space-y-3 mb-8">
            {[
              <>
                <strong>Answer ALL questions.</strong> Each question has sub-parts (a, b, c…).
              </>,
              <>
                You can <strong>type</strong>, use the <strong>whiteboard</strong>,{" "}
                <strong>graph sheet</strong>, <strong>construction sheet</strong>, or{" "}
                <strong>upload</strong> handwritten work.
              </>,
              selectedMode === "practice" ? (
                <>
                  In <strong>Practice Mode</strong>, click <em>"Score with AI"</em> on any
                  sub-question after answering to get instant feedback and the model answer.
                </>
              ) : (
                <>
                  In <strong>Exam Mode</strong>, model answers are revealed after you submit the
                  full paper.
                </>
              ),
              <>
                Answers are <strong>auto-saved</strong> as you work.
              </>,
              <>
                <strong className="text-red-600">Auto-submits</strong> when the timer reaches zero.
              </>,
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-text-muted text-sm">{item}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => onStart(selectedMode)}
            className="w-full py-4 bg-green-800 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all">
            <Play size={20} />
            Start {selectedMode === "practice" ? "Practice" : "Examination"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
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
      <InstructionsPage
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

"use client";

// app/(dashboard)/ai-tutor/page.tsx
//
// Sabi-Tutor: the dedicated AI chat interface for Gravitas.
// Design: Gravitas brand (cream / green-800 / gold) — NOT purple.
// Features:
//   • Real streaming responses via Anthropic API
//   • Full-height layout that fills the viewport
//   • Proper markdown rendering (bold, bullets, code)
//   • Subject context chip that colours the header
//   • Conversation history in left sidebar
//   • Difficulty + style settings
//   • Feedback (thumbs) + copy per message
//   • Voice input trigger (UI only — wires to browser SpeechRecognition)
//   • Pidgin toggle
//   • Mobile-responsive: sidebar slides in as sheet

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Trash2,
  Settings,
  Zap,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  History,
  Lightbulb,
  Target,
  Award,
  FileText,
  ChevronRight,
  X,
  Menu,
  Leaf,
  Users,
  Bookmark,
  Languages,
  Loader2,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type Subject =
  | "general"
  | "mathematics"
  | "physics"
  | "chemistry"
  | "biology"
  | "english"
  | "economics"
  | "government"
  | "literature"
  | "history";

type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
type ResponseStyle = "detailed" | "concise" | "step-by-step" | "examples";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  subject?: Subject;
  feedback?: "like" | "dislike";
  streaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  subject: Subject;
}

/* ─────────────────────────────────────────────────────────
   SUBJECT DEFINITIONS
───────────────────────────────────────────────────────── */
const SUBJECTS: {
  id: Subject;
  name: string;
  icon: React.ElementType;
  desc: string;
  color: string;
  iconBg: string;
}[] = [
  {
    id: "general",
    name: "General",
    icon: Bot,
    desc: "Ask anything academic",
    color: "#1a4a2e",
    iconBg: "rgba(26,74,46,0.12)",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: Calculator,
    desc: "Algebra, Calculus, Statistics",
    color: "#1e3a8a",
    iconBg: "rgba(30,58,138,0.10)",
  },
  {
    id: "physics",
    name: "Physics",
    icon: Zap,
    desc: "Mechanics, Thermodynamics, Optics",
    color: "#5b21b6",
    iconBg: "rgba(91,33,182,0.10)",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: FlaskConical,
    desc: "Organic, Inorganic, Physical",
    color: "#065f46",
    iconBg: "rgba(6,95,70,0.10)",
  },
  {
    id: "biology",
    name: "Biology",
    icon: Leaf,
    desc: "Cell biology, Genetics, Ecology",
    color: "#166534",
    iconBg: "rgba(22,101,52,0.10)",
  },
  {
    id: "english",
    name: "English",
    icon: BookOpen,
    desc: "Grammar, Literature, Comprehension",
    color: "#92400e",
    iconBg: "rgba(146,64,14,0.10)",
  },
  {
    id: "economics",
    name: "Economics",
    icon: Target,
    desc: "Micro, Macro, Development",
    color: "#9f1239",
    iconBg: "rgba(159,18,57,0.10)",
  },
  {
    id: "government",
    name: "Government",
    icon: Users,
    desc: "Political systems, Constitution",
    color: "#1e40af",
    iconBg: "rgba(30,64,175,0.10)",
  },
  {
    id: "literature",
    name: "Literature",
    icon: Bookmark,
    desc: "Prose, Poetry, Drama",
    color: "#831843",
    iconBg: "rgba(131,24,67,0.10)",
  },
  {
    id: "history",
    name: "History",
    icon: Globe,
    desc: "African, Nigerian, World History",
    color: "#78350f",
    iconBg: "rgba(120,53,15,0.10)",
  },
];

const QUICK_PROMPTS = [
  { icon: Lightbulb, label: "Explain Concept", prompt: "Explain the concept of " },
  { icon: Target, label: "Solve Problem", prompt: "Solve this step by step: " },
  { icon: Award, label: "Exam Tips", prompt: "Give me exam tips for " },
  { icon: FileText, label: "Summarise Topic", prompt: "Summarise this topic for JAMB/WAEC: " },
];

const SUGGESTIONS = [
  "Explain Newton's laws of motion with Nigerian examples",
  "How do I solve quadratic equations step by step?",
  "What is the difference between DNA and RNA?",
  "Explain supply and demand using a Lagos market example",
  "How to write a strong essay introduction for WAEC?",
  "What caused World War I? Key points for exams",
  "Explain photosynthesis like I am 15 years old",
  "How do I balance chemical equations?",
];

/* ─────────────────────────────────────────────────────────
   SYSTEM PROMPT builder
───────────────────────────────────────────────────────── */
function buildSystemPrompt(
  subject: Subject,
  difficulty: Difficulty,
  style: ResponseStyle,
  pidgin: boolean,
): string {
  const levelMap: Record<Difficulty, string> = {
    beginner: "a complete beginner who needs simple, clear language",
    intermediate: "a secondary school student (SS2/SS3 level)",
    advanced: "a student preparing for JAMB or WAEC at a high level",
    expert: "a student capable of university-level thinking",
  };
  const styleMap: Record<ResponseStyle, string> = {
    detailed: "Give thorough explanations with background context.",
    concise: "Be brief and direct — key points only.",
    "step-by-step": "Always break answers into numbered steps.",
    examples: "Lead with a practical example before explaining theory.",
  };
  const lang = pidgin
    ? "You may mix standard English with Nigerian Pidgin English to make explanations feel familiar and engaging."
    : "Always respond in clear, standard English.";

  return [
    `You are Sabi-Tutor, the AI learning assistant built into Gravitas — Nigeria's #1 exam prep platform.`,
    `You specialise in helping Nigerian secondary school students prepare for JAMB, WAEC, NECO, Post-UTME, and related exams.`,
    subject !== "general"
      ? `The student has selected ${subject.toUpperCase()} as their current subject. Prioritise that subject context.`
      : "",
    `Explain things as you would to ${levelMap[difficulty]}.`,
    styleMap[style],
    lang,
    `Use local Nigerian examples (Lagos traffic, garri, market prices, NEPA light) when they make concepts clearer.`,
    `Always tie explanations back to the Nigerian curriculum (WAEC/JAMB syllabus).`,
    `After each explanation, offer a short follow-up practice question.`,
    `Format your responses with **bold** for key terms, and use bullet points for lists.`,
    `Never make up facts. If you are unsure, say so and suggest the student verify in their textbook.`,
  ]
    .filter(Boolean)
    .join("\n");
}

/* ─────────────────────────────────────────────────────────
   SIMPLE MARKDOWN RENDERER
   Handles: **bold**, `code`, bullet lists, numbered lists,
   headings, and paragraph breaks — no external dep needed.
───────────────────────────────────────────────────────── */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;

  const inlineRender = (line: string): React.ReactNode => {
    // Split on **bold** and `code`
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{ color: "#0d2b1a", fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            style={{
              background: "rgba(26,74,46,0.08)",
              borderRadius: 4,
              padding: "1px 5px",
              fontSize: "0.9em",
              fontFamily: "'JetBrains Mono', monospace",
              color: "#1a4a2e",
            }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      nodes.push(<div key={key++} style={{ height: 8 }} />);
      continue;
    }

    // Heading
    if (line.startsWith("### ")) {
      nodes.push(
        <p
          key={key++}
          style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: 15,
            color: "#0d2b1a",
            fontWeight: 400,
            margin: "10px 0 4px",
          }}>
          {inlineRender(line.slice(4))}
        </p>,
      );
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <p
          key={key++}
          style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: 17,
            color: "#0d2b1a",
            fontWeight: 400,
            margin: "12px 0 4px",
          }}>
          {inlineRender(line.slice(3))}
        </p>,
      );
      continue;
    }
    if (line.startsWith("# ")) {
      nodes.push(
        <p
          key={key++}
          style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: 19,
            color: "#0d2b1a",
            fontWeight: 400,
            margin: "14px 0 6px",
          }}>
          {inlineRender(line.slice(2))}
        </p>,
      );
      continue;
    }

    // Bullet
    if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
      nodes.push(
        <div
          key={key++}
          style={{ display: "flex", gap: 8, margin: "2px 0", alignItems: "flex-start" }}>
          <span style={{ color: "#2e8b57", fontWeight: 700, marginTop: 1, flexShrink: 0 }}>•</span>
          <span>{inlineRender(line.slice(2))}</span>
        </div>,
      );
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numMatch) {
      nodes.push(
        <div
          key={key++}
          style={{ display: "flex", gap: 8, margin: "2px 0", alignItems: "flex-start" }}>
          <span
            style={{
              color: "#2e8b57",
              fontWeight: 700,
              marginTop: 1,
              flexShrink: 0,
              minWidth: 18,
            }}>
            {numMatch[1]}.
          </span>
          <span>{inlineRender(numMatch[2])}</span>
        </div>,
      );
      continue;
    }

    nodes.push(
      <p key={key++} style={{ margin: "2px 0", lineHeight: 1.65 }}>
        {inlineRender(line)}
      </p>,
    );
  }
  return nodes;
}

/* ─────────────────────────────────────────────────────────
   TYPING INDICATOR
───────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: i === 1 ? "#3aab6a" : i === 2 ? "#f5c842" : "rgba(26,74,46,0.25)",
            animation: `dot-bounce 1.4s ease-in-out infinite ${i * 0.18}s`,
          }}
        />
      ))}
      <style>{`@keyframes dot-bounce{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-7px);opacity:1}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SUBJECT CHIP (header accent)
───────────────────────────────────────────────────────── */
function SubjectChip({ subject }: { subject: Subject }) {
  const s = SUBJECTS.find((x) => x.id === subject)!;
  const Icon = s.icon;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
      style={{ background: s.iconBg, color: s.color, border: `1px solid ${s.color}22` }}>
      <Icon size={10} />
      {s.name}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   COPY BUTTON with checkmark flash
───────────────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handle}
      title="Copy"
      style={{
        padding: 4,
        border: "none",
        background: "none",
        cursor: "pointer",
        color: copied ? "#2e8b57" : "#8aab98",
        transition: "color 0.2s",
        display: "flex",
        alignItems: "center",
      }}>
      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   MESSAGE BUBBLE
───────────────────────────────────────────────────────── */
function MessageBubble({
  msg,
  onFeedback,
}: {
  msg: Message;
  onFeedback: (id: string, f: "like" | "dislike") => void;
}) {
  const isUser = msg.role === "user";

  return (
    <div
      data-testid={`message-${msg.id}`}
      style={{
        display: "flex",
        gap: 10,
        justifyContent: isUser ? "flex-end" : "flex-start",
        animation: "msgIn 0.25s cubic-bezier(0.16,1,0.3,1) both",
      }}>
      {/* Avatar — AI side */}
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            flexShrink: 0,
            background: "#1a4a2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}>
          <span
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: 16,
              color: "#f5c842",
              lineHeight: 1,
            }}>
            G
          </span>
        </div>
      )}

      <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Bubble */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
            background: isUser ? "#1a4a2e" : "white",
            border: isUser ? "none" : "1px solid rgba(30,80,50,0.1)",
            boxShadow: isUser ? "0 4px 16px rgba(26,74,46,0.2)" : "0 2px 12px rgba(13,43,26,0.06)",
            fontSize: 14,
            lineHeight: 1.65,
            color: isUser ? "rgba(255,255,255,0.92)" : "#111a14",
            fontFamily: "'Sora', sans-serif",
          }}>
          {msg.streaming ? (
            <TypingDots />
          ) : isUser ? (
            msg.content
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderMarkdown(msg.content)}
            </div>
          )}
        </div>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            justifyContent: isUser ? "flex-end" : "flex-start",
            padding: "0 4px",
          }}>
          <span
            style={{ fontSize: 11, color: "#8aab98", fontFamily: "'JetBrains Mono',monospace" }}>
            {msg.timestamp.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {msg.subject && msg.subject !== "general" && !isUser && (
            <SubjectChip subject={msg.subject} />
          )}
          {!isUser && !msg.streaming && (
            <>
              <CopyButton text={msg.content} />
              <button
                onClick={() => onFeedback(msg.id, "like")}
                title="Helpful"
                style={{
                  padding: 4,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: msg.feedback === "like" ? "#2e8b57" : "#8aab98",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}>
                <ThumbsUp size={13} />
              </button>
              <button
                onClick={() => onFeedback(msg.id, "dislike")}
                title="Not helpful"
                style={{
                  padding: 4,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: msg.feedback === "dislike" ? "#e63946" : "#8aab98",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}>
                <ThumbsDown size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Avatar — user side */}
      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            flexShrink: 0,
            background: "rgba(26,74,46,0.12)",
            border: "1.5px solid rgba(26,74,46,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}>
          <User size={16} style={{ color: "#276b43" }} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SETTINGS PANEL (floating)
───────────────────────────────────────────────────────── */
function SettingsPanel({
  difficulty,
  setDifficulty,
  style,
  setStyle,
  pidgin,
  setPidgin,
  onClose,
}: {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  style: ResponseStyle;
  setStyle: (s: ResponseStyle) => void;
  pidgin: boolean;
  setPidgin: (p: boolean) => void;
  onClose: () => void;
}) {
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: "#4a6357",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: "'JetBrains Mono',monospace",
    display: "block",
    marginBottom: 6,
  };
  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: "1.5px solid rgba(30,80,50,0.15)",
    background: "white",
    fontSize: 13,
    fontFamily: "'Sora',sans-serif",
    color: "#111a14",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        right: 0,
        width: 280,
        background: "white",
        borderRadius: 16,
        border: "1px solid rgba(30,80,50,0.12)",
        boxShadow: "0 12px 40px rgba(13,43,26,0.15)",
        padding: 20,
        zIndex: 50,
        animation: "fadeUp 0.2s ease both",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#0d2b1a" }}>Tutor settings</span>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#8aab98",
            padding: 2,
          }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>Difficulty level</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            style={selectStyle}>
            <option value="beginner">🟢 Beginner (Simple)</option>
            <option value="intermediate">🟡 Intermediate (SS2/SS3)</option>
            <option value="advanced">🟠 Advanced (JAMB/WAEC)</option>
            <option value="expert">🔴 Expert (University)</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Response style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as ResponseStyle)}
            style={selectStyle}>
            <option value="detailed">📖 Detailed explanation</option>
            <option value="concise">⚡ Concise & to the point</option>
            <option value="step-by-step">🔢 Step by step</option>
            <option value="examples">💡 Lead with examples</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: 8,
            background: pidgin ? "rgba(26,74,46,0.05)" : "rgba(0,0,0,0.02)",
            border: "1.5px solid rgba(30,80,50,0.12)",
            cursor: "pointer",
          }}
          onClick={() => setPidgin(!pidgin)}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0d2b1a" }}>🇳🇬 Pidgin mode</div>
            <div style={{ fontSize: 11, color: "#4a6357", marginTop: 2 }}>
              Mix English with Naija Pidgin
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: pidgin ? "#1a4a2e" : "rgba(30,80,50,0.15)",
              position: "relative",
              transition: "background 0.2s",
            }}>
            <div
              style={{
                position: "absolute",
                top: 2,
                left: pidgin ? 18 : 2,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "white",
                transition: "left 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────── */
function Sidebar({
  selectedSubject,
  setSelectedSubject,
  conversations,
  onNewChat,
  mobile,
  onClose,
}: {
  selectedSubject: Subject;
  setSelectedSubject: (s: Subject) => void;
  conversations: Conversation[];
  onNewChat: () => void;
  mobile?: boolean;
  onClose?: () => void;
}) {
  return (
    <div
      style={{
        width: mobile ? "100%" : 260,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        background: "white",
        borderRight: mobile ? "none" : "1px solid rgba(30,80,50,0.1)",
        height: "100%",
        overflow: "hidden",
      }}>
      {/* Sidebar header */}
      <div
        style={{
          padding: "20px 20px 14px",
          borderBottom: "1px solid rgba(30,80,50,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#4a6357",
            fontFamily: "'JetBrains Mono',monospace",
          }}>
          Subjects
        </span>
        {mobile && onClose && (
          <button
            onClick={onClose}
            style={{ border: "none", background: "none", cursor: "pointer", color: "#8aab98" }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Subject list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px 0" }}>
        {SUBJECTS.map((s) => {
          const Icon = s.icon;
          const active = selectedSubject === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSubject(s.id as Subject);
                onClose?.();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                marginBottom: 2,
                background: active ? "rgba(26,74,46,0.06)" : "transparent",
                outline: active ? `2px solid rgba(26,74,46,0.15)` : "none",
              }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: s.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Icon size={14} style={{ color: s.color }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#0d2b1a" : "#4a6357",
                  }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 11, color: "#8aab98", lineHeight: 1.3 }}>{s.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent conversations */}
      {conversations.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(30,80,50,0.08)", padding: "12px 10px" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8aab98",
              fontFamily: "'JetBrains Mono',monospace",
              padding: "0 4px",
              marginBottom: 6,
            }}>
            Recent
          </div>
          {conversations.slice(0, 4).map((c) => (
            <button
              key={c.id}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "7px 10px",
                borderRadius: 8,
                border: "none",
                background: "none",
                cursor: "pointer",
              }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#111a14",
                  marginBottom: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                {c.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#8aab98",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                {c.lastMessage}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* New chat button */}
      <div style={{ padding: 12, borderTop: "1px solid rgba(30,80,50,0.08)" }}>
        <button
          onClick={onNewChat}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 10,
            background: "#1a4a2e",
            border: "none",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Sora',sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}>
          <RefreshCw size={14} /> New conversation
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `Hello! I'm **Sabi-Tutor**, your AI learning assistant from Gravitas 🎓

I can help you with any subject on the Nigerian curriculum — JAMB, WAEC, NECO, or Post-UTME.

**Here's what I can do:**
• Explain concepts in plain English (or Pidgin!)
• Solve maths and science problems step by step
• Give you past question breakdowns
• Share exam tips specific to your target school
• Generate practice questions on your weak topics

Pick a subject from the sidebar and ask me anything. What would you like to learn today?`,
  timestamp: new Date(),
  subject: "general",
};

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject>("general");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>("detailed");
  const [pidgin, setPidgin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sheet
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Understanding Physics",
      lastMessage: "Newton's laws...",
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 12,
      subject: "physics",
    },
    {
      id: "2",
      title: "Mathematics Problem Set",
      lastMessage: "Quadratic equations...",
      timestamp: new Date(Date.now() - 172800000),
      messageCount: 8,
      subject: "mathematics",
    },
    {
      id: "3",
      title: "WAEC English Prep",
      lastMessage: "Essay structure...",
      timestamp: new Date(Date.now() - 259200000),
      messageCount: 5,
      subject: "english",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognRef = useRef<SpeechRecognition | null>(null);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [input]);

  /* Voice input */
  const toggleRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recog: SpeechRecognition = new SR();
    recog.lang = "en-NG";
    recog.interimResults = true;
    recog.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    recog.onend = () => setIsRecording(false);
    recog.start();
    recognRef.current = recog;
    setIsRecording(true);
  }, [isRecording]);

  /* Send message */
  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isLoading) return;

      setInput("");
      setIsLoading(true);

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
        subject: selectedSubject,
      };

      const streamingId = (Date.now() + 1).toString();
      const streamingMsg: Message = {
        id: streamingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        subject: selectedSubject,
        streaming: true,
      };

      setMessages((prev) => [...prev, userMsg, streamingMsg]);

      try {
        const systemPrompt = buildSystemPrompt(selectedSubject, difficulty, responseStyle, pidgin);

        const history = messages
          .filter((m) => !m.streaming && m.id !== "welcome")
          .slice(-12) // last 6 turns
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: systemPrompt,
            messages: [...history, { role: "user", content }],
          }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const responseText =
          data.content?.[0]?.text ?? "Sorry, I could not generate a response. Please try again.";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId ? { ...m, content: responseText, streaming: false } : m,
          ),
        );

        // Update conversations
        setConversations((prev) => {
          const title = content.slice(0, 40) + (content.length > 40 ? "…" : "");
          const exists = prev[0];
          if (exists?.id === "current") {
            return [
              { ...exists, lastMessage: content, messageCount: exists.messageCount + 1 },
              ...prev.slice(1),
            ];
          }
          return [
            {
              id: "current",
              title,
              lastMessage: content,
              timestamp: new Date(),
              messageCount: 1,
              subject: selectedSubject,
            },
            ...prev,
          ];
        });
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? {
                  ...m,
                  content: "⚠️ Something went wrong. Please check your connection and try again.",
                  streaming: false,
                }
              : m,
          ),
        );
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, isLoading, messages, selectedSubject, difficulty, responseStyle, pidgin],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
  };

  const handleFeedback = (id: string, feedback: "like" | "dislike") => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedback } : m)));
  };

  const currentSubject = SUBJECTS.find((s) => s.id === selectedSubject)!;

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes msgIn   { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-7px);opacity:1} }
        * { box-sizing:border-box }
        textarea { font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width:4px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: rgba(26,74,46,0.15); border-radius:2px }
      `}</style>

      {/* ── Full-height shell ── */}
      <div
        data-testid="ai-tutor-page"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "var(--color-cream)",
          fontFamily: "'Sora', sans-serif",
          overflow: "hidden",
        }}>
        {/* ══ TOP BAR ══ */}
        <div
          style={{
            height: 64,
            flexShrink: 0,
            background: "#1a4a2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            position: "relative",
            zIndex: 10,
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              style={{
                border: "none",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 8,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
              }}
              className="lg:hidden">
              <Menu size={18} />
            </button>

            {/* Logo mark + wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: "rgba(245,200,66,0.15)",
                  border: "1px solid rgba(245,200,66,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: 18,
                  color: "#f5c842",
                }}>
                G
              </div>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "white",
                    fontFamily: "'DM Serif Display',serif",
                    letterSpacing: "-0.3px",
                    lineHeight: 1.1,
                  }}>
                  Sabi-Tutor
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: "'JetBrains Mono',monospace",
                  }}>
                  AI Learning Assistant
                </div>
              </div>
            </div>
          </div>

          {/* Subject indicator (centre) */}
          <div
            className="hidden sm:flex"
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <SubjectChip subject={selectedSubject} />
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {pidgin && (
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 100,
                  background: "rgba(245,200,66,0.15)",
                  border: "1px solid rgba(245,200,66,0.3)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#f5c842",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "'JetBrains Mono',monospace",
                }}>
                🇳🇬 Pidgin
              </div>
            )}
            <button
              onClick={clearChat}
              title="Clear chat"
              style={{
                border: "none",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 8,
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.6)",
                transition: "all 0.2s",
              }}>
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* ── Mobile sidebar overlay ── */}
          {sidebarOpen && (
            <div
              style={{ position: "absolute", inset: 0, zIndex: 40, display: "flex" }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setSidebarOpen(false);
              }}>
              <div style={{ background: "rgba(13,43,26,0.4)", position: "absolute", inset: 0 }} />
              <div style={{ position: "relative", zIndex: 41, width: 280, height: "100%" }}>
                <Sidebar
                  selectedSubject={selectedSubject}
                  setSelectedSubject={setSelectedSubject}
                  conversations={conversations}
                  onNewChat={() => {
                    clearChat();
                    setSidebarOpen(false);
                  }}
                  mobile
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            </div>
          )}

          {/* ── Desktop sidebar ── */}
          <div className="hidden lg:flex" style={{ flexShrink: 0 }}>
            <Sidebar
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              conversations={conversations}
              onNewChat={clearChat}
            />
          </div>

          {/* ── Chat column ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minWidth: 0,
            }}>
            {/* Messages scroll area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} onFeedback={handleFeedback} />
              ))}

              {/* Suggestions — shown only when just welcome message */}
              {messages.length === 1 && (
                <div style={{ animation: "fadeUp 0.5s 0.3s ease both" }}>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8aab98",
                      fontFamily: "'JetBrains Mono',monospace",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}>
                    Try asking…
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: 8,
                    }}>
                    {SUGGESTIONS.slice(0, 6).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 10,
                          textAlign: "left",
                          background: "white",
                          border: "1px solid rgba(30,80,50,0.1)",
                          fontSize: 13,
                          color: "#4a6357",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          fontFamily: "'Sora',sans-serif",
                          lineHeight: 1.45,
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Quick-action chips ── */}
            <div
              style={{
                padding: "10px 20px 0",
                borderTop: "1px solid rgba(30,80,50,0.08)",
                background: "white",
                display: "flex",
                gap: 6,
                overflowX: "auto",
                flexShrink: 0,
              }}>
              {QUICK_PROMPTS.map((q, i) => {
                const Icon = q.icon;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q.prompt);
                      inputRef.current?.focus();
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 12px",
                      borderRadius: 100,
                      background: "rgba(26,74,46,0.06)",
                      border: "1px solid rgba(30,80,50,0.12)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#276b43",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      flexShrink: 0,
                      fontFamily: "'Sora',sans-serif",
                      transition: "all 0.15s",
                    }}>
                    <Icon size={12} /> {q.label}
                  </button>
                );
              })}
            </div>

            {/* ── Input bar ── */}
            <div style={{ padding: "12px 20px 16px", background: "white", flexShrink: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 10,
                  background: "white",
                  border: "1.5px solid rgba(30,80,50,0.18)",
                  borderRadius: 16,
                  padding: "10px 12px",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxShadow: "0 2px 12px rgba(13,43,26,0.05)",
                }}
                onFocus={() => {}}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask Sabi-Tutor anything about ${currentSubject.name}… (Enter to send)`}
                  rows={1}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    resize: "none",
                    fontSize: 14,
                    color: "#111a14",
                    background: "transparent",
                    lineHeight: 1.5,
                    minHeight: 22,
                    maxHeight: 140,
                    overflowY: "auto",
                    fontFamily: "'Sora',sans-serif",
                  }}
                />

                {/* Voice button */}
                <button
                  onClick={toggleRecording}
                  title={isRecording ? "Stop recording" : "Voice input"}
                  style={{
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isRecording ? "rgba(230,57,70,0.1)" : "rgba(26,74,46,0.07)",
                    color: isRecording ? "#e63946" : "#4a6357",
                    transition: "all 0.2s",
                  }}>
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                {/* Settings button */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <button
                    onClick={() => setSettingsOpen((o) => !o)}
                    title="Tutor settings"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: settingsOpen ? "rgba(26,74,46,0.12)" : "rgba(26,74,46,0.07)",
                      color: "#4a6357",
                      transition: "all 0.2s",
                    }}>
                    <Settings size={15} />
                  </button>
                  {settingsOpen && (
                    <SettingsPanel
                      difficulty={difficulty}
                      setDifficulty={setDifficulty}
                      style={responseStyle}
                      setStyle={setResponseStyle}
                      pidgin={pidgin}
                      setPidgin={setPidgin}
                      onClose={() => setSettingsOpen(false)}
                    />
                  )}
                </div>

                {/* Send button */}
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  data-testid="send-btn"
                  style={{
                    flexShrink: 0,
                    height: 34,
                    paddingLeft: 16,
                    paddingRight: 16,
                    borderRadius: 8,
                    border: "none",
                    cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                    background: input.trim() && !isLoading ? "#1a4a2e" : "rgba(26,74,46,0.2)",
                    color: input.trim() && !isLoading ? "white" : "rgba(26,74,46,0.4)",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s",
                    fontFamily: "'Sora',sans-serif",
                  }}>
                  {isLoading ? (
                    <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <Send size={15} />
                  )}
                  {isLoading ? "Thinking…" : "Send"}
                </button>
              </div>

              {/* Disclaimer */}
              <p
                style={{
                  fontSize: 11,
                  color: "#8aab98",
                  textAlign: "center",
                  marginTop: 8,
                  fontFamily: "'JetBrains Mono',monospace",
                }}>
                Sabi-Tutor can make mistakes. Verify important answers in your textbook.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

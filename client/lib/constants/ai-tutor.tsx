import { Message, Subject } from "@/types/ai-tutor";
import {
  Bot,
  Zap,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Target,
  Leaf,
  Users,
  Bookmark,
  Lightbulb,
  Award,
  FileText,
} from "lucide-react";
export const SUBJECTS: {
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
export const QUICK_PROMPTS = [
  { icon: Lightbulb, label: "Explain Concept", prompt: "Explain the concept of " },
  { icon: Target, label: "Solve Problem", prompt: "Solve this step by step: " },
  { icon: Award, label: "Exam Tips", prompt: "Give me exam tips for " },
  { icon: FileText, label: "Summarise Topic", prompt: "Summarise this topic for JAMB/WAEC: " },
];
export const WELCOME_MESSAGE: Message = {
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

/**
 * AI Tutor API abstraction layer.
 *
 * ─────────────────────────────────────────────────────────
 * HOW TO SWITCH FROM MOCK → REAL API
 * ─────────────────────────────────────────────────────────
 * 1. Set NEXT_PUBLIC_AI_MODE=api in your .env.local
 * 2. Create a Next.js API route at: app/api/ai-tutor/route.ts
 *    that accepts { systemPrompt, history, userMessage } and
 *    calls Anthropic (server-side, with your API key).
 * 3. This file will automatically route to it.
 *
 * The page.tsx and all components stay unchanged.
 * ─────────────────────────────────────────────────────────
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatPayload {
  systemPrompt: string;
  history: ChatMessage[];
  userMessage: string;
}

/** Simulated network delay for mock mode */
const mockDelay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

/** Mock response generator — realistic JAMB/WAEC flavour */
async function mockSendMessage(payload: ChatPayload): Promise<string> {
  await mockDelay(900 + Math.random() * 600);

  const q = payload.userMessage.toLowerCase();

  if (q.includes("photosynthesis")) {
    return `**Photosynthesis** is the process by which plants convert light energy into chemical energy.

The overall equation is:

\`6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\`

### Two main stages:
1. **Light-dependent reactions** — occur in the thylakoid membrane; produce ATP and NADPH
2. **Light-independent reactions (Calvin cycle)** — occur in the stroma; use ATP and NADPH to fix CO₂ into glucose

For WAEC, remember that **chlorophyll** is the key pigment and is found in the **chloroplast**.`;
  }

  if (q.includes("newton") || q.includes("motion")) {
    return `**Newton's Three Laws of Motion** are fundamental for both JAMB Physics and WAEC:

1. **First Law (Inertia)** — A body remains at rest or in uniform motion unless acted upon by an external force.

2. **Second Law (F = ma)** — The net force on a body equals its mass multiplied by its acceleration.
   - \`F = ma\` → force in Newtons (N), mass in kg, acceleration in m/s²

3. **Third Law (Action–Reaction)** — For every action there is an equal and opposite reaction.

### Quick exam tip:
When a question asks *"why does a gun recoil when fired?"* — that's Newton's Third Law. The bullet goes forward, the gun goes backward with equal momentum.`;
  }

  if (q.includes("quadratic") || q.includes("equation")) {
    return `To solve a **quadratic equation** of the form \`ax² + bx + c = 0\`:

### Method 1: Factorisation
Find two numbers that multiply to \`ac\` and add to \`b\`.

### Method 2: Quadratic formula
\`x = (-b ± √(b² - 4ac)) / 2a\`

The expression \`b² - 4ac\` is called the **discriminant**:
- If **> 0** → two distinct real roots
- If **= 0** → one repeated root
- If **< 0** → no real roots (complex)

### Example (JAMB 2022 style):
Solve \`x² - 5x + 6 = 0\`
- Factors: \`(x - 2)(x - 3) = 0\`
- **x = 2 or x = 3** ✓`;
  }

  /* Generic fallback */
  return `Great question! Here's what you need to know for your exams:

${payload.userMessage.length > 60 ? `You asked about: *"${payload.userMessage.slice(0, 60)}…"*` : ""}

This is a **mock response** — the real Sabi-Tutor AI will provide a detailed, curriculum-aligned answer here once connected to the Anthropic API.

### To activate the real AI:
1. Create \`src/lib/api/ai-tutor.ts\` with your API route
2. Set \`NEXT_PUBLIC_AI_MODE=api\` in \`.env.local\`
3. Add your Anthropic API key to your backend route

Keep studying — you're doing great! 💪`;
}

/**
 * Real API call — proxied through your Next.js backend to keep
 * the Anthropic API key off the client.
 *
 * Uncomment and use this when your /api/ai-tutor route is ready.
 */
// async function realSendMessage(payload: ChatPayload): Promise<string> {
//   const res = await fetch("/api/ai-tutor", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error(`API error: ${res.status}`);
//   const data = await res.json() as { text: string };
//   return data.text;
// }

/**
 * Public entry point used by page.tsx.
 * Controlled by NEXT_PUBLIC_AI_MODE env var.
 */
export async function sendChatMessage(payload: ChatPayload): Promise<string> {
  const mode = process.env.NEXT_PUBLIC_AI_MODE ?? "mock";
  if (mode === "api") {
    // return realSendMessage(payload);
    throw new Error("Real API not yet wired up. See comments in lib/api/ai-tutor.ts");
  }
  return mockSendMessage(payload);
}

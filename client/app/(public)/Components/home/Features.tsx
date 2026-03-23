import Card from "@/Components/Card";
import { Monitor, Sparkles, BarChart3, WifiOff, Video, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
type Feature = {
  Icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
  featured?: boolean;
  delay: string;
};

/* ─── Data ───────────────────────────────────────────────── */
const FEATURES: Feature[] = [
  {
    Icon: Monitor,
    title: "Exact CBT Interface Replication",
    desc: "Practice on a pixel-perfect replica of the real JAMB, WAEC 2026 Digital, and ICAN interfaces. Walk into the exam hall and feel zero surprise.",
    tag: "Core MVP",
    featured: true,
    delay: "",
  },
  {
    Icon: Sparkles,
    title: "Sabi-Explain AI",
    desc: "Every wrong answer triggers an instant AI breakdown using Nigerian syllabus context, local examples — even in Pidgin if you prefer.",
    tag: "AI-Powered",
    delay: "reveal-delay-1",
  },
  {
    Icon: BarChart3,
    title: "Deep Performance Analytics",
    desc: "Track weak topics, time per question, and score trajectory across every mock. Know exactly where you're losing marks.",
    tag: "Smart Insights",
    delay: "reveal-delay-2",
  },
  {
    Icon: WifiOff,
    title: "Works on 2G & Offline",
    desc: "Download question banks and video lessons. Practice on the bus, in your village — even with zero data after download.",
    tag: "Offline First",
    delay: "reveal-delay-1",
  },
  {
    Icon: Video,
    title: "Live Tutoring + Whiteboard",
    desc: "1-on-1 or group sessions with verified tutors. Collaborative whiteboard built-in — no Zoom, no extra app needed.",
    tag: "Live Sessions",
    delay: "reveal-delay-2",
  },
  {
    Icon: Flame,
    title: "Streaks, XP & Leaderboards",
    desc: "Daily study streaks, subject XP points, and national leaderboards make preparation feel like a competition.",
    tag: "Gamification",
    delay: "reveal-delay-3",
  },
];

/* ─── Section ────────────────────────────────────────────── */
export default function Features() {
  return (
    <section className="px-[5%] py-[100px] relative" id="features">
      {/* ── Section header — NO reveal wrapper, always visible ── */}
      <div className="mb-16">
        {/* Label */}
        <div className="inline-flex items-center gap-2 mb-4 before:content-[''] before:block before:w-6 before:h-0.5 before:rounded-sm before:bg-green-500">
          <span className="text-[11px] font-bold text-green-600 tracking-[0.12em] uppercase">
            Why Gravitas
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-serif font-bold text-green-900 leading-[1.1] tracking-[-0.03em] mb-4 max-w-[600px]"
          style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>
          Everything you need to pass. Nothing you don&apos;t.
        </h2>

        {/* Sub */}
        <p className="text-base text-text-muted leading-[1.7] max-w-[520px]">
          Built specifically for Nigerian students, Nigerian syllabuses, and Nigerian network
          conditions.
        </p>
      </div>

      {/* ── Cards grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}

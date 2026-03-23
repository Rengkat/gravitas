import { School, ClipboardList, Users, FileCheck, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
type CheckItem = { Icon: LucideIcon; title: string; desc: string };
type ScoreVariant = "high" | "mid" | "low";
type DashRow = {
  name: string;
  subject: string;
  score: string;
  variant: ScoreVariant;
  status: "Pass" | "Review";
};

/* ─── Data ───────────────────────────────────────────────────────────────────
   Icons replace emojis. Score/status classes are split into per-row branches
   in the render — never looked up from a Record at runtime so Tailwind's
   scanner sees every class as a complete literal string.
──────────────────────────────────────────────────────────────────────────── */
const CHECKLIST: CheckItem[] = [
  {
    Icon: School,
    title: "Branded School Portal",
    desc: "Your school name, logo, and subdomain. Students see your brand, not ours.",
  },
  {
    Icon: ClipboardList,
    title: "Custom CBT Tests — Class → Subject → Topic",
    desc: "Upload tests for any class. Set time limits, randomize questions, control retakes.",
  },
  {
    Icon: Users,
    title: "Parent Dashboard + WhatsApp Reports",
    desc: "Weekly performance summary sent to parents via WhatsApp every Friday. Parents pay the bills — keep them happy.",
  },
  {
    Icon: FileCheck,
    title: "Instant Auto-Grading & Report Cards",
    desc: "Exam submitted → scored → PDF report card generated. No teacher marking required.",
  },
];

const DASH_ROWS: DashRow[] = [
  { name: "Adaeze Okonkwo", subject: "Physics", score: "92%", variant: "high", status: "Pass" },
  { name: "Emeka Nwosu", subject: "Chemistry", score: "68%", variant: "mid", status: "Pass" },
  { name: "Fatima Musa", subject: "Maths", score: "95%", variant: "high", status: "Pass" },
  { name: "Tunde Bakare", subject: "English", score: "42%", variant: "low", status: "Review" },
  { name: "Ngozi Eze", subject: "Biology", score: "88%", variant: "high", status: "Pass" },
];

function ScoreCell({ score, variant }: { score: string; variant: ScoreVariant }) {
  if (variant === "high") return <div className="font-bold text-green-300">{score}</div>;
  if (variant === "mid") return <div className="font-bold text-gold">{score}</div>;
  return <div className="font-bold text-red-300">{score}</div>;
}

function StatusCell({ status }: { status: "Pass" | "Review" }) {
  if (status === "Pass") {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-400/15 text-green-300">
        Pass
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-300">
      Review
    </span>
  );
}

/* ─── Stat cell ──────────────────────────────────────────────────────────────
   Same pattern — text colour split into branches not a dynamic string.
──────────────────────────────────────────────────────────────────────────── */
function StatCell({ num, label, highlight }: { num: string; label: string; highlight?: boolean }) {
  return (
    <div className="p-4 bg-white/[0.04] rounded-xl border border-white/[0.07] text-center">
      <div
        className={`font-serif text-2xl leading-none mb-1 ${highlight ? "text-green-300" : "text-white"}`}>
        {num}
      </div>
      <div className="text-[10px] text-white/35 uppercase tracking-[0.06em] font-semibold">
        {label}
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────── */
export default function SchoolPortal() {
  return (
    <section className="px-[5%] py-[100px] bg-green-900 relative overflow-hidden" id="schools">
      {/* Glow */}
      <div
        className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,200,66,0.08), transparent 70%)" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-[1]">
        {/* ── Left: copy ── */}
        <div className="[animation:fadeUp_0.6s_ease_both]">
          {/* Label */}
          <div className="inline-flex items-center gap-2 mb-4 before:content-[''] before:block before:w-6 before:h-0.5 before:rounded-sm before:bg-gold">
            <span className="text-[11px] font-bold text-gold tracking-[0.12em] uppercase">
              For Schools &amp; Institutions
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-serif font-bold text-white leading-[1.1] tracking-[-0.03em] mb-4"
            style={{ fontSize: "clamp(32px, 4vw, 52px)", maxWidth: "560px" }}>
            Your school. Your tests. Your branding.
          </h2>

          {/* Sub */}
          <p className="text-base text-white/55 leading-[1.7] max-w-[480px] mb-8">
            Give your students a fully branded portal. Upload your own tests, track attendance,
            auto-generate report cards. Gravitas runs the infrastructure.
          </p>

          {/* Checklist */}
          <div className="flex flex-col gap-4">
            {CHECKLIST.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className="flex items-start gap-3.5 px-5 py-[18px] bg-white/[0.04] border border-white/[0.07] rounded-[14px] transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.14] [animation:fadeUp_0.6s_ease_both]"
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0 mt-px text-green-400">
                  <Icon size={16} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">{title}</div>
                  <div className="text-[12.5px] text-white/45 leading-[1.5]">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-7">
            <a
              href="#"
              className="relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-4 bg-green-800 rounded-[10px] text-white font-sans text-[15px] font-bold no-underline transition-all duration-[250ms] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:to-transparent hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(26,74,46,0.35)]">
              Request School Demo
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>

        {/* ── Right: dashboard mockup ── */}
        <div className="bg-white/[0.05] border border-white/10 rounded-[20px] overflow-hidden [animation:fadeUp_0.6s_0.2s_ease_both]">
          {/* Window chrome */}
          <div className="bg-white/[0.06] px-5 py-[14px] border-b border-white/[0.08] flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div className="text-xs text-white/40 font-medium ml-2 font-mono">
              Kings College Lagos — Admin Portal
            </div>
          </div>

          <div className="p-5">
            {/* Stat row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <StatCell num="342" label="Students" />
              <StatCell num="18" label="Active Tests" />
              <StatCell num="87%" label="Avg Score" highlight />
            </div>

            {/* Table header */}
            <div
              className="grid gap-2 px-3 py-2 text-[10px] font-bold text-white/30 tracking-[0.08em] uppercase"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
              <div>Student</div>
              <div>Subject</div>
              <div>Score</div>
              <div>Status</div>
            </div>

            {/* Table rows */}
            {DASH_ROWS.map(({ name, subject, score, variant, status }) => (
              <div
                key={name}
                className="grid gap-2 px-3 py-2.5 rounded-lg text-xs text-white/70 mb-1 transition-colors duration-200 hover:bg-white/[0.05]"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                <div>{name}</div>
                <div className="text-white/40">{subject}</div>
                <ScoreCell score={score} variant={variant} />
                <div>
                  <StatusCell status={status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

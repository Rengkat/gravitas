"use client";

import { useEffect } from "react";

const TRUST_AVATARS = [
  { letter: "A", bg: "bg-green-500" },
  { letter: "K", bg: "bg-green-600" },
  { letter: "F", bg: "bg-green-400" },
  { letter: "E", bg: "bg-green-900" },
];

const GRID_CELLS: Array<"answered" | "flagged" | "current" | "default"> = [
  "answered",
  "answered",
  "answered",
  "flagged",
  "answered",
  "answered",
  "answered",
  "answered",
  "answered",
  "answered",
  "answered",
  "current",
  "default",
  "default",
  "default",
  "default",
  "default",
  "default",
  "default",
  "default",
];

const CELL_CLS = {
  answered: "bg-green-500 border-green-500 text-white",
  flagged: "bg-gold border-gold-dark text-green-900",
  current: "bg-green-800 border-green-800 text-white",
  default: "bg-white border-cream-border text-text-muted",
};

export default function Hero() {
  useEffect(() => {
    let seconds = 84 * 60 + 38;
    const el = document.querySelector<HTMLElement>(".exam-timer-text");
    if (!el) return;
    const id = setInterval(() => {
      if (seconds > 0) seconds--;
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      el.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="min-h-screen pt-[120px] pb-20 px-[5%] grid grid-cols-1 md:grid-cols-2 items-center gap-[60px] relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cream"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(46,139,87,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(245,200,66,0.06) 0%, transparent 60%), var(--color-cream)",
        }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,74,46,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,74,46,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)",
          }}
        />
      </div>

      {/* ── Left: content ── */}
      <div className="relative z-[1]">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-800/[0.08] border border-green-800/[0.18] rounded-full text-xs font-semibold text-green-700 tracking-[0.05em] uppercase mb-7 [animation:fadeUp_0.6s_ease_both]">
          <div className="w-[7px] h-[7px] bg-green-400 rounded-full [animation:pulse-dot_2s_infinite]" />
          Nigeria&apos;s #1 Exam Prep Platform
        </div>

        {/* Headline */}
        <h1
          className="font-serif font-bold leading-[1.08] tracking-[-1.5px] text-green-900 mb-6 [animation:fadeUp_0.6s_0.1s_ease_both] "
          style={{ fontSize: "clamp(42px,5.5vw,72px)" }}>
          Pass JAMB.
          <br />
          <span className="relative inline-block">
            Conquer
            <span className="absolute bottom-1 left-0 right-0 h-2 bg-gold opacity-40 -z-[1] rounded-sm" />
          </span>{" "}
          WAEC.
          <br />
          <em className="italic text-green-600">Own your future.</em>
        </h1>

        {/* Sub */}
        <p className="text-[17px] text-text-muted leading-[1.7] max-w-[500px] mb-10 font-normal [animation:fadeUp_0.6s_0.2s_ease_both]">
          AI-powered CBT practice that mirrors the exact JAMB &amp; WAEC interfaces. Instant
          explanations, weak topic tracking, and higher scores — even on 2G.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 mb-12 [animation:fadeUp_0.6s_0.3s_ease_both]">
          <a
            href="#"
            className="relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-4 bg-green-800 rounded-[10px] text-white font-sans text-[15px] font-bold no-underline tracking-[0.01em] transition-all duration-[250ms] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:to-transparent hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(26,74,46,0.35)]">
            Start Practising Free
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-4 bg-transparent border-2 border-green-800/25 rounded-[10px] text-green-800 font-sans text-[15px] font-semibold no-underline transition-all duration-[250ms] hover:bg-green-800/[0.06] hover:border-green-600">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Demo
          </a>
        </div>

        {/* Trust row */}
        <div className="flex items-center gap-5 [animation:fadeUp_0.6s_0.4s_ease_both]">
          <div className="flex">
            {TRUST_AVATARS.map(({ letter, bg }, i) => (
              <span
                key={letter}
                className={`w-8 h-8 rounded-full border-2 border-cream flex items-center justify-center text-[13px] font-bold text-white ${bg}`}
                style={{ marginLeft: i === 0 ? 0 : "-8px" }}>
                {letter}
              </span>
            ))}
          </div>
          <div className="text-[13px] text-text-muted leading-[1.4]">
            <strong className="text-text-main font-bold">12,000+ students</strong> already preparing
            <br />
            with Gravitas this session
          </div>
        </div>
      </div>

      {/* ── Right: visual ── */}
      <div className="relative z-[1] [animation:fadeIn_0.8s_0.3s_ease_both] hidden md:block">
        {/* Float card — top right */}
        <div className="absolute -top-5 -right-[30px] w-[160px] bg-white rounded-[14px] shadow-[0_8px_32px_rgba(13,43,26,0.15)] border border-cream-border px-[18px] py-[14px] [animation:float_4s_ease-in-out_infinite]">
          <div className="font-serif text-[28px] text-green-700 leading-none mb-0.5">
            78<span className="text-[16px] text-text-muted">/100</span>
          </div>
          <div className="text-[11px] text-text-muted font-medium">Mock Score — Physics</div>
          <div className="mt-2 h-1 bg-cream-border rounded overflow-hidden">
            <div className="h-full w-[78%] rounded bg-gradient-to-r from-green-500 to-green-300" />
          </div>
        </div>

        {/* Exam card */}
        <div className="bg-white rounded-[20px] shadow-[var(--shadow-heavy)] overflow-hidden border border-cream-border">
          {/* Header */}
          <div className="bg-green-800 px-5 py-[14px] flex items-center justify-between">
            <div className="flex gap-1">
              {["USE OF ENGLISH", "MATHS", "PHYSICS", "CHEM"].map((tab) => (
                <div
                  key={tab}
                  className={`px-[14px] py-[5px] rounded-md text-xs font-semibold tracking-[0.03em] cursor-pointer transition-all duration-200 ${tab === "PHYSICS" ? "bg-white/15 text-white" : "text-white/60"}`}>
                  {tab}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-[#e63946] px-[14px] py-1.5 rounded-lg">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
              <span className="exam-timer-text font-mono text-sm font-medium text-white">
                01:24:38
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-[18px]">
              <span className="font-mono text-xs font-medium text-text-light tracking-[0.08em]">
                QUESTION 12 OF 40
              </span>
              <span className="flex items-center gap-1 text-xs text-gold-dark font-semibold cursor-pointer">
                🚩 Flag
              </span>
            </div>
            <p className="text-sm leading-[1.65] text-text-main mb-5">
              A body of mass 5 kg is acted upon by a force of 20 N for 4 seconds. If the body starts
              from rest, what is the velocity at the end of this time?
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { letter: "A", text: "4 m/s", state: "default" },
                { letter: "B", text: "8 m/s", state: "selected" },
                {
                  letter: "C",
                  text: "16 m/s",
                  state: "correct",
                  extra: (
                    <span className="text-[11px] text-green-500 font-bold ml-1">✓ Correct</span>
                  ),
                },
                { letter: "D", text: "100 m/s", state: "default" },
              ].map(({ letter, text, state, extra }) => (
                <div
                  key={letter}
                  className={`flex items-center gap-3 px-4 py-[11px] border-[1.5px] rounded-[10px] cursor-pointer transition-all duration-200 text-[13.5px] text-text-main hover:border-green-400 hover:bg-green-50 ${state === "selected" ? "border-green-500 bg-green-500/[0.07]" : state === "correct" ? "border-[#22c55e] bg-[#22c55e]/[0.08]" : "border-cream-border"}`}>
                  <div
                    className={`w-[26px] h-[26px] rounded-full border-[1.5px] flex items-center justify-center text-xs font-bold shrink-0 ${state === "selected" || state === "correct" ? "bg-green-500 border-green-500 text-white" : "border-current text-text-muted"}`}>
                    {letter}
                  </div>
                  {text}
                  {extra}
                </div>
              ))}
            </div>

            {/* Sabi-Explain */}
            <div
              className="mt-4 rounded-xl px-[18px] py-4 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg,rgba(13,43,26,0.96),rgba(26,74,46,0.98))",
              }}>
              <div
                className="absolute -top-5 -right-5 w-20 h-20 rounded-full"
                style={{ background: "radial-gradient(circle,rgba(245,200,66,0.15),transparent)" }}
              />
              <div className="flex items-center gap-[7px] text-[11px] font-bold text-gold tracking-[0.1em] uppercase mb-2">
                <span>✦</span> Sabi-Explain
              </div>
              <div className="text-[12.5px] text-white/85 leading-[1.6]">
                Using Newton&apos;s 2nd Law: F = ma, so a = 20/5 ={" "}
                <strong className="text-gold">4 m/s²</strong>. Then v = u + at = 0 + (4 × 4) ={" "}
                <strong className="text-gold">16 m/s</strong>.
              </div>
            </div>
          </div>

          {/* Navigator */}
          <div className="px-6 py-4 border-t border-cream-border bg-cream-dark">
            <div className="flex justify-between text-[11px] font-semibold text-text-muted tracking-[0.06em] uppercase mb-2.5">
              <span>Question Navigator</span>
              <span className="text-green-500 font-bold">8/40 Answered</span>
            </div>
            <div className="flex flex-wrap gap-[5px]">
              {GRID_CELLS.map((state, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-semibold border cursor-pointer ${CELL_CLS[state]}`}>
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-2.5">
              {[
                { color: "bg-green-500", label: "Answered" },
                { color: "bg-gold", label: "Flagged" },
                { color: "bg-green-800", label: "Current" },
              ].map(({ color, label }) => (
                <span key={label} className="text-[11px] text-text-muted flex items-center gap-1">
                  <span className={`w-3 h-3 rounded-[3px] inline-block ${color}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Float card — bottom left */}
        <div className="absolute bottom-[60px] -left-10 w-[150px] bg-white rounded-[14px] shadow-[0_8px_32px_rgba(13,43,26,0.15)] border border-cream-border px-[18px] py-[14px] [animation:float_4s_2s_ease-in-out_infinite]">
          <div className="flex items-center gap-2">
            <div className="text-[22px]">🔥</div>
            <div>
              <div className="text-lg font-extrabold text-green-800 leading-none">14 Days</div>
              <div className="text-[10px] text-text-muted">Study streak — keep it up!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

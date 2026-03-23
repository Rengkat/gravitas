"use client";

import { useState } from "react";
import { GraduationCap, Zap, School, Check, X, ArrowRight } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
type Billing = "monthly" | "annual";

type Feature = { text: string; included: boolean };

/* ─── Data ───────────────────────────────────────────────── */
const FREE_FEATURES: Feature[] = [
  { text: "3 subjects access", included: true },
  { text: "100 past questions / month", included: true },
  { text: "Basic performance stats", included: true },
  { text: "2 mock exams / month", included: true },
  { text: "AI Sabi-Explain", included: false },
  { text: "Unlimited mock exams", included: false },
  { text: "Offline download mode", included: false },
  { text: "Weak topic AI drill generator", included: false },
];

const PRO_FEATURES: Feature[] = [
  { text: "All subjects unlocked", included: true },
  { text: "Unlimited past questions", included: true },
  { text: "AI Sabi-Explain on every question", included: true },
  { text: "Unlimited mock exams", included: true },
  { text: "Offline download mode", included: true },
  { text: "Weak topic AI drill generator", included: true },
  { text: "Voice & Pidgin input", included: true },
  { text: "Priority support", included: true },
];

const SCHOOL_FEATURES: Feature[] = [
  { text: "Branded school portal", included: true },
  { text: "Custom CBT test builder", included: true },
  { text: "Auto-grading + report cards", included: true },
  { text: "Parent WhatsApp reports", included: true },
  { text: "Bulk student onboarding (CSV)", included: true },
  { text: "Admin analytics dashboard", included: true },
  { text: "Dedicated account manager", included: true },
  { text: "API access", included: true },
];

/* ─── Feature row ────────────────────────────────────────── */
function FeatureRow({ text, included, popular }: Feature & { popular?: boolean }) {
  if (included) {
    return (
      <div className="flex items-center gap-2.5 text-[13.5px]">
        <div
          className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 ${popular ? "bg-white/15 text-green-300" : "bg-green-500/[0.12] text-green-600"}`}>
          <Check size={10} strokeWidth={3} />
        </div>
        <span className={popular ? "text-white/75" : "text-text-muted"}>{text}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5 text-[13.5px] opacity-35">
      <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 bg-black/[0.05] text-text-light">
        <X size={10} strokeWidth={3} />
      </div>
      <span className="text-text-muted">{text}</span>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────── */
export default function PricingHero() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const annual = billing === "annual";

  return (
    <section className="pt-[140px] pb-20 px-[5%] text-center relative overflow-hidden bg-cream">
      {/* Radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(46,139,87,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(245,200,66,0.05) 0%, transparent 60%)",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,74,46,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,74,46,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)",
        }}
      />

      <div className="relative z-[1]">
        {/* Label */}
        <div className="inline-flex items-center gap-2 mb-4 [animation:fadeUp_0.6s_ease_both] before:content-[''] before:block before:w-6 before:h-0.5 before:rounded-sm before:bg-green-500">
          <span className="text-[11px] font-bold text-green-600 tracking-[0.12em] uppercase">
            Pricing
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-green-900 leading-[1.08] tracking-[-1.5px] mb-5 [animation:fadeUp_0.6s_0.1s_ease_both]"
          style={{ fontSize: "clamp(42px, 5vw, 68px)" }}>
          Simple pricing.
          <br />
          <em className="not-italic text-green-600">Big results.</em>
        </h1>

        {/* Sub */}
        <p className="text-lg text-text-muted max-w-[520px] mx-auto mb-12 leading-[1.7] [animation:fadeUp_0.6s_0.2s_ease_both]">
          Start free. Upgrade when you&apos;re ready. No hidden fees, no tricks, no
          &ldquo;gotcha&rdquo; moments.
        </p>

        {/* Billing toggle */}
        <div className="flex justify-center mb-16 [animation:fadeUp_0.6s_0.25s_ease_both]">
          <div className="inline-flex items-center bg-white border border-cream-border rounded-xl p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2 rounded-lg font-sans text-sm font-semibold cursor-pointer transition-all duration-200 border-none ${
                !annual
                  ? "bg-green-800 text-white shadow-[0_2px_12px_rgba(26,74,46,0.25)]"
                  : "bg-transparent text-text-muted"
              }`}>
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-6 py-2 rounded-lg font-sans text-sm font-semibold cursor-pointer transition-all duration-200 border-none flex items-center gap-2 ${
                annual
                  ? "bg-green-800 text-white shadow-[0_2px_12px_rgba(26,74,46,0.25)]"
                  : "bg-transparent text-text-muted"
              }`}>
              Annual
              <span className="inline-flex items-center px-2.5 py-0.5 bg-gold/15 rounded-full text-[11px] font-extrabold text-gold-dark tracking-[0.04em]">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1020px] mx-auto relative z-[1] items-start">
          {/* Free */}
          <div className="rounded-[24px] px-8 py-10 border-[1.5px] border-cream-border bg-white relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] [animation:fadeUp_0.6s_0.1s_ease_both]">
            <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
              <GraduationCap size={20} strokeWidth={1.75} className="text-green-600" />
            </div>
            <div className="text-xs font-bold tracking-[0.1em] uppercase text-text-muted mb-2">
              Free
            </div>
            <div className="font-serif text-[48px] text-green-900 leading-none mb-1 flex items-baseline gap-1">
              ₦0<sub className="font-sans text-base font-medium text-text-muted">/mo</sub>
            </div>
            <div className="text-xs text-text-light mb-2">Forever free. No card needed.</div>
            <div className="text-[13px] text-text-muted leading-[1.6] mb-6 min-h-[40px]">
              Everything you need to start preparing for your exams today.
            </div>
            <div className="h-px bg-cream-border mb-6" />
            <div className="flex flex-col gap-[11px] mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <FeatureRow key={f.text} {...f} />
              ))}
            </div>
            <button className="w-full py-3.5 rounded-xl font-sans text-sm font-bold cursor-pointer transition-all duration-[250ms] border-2 border-green-800 bg-transparent text-green-800 hover:bg-green-800 hover:text-white hover:-translate-y-px">
              Get Started Free
            </button>
          </div>

          {/* Student Pro — popular */}
          <div className="rounded-[24px] px-8 py-10 border-[1.5px] border-green-700 bg-green-800 relative flex flex-col transition-all duration-300 scale-[1.03] shadow-[var(--shadow-heavy)] hover:scale-[1.03] hover:-translate-y-1 [animation:fadeUp_0.6s_0.2s_ease_both]">
            <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-gold text-green-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-[18px] py-[5px] rounded-full whitespace-nowrap">
              🔥 Most Popular
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/[0.12] flex items-center justify-center mb-5">
              <Zap size={20} strokeWidth={1.75} className="text-white" />
            </div>
            <div className="text-xs font-bold tracking-[0.1em] uppercase text-white/55 mb-2">
              Student Pro
            </div>
            <div className="font-serif text-[48px] text-white leading-none mb-1 flex items-baseline gap-1">
              {annual ? "₦1,667" : "₦2,500"}
              <sub className="font-sans text-base font-medium text-white/50">/mo</sub>
            </div>
            <div className="text-xs text-white/40 mb-2">
              {annual ? "Billed ₦20,000/year — save 33%" : "Billed monthly"}
            </div>
            <div className="text-[13px] text-white/55 leading-[1.6] mb-6 min-h-[40px]">
              Everything you need to score high. Trusted by 12,000+ students.
            </div>
            <div className="h-px bg-white/[0.12] mb-6" />
            <div className="flex flex-col gap-[11px] mb-8 flex-1">
              {PRO_FEATURES.map((f) => (
                <FeatureRow key={f.text} {...f} popular />
              ))}
            </div>
            <button className="w-full py-3.5 rounded-xl font-sans text-sm font-bold cursor-pointer transition-all duration-[250ms] bg-gold border-2 border-gold text-green-900 hover:bg-gold-dark hover:border-gold-dark hover:shadow-[0_8px_24px_rgba(245,200,66,0.4)]">
              {annual ? "Start Annual — ₦20,000/yr" : "Start Pro — ₦2,500/mo"}
            </button>
          </div>

          {/* School */}
          <div className="rounded-[24px] px-8 py-10 border-[1.5px] border-cream-border bg-white relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] [animation:fadeUp_0.6s_0.3s_ease_both]">
            <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
              <School size={20} strokeWidth={1.75} className="text-green-600" />
            </div>
            <div className="text-xs font-bold tracking-[0.1em] uppercase text-text-muted mb-2">
              School
            </div>
            <div className="font-serif text-[48px] text-green-900 leading-none mb-1 flex items-baseline gap-1">
              ₦15k<sub className="font-sans text-base font-medium text-text-muted">/mo</sub>
            </div>
            <div className="text-xs text-text-light mb-2">Scales with your student count</div>
            <div className="text-[13px] text-text-muted leading-[1.6] mb-6 min-h-[40px]">
              Full admin suite for your school with branded portal and reporting.
            </div>
            <div className="h-px bg-cream-border mb-6" />
            <div className="flex flex-col gap-[11px] mb-8 flex-1">
              {SCHOOL_FEATURES.map((f) => (
                <FeatureRow key={f.text} {...f} />
              ))}
            </div>
            <button className="w-full py-3.5 rounded-xl font-sans text-sm font-bold cursor-pointer transition-all duration-[250ms] border-2 border-green-800 bg-transparent text-green-800 hover:bg-green-800 hover:text-white hover:-translate-y-px">
              Book School Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

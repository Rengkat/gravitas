"use client";

import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";

interface Props {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState("");

  function sendReset() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErr("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  }

  if (sent) {
    return (
      <div className="text-center [animation:fadeUp_0.4s_ease_both]">
        <div className="w-20 h-20 rounded-3xl bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center text-4xl mx-auto mb-6 [animation:float_6s_ease-in-out_infinite]">
          📨
        </div>
        <h2 className="font-serif text-[28px] text-green-900 leading-tight mb-3">
          Check your inbox
        </h2>
        <p className="text-green-700/55 text-sm leading-relaxed mb-2 max-w-[280px] mx-auto">
          We&apos;ve sent a password reset link to
        </p>
        <p className="font-bold text-green-800 text-sm mb-8">{email}</p>

        <div className="space-y-3 mb-6 text-left">
          {[
            "Check your inbox (and spam folder)",
            'Click the "Reset Password" button in the email',
            "Create your new password — link expires in 30 minutes",
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-green-900/10 text-sm">
              <span className="text-green-500 shrink-0 mt-0.5 font-bold">①②③"[i]"</span>
              <span className="text-green-900/70">{step}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onBack}
          className="w-full py-3.5 border-2 border-green-800 text-green-800 font-bold text-sm rounded-xl hover:bg-green-800 hover:text-white transition-all duration-200 mb-3 bg-transparent cursor-pointer">
          Back to Login
        </button>
        <button
          onClick={() => setSent(false)}
          className="w-full py-3 text-sm text-green-700/55 font-medium hover:text-green-700 transition-colors bg-transparent border-none cursor-pointer">
          Didn&apos;t receive it? Resend →
        </button>
      </div>
    );
  }

  return (
    <div className="[animation:fadeUp_0.4s_ease_both]">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-green-700/55 hover:text-green-800 transition-colors mb-6 group bg-transparent border-none cursor-pointer p-0">
        <ArrowLeft
          size={14}
          strokeWidth={2.5}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        Back to login
      </button>

      <div className="mb-8">
        <div className="w-16 h-16 rounded-2xl bg-green-800/[0.08] border-2 border-green-800/[0.12] flex items-center justify-center mx-auto mb-5">
          <Mail size={28} strokeWidth={1.5} className="text-green-700" />
        </div>
        <h2 className="font-serif text-[28px] text-green-900 leading-tight tracking-tight mb-2 text-center">
          Reset your password
        </h2>
        <p className="text-green-700/55 text-sm text-center max-w-[300px] mx-auto">
          Enter your email address and we&apos;ll send a secure reset link.
        </p>
      </div>

      <div className="mb-5">
        <label className="block text-[11px] font-bold text-green-900/60 mb-1.5 tracking-widest uppercase">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700/30 pointer-events-none">
            <Mail size={16} strokeWidth={1.8} />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailErr("");
            }}
            placeholder="adaeze@example.com"
            className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-green-900 text-sm placeholder:text-green-900/30 font-medium outline-none transition-all duration-200 border-[1.5px] ${emailErr ? "border-red-400 shadow-[0_0_0_3px_rgba(230,57,70,0.1)]" : "border-green-900/15 focus:border-green-800 focus:shadow-[0_0_0_3px_rgba(26,74,46,0.1)]"}`}
          />
        </div>
        {emailErr && <p className="text-xs text-red-500 mt-1.5 ml-1">{emailErr}</p>}
      </div>

      <button
        onClick={sendReset}
        disabled={loading}
        className="relative w-full py-4 bg-green-800 text-white font-bold text-[15px] rounded-xl hover:bg-green-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(26,74,46,0.3)] flex items-center justify-center gap-2 overflow-hidden mb-4 border-none cursor-pointer after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/12 after:to-transparent after:pointer-events-none">
        {loading ? (
          <>
            <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="white"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending…
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      <p className="text-xs text-center text-green-700/40">
        Remember your password?{" "}
        <button
          onClick={onBack}
          className="text-green-700 font-semibold underline underline-offset-2 ml-1 bg-transparent border-none cursor-pointer">
          Log in
        </button>
      </p>
    </div>
  );
}

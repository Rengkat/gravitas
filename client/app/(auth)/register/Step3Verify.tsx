"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { ArrowRight, Mail } from "lucide-react";

interface Props {
  email: string;
  onVerified: () => void;
}

export default function Step3Verify({ email, onVerified }: Props) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [resendCount, setResendCount] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── auto-verify when all 6 filled ── */
  useEffect(() => {
    if (digits.every((d) => d.length === 1) && !verified) {
      setTimeout(handleVerify, 400);
    }
  }, [digits]);

  /* ── resend countdown ── */
  useEffect(() => {
    if (resendCount === null || resendCount <= 0) return;
    const id = setTimeout(() => setResendCount((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCount]);

  function handleChange(i: number, val: string) {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    setDigits(next);
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  }

  function handleVerify() {
    if (digits.some((d) => !d)) return;
    const next = [...digits].map(() => "");
    // simulate correct code — mark verified
    setVerified(true);
    setTimeout(onVerified, 600);
  }

  function startResend() {
    setResendCount(60);
  }

  const allFilled = digits.every((d) => d.length === 1);

  return (
    <div className="[animation:fadeUp_0.4s_ease_both]">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-3xl bg-green-800/[0.08] border-2 border-green-800/15 flex items-center justify-center mx-auto mb-5 [animation:float_6s_ease-in-out_infinite]">
          <Mail size={36} className="text-green-700/60" strokeWidth={1.5} />
        </div>
        <h2 className="font-serif text-[28px] text-green-900 leading-tight tracking-tight mb-3">
          Check your inbox
        </h2>
        <p className="text-green-700/60 text-sm leading-relaxed max-w-xs mx-auto">
          We sent a 6-digit verification code to
          <br />
          <strong className="text-green-800">{email || "your email address"}</strong>
        </p>
      </div>

      {/* OTP inputs */}
      <div className="flex justify-center gap-3 mb-6">
        {digits.map((d: any, i: any) => {
          return (
            <Fragment key={i}>
              {i === 3 && (
                <div key="sep" className="flex items-center text-green-900/20 font-bold text-xl">
                  —
                </div>
              )}
              <input
                title="code"
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold text-green-900 rounded-xl border-2 bg-white
                           outline-none transition-all font-mono
                           ${
                             verified
                               ? "border-green-500 bg-green-50"
                               : "border-green-900/15 focus:border-green-800 focus:shadow-[0_0_0_3px_rgba(26,74,46,0.1)]"
                           }`}
              />
            </Fragment>
          );
        })}
      </div>

      {/* Verify button */}
      <button
        onClick={handleVerify}
        disabled={!allFilled}
        className="w-full py-4 bg-green-800 text-white font-bold text-[15px] rounded-xl
                   hover:bg-green-700 transition-all duration-200 hover:-translate-y-0.5
                   hover:shadow-[0_8px_24px_rgba(26,74,46,0.3)]
                   flex items-center justify-center gap-2 mb-4
                   border-none cursor-pointer
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
        Verify &amp; Continue
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>

      {/* Resend */}
      <div className="text-center text-sm text-green-700/50">
        Didn&apos;t receive it?{" "}
        {resendCount !== null && resendCount > 0 ? (
          <span className="text-green-700/40 font-mono text-xs ml-1">
            in <span className="font-semibold">{resendCount}</span>s
          </span>
        ) : (
          <button
            onClick={startResend}
            className="text-green-700 font-semibold hover:text-green-800 underline underline-offset-2 transition-colors ml-1 bg-transparent border-none cursor-pointer">
            Resend code
          </button>
        )}
      </div>

      {/* SMS fallback */}
      <div className="mt-5 p-4 rounded-xl bg-green-800/[0.05] border border-green-800/[0.12] text-center">
        <p className="text-xs text-green-700/60 mb-2">Can&apos;t find the email? Check spam or</p>
        <button className="text-xs font-semibold text-green-700 hover:text-green-800 underline underline-offset-2 bg-transparent border-none cursor-pointer">
          Send OTP to your phone via SMS instead
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

import { AlertCircle, X } from "lucide-react";
import LoginLeftPanel from "./LoginLeftPanel";
import LoginSuccess from "./LoginSuccess";
import ForgotPassword from "./ForgotPassword";
import EmailLoginForm from "./EmailLoginForm";
import PhoneLoginForm from "./PhoneLoginForm";

type View = "login" | "forgot" | "success";
type Tab = "email" | "phone";

const ERROR_CREDS = {
  title: "Invalid credentials",
  desc: "The email or password you entered is incorrect. Please try again.",
};

export default function LoginPage() {
  const [view, setView] = useState<View>("login");
  const [tab, setTab] = useState<Tab>("email");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<{ title: string; desc: string } | null>(null);

  function handleSuccess(name: string) {
    if (name === "__error__") {
      setError(ERROR_CREDS);
    } else {
      setUserName(name);
      setView("success");
    }
  }

  /* ── Google SVG paths — kept as static inline SVG ── */
  const GoogleSVG = (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex bg-cream">
      {/* ── Left decorative panel ── */}
      <LoginLeftPanel />

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-cream">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-5 lg:px-10 border-b border-green-900/[0.08]">
          <a href="/" className="flex items-center gap-2 lg:hidden no-underline">
            <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center font-serif text-xl text-gold">
              G
            </div>
            <span className="font-serif text-xl text-green-800">Gravitas</span>
          </a>
          <div className="ml-auto flex items-center gap-2 text-sm text-green-700/60">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-green-800 hover:text-green-600 transition-colors underline underline-offset-2">
              Sign up free →
            </a>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[460px]">
            {/* ── SUCCESS ── */}
            {view === "success" && <LoginSuccess name={userName} />}

            {/* ── FORGOT PASSWORD ── */}
            {view === "forgot" && <ForgotPassword onBack={() => setView("login")} />}

            {/* ── LOGIN PANEL ── */}
            {view === "login" && (
              <div className="[animation:fadeUp_0.4s_ease_both]">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="font-serif text-[32px] text-green-900 leading-tight tracking-tight mb-2">
                    Welcome back
                  </h2>
                  <p className="text-green-700/55 text-sm">
                    Log in to continue your exam preparation.
                  </p>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-1 p-1 bg-green-900/[0.06] rounded-xl mb-6">
                  <button
                    onClick={() => setTab("email")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-[250ms] border-none cursor-pointer
                      ${tab === "email" ? "bg-green-800 text-white shadow-[0_2px_12px_rgba(26,74,46,0.25)]" : "bg-transparent text-green-900/55"}`}>
                    Email
                  </button>
                  <button
                    onClick={() => setTab("phone")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-[250ms] border-none cursor-pointer
                      ${tab === "phone" ? "bg-green-800 text-white shadow-[0_2px_12px_rgba(26,74,46,0.25)]" : "bg-transparent text-green-900/55"}`}>
                    Phone / OTP
                  </button>
                </div>

                {/* Error banner */}
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 mb-5 [animation:fadeUp_0.3s_ease_both]">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <AlertCircle size={14} strokeWidth={2.5} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-red-700 text-sm font-semibold">{error.title}</p>
                      <p className="text-red-500 text-xs mt-0.5">{error.desc}</p>
                    </div>
                    <button
                      title="error"
                      onClick={() => setError(null)}
                      className="ml-auto text-red-400 hover:text-red-600 transition-colors p-1 bg-transparent border-none cursor-pointer">
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                )}

                {/* OAuth */}
                <div className="space-y-3 mb-6">
                  <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border-2 border-green-900/[0.12] bg-white font-semibold text-green-900 text-sm hover:border-green-900/25 hover:bg-green-50/40 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(13,43,26,0.12)]">
                    {GoogleSVG}
                    Continue with Google
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-green-900/[0.12] bg-white font-semibold text-green-900 text-sm hover:border-green-900/25 hover:bg-green-50/40 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(13,43,26,0.12)]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      Apple
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-green-900/[0.12] bg-white font-semibold text-green-900 text-sm hover:border-green-900/25 hover:bg-green-50/40 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(13,43,26,0.12)]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-green-900/10" />
                  <span className="text-[11px] text-green-700/40 font-bold tracking-widest uppercase">
                    or
                  </span>
                  <div className="flex-1 h-px bg-green-900/10" />
                </div>

                {/* Email form */}
                {tab === "email" && (
                  <EmailLoginForm
                    onSuccess={handleSuccess}
                    onForgot={() => setView("forgot")}
                    error={error}
                    onClearError={() => setError(null)}
                  />
                )}

                {/* Phone form */}
                {tab === "phone" && <PhoneLoginForm onSuccess={handleSuccess} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

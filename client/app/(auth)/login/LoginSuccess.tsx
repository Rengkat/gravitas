import { Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

const SESSIONS = [
  {
    icon: "📝",
    iconBg: "bg-green-500/10",
    title: "JAMB Physics Mock — 2023",
    sub: "Question 23 of 40 · Saved 2 days ago",
    cta: "Resume",
  },
  {
    icon: "🤖",
    iconBg: "bg-gold/15",
    title: "Sabi-Tutor — Chemistry",
    sub: "Moles & Avogadro · 3 days ago",
    cta: "Continue",
  },
];

interface Props {
  name: string;
}

export default function LoginSuccess({ name }: Props) {
  return (
    <div className="text-center py-8 [animation:fadeUp_0.4s_ease_both]">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="w-24 h-24 rounded-3xl bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center text-5xl [animation:float_6s_ease-in-out_infinite]">
          🎓
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-gold flex items-center justify-center shadow-md">
          <Flame size={16} strokeWidth={1.5} className="text-green-900" />
        </div>
      </div>

      <h2 className="font-serif text-[30px] text-green-900 tracking-tight mb-2">
        You&apos;re back!
      </h2>
      <p className="text-green-700/55 text-sm mb-2">
        Welcome back, <strong className="text-green-800">{name}</strong>
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-bold mb-8">
        <Flame size={13} strokeWidth={1.5} className="text-gold" />
        14-day streak — don&apos;t break it!
      </div>

      {/* Last session recap */}
      <div className="bg-white border border-green-900/10 rounded-2xl p-5 mb-5 text-left">
        <p className="text-[10px] font-bold text-green-700/40 tracking-widest uppercase mb-4">
          Continue where you left off
        </p>
        {SESSIONS.map(({ icon, iconBg, title, sub, cta }) => (
          <div
            key={title}
            className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-green-800/[0.04] mt-1 first:mt-0">
            <div
              className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-xl shrink-0`}>
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-green-900">{title}</p>
              <p className="text-xs text-green-700/50">{sub}</p>
            </div>
            <div className="text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-lg">
              {cta}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="w-full py-4 bg-green-800 text-white font-bold text-[15px] rounded-xl hover:bg-green-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(26,74,46,0.3)] flex items-center justify-center gap-2 no-underline">
        Go to Dashboard
        <ArrowRight size={16} strokeWidth={2.5} />
      </Link>
    </div>
  );
}

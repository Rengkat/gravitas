import { ArrowRight } from "lucide-react";

const NEXT_STEPS = [
  { icon: "📝", iconBg: "bg-green-500/10", title: "Take a practice exam",      sub: "See where you stand right now" },
  { icon: "🤖", iconBg: "bg-gold/15",      title: "Meet Sabi-Tutor",           sub: "Ask your first question in Pidgin or English" },
];

export default function StepSuccess() {
  return (
    <div className="text-center py-8 [animation:fadeUp_0.4s_ease_both]">

      <div className="w-24 h-24 rounded-3xl bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center text-5xl mx-auto mb-6 [animation:float_6s_ease-in-out_infinite]">
        🎉
      </div>

      <h2 className="font-serif text-[32px] text-green-900 leading-tight tracking-tight mb-3">
        Welcome to Gravitas!
      </h2>
      <p className="text-green-700/60 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
        Your account is ready. Let&apos;s get you set up and start preparing for your exam.
      </p>

      <div className="space-y-3 mb-8 text-left">
        {NEXT_STEPS.map(({ icon, iconBg, title, sub }) => (
          <div key={title} className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-green-900/10">
            <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center text-sm shrink-0`}>
              {icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-green-900">{title}</div>
              <div className="text-xs text-green-700/50">{sub}</div>
            </div>
            <ArrowRight size={14} strokeWidth={2.5} className="text-green-700/40" />
          </div>
        ))}
      </div>

      <a
        href="/dashboard"
        className="w-full py-4 bg-green-800 text-white font-bold text-[15px] rounded-xl
                   hover:bg-green-700 transition-all duration-200 hover:-translate-y-0.5
                   hover:shadow-[0_8px_24px_rgba(26,74,46,0.3)]
                   flex items-center justify-center gap-2 no-underline"
      >
        Go to My Dashboard →
      </a>
    </div>
  );
}

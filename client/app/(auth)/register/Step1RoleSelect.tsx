import {
  Check, ArrowRight,
  GraduationCap, Users, BookOpen,
  School, PenSquare, Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type RoleId = "student" | "parent" | "tutor" | "school" | "teacher" | "professional";

type RoleCard = {
  id:      RoleId;
  Icon:    LucideIcon;
  title:   string;
  desc:    string;
  badge?:  { label: string; cls: string };
  iconBg:  string;
  iconCls: string;
};

/* ─── Data ───────────────────────────────────────────────────────────────────
   All class strings are complete static literals — no dynamic construction.
──────────────────────────────────────────────────────────────────────────── */
const ROLES: RoleCard[] = [
  {
    id:      "student",
    Icon:    GraduationCap,
    title:   "Student",
    desc:    "JAMB, WAEC, Post-UTME prep & AI tutoring",
    badge:   { label: "Most Popular", cls: "bg-green-500/10 text-green-600" },
    iconBg:  "bg-green-500/10",
    iconCls: "text-green-600",
  },
  {
    id:      "parent",
    Icon:    Users,
    title:   "Parent / Guardian",
    desc:    "Monitor your child's progress & receive weekly reports",
    iconBg:  "bg-blue-500/10",
    iconCls: "text-blue-500",
  },
  {
    id:      "tutor",
    Icon:    BookOpen,
    title:   "Tutor",
    desc:    "Teach students online or in-person, earn per session",
    badge:   { label: "Earn Money", cls: "bg-purple-500/10 text-purple-600" },
    iconBg:  "bg-purple-500/10",
    iconCls: "text-purple-500",
  },
  {
    id:      "school",
    Icon:    School,
    title:   "School / Institution",
    desc:    "White-label portal, custom CBT tests & bulk student management",
    iconBg:  "bg-orange-500/10",
    iconCls: "text-orange-500",
  },
  {
    id:      "teacher",
    Icon:    PenSquare,
    title:   "Teacher / Lecturer",
    desc:    "Upload materials, set tests, track your class performance",
    iconBg:  "bg-teal-500/10",
    iconCls: "text-teal-600",
  },
  {
    id:      "professional",
    Icon:    Briefcase,
    title:   "Professional",
    desc:    "ICAN, Nursing Council, professional certification prep",
    iconBg:  "bg-gold/15",
    iconCls: "text-gold-dark",
  },
];

interface Props {
  selected:   RoleId | null;
  onSelect:   (id: RoleId) => void;
  onContinue: () => void;
}

export default function Step1RoleSelect({ selected, onSelect, onContinue }: Props) {
  return (
    <div className="[animation:fadeUp_0.4s_ease_both]">

      {/* Header */}
      <div className="mb-8">
        <h2 className="font-serif text-[28px] text-green-900 leading-tight tracking-tight mb-2">
          Who are you joining as?
        </h2>
        <p className="text-green-700/60 text-sm leading-relaxed">
          Choose your account type. You can switch or add roles later.
        </p>
      </div>

      {/* Role grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {ROLES.map(({ id, Icon, title, desc, badge, iconBg, iconCls }) => {
          const isSelected = selected === id;
          return (
            <div
              key={id}
              onClick={() => onSelect(id)}
              className={`cursor-pointer rounded-2xl border-2 bg-white p-5 relative transition-all duration-[250ms]
                ${isSelected
                  ? "border-green-800 bg-green-800/[0.04] shadow-[0_0_0_3px_rgba(26,74,46,0.12),0_4px_20px_rgba(13,43,26,0.1)] -translate-y-0.5"
                  : "border-green-900/10 hover:border-green-900/20 hover:shadow-[var(--shadow-card)]"
                }`}
            >
              {/* Check badge */}
              <div
                className={`absolute top-3 right-3 w-5 h-5 rounded-full bg-green-800 flex items-center justify-center transition-all duration-200
                  ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
              >
                <Check size={10} strokeWidth={2.5} className="text-white" />
              </div>

              {/* Role icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
                <Icon size={22} strokeWidth={1.75} className={iconCls} />
              </div>

              <div className="font-bold text-green-900 text-[15px] mb-1">{title}</div>
              <div className="text-green-700/55 text-xs leading-relaxed">{desc}</div>

              {badge && (
                <div className={`mt-3 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${badge.cls}`}>
                  {badge.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="w-full py-4 bg-green-800 text-white font-bold text-[15px] rounded-xl
                   hover:bg-green-700 active:bg-green-900 transition-all duration-200
                   hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,74,46,0.3)]
                   flex items-center justify-center gap-2 relative overflow-hidden group
                   border-none cursor-pointer"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        Continue
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

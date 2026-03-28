import { ExamTarget, RoleCard, RoleConfig, RoleId } from "@/types/registerType";
import {
  GraduationCap,
  Users,
  BookOpen,
  School,
  PenSquare,
  Briefcase,
  Target,
  ClipboardList,
  FileText,
  Stethoscope,
} from "lucide-react";

import { z } from "zod";

export function buildSchema(cfg: RoleConfig) {
  return z
    .object({
      firstName: z.string().min(2, "Too short"),
      lastName: z.string().min(2, "Too short"),
      schoolName: cfg.showSchoolName
        ? z.string().min(2, "Enter your school name")
        : z.string().optional(),
      email: z.string().email("Enter a valid email address"),
      phone: z.string().optional(),
      subject: cfg.showSubject
        ? z.string().min(1, "Please select a subject")
        : z.string().optional(),
      lga: cfg.showLGA ? z.string().min(1, "Please select your state") : z.string().optional(),
      examTarget: cfg.showExamTarget
        ? z.string().min(1, "Please select an exam target")
        : z.string().optional(),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirm: z.string(),
      agreeTerms: z.literal(true, {
        message: "Please agree to the Terms of Service",
      }),
      agreeMarketing: z.boolean().optional(),
    })
    .refine((d) => d.password === d.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    });
}

export const ROLES: RoleCard[] = [
  {
    id: "student",
    Icon: GraduationCap,
    title: "Student",
    desc: "JAMB, WAEC, Post-UTME prep & AI tutoring",
    badge: { label: "Most Popular", cls: "bg-green-500/10 text-green-600" },
    iconBg: "bg-green-500/10",
    iconCls: "text-green-600",
  },
  {
    id: "parent",
    Icon: Users,
    title: "Parent / Guardian",
    desc: "Monitor your child's progress & receive weekly reports",
    iconBg: "bg-blue-500/10",
    iconCls: "text-blue-500",
  },
  {
    id: "tutor",
    Icon: BookOpen,
    title: "Tutor",
    desc: "Teach students online or in-person, earn per session",
    badge: { label: "Earn Money", cls: "bg-purple-500/10 text-purple-600" },
    iconBg: "bg-purple-500/10",
    iconCls: "text-purple-500",
  },
  {
    id: "school",
    Icon: School,
    title: "School / Institution",
    desc: "White-label portal, custom CBT tests & bulk student management",
    iconBg: "bg-orange-500/10",
    iconCls: "text-orange-500",
  },
  {
    id: "teacher",
    Icon: PenSquare,
    title: "Teacher / Lecturer",
    desc: "Upload materials, set tests, track your class performance",
    iconBg: "bg-teal-500/10",
    iconCls: "text-teal-600",
  },
  {
    id: "professional",
    Icon: Briefcase,
    title: "Professional",
    desc: "ICAN, Nursing Council, professional certification prep",
    iconBg: "bg-gold/15",
    iconCls: "text-gold-dark",
  },
];

export const EXAM_TARGETS: ExamTarget[] = [
  { value: "jamb", label: "JAMB", Icon: Target },
  { value: "waec", label: "WAEC", Icon: ClipboardList },
  { value: "post-utme", label: "Post-UTME", Icon: GraduationCap },
  { value: "neco", label: "NECO", Icon: FileText },
  { value: "ican", label: "ICAN", Icon: Briefcase },
  { value: "nursing", label: "Nursing", Icon: Stethoscope },
];

export const STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Kano",
  "Oyo",
  "Kaduna",
  "Anambra",
  "Delta",
  "Enugu",
  "Ogun",
  "Imo",
  "Kwara",
  "Osun",
  "Ekiti",
  "Ondo",
  "Cross River",
  "Akwa Ibom",
  "Edo",
  "Benue",
  "Plateau",
  "Niger",
  "Kogi",
  "Nassarawa",
  "Taraba",
  "Adamawa",
  "Gombe",
  "Bauchi",
  "Borno",
  "Yobe",
  "Jigawa",
  "Katsina",
  "Kebbi",
  "Sokoto",
  "Zamfara",
  "Bayelsa",
  "Abia",
  "Ebonyi",
];

/* ─── Password strength ──────────────────────────────────────── */
export function getStrength(val: string): { score: number; label: string } {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const labels = [
    "",
    "Weak — add uppercase & numbers",
    "Fair — add a special character",
    "Good — almost there!",
    "Strong ✓",
  ];
  return { score, label: val.length ? labels[score] : "" };
}

/* ─── Shared sub-components ──────────────────────────────────── */
export function FieldLabel({ text, hint }: { text: string; hint?: string }) {
  return (
    <label className="block text-xs font-semibold text-green-900/70 mb-1.5 tracking-wide uppercase">
      {text}
      {hint && (
        <span className="text-green-700/40 normal-case font-normal tracking-normal ml-1">
          {hint}
        </span>
      )}
    </label>
  );
}

export function FieldError({ msg }: { msg: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1.5 ml-1">{msg}</p>;
}

export const ROLE_CONFIG: Record<RoleId, RoleConfig> = {
  student: {
    Icon: GraduationCap,
    label: "Student Account",
    heading: "Create your student account",
    sub: "Start preparing for JAMB, WAEC, and more.",
    showExamTarget: true,
    showSchoolName: false,
    showSubject: false,
    showLGA: false,
  },
  parent: {
    Icon: Users,
    label: "Parent / Guardian Account",
    heading: "Create your parent account",
    sub: "Monitor your child's progress and receive weekly WhatsApp reports.",
    showExamTarget: false,
    showSchoolName: false,
    showSubject: false,
    showLGA: false,
  },
  tutor: {
    Icon: BookOpen,
    label: "Tutor Account",
    heading: "Apply as a Gravitas tutor",
    sub: "Teach students online or near your location. Earn per session.",
    showExamTarget: false,
    showSchoolName: false,
    showSubject: true,
    showLGA: true,
  },
  school: {
    Icon: School,
    label: "School / Institution Account",
    heading: "Set up your school portal",
    sub: "Get a branded portal with CBT test builder, auto-grading, and parent reports.",
    showExamTarget: false,
    showSchoolName: true,
    showSubject: false,
    showLGA: false,
  },
  teacher: {
    Icon: PenSquare,
    label: "Teacher Account",
    heading: "Create your teacher account",
    sub: "Upload materials, set tests, and track your students' performance.",
    showExamTarget: false,
    showSchoolName: false,
    showSubject: true,
    showLGA: false,
  },
  professional: {
    Icon: Briefcase,
    label: "Professional Account",
    heading: "Create your professional account",
    sub: "Prepare for ICAN, Nursing Council, and other certifications.",
    showExamTarget: true,
    showSchoolName: false,
    showSubject: false,
    showLGA: false,
  },
};

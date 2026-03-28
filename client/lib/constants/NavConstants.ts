import {
  ClipboardList,
  BrainCircuit,
  Video,
  LibraryBig,
  Building2,
  BarChart3,
  Target,
  FileText,
  GraduationCap,
  ScrollText,
  Briefcase,
  Stethoscope,
  LayoutDashboard,
  PencilRuler,
  Users,
  FileOutput,
  Newspaper,
  PlayCircle,
  LifeBuoy,
  MessageCircle,
} from "lucide-react";
export type LucideIcon = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

export interface NavItemData {
  icon: LucideIcon;
  color: "green" | "gold" | "blue" | "orange" | "purple";
  title: string;
  desc: string;
  badge?: string | null;
  badgeStyle?: "gold" | "new" | null;
}

export const NAV_PRODUCTS: NavItemData[] = [
  {
    icon: ClipboardList,
    color: "green",
    title: "CBT Exam Practice",
    desc: "Pixel-perfect JAMB, WAEC & ICAN simulators with real past questions",
  },
  {
    icon: BrainCircuit,
    color: "gold",
    title: "Gravitas-Tutor AI",
    desc: "Your 24/7 AI subject expert — explains in Pidgin if you want",
  },
  {
    icon: Video,
    color: "blue",
    title: "Live Tutoring",
    desc: "Book verified tutors online or near your LGA with whiteboard sessions",
  },
  {
    icon: LibraryBig,
    color: "purple",
    title: "Content Library",
    desc: "Short video lessons + PDF resources — works offline after download",
  },
  {
    icon: Building2,
    color: "orange",
    title: "School Portal",
    desc: "White-label CBT platform for your school with auto-grading & reports",
  },
  {
    icon: BarChart3,
    color: "green",
    title: "Performance Analytics",
    desc: "Track weak topics, score trends and time-per-question across all exams",
  },
];

export const NAV_EXAMS: NavItemData[] = [
  {
    icon: Target,
    color: "gold",
    title: "JAMB / UTME",
    badge: "40k+ Qs",
    badgeStyle: "gold",
    desc: "Exact interface replication. 10+ years of past questions per subject.",
  },
  {
    icon: FileText,
    color: "green",
    title: "WAEC / NECO",
    badge: "2026 Ready",
    badgeStyle: "new",
    desc: "Objective + theory/essay. Mirrors the new 2026 digital format.",
  },
  {
    icon: GraduationCap,
    color: "blue",
    title: "Post-UTME",
    badge: null,
    badgeStyle: null,
    desc: "UNILAG, UI, OAU, ABU, UNIBEN + 35 more institutions.",
  },
  {
    icon: ScrollText,
    color: "green",
    title: "NABTEB",
    badge: null,
    badgeStyle: null,
    desc: "Technical & business past questions with full explanations.",
  },
  {
    icon: Briefcase,
    color: "orange",
    title: "ICAN",
    badge: null,
    badgeStyle: null,
    desc: "Syllabus — MCQ + essay with AI marking for all levels.",
  },
  {
    icon: Stethoscope,
    color: "purple",
    title: "Nursing Council",
    badge: null,
    badgeStyle: null,
    desc: "NCN pre-registration and licensing exam preparation.",
  },
];

export const NAV_SCHOOLS: NavItemData[] = [
  {
    icon: LayoutDashboard,
    color: "green",
    title: "School Portal",
    desc: "Branded subdomain, admin dashboard, student management",
  },
  {
    icon: PencilRuler,
    color: "gold",
    title: "CBT Test Builder",
    desc: "Create exams by Class → Subject → Topic with full control",
  },
  {
    icon: Users,
    color: "blue",
    title: "Parent Dashboard",
    desc: "Weekly WhatsApp reports sent to parents automatically",
  },
  {
    icon: FileOutput,
    color: "orange",
    title: "Auto Report Cards",
    desc: "Instant PDF report cards generated after every exam",
  },
];

export const NAV_RESOURCES: NavItemData[] = [
  {
    icon: Newspaper,
    color: "green",
    title: "Blog",
    desc: "Study tips, JAMB guides, WAEC strategies",
  },
  {
    icon: PlayCircle,
    color: "gold",
    title: "Video Tutorials",
    desc: "How to use Gravitas + exam prep masterclasses",
  },
  {
    icon: LifeBuoy,
    color: "blue",
    title: "Help Centre",
    desc: "FAQs, troubleshooting, contact support",
  },
  {
    icon: MessageCircle,
    color: "orange",
    title: "Community",
    desc: "Join 12k+ students on WhatsApp & Telegram",
  },
];

export const ICON_CLASSES: Record<NavItemData["color"], string> = {
  green: "bg-green-500/10  text-green-600",
  gold: "bg-gold/15        text-gold-dark",
  blue: "bg-blue-500/10   text-blue-600",
  orange: "bg-orange-500/10 text-orange-600",
  purple: "bg-purple-500/10 text-purple-600",
};

export const INLINE_BADGE_CLASSES: Record<"gold" | "new", string> = {
  gold: "bg-gold/15       text-gold-dark",
  new: "bg-gold-light    text-amber-800",
};

export const FOOTER_BADGE_CLASSES: Record<"green" | "gold" | "new", string> = {
  green: "bg-green-500/10 text-green-600",
  gold: "bg-gold/15      text-gold-dark",
  new: "bg-gold-light   text-amber-800",
};

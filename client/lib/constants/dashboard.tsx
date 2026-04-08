import {
  LayoutDashboard,
  BarChart3,
  Library,
  Users,
  Calendar,
  Bot,
  Settings,
  Target,
  Gamepad2,
} from "lucide-react";
export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", exact: true },
  { icon: Target, label: "Practice CBT", href: "/dashboard/practice" },
  { icon: BarChart3, label: "Performance Analysis", href: "/dashboard/performance" },
  { icon: Library, label: "Library", href: "/dashboard/library" },
  { icon: Users, label: "Tutors", href: "/dashboard/tutors" },
  { icon: Calendar, label: "Bookings", href: "/dashboard/bookings" },
  { icon: Bot, label: "AI Tutor", href: "/dashboard/ai-tutor" },
  { icon: Gamepad2, label: "Games", href: "/dashboard/games" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export type RecentSession = {
  id: string;
  examType: string;
  subject: string;
  score: number;
  total: number;
  date: string;
  duration: string;
};

export type WeakTopic = {
  id: string;
  topic: string;
  subject: string;
  accuracy: number;
  priority: "high" | "medium" | "low";
};

export type UpcomingBooking = {
  id: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
};

/* ─────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────── */
export const RECENT_SESSIONS: RecentSession[] = [
  {
    id: "1",
    examType: "JAMB",
    subject: "Mathematics",
    score: 28,
    total: 40,
    date: "Today",
    duration: "35 min",
  },
  {
    id: "2",
    examType: "JAMB",
    subject: "English",
    score: 32,
    total: 40,
    date: "Yesterday",
    duration: "32 min",
  },
  {
    id: "3",
    examType: "WAEC",
    subject: "Physics",
    score: 22,
    total: 30,
    date: "2 days ago",
    duration: "28 min",
  },
];

export const WEAK_TOPICS: WeakTopic[] = [
  { id: "1", topic: "Quadratic Equations", subject: "Mathematics", accuracy: 45, priority: "high" },
  { id: "2", topic: "Organic Chemistry", subject: "Chemistry", accuracy: 52, priority: "medium" },
  { id: "3", topic: "Past Tenses", subject: "English", accuracy: 48, priority: "high" },
];

export const UPCOMING_BOOKINGS: UpcomingBooking[] = [
  {
    id: "1",
    tutorName: "Dr. Adeola Williams",
    subject: "Mathematics",
    date: "Tomorrow",
    time: "4:00 PM",
  },
];

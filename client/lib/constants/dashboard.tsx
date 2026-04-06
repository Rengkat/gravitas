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
  { icon: Target, label: "Practice", href: "/dashboard/practice" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: Library, label: "Library", href: "/dashboard/library" },
  { icon: Users, label: "Tutors", href: "/dashboard/tutors" },
  { icon: Calendar, label: "Bookings", href: "/dashboard/bookings" },
  { icon: Bot, label: "AI Tutor", href: "/dashboard/ai-tutor" },
  { icon: Gamepad2, label: "Games", href: "/dashboard/games" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

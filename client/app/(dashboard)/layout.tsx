// app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Library,
  Users,
  Calendar,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  GraduationCap,
  Target,
  Flame,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  Zap,
  PlayCircle,
  FileText,
  MessageCircle,
  CreditCard,
  Lock,
  UserCircle,
  Gamepad2,
  Trophy,
  Sword,
  Crown,
  Volume2,
} from "lucide-react";
import Footer from "./Footer"; // Import the footer component

/* ─────────────────────────────────────────────────────────
   NAVIGATION ITEMS
───────────────────────────────────────────────────────── */
const NAV_ITEMS = [
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

/* ─────────────────────────────────────────────────────────
   MAIN LAYOUT COMPONENT
───────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const isParentView = false; // Would come from URL param or user role

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
        style={{ border: "1px solid rgba(30,80,50,0.1)" }}>
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ borderColor: "rgba(30,80,50,0.1)" }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(30,80,50,0.1)" }}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-800 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-serif text-xl font-bold" style={{ color: "#0d2b1a" }}>
              Gravitas
            </span>
            {isParentView && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "#f5c84220", color: "#d4a017" }}>
                Parent View
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "text-text-muted hover:bg-green-500/5 hover:text-green-800"
                }`}>
                <Icon size={18} strokeWidth={1.8} />
                <span className="text-[14px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div
          className="absolute bottom-0 left-0 right-0 py-[0.2rem] px-4 border-t"
          style={{ borderColor: "rgba(30,80,50,0.1)" }}>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-cream">
            <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-green-900">Oluwaseun Adebayo</div>
              <div className="text-[11px] text-text-muted">Student Pro • 45 day streak</div>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
              <LogOut size={16} className="text-text-muted" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 flex-1 flex flex-col">
        {/* Header */}
        <header
          className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b px-6 py-4"
          style={{ borderColor: "rgba(30,80,50,0.1)" }}>
          <div className="flex items-center justify-end gap-4">
            {/* XP Display */}
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-cream">
              <Flame size={14} className="text-orange-500" />
              <span className="text-[12px] font-semibold text-green-900">45 day streak</span>
              <div className="w-px h-4 bg-text-muted/20" />
              <Sparkles size={14} className="text-gold" />
              <span className="text-[12px] font-semibold text-green-900">2,450 XP</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg hover:bg-cream transition-colors relative">
                <Bell size={18} className="text-text-muted" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border p-4 z-50">
                  <div className="text-[13px] font-semibold mb-3">Notifications</div>
                  <div className="space-y-3">
                    <div className="text-[12px] text-text-muted">No new notifications</div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-cream transition-colors">
                <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <ChevronDown size={14} className="text-text-muted" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border p-2 z-50">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] hover:bg-cream transition-colors">
                    <UserCircle size={14} /> Profile
                  </Link>
                  <Link
                    href="/dashboard/settings/billing"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] hover:bg-cream transition-colors">
                    <CreditCard size={14} /> Billing
                  </Link>
                  <div className="h-px my-1 bg-cream-border" />
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 px-8 pt-6 pb-12">{children}</div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

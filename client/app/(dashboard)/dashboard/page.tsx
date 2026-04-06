"use client";

import Link from "next/link";
import {
  Flame,
  Sparkles,
  Target,
  Clock,
  Award,
  Zap,
  ArrowRight,
  Calendar,
  AlertCircle,
  BookOpen,
  Users,
  LucideIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type RecentSession = {
  id: string;
  examType: string;
  subject: string;
  score: number;
  total: number;
  date: string;
  duration: string;
};

type WeakTopic = {
  id: string;
  topic: string;
  subject: string;
  accuracy: number;
  priority: "high" | "medium" | "low";
};

type UpcomingBooking = {
  id: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
};

/* ─────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────── */
const RECENT_SESSIONS: RecentSession[] = [
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

const WEAK_TOPICS: WeakTopic[] = [
  { id: "1", topic: "Quadratic Equations", subject: "Mathematics", accuracy: 45, priority: "high" },
  { id: "2", topic: "Organic Chemistry", subject: "Chemistry", accuracy: 52, priority: "medium" },
  { id: "3", topic: "Past Tenses", subject: "English", accuracy: 48, priority: "high" },
];

const UPCOMING_BOOKINGS: UpcomingBooking[] = [
  {
    id: "1",
    tutorName: "Dr. Adeola Williams",
    subject: "Mathematics",
    date: "Tomorrow",
    time: "4:00 PM",
  },
];

/* ─────────────────────────────────────────────────────────
   STATS CARD
───────────────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl bg-white border transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}>
          <Icon size={18} strokeWidth={1.8} style={{ color }} />
        </div>
        <span className="text-[22px] font-bold text-green-900">{value}</span>
      </div>
      <div className="text-[13px] font-medium text-text-muted">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   WEAK TOPIC CARD
───────────────────────────────────────────────────────── */
function WeakTopicCard({ topic, subject, accuracy, priority }: WeakTopic) {
  const priorityColor =
    priority === "high" ? "#ef4444" : priority === "medium" ? "#f59e0b" : "#10b981";

  return (
    <div className="p-4 rounded-xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-[14px] font-semibold text-green-900">{topic}</div>
          <div className="text-[11px] text-text-muted">{subject}</div>
        </div>
        <div
          className="px-2 py-1 rounded-full text-[10px] font-bold"
          style={{ background: `${priorityColor}15`, color: priorityColor }}>
          {priority.toUpperCase()}
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-text-muted">Accuracy</span>
          <span className="font-semibold" style={{ color: accuracy < 50 ? "#ef4444" : "#f59e0b" }}>
            {accuracy}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-cream overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${accuracy}%`, background: accuracy < 50 ? "#ef4444" : "#f59e0b" }}
          />
        </div>
      </div>
      <button
        className="w-full mt-3 py-2 rounded-lg text-[12px] font-semibold transition-all"
        style={{ background: "rgba(26,74,46,0.08)", color: "#1a4a2e" }}>
        Practice Topic →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN DASHBOARD COMPONENT
───────────────────────────────────────────────────────── */
export default function DashboardHome() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-green-900 mb-2">Welcome back, Oluwaseun! 👋</h1>
        <p className="text-text-muted">
          Your exam is in 45 days. Let&apos;s make every session count.
        </p>{" "}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Flame} label="Current Streak" value="45 days" color="#f97316" />
        <StatCard icon={Sparkles} label="Total XP" value="2,450" color="#f5c842" />
        <StatCard icon={Target} label="Target Score" value="320/400" color="#2e8b57" />
        <StatCard icon={Clock} label="Study Hours" value="28 hrs" color="#6366f1" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/dashboard/practice"
          className="group p-5 rounded-2xl bg-gradient-to-r from-green-800 to-green-700 text-white transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <Target size={24} />
            <ArrowRight
              size={18}
              className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
            />
          </div>
          <div className="text-[15px] font-semibold mb-1">Start Practice</div>
          <div className="text-[12px] text-white/60">Take a mock exam or practice session</div>
        </Link>

        <Link
          href="/dashboard/ai-tutor"
          className="group p-5 rounded-2xl bg-gradient-to-r from-gold to-gold-dark text-green-900 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <Zap size={24} />
            <ArrowRight
              size={18}
              className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
            />
          </div>
          <div className="text-[15px] font-semibold mb-1">Ask AI Tutor</div>
          <div className="text-[12px] text-green-900/60">Get instant explanations in Pidgin</div>
        </Link>

        <Link
          href="/dashboard/games"
          className="group p-5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <Award size={24} />
            <ArrowRight
              size={18}
              className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
            />
          </div>
          <div className="text-[15px] font-semibold mb-1">Play & Learn</div>
          <div className="text-[12px] text-white/60">Challenge yourself with academic games</div>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Sessions & Weak Topics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Sessions */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-green-900">Recent Sessions</h2>
              <Link
                href="/dashboard/reports"
                className="text-[12px] font-semibold text-green-600 hover:text-green-700">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {RECENT_SESSIONS.map((session) => (
                <Link
                  key={session.id}
                  href={`/dashboard/reports/${session.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-cream transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <BookOpen size={16} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-green-900">
                        {session.subject}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {session.examType} • {session.date} • {session.duration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[15px] font-bold text-green-900">
                      {session.score}/{session.total}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {Math.round((session.score / session.total) * 100)}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Weak Topics */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-orange-500" />
              <h2 className="font-serif text-xl text-green-900">Topics to Improve</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WEAK_TOPICS.map((topic) => (
                <WeakTopicCard key={topic.id} {...topic} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Bookings & Achievements */}
        <div className="space-y-6">
          {/* Upcoming Bookings */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-green-600" />
              <h2 className="font-serif text-xl text-green-900">Upcoming</h2>
            </div>
            {UPCOMING_BOOKINGS.length > 0 ? (
              UPCOMING_BOOKINGS.map((booking) => (
                <div key={booking.id} className="p-3 rounded-xl bg-cream">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={14} className="text-green-600" />
                    <span className="text-[13px] font-semibold text-green-900">
                      {booking.tutorName}
                    </span>
                  </div>
                  <div className="text-[12px] text-text-muted mb-2">
                    {booking.subject} • {booking.date} at {booking.time}
                  </div>
                  <Link
                    href={`/dashboard/bookings/${booking.id}/session`}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-green-600">
                    Join Session <ArrowRight size={12} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Calendar size={32} className="mx-auto mb-2 text-text-muted/50" />
                <div className="text-[13px] text-text-muted">No upcoming sessions</div>
                <Link
                  href="/dashboard/tutors"
                  className="inline-block mt-2 text-[12px] font-semibold text-green-600">
                  Book a tutor →
                </Link>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-800 to-green-700 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} />
              <h2 className="font-serif text-xl">Recent Achievements</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Flame size={14} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">7-Day Streak</div>
                  <div className="text-[11px] text-white/60">Completed 7 days in a row</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Target size={14} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">First Mock Completed</div>
                  <div className="text-[11px] text-white/60">
                    Completed your first full mock exam
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap size={14} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">AI Explorer</div>
                  <div className="text-[11px] text-white/60">Used Sabi-Explain 10 times</div>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/games"
              className="inline-flex items-center gap-1 mt-4 text-[12px] font-semibold text-gold">
              View all achievements →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

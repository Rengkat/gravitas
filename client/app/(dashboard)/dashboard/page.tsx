"use client";

import Link from "next/link";
import { Flame, Sparkles, Target, Clock, Award, Zap, Calendar, AlertCircle } from "lucide-react";
import StatCard from "@/Components/StatCard";
import { RECENT_SESSIONS, UPCOMING_BOOKINGS, WEAK_TOPICS } from "@/lib/constants/dashboard";
import WeakTopicCard from "../components/WeakTopicCard";
import QuickActionCard from "../components/QuickActions";
import RecentSessionList from "../components/RecentSessionLis";
import BookingCard from "../components/BookingList";
import Achievements from "../components/Achievements";

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
        <QuickActionCard
          href="/dashboard/practice"
          gradient="from-green-800 to-green-700"
          icon={Target}
          title="Start Practice"
          description="Take a mock exam or practice session"
        />

        <QuickActionCard
          href="/dashboard/ai-tutor"
          gradient="from-gold to-gold-dark"
          icon={Zap}
          title="Ask AI Tutor"
          description="Get instant explanations in Pidgin"
          textColor="text-green-900"
          descriptionColor="text-green-900/60"
        />

        <QuickActionCard
          href="/dashboard/games"
          gradient="from-purple-600 to-purple-500"
          icon={Award}
          title="Play & Learn"
          description="Challenge yourself with academic games"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Sessions & Weak Topics */}
        <div className="lg:col-span-2 space-y-6">
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
              <RecentSessionList sessions={RECENT_SESSIONS} maxItems={5} />
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
              UPCOMING_BOOKINGS.map((booking) => <BookingCard key={booking.id} booking={booking} />)
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
          <Achievements />
        </div>
      </div>
    </div>
  );
}

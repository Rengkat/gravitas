"use client";

import { useState } from "react";
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Smartphone,
  Zap,
  Trophy,
  ChevronRight,
  Calendar,
  CheckCircle,
  PlayCircle,
  GraduationCap,
  Target,
  TrendingUp,
  MessageSquare,
  Download,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────
   VIDEO CATEGORIES
───────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "all", label: "All Videos", icon: PlayCircle },
  { id: "getting-started", label: "Getting Started", icon: GraduationCap },
  { id: "cbt-practice", label: "CBT Practice", icon: Target },
  { id: "ai-features", label: "AI Features", icon: Zap },
  { id: "masterclasses", label: "Masterclasses", icon: Trophy },
  { id: "tips-tricks", label: "Tips & Tricks", icon: TrendingUp },
];

/* ─────────────────────────────────────────────────────────
   VIDEO DATA
───────────────────────────────────────────────────────── */
type Video = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail: string;
  instructor?: string;
  views?: string;
  date?: string;
  featured?: boolean;
  level?: "Beginner" | "Intermediate" | "Advanced";
};

const VIDEOS: Video[] = [
  {
    id: "getting-started-1",
    title: "Create Your Free Account",
    description:
      "Learn how to create your Gravitas account in under 2 minutes and start your exam preparation journey.",
    category: "getting-started",
    duration: "1:45",
    thumbnail: "/videos/thumbnails/create-account.jpg",
    level: "Beginner",
    views: "12.4K",
    date: "2024-01-15",
  },
  {
    id: "getting-started-2",
    title: "Set Your Exam Target & Study Plan",
    description:
      "Configure your target score, exam date, and let Gravitas create a personalized study plan for you.",
    category: "getting-started",
    duration: "3:12",
    thumbnail: "/videos/thumbnails/set-target.jpg",
    level: "Beginner",
    views: "8.7K",
    date: "2024-01-20",
  },
  {
    id: "cbt-practice-1",
    title: "Navigate the CBT Interface Like a Pro",
    description:
      "Master the exam interface: question navigator, flag system, and timer management.",
    category: "cbt-practice",
    duration: "5:23",
    thumbnail: "/videos/thumbnails/cbt-interface.jpg",
    level: "Intermediate",
    views: "15.2K",
    date: "2024-02-01",
    featured: true,
  },
  {
    id: "cbt-practice-2",
    title: "Practice vs Mock vs School Exam Modes",
    description:
      "Understand the difference between practice sessions, full mocks, and school exams.",
    category: "cbt-practice",
    duration: "4:08",
    thumbnail: "/videos/thumbnails/exam-modes.jpg",
    level: "Beginner",
    views: "6.9K",
    date: "2024-02-10",
  },
  {
    id: "ai-features-1",
    title: "Sabi-Explain AI: Instant Answer Explanations",
    description: "See how AI explains every wrong answer to help you understand concepts deeply.",
    category: "ai-features",
    duration: "4:45",
    thumbnail: "/videos/thumbnails/sabi-explain.jpg",
    level: "Beginner",
    views: "21.3K",
    date: "2024-02-15",
    featured: true,
  },
  {
    id: "ai-features-2",
    title: "Chat with Sabi-Tutor: Your Personal AI Tutor",
    description:
      "Learn how to use the AI chat assistant for any question, in Pidgin English or voice input.",
    category: "ai-features",
    duration: "6:32",
    thumbnail: "/videos/thumbnails/sabi-tutor.jpg",
    level: "Intermediate",
    views: "14.8K",
    date: "2024-02-25",
  },
  {
    id: "masterclasses-1",
    title: "JAMB UTME: 7-Day Score Booster",
    description:
      "Intensive masterclass with proven strategies to improve your JAMB score by 50+ points.",
    category: "masterclasses",
    duration: "45:00",
    thumbnail: "/videos/thumbnails/jamb-booster.jpg",
    instructor: "Dr. Adeola Williams",
    level: "Advanced",
    views: "5.2K",
    date: "2024-03-01",
    featured: true,
  },
  {
    id: "masterclasses-2",
    title: "WAEC Essay Writing: How to Score A1",
    description: "Complete guide to structuring essays, using keywords, and impressing examiners.",
    category: "masterclasses",
    duration: "52:30",
    thumbnail: "/videos/thumbnails/waec-essay.jpg",
    instructor: "Mr. Olumide Adebayo",
    level: "Intermediate",
    views: "4.8K",
    date: "2024-03-10",
  },
  {
    id: "tips-tricks-1",
    title: "10 Study Hacks That Actually Work",
    description: "Science-backed study techniques to retain more information in less time.",
    category: "tips-tricks",
    duration: "8:15",
    thumbnail: "/videos/thumbnails/study-hacks.jpg",
    level: "Beginner",
    views: "18.9K",
    date: "2024-02-05",
  },
  {
    id: "tips-tricks-2",
    title: "How to Manage Exam Anxiety",
    description: "Proven techniques to stay calm, focused, and confident during your exams.",
    category: "tips-tricks",
    duration: "7:48",
    thumbnail: "/videos/thumbnails/exam-anxiety.jpg",
    level: "All Levels",
    views: "11.2K",
    date: "2024-02-18",
  },
  {
    id: "offline-mode",
    title: "Enable Offline Mode & Practice Without Data",
    description: "Step-by-step guide to downloading question banks and syncing answers offline.",
    category: "getting-started",
    duration: "3:56",
    thumbnail: "/videos/thumbnails/offline-mode.jpg",
    level: "Beginner",
    views: "9.3K",
    date: "2024-03-05",
  },
  {
    id: "school-portal",
    title: "School Admin: Manage Students & Create Tests",
    description:
      "Complete walkthrough for school administrators: bulk upload, test builder, and report cards.",
    category: "cbt-practice",
    duration: "12:24",
    thumbnail: "/videos/thumbnails/school-portal.jpg",
    level: "Advanced",
    views: "3.2K",
    date: "2024-03-12",
  },
];

/* ─────────────────────────────────────────────────────────
   FEATURED MASTERCLASSES (for hero section)
───────────────────────────────────────────────────────── */
const FEATURED_MASTERCLASSES = VIDEOS.filter((v) => v.category === "masterclasses" && v.featured);

/* ─────────────────────────────────────────────────────────
   VIDEO CARD COMPONENT
───────────────────────────────────────────────────────── */
function VideoCard({ video, index }: { video: Video; index: number }) {
  const [hovered, setHovered] = useState(false);
  const CategoryIcon = CATEGORIES.find((c) => c.id === video.category)?.icon || PlayCircle;

  return (
    <div
      className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "white",
        border: hovered ? "1px solid rgba(46,139,87,0.25)" : "1px solid rgba(30,80,50,0.1)",
        boxShadow: hovered ? "0 12px 32px rgba(13,43,26,0.1)" : "none",
        animation: `fadeUp 0.6s ${0.05 * index}s ease both`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-green-900 to-green-700 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}>
            <Play size={24} strokeWidth={2} style={{ color: "white", marginLeft: 2 }} />
          </div>
        </div>

        {/* Duration badge */}
        <div
          className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-[11px] font-mono font-bold"
          style={{ background: "rgba(0,0,0,0.75)", color: "white" }}>
          {video.duration}
        </div>

        {/* Level badge */}
        {video.level && (
          <div
            className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide"
            style={{ background: "rgba(26,74,46,0.9)", color: "#f5c842" }}>
            {video.level}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <CategoryIcon size={14} strokeWidth={1.8} style={{ color: "#8aab98" }} />
          <span className="text-[11px] text-text-muted uppercase tracking-wide">
            {CATEGORIES.find((c) => c.id === video.category)?.label}
          </span>
          {video.featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/15 text-gold-dark">
              Featured
            </span>
          )}
        </div>

        <h3
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#0d2b1a",
            marginBottom: 8,
            lineHeight: 1.4,
          }}>
          {video.title}
        </h3>

        <p style={{ fontSize: 13, color: "#4a6357", lineHeight: 1.5, marginBottom: 12 }}>
          {video.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-[11px] text-text-light">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{video.duration}</span>
          </div>
          {video.views && (
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{video.views} views</span>
            </div>
          )}
          {video.instructor && (
            <div className="flex items-center gap-1">
              <GraduationCap size={12} />
              <span>{video.instructor.split(" ")[0]}</span>
            </div>
          )}
        </div>

        {/* Watch button */}
        <button
          className="w-full mt-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
          style={{
            background: hovered ? "#1a4a2e" : "rgba(26,74,46,0.05)",
            color: hovered ? "white" : "#1a4a2e",
          }}>
          Watch Now →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="w-6 h-0.5 rounded-sm bg-green-500" />
      <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-green-600">
        {children}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function VideoTutorialsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = VIDEOS.filter((video) => {
    const matchesCategory = activeCategory === "all" || video.category === activeCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ background: "var(--color-cream)" }}>
      {/* ══ HERO SECTION ══ */}
      <section
        className="relative overflow-hidden text-center"
        style={{ padding: "140px 5% 80px" }}>
        {/* Background gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(46,139,87,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(245,200,66,0.05) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,74,46,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,74,46,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)",
          }}
        />

        <div className="relative z-10">
          <SectionLabel>Video Tutorials</SectionLabel>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(44px, 6vw, 72px)",
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              color: "#0d2b1a",
              marginBottom: 18,
              animation: "fadeUp 0.6s 0.1s ease both",
            }}>
            How to use Gravitas
            <br />+ <em style={{ color: "#1a4a2e" }}>Exam Prep Masterclasses</em>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#4a6357",
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.7,
              animation: "fadeUp 0.6s 0.2s ease both",
            }}>
            Watch step-by-step tutorials, masterclass sessions, and get expert tips to ace your
            exams.
          </p>

          {/* Search bar */}
          <div
            className="relative max-w-[500px] mx-auto"
            style={{ animation: "fadeUp 0.6s 0.3s ease both" }}>
            <input
              type="search"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3 rounded-xl text-[14px] outline-none"
              style={{
                background: "white",
                border: "1px solid rgba(30,80,50,0.15)",
                color: "#111a14",
              }}
            />
            <Play
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "#8aab98" }}
            />
          </div>
        </div>
      </section>

      {/* ══ FEATURED MASTERCLASSES ══ */}
      {FEATURED_MASTERCLASSES.length > 0 && (
        <section style={{ padding: "60px 5%", maxWidth: 1200, margin: "0 auto" }}>
          <div className="mb-8">
            <SectionLabel>Featured Masterclass</SectionLabel>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                color: "#0d2b1a",
                letterSpacing: "-0.5px",
              }}>
              Boost Your Score with Expert-Led Sessions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {FEATURED_MASTERCLASSES.map((masterclass, i) => (
              <div
                key={masterclass.id}
                className="rounded-2xl overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid rgba(46,139,87,0.2)",
                  boxShadow: "0 8px 24px rgba(13,43,26,0.08)",
                  animation: `fadeUp 0.6s ${0.1 + i * 0.1}s ease both`,
                }}>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.6)" }}>
                      <Play size={28} strokeWidth={2} style={{ color: "white", marginLeft: 2 }} />
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 text-white text-[11px] font-mono">
                      {masterclass.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy size={16} style={{ color: "#f5c842" }} />
                      <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wide">
                        Premium Masterclass
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#0d2b1a",
                        marginBottom: 12,
                      }}>
                      {masterclass.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#4a6357", marginBottom: 16 }}>
                      {masterclass.description}
                    </p>
                    <div className="flex items-center gap-4 text-[12px] text-text-light mb-4">
                      <div className="flex items-center gap-1">
                        <GraduationCap size={12} />
                        <span>{masterclass.instructor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Available Now</span>
                      </div>
                    </div>
                    <button className="w-full py-2.5 rounded-xl text-[14px] font-semibold bg-green-800 text-white transition-all duration-200 hover:bg-green-700">
                      Watch Masterclass →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ CATEGORY FILTERS ══ */}
      <section style={{ padding: "40px 5% 20px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200"
                style={{
                  background: isActive ? "#1a4a2e" : "white",
                  color: isActive ? "white" : "#4a6357",
                  border: isActive ? "none" : "1px solid rgba(30,80,50,0.15)",
                }}>
                <IconComponent size={14} strokeWidth={1.8} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ══ VIDEO GRID ══ */}
      <section style={{ padding: "40px 5% 80px", maxWidth: 1200, margin: "0 auto" }}>
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <PlayCircle
              size={48}
              strokeWidth={1.5}
              style={{ color: "#8aab98", marginBottom: 16 }}
            />
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0d2b1a", marginBottom: 8 }}>
              No videos found
            </h3>
            <p style={{ fontSize: 14, color: "#4a6357" }}>
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ══ STATS SECTION ══ */}
      <section
        style={{
          padding: "80px 5%",
          background: "white",
          borderTop: "1px solid rgba(30,80,50,0.08)",
        }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Impact</SectionLabel>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                color: "#0d2b1a",
                letterSpacing: "-0.5px",
              }}>
              Trusted by Thousands of Students
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: PlayCircle, value: "50+", label: "Video Tutorials" },
              { icon: Users, value: "15,000+", label: "Students Trained" },
              { icon: Star, value: "4.9/5", label: "Average Rating" },
              { icon: Clock, value: "500+", label: "Hours of Content" },
            ].map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <IconComponent size={22} strokeWidth={1.8} style={{ color: "#1a4a2e" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#0d2b1a", marginBottom: 4 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 13, color: "#4a6357" }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section
        className="relative overflow-hidden text-center"
        style={{ padding: "80px 5%", background: "#1a4a2e" }}>
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(245,200,66,0.07), transparent 60%)",
            borderRadius: "50%",
          }}
        />
        <div className="relative z-10 max-w-[560px] mx-auto">
          <BookOpen size={48} strokeWidth={1.2} style={{ color: "#f5c842", marginBottom: 24 }} />
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px,4vw,48px)",
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              marginBottom: 14,
            }}>
            Ready to master
            <br />
            <em style={{ color: "#f5c842" }}>your exams?</em>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              marginBottom: 32,
              lineHeight: 1.7,
            }}>
            Start watching tutorials and join 12,000+ students already preparing with Gravitas.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[15px] font-bold no-underline transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "#f5c842",
                color: "#0d2b1a",
                boxShadow: "0 8px 32px rgba(245,200,66,0.3)",
              }}>
              Start Free Today
              <ChevronRight size={16} strokeWidth={2.5} />
            </Link>
            <Link
              href="/help-centre"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[15px] font-semibold no-underline transition-all duration-200 border-2 border-white/30 hover:border-white/60"
              style={{ color: "white" }}>
              Visit Help Centre
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp { 
          from { opacity: 0; transform: translateY(24px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}

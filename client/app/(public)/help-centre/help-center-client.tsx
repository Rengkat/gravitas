"use client";

import {
  Rocket,
  FileText,
  Bot,
  BarChart3,
  School,
  CreditCard,
  Wifi,
  Lock,
  MessageCircle,
  Mail,
  MessageSquare,
  Key,
  Upload,
  Zap,
  BookOpen,
  GraduationCap,
  Search,
  Book,
  Clock,
  Headphones,
  Star,
  X,
  File,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { FaqItem, Category } from "./help-data";
import { CATEGORIES, FAQS, CONTACT_OPTIONS } from "./help-data";

/* ─────────────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: "new" | "updated" }) {
  if (status === "new") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-500/10 text-green-600 ml-2 shrink-0">
        New
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ml-2 shrink-0"
      style={{ background: "rgba(245,200,66,0.15)", color: "#d4a017" }}>
      Updated
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   SEARCH BAR
───────────────────────────────────────────────────────── */
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative max-w-[600px] mx-auto">
      {/* Search icon */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search size={18} strokeWidth={2} style={{ color: "#8aab98" }} />
      </div>
      <input
        type="search"
        data-testid="help-search"
        placeholder="Search for help… e.g. reset password, offline mode"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-[50px] pr-5 py-4 rounded-2xl text-[15px] transition-all duration-200 outline-none"
        style={{
          background: "white",
          border: "1.5px solid rgba(30,80,50,0.15)",
          color: "#111a14",
          fontFamily: "'Sora', sans-serif",
          boxShadow: "0 4px 24px rgba(13,43,26,0.06)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#1a4a2e";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,74,46,0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(30,80,50,0.15)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(13,43,26,0.06)";
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(26,74,46,0.08)", color: "#4a6357" }}
          aria-label="Clear search">
          <X size={12} />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SEARCH RESULTS
───────────────────────────────────────────────────────── */
function SearchResults({ query }: { query: string }) {
  const results = useMemo(() => {
    const q = query.toLowerCase();
    const out: { cat: string; slug: string; title: string }[] = [];
    for (const cat of CATEGORIES) {
      for (const art of cat.articles) {
        if (art.title.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q)) {
          out.push({ cat: cat.title, slug: art.slug, title: art.title });
        }
      }
    }
    return out.slice(0, 8);
  }, [query]);

  if (!results.length) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <Search size={48} strokeWidth={1.5} style={{ color: "#8aab98" }} />
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#0d2b1a", marginBottom: 8 }}>
          No results for "{query}"
        </p>
        <p style={{ fontSize: 14, color: "#4a6357" }}>
          Try different words, or browse the categories below.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto" data-testid="search-results">
      <p
        style={{
          fontSize: 13,
          color: "#8aab98",
          marginBottom: 16,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.06em",
        }}>
        {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
      </p>
      <div className="flex flex-col gap-2">
        {results.map((r) => (
          <a
            key={r.slug}
            href={`/help/${r.slug}`}
            className="flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 no-underline group"
            style={{ background: "white", border: "1px solid rgba(30,80,50,0.1)" }}>
            <File size={16} strokeWidth={2} style={{ color: "#8aab98", flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <div
                style={{ fontSize: 14, fontWeight: 600, color: "#111a14" }}
                className="group-hover:text-[#1a4a2e] transition-colors truncate">
                {r.title}
              </div>
              <div style={{ fontSize: 11, color: "#8aab98", marginTop: 2 }}>{r.cat}</div>
            </div>
            <ChevronRight size={14} strokeWidth={2.5} style={{ color: "#8aab98", flexShrink: 0 }} />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CATEGORY CARD
───────────────────────────────────────────────────────── */
function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = cat.icon;

  return (
    <a
      href={`/help/category/${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
      data-testid={`category-card-${index}`}
      className="block no-underline rounded-[20px] p-7 border transition-all duration-300"
      style={{
        background: "white",
        border: `1px solid ${hovered ? "rgba(46,139,87,0.25)" : "rgba(30,80,50,0.1)"}`,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 4px 32px rgba(13,43,26,0.10)" : "none",
        animationDelay: `${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${cat.color}18` }}>
        <IconComponent size={22} strokeWidth={1.8} style={{ color: cat.color }} />
      </div>

      {/* Title + article count */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 18,
            color: "#0d2b1a",
            lineHeight: 1.25,
          }}>
          {cat.title}
        </h3>
        <span
          className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold mt-0.5"
          style={{
            background: "rgba(26,74,46,0.07)",
            color: "#276b43",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
          {cat.articles.length}
        </span>
      </div>

      <p style={{ fontSize: 13, color: "#4a6357", lineHeight: 1.6, marginBottom: 20 }}>
        {cat.description}
      </p>

      {/* Top articles preview */}
      <ul className="flex flex-col gap-2" style={{ listStyle: "none" }}>
        {cat.articles.slice(0, 3).map((art) => (
          <li key={art.slug} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full shrink-0" style={{ background: cat.color }} />
            <span
              style={{ fontSize: 12, color: "#4a6357", lineHeight: 1.4 }}
              className="flex-1 truncate">
              {art.title}
            </span>
            {art.status && <StatusBadge status={art.status} />}
          </li>
        ))}
        {cat.articles.length > 3 && (
          <li style={{ fontSize: 12, color: "#8aab98", paddingLeft: 12 }}>
            +{cat.articles.length - 3} more articles
          </li>
        )}
      </ul>
    </a>
  );
}

/* ─────────────────────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────────────────────── */
function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col" data-testid="faq-accordion">
      {faqs.map((faq, i) => (
        <div
          key={i}
          data-testid={`faq-item-${i}`}
          style={{ borderBottom: "1px solid rgba(30,80,50,0.12)" }}>
          <button
            title="open"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 text-left py-5 transition-colors duration-200"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: open === i ? "#1a4a2e" : "#111a14",
            }}
            aria-expanded={open === i}
            data-testid={`faq-btn-${i}`}>
            <span>{faq.question}</span>
            <span
              className="w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-250"
              style={{
                border: open === i ? "1.5px solid #1a4a2e" : "1.5px solid rgba(30,80,50,0.2)",
                background: open === i ? "#1a4a2e" : "transparent",
                color: open === i ? "white" : "#4a6357",
                transform: open === i ? "rotate(180deg)" : "none",
              }}>
              ▾
            </span>
          </button>

          <div
            data-testid={`faq-answer-${i}`}
            style={{
              fontSize: 14,
              color: "#4a6357",
              lineHeight: 1.75,
              maxHeight: open === i ? 400 : 0,
              overflow: "hidden",
              paddingBottom: open === i ? 20 : 0,
              transition: "max-height 0.35s ease, padding 0.35s ease",
            }}>
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CONTACT CARD
───────────────────────────────────────────────────────── */
function ContactCard({
  icon: IconComponent,
  title,
  desc,
  cta,
  href,
  primary,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  cta: string;
  href: string;
  primary: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-4 p-7 rounded-[20px] border transition-all duration-300"
      style={{
        background: primary ? "#1a4a2e" : "white",
        border: primary ? "1px solid #1f5c38" : "1px solid rgba(30,80,50,0.12)",
        boxShadow: primary ? "0 20px 60px rgba(13,43,26,0.2)" : "none",
      }}>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: primary ? "rgba(255,255,255,0.12)" : "rgba(46,139,87,0.1)" }}>
        <IconComponent
          size={22}
          strokeWidth={1.8}
          style={{ color: primary ? "#f5c842" : "#1a4a2e" }}
        />
      </div>
      <div>
        <h3
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 20,
            color: primary ? "white" : "#0d2b1a",
            marginBottom: 6,
          }}>
          {title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: primary ? "rgba(255,255,255,0.6)" : "#4a6357",
            lineHeight: 1.65,
          }}>
          {desc}
        </p>
      </div>
      <a
        href={href}
        className="inline-flex items-center gap-1.5 text-[14px] font-bold no-underline transition-all duration-200 mt-auto"
        style={{ color: primary ? "#f5c842" : "#1a4a2e" }}>
        {cta}
        <ArrowRight size={14} strokeWidth={2.5} />
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   POPULAR ARTICLES — quick-access strip
───────────────────────────────────────────────────────── */
const POPULAR = [
  { icon: Key, label: "Reset your password", href: "/help/reset-password" },
  { icon: Wifi, label: "Enable offline mode", href: "/help/enable-offline" },
  { icon: Upload, label: "Bulk upload students (CSV)", href: "/help/bulk-upload" },
  { icon: Bot, label: "How Sabi-Explain works", href: "/help/sabi-explain-how" },
  { icon: CreditCard, label: "Upgrade to Student Pro", href: "/help/upgrade-pro" },
  { icon: FileText, label: "WAEC essay mode guide", href: "/help/waec-essay-mode" },
];

/* ─────────────────────────────────────────────────────────
   SECTION LABEL (shared)
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
   MAIN CLIENT COMPONENT
───────────────────────────────────────────────────────── */
export default function HelpCenterClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const isSearching = search.trim().length > 1;
  const filteredFaqs = activeCategory ? FAQS.filter((f) => f.category === activeCategory) : FAQS;

  const faqCategories = Array.from(new Set(FAQS.map((f) => f.category)));

  return (
    <div style={{ background: "var(--color-cream)" }}>
      {/* ══ HERO ══ */}
      <section
        data-testid="help-hero"
        className="relative overflow-hidden text-center"
        style={{ padding: "120px 5% 80px" }}>
        {/* BG gradients */}
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
          <SectionLabel>Help Centre</SectionLabel>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(36px, 5vw, 62px)",
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              color: "#0d2b1a",
              marginBottom: 18,
              animation: "fadeUp 0.6s 0.1s ease both",
            }}>
            How can we help you?
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#4a6357",
              maxWidth: 480,
              margin: "0 auto 40px",
              lineHeight: 1.7,
              animation: "fadeUp 0.6s 0.2s ease both",
            }}>
            Search our docs, browse categories, or ask our team directly.
          </p>

          <div style={{ animation: "fadeUp 0.6s 0.3s ease both" }}>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Popular quick-links — hidden when searching */}
          {!isSearching && (
            <div
              className="flex flex-wrap justify-center gap-2 mt-6"
              style={{ animation: "fadeUp 0.6s 0.4s ease both" }}>
              <span
                style={{
                  fontSize: 12,
                  color: "#8aab98",
                  display: "flex",
                  alignItems: "center",
                  marginRight: 4,
                }}>
                Popular:
              </span>
              {POPULAR.map((p) => {
                const IconComponent = p.icon;
                return (
                  <a
                    key={p.href}
                    href={p.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium no-underline transition-all duration-200"
                    style={{
                      background: "white",
                      border: "1px solid rgba(30,80,50,0.12)",
                      color: "#4a6357",
                    }}>
                    <IconComponent size={14} strokeWidth={1.8} />
                    {p.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══ SEARCH RESULTS or STATS BAR ══ */}
      {isSearching ? (
        <section className="px-[5%] pb-20 max-w-[800px] mx-auto">
          <SearchResults query={search.trim()} />
        </section>
      ) : (
        /* Stats trust bar */
        <div
          className="flex items-center justify-center flex-wrap gap-8"
          style={{
            padding: "24px 5%",
            borderTop: "1px solid rgba(30,80,50,0.1)",
            borderBottom: "1px solid rgba(30,80,50,0.1)",
            background: "white",
          }}>
          {[
            { icon: Book, value: "120+", label: "Help articles" },
            { icon: Zap, value: "< 2 min", label: "Avg search result" },
            { icon: Headphones, value: "4 hrs", label: "Email response time" },
            { icon: Star, value: "4.9 / 5", label: "Support satisfaction" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(46,139,87,0.1)" }}>
                <s.icon size={15} strokeWidth={1.8} style={{ color: "#1a4a2e" }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0d2b1a" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#8aab98" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSearching && (
        <>
          {/* ══ CATEGORIES ══ */}
          <section
            data-testid="categories-section"
            style={{ padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
            <div className="mb-10">
              <SectionLabel>Browse by Topic</SectionLabel>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(28px,3.5vw,44px)",
                  color: "#0d2b1a",
                  letterSpacing: "-0.5px",
                }}>
                Find answers by category
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}>
              {CATEGORIES.map((cat, i) => (
                <CategoryCard key={cat.title} cat={cat} index={i} />
              ))}
            </div>
          </section>

          {/* ══ FAQ ══ */}
          <section
            data-testid="faq-section"
            style={{ padding: "80px 5% 100px", background: "var(--color-cream-dark)" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <div className="text-center mb-12">
                <SectionLabel>FAQs</SectionLabel>
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(28px,3.5vw,44px)",
                    color: "#0d2b1a",
                    letterSpacing: "-0.8px",
                    marginBottom: 12,
                  }}>
                  Frequently asked questions
                </h2>
                <p style={{ fontSize: 16, color: "#4a6357" }}>
                  Can't find the answer?{" "}
                  <a
                    href="mailto:support@gravitas.ng"
                    style={{ color: "#1a4a2e", fontWeight: 600, textDecoration: "none" }}>
                    Email our team →
                  </a>
                </p>
              </div>

              {/* Category filter pills */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                <button
                  onClick={() => setActiveCategory(null)}
                  className="px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-200"
                  style={{
                    background: activeCategory === null ? "#1a4a2e" : "white",
                    color: activeCategory === null ? "white" : "#4a6357",
                    border:
                      activeCategory === null
                        ? "1px solid #1a4a2e"
                        : "1px solid rgba(30,80,50,0.15)",
                    fontFamily: "'Sora', sans-serif",
                  }}>
                  All
                </button>
                {faqCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className="px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-200"
                    style={{
                      background: activeCategory === cat ? "#1a4a2e" : "white",
                      color: activeCategory === cat ? "white" : "#4a6357",
                      border:
                        activeCategory === cat
                          ? "1px solid #1a4a2e"
                          : "1px solid rgba(30,80,50,0.15)",
                      fontFamily: "'Sora', sans-serif",
                    }}>
                    {cat}
                  </button>
                ))}
              </div>

              <FaqAccordion faqs={filteredFaqs} />

              {/* Browse all link */}
              <div className="text-center mt-10">
                <Link
                  href="/help/faq"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold no-underline transition-colors"
                  style={{ color: "#1a4a2e" }}>
                  View all frequently asked questions
                  <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </section>

          {/* ══ CONTACT ══ */}
          <section
            data-testid="contact-section"
            style={{ padding: "80px 5% 100px", maxWidth: 1200, margin: "0 auto" }}>
            <div className="text-center mb-12">
              <SectionLabel>Still Need Help?</SectionLabel>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(28px,3.5vw,44px)",
                  color: "#0d2b1a",
                  letterSpacing: "-0.5px",
                  marginBottom: 12,
                }}>
                Our team is here for you
              </h2>
              <p style={{ fontSize: 16, color: "#4a6357", maxWidth: 440, margin: "0 auto" }}>
                Available Monday–Friday, 8am–8pm WAT. We typically respond to emails within 4 hours.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
                maxWidth: 900,
                margin: "0 auto",
              }}>
              {CONTACT_OPTIONS.map((opt) => (
                <ContactCard key={opt.title} {...opt} />
              ))}
            </div>
          </section>

          {/* ══ BOTTOM CTA ══ */}
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
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="relative z-10 max-w-[560px] mx-auto">
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(28px,4vw,48px)",
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                  marginBottom: 14,
                }}>
                Ready to get back
                <br />
                to <em style={{ color: "#f5c842" }}>studying?</em>
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: 32,
                  lineHeight: 1.7,
                }}>
                12,000+ students are already preparing with Gravitas. Start free — no credit card
                needed.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[15px] font-bold no-underline transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "#f5c842",
                  color: "#0d2b1a",
                  boxShadow: "0 8px 32px rgba(245,200,66,0.3)",
                }}>
                Start Practising Free →
              </Link>
            </div>
          </section>
        </>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

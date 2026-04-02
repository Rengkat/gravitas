"use client";

import { useState, useMemo } from "react";
import BlogHero from "./BlogHero";
import CategoryFilter from "./CategoryFilter";
import FeaturedPost from "./FeaturedPost";
import BlogGrid from "./BlogGrid";
import BlogSidebar from "./BlogSidebar";
import BlogCTA from "./BlogCTA";
import { POSTS } from "./blogData";
import type { CategoryId } from "./blogData";

export default function BlogPage() {
  const [category, setCategory] = useState<CategoryId>("all");
  const [search, setSearch] = useState("");

  /* ── Featured post — always the same, never filtered ── */
  const featured = POSTS.find((p) => p.featured)!;

  /* ── Filtered posts — excludes the featured post ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return POSTS.filter((p) => !p.featured)
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => {
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q)
        );
      });
  }, [category, search]);

  return (
    <>
      {/* ── Hero with search ── */}
      <BlogHero search={search} onSearch={setSearch} />

      {/* ── Category filter ── */}
      {!search && <CategoryFilter active={category} onChange={setCategory} />}

      {/* ── Featured post (only shown when no filter active) ── */}
      {!search && category === "all" && <FeaturedPost post={featured} />}

      {/* ── Main content + sidebar ── */}
      <section className="px-[5%] pb-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
          {/* Posts grid */}
          <BlogGrid posts={filtered} total={POSTS.filter((p) => !p.featured).length} />

          {/* Sidebar */}
          <div className="sticky top-[92px]">
            <BlogSidebar />
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <BlogCTA />
    </>
  );
}

"use client";

import { useState, useMemo, useCallback } from "react";
import { X } from "lucide-react";

import { ViewMode, LibraryFilters, LibraryItem } from "@/types/library";

import LibraryHero from "./components/LibraryHero";
import SearchBar from "./components/SearchBar";
import ContentTypeTabs from "./components/ContentTypeTabs";
import FeaturedBanner from "./components/FeaturedBanner";
import LibraryCard from "./components/LibraryCard";
import LibraryRow from "./components/LibraryRow";
import EmptyState from "./components/EmptyState";
import PremiumCTA from "./components/PremiumCTA";
import PaywallModal from "./components/PaywallModal";
import { LIBRARY_ITEMS } from "@/lib/mock/library";

const DEFAULT_FILTERS: LibraryFilters = {
  contentType: "all",
  subject: "all",
  level: "all",
  examType: "all",
  sortMode: "latest",
  searchQuery: "",
  showPremiumOnly: false,
  showFreeOnly: false,
};

export default function LibraryPage() {
  // ── Filter state ─────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<LibraryFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  // ── Interaction state ────────────────────────────────────────────────────
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  // ── Paywall modal ────────────────────────────────────────────────────────
  const [paywallItem, setPaywallItem] = useState<LibraryItem | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggleLike = useCallback((id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleAccess = useCallback((item: LibraryItem) => {
    if (item.isPremium) {
      setPaywallItem(item);
    } else {
      // TODO: open viewer / player / download — integrate here
      console.log("Access free item:", item.id);
    }
  }, []);

  const handleShare = useCallback((item: LibraryItem) => {
    // TODO: open share sheet — integrate here
    if (navigator.share) {
      navigator.share({ title: item.title, text: item.description });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const updateFilter = <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const activeFilterCount = [
    filters.subject !== "all",
    filters.level !== "all",
    filters.examType !== "all",
    filters.showFreeOnly,
    filters.showPremiumOnly,
  ].filter(Boolean).length;

  const filteredItems = useMemo(() => {
    let items = LIBRARY_ITEMS.filter((item) => {
      if (filters.contentType !== "all" && item.type !== filters.contentType) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (
          !item.title.toLowerCase().includes(q) &&
          !item.description.toLowerCase().includes(q) &&
          !item.tags.some((t) => t.includes(q))
        )
          return false;
      }
      if (filters.subject !== "all" && item.subject !== filters.subject) return false;
      if (filters.level !== "all" && item.level !== filters.level) return false;
      if (
        filters.examType !== "all" &&
        item.examType !== filters.examType &&
        item.examType !== "all"
      )
        return false;
      if (filters.showFreeOnly && item.isPremium) return false;
      if (filters.showPremiumOnly && !item.isPremium) return false;
      return true;
    });

    switch (filters.sortMode) {
      case "popular":
        items = [...items].sort((a, b) => b.views - a.views);
        break;
      case "rating":
        items = [...items].sort((a, b) => b.rating - a.rating);
        break;
      case "latest":
      default:
        items = [...items].sort(
          (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        );
    }
    return items;
  }, [filters]);

  const featuredItems = useMemo(() => LIBRARY_ITEMS.filter((i) => i.isFeatured), []);

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Hero */}
      <LibraryHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Search + controls */}
        <SearchBar
          filters={filters}
          viewMode={viewMode}
          showFilters={showFilters}
          activeFilterCount={activeFilterCount}
          onSearchChange={(q) => updateFilter("searchQuery", q)}
          onSortChange={(s) => updateFilter("sortMode", s)}
          onViewModeChange={setViewMode}
          onToggleFilters={() => setShowFilters((v) => !v)}
          onSubjectChange={(s) => updateFilter("subject", s)}
          onLevelChange={(l) => updateFilter("level", l)}
          onExamChange={(e) => updateFilter("examType", e)}
          onClearFilters={clearFilters}
        />

        {/* Content type tabs */}
        <ContentTypeTabs
          activeTab={filters.contentType}
          onChange={(tab) => updateFilter("contentType", tab)}
        />

        {/* Featured strip — shown only when no filters active */}
        {activeFilterCount === 0 && !filters.searchQuery && filters.contentType === "all" && (
          <FeaturedBanner items={featuredItems} onAccess={handleAccess} />
        )}

        {/* Results count + clear */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] text-gray-500">
            Showing <span className="font-bold text-gray-800">{filteredItems.length}</span> resource
            {filteredItems.length !== 1 ? "s" : ""}
            {filters.searchQuery && (
              <span className="text-green-700"> for &quot;{filters.searchQuery}&quot;</span>
            )}
          </p>
          {(filters.searchQuery || activeFilterCount > 0) && (
            <button
              onClick={clearFilters}
              className="text-[12px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Grid / List / Empty */}
        {filteredItems.length === 0 ? (
          <EmptyState onReset={clearFilters} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <LibraryCard
                key={item.id}
                item={item}
                liked={likedItems.has(item.id)}
                bookmarked={bookmarkedItems.has(item.id)}
                onLike={() => toggleLike(item.id)}
                onBookmark={() => toggleBookmark(item.id)}
                onShare={() => handleShare(item)}
                onAccess={() => handleAccess(item)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <LibraryRow
                key={item.id}
                item={item}
                liked={likedItems.has(item.id)}
                bookmarked={bookmarkedItems.has(item.id)}
                onLike={() => toggleLike(item.id)}
                onBookmark={() => toggleBookmark(item.id)}
                onAccess={() => handleAccess(item)}
              />
            ))}
          </div>
        )}

        {/* Premium CTA */}
        <PremiumCTA />
      </div>

      {/* Paywall modal */}
      {paywallItem && (
        <PaywallModal
          item={paywallItem}
          onClose={() => setPaywallItem(null)}
          onUpgrade={() => {
            setPaywallItem(null);
            // TODO: navigate to /pricing or open upgrade flow
            console.log("Upgrade triggered");
          }}
          onBuySingle={
            paywallItem.price
              ? () => {
                  setPaywallItem(null);
                  // TODO: open single-purchase checkout
                  console.log("Buy single:", paywallItem.id, paywallItem.price);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

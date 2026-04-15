"use client";

import { useState, useMemo, useCallback } from "react";
import { TUTORS } from "@/lib/mock/tutors";
import { TutorFilters } from "@/types/tutors";

import TutorsHero from "./components/TutorsHero";
import TutorFiltersBar from "./components/TutorFiltersBar";
import TutorCard from "./components/TutorCard";
import TutorEmptyState from "./components/TutorEmptyState";
import { applyFilters } from "./components/helper";

const DEFAULT_FILTERS: TutorFilters = {
  searchQuery: "",
  subject: "all",
  experience: "all",
  priceRange: "all",
  availability: "all",
  sortMode: "rating",
  verifiedOnly: false,
  onlineOnly: false,
};

export default function TutorsPage() {
  const [filters, setFilters] = useState<TutorFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteTutors, setFavoriteTutors] = useState<Set<string>>(new Set());

  const updateFilter = <K extends keyof TutorFilters>(key: K, value: TutorFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const toggleFavorite = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setFavoriteTutors((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const filteredTutors = useMemo(() => applyFilters(TUTORS, filters), [filters]);

  const activeFilterCount = [
    filters.subject !== "all",
    filters.experience !== "all",
    filters.priceRange !== "all",
    filters.availability !== "all",
    filters.verifiedOnly,
    filters.onlineOnly,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20">
      <TutorsHero />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <TutorFiltersBar
          filters={filters}
          showFilters={showFilters}
          activeFilterCount={activeFilterCount}
          onSearchChange={(q) => updateFilter("searchQuery", q)}
          onSubjectChange={(s) => updateFilter("subject", s)}
          onExperienceChange={(e) => updateFilter("experience", e)}
          onPriceChange={(p) => updateFilter("priceRange", p)}
          onAvailabilityChange={(a) => updateFilter("availability", a)}
          onSortChange={(s) => updateFilter("sortMode", s)}
          onToggleFilters={() => setShowFilters((v) => !v)}
          onToggleVerified={() => updateFilter("verifiedOnly", !filters.verifiedOnly)}
          onToggleOnline={() => updateFilter("onlineOnly", !filters.onlineOnly)}
          onClearFilters={clearFilters}
        />

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[14px] text-gray-600">
            Found <span className="font-semibold text-green-700">{filteredTutors.length}</span>{" "}
            tutor{filteredTutors.length !== 1 ? "s" : ""}
            {filters.searchQuery && (
              <span className="text-green-700"> for &quot;{filters.searchQuery}&quot;</span>
            )}
          </p>
        </div>

        {/* Grid */}
        {filteredTutors.length === 0 ? (
          <TutorEmptyState onReset={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                isFavorited={favoriteTutors.has(tutor.id)}
                onFavorite={(e) => toggleFavorite(e, tutor.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

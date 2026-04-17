"use client";

import { Search, Filter, ChevronDown, X, CheckCircle, Wifi } from "lucide-react";
import {
  Subject, Experience, PriceRange, Availability, SortMode, TutorFilters,
} from "@/types/tutors";
import {
  SUBJECTS, EXPERIENCE_OPTIONS, PRICE_OPTIONS, AVAILABILITY_OPTIONS, SORT_OPTIONS,
} from "@/lib/constants/tutors";

interface TutorFiltersBarProps {
  filters: TutorFilters;
  showFilters: boolean;
  activeFilterCount: number;
  onSearchChange: (q: string) => void;
  onSubjectChange: (s: Subject) => void;
  onExperienceChange: (e: Experience) => void;
  onPriceChange: (p: PriceRange) => void;
  onAvailabilityChange: (a: Availability) => void;
  onSortChange: (s: SortMode) => void;
  onToggleFilters: () => void;
  onToggleVerified: () => void;
  onToggleOnline: () => void;
  onClearFilters: () => void;
}

export default function TutorFiltersBar({
  filters,
  showFilters,
  activeFilterCount,
  onSearchChange,
  onSubjectChange,
  onExperienceChange,
  onPriceChange,
  onAvailabilityChange,
  onSortChange,
  onToggleFilters,
  onToggleVerified,
  onToggleOnline,
  onClearFilters,
}: TutorFiltersBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 sticky top-4 z-10 backdrop-blur-lg bg-white/95">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, subject or tag..."
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px]"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={filters.sortMode}
          onChange={(e) => onSortChange(e.target.value as SortMode)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px] bg-white"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>Sort: {o.label}</option>
          ))}
        </select>

        {/* Filter toggle */}
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[14px] font-semibold transition-all ${
            showFilters || activeFilterCount > 0
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => onSubjectChange(e.target.value as Subject)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[13px]"
              >
                {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => onExperienceChange(e.target.value as Experience)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[13px]"
              >
                {EXPERIENCE_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Price / hour</label>
              <select
                value={filters.priceRange}
                onChange={(e) => onPriceChange(e.target.value as PriceRange)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[13px]"
              >
                {PRICE_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => onAvailabilityChange(e.target.value as Availability)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[13px]"
              >
                {AVAILABILITY_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Quick toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={onToggleVerified}
                className="w-4 h-4 rounded accent-green-600"
              />
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-[13px] font-semibold text-gray-600">Verified only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlineOnly}
                onChange={onToggleOnline}
                className="w-4 h-4 rounded accent-green-600"
              />
              <Wifi size={14} className="text-green-500" />
              <span className="text-[13px] font-semibold text-gray-600">Online now</span>
            </label>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="mt-3 text-[12px] text-red-500 hover:text-red-600 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <X size={13} /> Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

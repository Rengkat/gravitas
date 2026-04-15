import { Tutor, TutorFilters } from "../../../../../types/tutors";

export function formatPrice(n: number): string {
  return `₦${n.toLocaleString()}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function subjectLabel(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function matchesExperience(tutor: Tutor, range: TutorFilters["experience"]): boolean {
  if (range === "all") return true;
  if (range === "10+") return tutor.experience >= 10;
  const [min, max] = range.split("-").map(Number);
  return tutor.experience >= min && tutor.experience <= max;
}

export function matchesPrice(tutor: Tutor, range: TutorFilters["priceRange"]): boolean {
  const p = tutor.hourlyRate;
  if (range === "all") return true;
  if (range === "under-5k") return p < 5000;
  if (range === "5k-10k") return p >= 5000 && p <= 10000;
  if (range === "10k-20k") return p > 10000 && p <= 20000;
  if (range === "20k+") return p > 20000;
  return true;
}

export function applyFilters(tutors: Tutor[], filters: TutorFilters): Tutor[] {
  let result = tutors.filter((t) => {
    const q = filters.searchQuery.toLowerCase();
    if (
      q &&
      !t.name.toLowerCase().includes(q) &&
      !t.title.toLowerCase().includes(q) &&
      !t.tags.some((tag) => tag.toLowerCase().includes(q))
    )
      return false;
    if (filters.subject !== "all" && !t.specialization.includes(filters.subject)) return false;
    if (!matchesExperience(t, filters.experience)) return false;
    if (!matchesPrice(t, filters.priceRange)) return false;
    if (filters.verifiedOnly && !t.isVerified) return false;
    if (filters.onlineOnly && !t.isOnline) return false;
    return true;
  });

  switch (filters.sortMode) {
    case "rating":
      return result.sort((a, b) => b.rating - a.rating);
    case "price-low":
      return result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    case "price-high":
      return result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    case "experience":
      return result.sort((a, b) => b.experience - a.experience);
    default:
      return result;
  }
}

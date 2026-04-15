import {
  BookOpen,
  TrendingUp,
  Zap,
  Leaf,
  Briefcase,
  Users,
  Globe,
} from "lucide-react";
import { Subject, Experience, PriceRange, Availability, SortMode } from "@/types/tutors";

export const SUBJECTS: { id: Subject; name: string; icon?: any }[] = [
  { id: "all", name: "All Subjects" },
  { id: "mathematics", name: "Mathematics", icon: TrendingUp },
  { id: "physics", name: "Physics", icon: Zap },
  { id: "chemistry", name: "Chemistry" },
  { id: "biology", name: "Biology", icon: Leaf },
  { id: "english", name: "English", icon: BookOpen },
  { id: "economics", name: "Economics", icon: Briefcase },
  { id: "government", name: "Government", icon: Users },
  { id: "literature", name: "Literature" },
  { id: "history", name: "History", icon: Globe },
];

export const EXPERIENCE_OPTIONS: { id: Experience; label: string }[] = [
  { id: "all", label: "Any Experience" },
  { id: "1-3", label: "1–3 years" },
  { id: "3-5", label: "3–5 years" },
  { id: "5-10", label: "5–10 years" },
  { id: "10+", label: "10+ years" },
];

export const PRICE_OPTIONS: { id: PriceRange; label: string }[] = [
  { id: "all", label: "Any Price" },
  { id: "under-5k", label: "Under ₦5,000" },
  { id: "5k-10k", label: "₦5,000 – ₦10,000" },
  { id: "10k-20k", label: "₦10,000 – ₦20,000" },
  { id: "20k+", label: "₦20,000+" },
];

export const AVAILABILITY_OPTIONS: { id: Availability; label: string }[] = [
  { id: "all", label: "Any Time" },
  { id: "today", label: "Available Today" },
  { id: "tomorrow", label: "Available Tomorrow" },
  { id: "this-week", label: "This Week" },
];

export const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "rating", label: "Highest Rated" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "experience", label: "Most Experienced" },
];

export const SUBJECT_DISPLAY: Record<string, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  english: "English",
  economics: "Economics",
  government: "Government",
  literature: "Literature",
  history: "History",
  all: "All Subjects",
};

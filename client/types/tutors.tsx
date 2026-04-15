export type Subject =
  | "all"
  | "mathematics"
  | "physics"
  | "chemistry"
  | "biology"
  | "english"
  | "economics"
  | "government"
  | "literature"
  | "history";

export type Experience = "all" | "1-3" | "3-5" | "5-10" | "10+";
export type PriceRange = "all" | "under-5k" | "5k-10k" | "10k-20k" | "20k+";
export type Availability = "all" | "today" | "tomorrow" | "this-week";
export type SortMode = "rating" | "price-low" | "price-high" | "experience";

export interface TutorPackage {
  name: string;
  duration: string;
  price: number;
  savings: number;
  popular?: boolean;
}

export interface TutorReview {
  id: number;
  student: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  subject: string;
  helpful: number;
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialization: Subject[];
  experience: number;
  rating: number;
  reviews: number;
  students: number;
  hourlyRate: number;
  availability: string[];
  timeSlots: string[];
  isOnline: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  languages: string[];
  education: string;
  certifications: string[];
  about: string;
  teachingStyle: string;
  achievements: string[];
  responseTime: string;
  completionRate: number;
  sessionsCompleted: number;
  tags: string[];
  packages: TutorPackage[];
  reviews_list: TutorReview[];
}

export interface TutorFilters {
  searchQuery: string;
  subject: Subject;
  experience: Experience;
  priceRange: PriceRange;
  availability: Availability;
  sortMode: SortMode;
  verifiedOnly: boolean;
  onlineOnly: boolean;
}

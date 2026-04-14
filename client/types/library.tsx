export type ContentType = "all" | "ebooks" | "videos" | "images" | "documents";
export type Subject =
  | "all"
  | "mathematics"
  | "english"
  | "physics"
  | "chemistry"
  | "biology"
  | "economics"
  | "government"
  | "literature";
export type Level = "all" | "sss1" | "sss2" | "sss3" | "jamb" | "university";
export type ExamType = "all" | "jamb" | "waec" | "neco" | "nabteb" | "professional";
export type SortMode = "latest" | "popular" | "rating";
export type ViewMode = "grid" | "list";

export interface LibraryItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  subject: Subject;
  level: Level;
  examType: ExamType;
  duration?: string;      // videos
  pages?: number;         // ebooks / documents
  size?: string;          // images / downloadable files
  author?: string;
  views: number;
  likes: number;
  downloads: number;
  rating: number;
  ratingCount: number;
  isPremium: boolean;     // true = paid / locked
  price?: number;         // in NGN — only if isPremium
  isNew: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  dateAdded: string;
  tags: string[];
  previewAvailable: boolean; // can show first X pages / first N minutes for free
}

export interface LibraryFilters {
  contentType: ContentType;
  subject: Subject;
  level: Level;
  examType: ExamType;
  sortMode: SortMode;
  searchQuery: string;
  showPremiumOnly: boolean;
  showFreeOnly: boolean;
}

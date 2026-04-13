import { ContentType } from "@/types/library";

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function formatPrice(priceNGN: number): string {
  return `₦${priceNGN.toLocaleString()}`;
}

export function typeColor(type: ContentType): { bg: string; text: string; dot: string; border: string } {
  switch (type) {
    case "ebooks":
      return { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" };
    case "videos":
      return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", border: "border-red-200" };
    case "images":
      return { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500", border: "border-purple-200" };
    case "documents":
      return { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500", border: "border-gray-200" };
  }
}

export function typeLabel(type: ContentType): string {
  const map: Record<ContentType, string> = {
    all: "All",
    ebooks: "eBook",
    videos: "Video",
    images: "Image",
    documents: "Doc",
  };
  return map[type];
}

export function accessLabel(item: { type: ContentType; isPremium: boolean }): string {
  if (item.type === "videos") return item.isPremium ? "Unlock" : "Watch";
  if (item.isPremium) return "Unlock";
  return "Access";
}

"use client";

import { Heart, Eye, Download, BookOpen, Clock, Users, Crown, Lock } from "lucide-react";
import { LibraryItem } from "@/types/library";
import { typeColor, formatNumber, formatPrice, accessLabel } from "@/lib/constants/helpers";
import { TypeIcon, StarRating } from "./ui";

interface LibraryRowProps {
  item: LibraryItem;
  liked: boolean;
  bookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onAccess: () => void;
}

export default function LibraryRow({
  item,
  liked,
  bookmarked,
  onLike,
  onBookmark,
  onAccess,
}: LibraryRowProps) {
  const colors = typeColor(item.type);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4">
      {/* Icon block */}
      <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center shrink-0 relative`}>
        <TypeIcon type={item.type} size={24} />
        {item.isPremium && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
            <Crown size={10} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-[14px] font-bold text-gray-900 truncate">{item.title}</h3>
          {item.isNew && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
              NEW
            </span>
          )}
          {item.isPremium ? (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0 flex items-center gap-0.5">
              <Crown size={9} /> {item.price ? formatPrice(item.price) : "PRO"}
            </span>
          ) : (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
              FREE
            </span>
          )}
          {item.isPremium && item.previewAvailable && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              Preview
            </span>
          )}
        </div>

        <p className="text-[12px] text-gray-500 mb-2 line-clamp-1">{item.description}</p>

        <div className="flex items-center gap-4 text-[11px] text-gray-400 flex-wrap">
          {item.author && (
            <span className="flex items-center gap-1">
              <Users size={11} />
              {item.author}
            </span>
          )}
          {item.pages && (
            <span className="flex items-center gap-1">
              <BookOpen size={11} />
              {item.pages} pages
            </span>
          )}
          {item.duration && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {item.duration}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {formatNumber(item.views)}
          </span>
          <span className="flex items-center gap-1">
            <Download size={11} />
            {formatNumber(item.downloads)}
          </span>
          <StarRating rating={item.rating} count={item.ratingCount} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onLike}
          className={`p-2 rounded-xl transition-all ${liked ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-400 hover:bg-red-50"}`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={onBookmark}
          className={`p-2 rounded-xl transition-all ${bookmarked ? "text-blue-500 bg-blue-50" : "text-gray-400 hover:text-blue-400 hover:bg-blue-50"}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <button
          onClick={onAccess}
          className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
            item.isPremium
              ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          {item.isPremium && <Lock size={11} />}
          {accessLabel(item)}
        </button>
      </div>
    </div>
  );
}

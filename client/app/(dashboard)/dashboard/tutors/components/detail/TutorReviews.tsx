import { Star, ThumbsUp } from "lucide-react";
import { Tutor } from "@/types/tutors";

export default function TutorReviews({ tutor }: { tutor: Tutor }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">Student Reviews</h2>
        <div className="flex items-center gap-1.5">
          <Star size={16} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-gray-800">{tutor.rating}</span>
          <span className="text-[13px] text-gray-500">· {tutor.reviews.toLocaleString()} reviews</span>
        </div>
      </div>

      {/* Rating breakdown (visual) */}
      <div className="space-y-1.5 mb-6">
        {[5, 4, 3, 2, 1].map((star) => {
          // Rough distribution based on rating
          const pct =
            star === 5 ? Math.round(tutor.rating * 18)
            : star === 4 ? 100 - Math.round(tutor.rating * 18) - 5
            : star === 3 ? 4
            : star === 2 ? 1
            : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 w-8">
                <span className="text-[12px] text-gray-500">{star}</span>
                <Star size={10} className="fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-amber-400 h-1.5 rounded-full"
                  style={{ width: `${Math.max(pct, 0)}%` }}
                />
              </div>
              <span className="text-[11px] text-gray-400 w-6">{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* Review list */}
      <div className="space-y-5">
        {tutor.reviews_list.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[12px] font-bold text-green-700">
                    {review.student[0]}
                  </div>
                  <span className="font-semibold text-gray-800 text-[14px]">{review.student}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
                      />
                    ))}
                  </div>
                  <span>·</span>
                  <span>{review.date}</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                    {review.subject}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed mb-2">{review.comment}</p>
            <button className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
              <ThumbsUp size={12} />
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

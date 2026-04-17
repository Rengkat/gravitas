import { Star, Users, Award, CheckCircle, GraduationCap, Heart, Share2 } from "lucide-react";
import { Tutor } from "@/types/tutors";
import { getInitials, subjectLabel } from "../helper";

interface TutorProfileHeaderProps {
  tutor: Tutor;
  isFavorited: boolean;
  onFavorite: () => void;
  onShare: () => void;
}

export default function TutorProfileHeader({
  tutor,
  isFavorited,
  onFavorite,
  onShare,
}: TutorProfileHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center border-4 border-green-100">
            <span className="text-3xl font-bold text-white">{getInitials(tutor.name)}</span>
          </div>
          {tutor.isOnline && (
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-800">{tutor.name}</h1>
                {tutor.isVerified && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-green-100 rounded-full">
                    <CheckCircle size={13} className="text-green-600" />
                    <span className="text-[11px] font-bold text-green-700">Verified</span>
                  </div>
                )}
                {tutor.isOnline && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[11px] font-bold text-emerald-700">Online</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-3">{tutor.title}</p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 text-[13px] mb-3">
                <div className="flex items-center gap-1.5">
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-800">{tutor.rating}</span>
                  <span className="text-gray-500">({tutor.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users size={14} className="text-green-600" />
                  {tutor.students.toLocaleString()} students
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Award size={14} className="text-green-600" />
                  {tutor.experience}+ years
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <GraduationCap size={14} className="text-green-600" />
                  {tutor.sessionsCompleted.toLocaleString()} sessions
                </div>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-2">
                {tutor.specialization.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 text-[12px] rounded-full bg-green-100 text-green-700 font-medium">
                    {subjectLabel(s)}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onFavorite}
                className={`p-2.5 rounded-xl border transition-all ${
                  isFavorited
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400"
                }`}>
                <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
              </button>
              <button
                onClick={onShare}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600 transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

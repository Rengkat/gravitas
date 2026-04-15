"use client";

import Link from "next/link";
import { Star, Heart, Award, Clock, CheckCircle, Users, ChevronRight, Zap } from "lucide-react";
import { Tutor } from "@/types/tutors";
import { formatPrice, getInitials, subjectLabel } from "./helper";
interface TutorCardProps {
  tutor: Tutor;
  isFavorited: boolean;
  onFavorite: (e: React.MouseEvent) => void;
}

export default function TutorCard({ tutor, isFavorited, onFavorite }: TutorCardProps) {
  return (
    <Link href={`/dashboard/tutors/${tutor.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* Card header */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-6">
          {/* Favorite + Featured */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* {tutor.isFeatured && (
              <span className="px-2 py-1 rounded-full bg-amber-400 text-amber-900 text-[10px] font-bold flex items-center gap-0.5">
                <Zap size={9} /> Featured
              </span>
            )} */}
            <button
              onClick={onFavorite}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Favourite">
              <Heart
                size={18}
                className={isFavorited ? "fill-red-500 text-red-500" : "text-white"}
              />
            </button>
          </div>

          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
                <span className="text-xl font-bold text-white">{getInitials(tutor.name)}</span>
              </div>
              {tutor.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{tutor.name}</h3>
              <p className="text-sm text-green-100 line-clamp-2">{tutor.title}</p>
              {tutor.isVerified && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle size={12} className="text-green-300" />
                  <span className="text-[11px] text-green-200 font-medium">Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          {/* Rating row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-800">{tutor.rating}</span>
              <span className="text-[12px] text-gray-500">
                ({tutor.reviews.toLocaleString()} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-gray-500">
              <Users size={13} />
              <span>{tutor.students.toLocaleString()} students</span>
            </div>
          </div>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tutor.specialization.map((s) => (
              <span
                key={s}
                className="px-2 py-1 text-[11px] rounded-full bg-green-100 text-green-700 font-medium">
                {subjectLabel(s)}
              </span>
            ))}
          </div>

          {/* Key stats */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-[13px] text-gray-600">
              <Award size={13} className="text-green-600 shrink-0" />
              {tutor.experience}+ years experience
            </div>
            <div className="flex items-center gap-2 text-[13px] text-gray-600">
              <Clock size={13} className="text-green-600 shrink-0" />
              Responds {tutor.responseTime}
            </div>
            <div className="flex items-center gap-2 text-[13px] text-gray-600">
              <CheckCircle size={13} className="text-green-600 shrink-0" />
              {tutor.completionRate}% completion rate
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {tutor.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-600 font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-[11px] text-gray-500">Hourly rate</p>
              <p className="text-xl font-bold text-green-700">{formatPrice(tutor.hourlyRate)}</p>
            </div>
            <span className="px-4 py-2 bg-green-600 text-white rounded-lg text-[13px] font-semibold flex items-center gap-1.5 group-hover:bg-green-700 transition-colors">
              View Profile
              <ChevronRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

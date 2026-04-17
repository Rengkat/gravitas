"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TUTORS } from "@/lib/mock/tutors";
import TutorProfileHeader from "../components/detail/TutorProfileHeader";
import {
  TutorAbout,
  TutorEducation,
  TutorAchievements,
} from "../components/detail/TutorInfoSections";
import TutorReviews from "../components/detail/TutorReviews";
import TutorBookingSidebar from "../components/detail/TutorBookingSidebar";
import BookingModal from "../components/detail/BookingModal";

export default function TutorDetailPage() {
  const params = useParams();
  const tutor = TUTORS.find((t) => t.id === params.id);

  const [isFavorited, setIsFavorited] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: tutor?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleMessage = () => {
    // TODO: navigate to messages with this tutor pre-selected
    console.log("Open message thread with tutor:", tutor?.id);
  };

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Tutor not found</h2>
          <Link href="/tutors" className="text-green-600 hover:underline">
            Back to Tutors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20">
      {/* Back navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link
          href="/tutors"
          className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-800 transition-colors text-[14px] font-medium">
          <ChevronLeft size={18} />
          Back to Tutors
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: tutor info ── */}
          <div className="lg:col-span-2 space-y-6">
            <TutorProfileHeader
              tutor={tutor}
              isFavorited={isFavorited}
              onFavorite={() => setIsFavorited((v) => !v)}
              onShare={handleShare}
            />
            <TutorAbout tutor={tutor} />
            <TutorEducation tutor={tutor} />
            <TutorAchievements tutor={tutor} />
            <TutorReviews tutor={tutor} />
          </div>

          {/* ── Right: booking sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TutorBookingSidebar
                tutor={tutor}
                onBook={() => setShowBookingModal(true)}
                onMessage={handleMessage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {showBookingModal && (
        <BookingModal tutor={tutor} onClose={() => setShowBookingModal(false)} />
      )}
    </div>
  );
}

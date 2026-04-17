import { GraduationCap, Award, BookOpen } from "lucide-react";
import { Tutor } from "@/types/tutors";

// ─── About ───────────────────────────────────────────────────────────────────
export function TutorAbout({ tutor }: { tutor: Tutor }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">About</h2>
      <p className="text-gray-600 leading-relaxed mb-4">{tutor.about}</p>
      <h3 className="font-semibold text-gray-800 mb-2">Teaching Style</h3>
      <p className="text-gray-600 leading-relaxed">{tutor.teachingStyle}</p>
    </div>
  );
}

// ─── Education & Certifications ──────────────────────────────────────────────
export function TutorEducation({ tutor }: { tutor: Tutor }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Education & Certifications</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <GraduationCap size={18} className="text-green-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-[14px]">Education</p>
            <p className="text-[13px] text-gray-600">{tutor.education}</p>
          </div>
        </div>
        {tutor.certifications.map((cert, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Award size={18} className="text-blue-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-[14px]">Certification</p>
              <p className="text-[13px] text-gray-600">{cert}</p>
            </div>
          </div>
        ))}
        {tutor.languages.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-purple-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-[14px]">Languages</p>
              <p className="text-[13px] text-gray-600">{tutor.languages.join(", ")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────
function Trophy({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

export function TutorAchievements({ tutor }: { tutor: Tutor }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tutor.achievements.map((a, idx) => (
          <div key={idx} className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <Trophy size={15} className="text-amber-500 mt-0.5 shrink-0" />
            <span className="text-[13px] text-gray-700">{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

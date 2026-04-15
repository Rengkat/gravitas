import { Users, Star, BookOpen, Shield } from "lucide-react";
import { TUTOR_STATS } from "@/lib/mock/tutors";

export default function TutorsHero() {
  return (
    <div className="relative bg-gradient-to-r from-green-900 to-emerald-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
          <Users size={16} />
          <span className="text-sm font-medium">Expert Tutors</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Tutor</h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
          Connect with experienced, verified tutors who specialize in your subjects and help you
          achieve your academic goals.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { icon: Users, val: `${TUTOR_STATS.totalTutors}+`, label: "Expert Tutors" },
            { icon: Star, val: TUTOR_STATS.avgRating.toString(), label: "Avg. Rating" },
            { icon: BookOpen, val: `${TUTOR_STATS.totalStudents.toLocaleString()}+`, label: "Students Taught" },
            { icon: Shield, val: `${TUTOR_STATS.subjectsCovered}`, label: "Subjects Covered" },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon size={16} className="text-green-300" />
                <span className="text-2xl font-bold">{val}</span>
              </div>
              <div className="text-[12px] text-green-300">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

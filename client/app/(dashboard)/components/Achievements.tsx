import { Award, Flame, Target, Zap } from "lucide-react";
import Link from "next/link";

const Achievements = () => {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-800 to-green-700 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Award size={18} />
        <h2 className="font-serif text-xl">Recent Achievements</h2>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Flame size={14} />
          </div>
          <div>
            <div className="text-[13px] font-semibold">7-Day Streak</div>
            <div className="text-[11px] text-white/60">Completed 7 days in a row</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Target size={14} />
          </div>
          <div>
            <div className="text-[13px] font-semibold">First Mock Completed</div>
            <div className="text-[11px] text-white/60">Completed your first full mock exam</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Zap size={14} />
          </div>
          <div>
            <div className="text-[13px] font-semibold">AI Explorer</div>
            <div className="text-[11px] text-white/60">Used Sabi-Explain 10 times</div>
          </div>
        </div>
      </div>
      <Link
        href="/dashboard/games"
        className="inline-flex items-center gap-1 mt-4 text-[12px] font-semibold text-gold">
        View all achievements →
      </Link>
    </div>
  );
};

export default Achievements;

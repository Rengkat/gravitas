"use client";

import { PERFORMANCE_DATA } from "@/lib/mock/performance";
import { Medal, TrendingUp, Users, Award } from "lucide-react";

const LeaderboardTab = () => {
  const { leaderboard, overall } = PERFORMANCE_DATA;
  const topThree = leaderboard.filter((e) => e.rank <= 3);
  const rest = leaderboard.filter((e) => e.rank > 3);

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <Medal size={24} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">#{overall.rank}</p>
            <p className="text-sm text-gray-500">Your Current Rank</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">Top {100 - overall.percentile}%</p>
            <p className="text-sm text-gray-500">Percentile Standing</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Users size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{overall.percentile}th</p>
            <p className="text-sm text-gray-500">Percentile</p>
          </div>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award size={22} className="text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800">Top Performers</h3>
        </div>
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd */}
          {topThree[1] && (
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-1">{topThree[1].badge}</div>
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg border-4 border-gray-300">
                {topThree[1].name.split(" ")[0][0]}
              </div>
              <p className="text-sm font-semibold text-gray-700 mt-2">{topThree[1].name}</p>
              <p className="text-xs text-gray-500">{topThree[1].score}%</p>
              <div className="w-24 h-16 bg-gray-200 rounded-t-lg mt-2 flex items-center justify-center font-bold text-gray-600 text-lg">
                2nd
              </div>
            </div>
          )}
          {/* 1st */}
          {topThree[0] && (
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-1">{topThree[0].badge}</div>
              <div className="w-24 h-24 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-700 font-bold text-2xl border-4 border-yellow-400">
                {topThree[0].name.split(" ")[0][0]}
              </div>
              <p className="text-sm font-bold text-gray-800 mt-2">{topThree[0].name}</p>
              <p className="text-xs text-gray-500">{topThree[0].score}%</p>
              <div className="w-24 h-24 bg-yellow-400 rounded-t-lg mt-2 flex items-center justify-center font-bold text-white text-xl">
                1st
              </div>
            </div>
          )}
          {/* 3rd */}
          {topThree[2] && (
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-1">{topThree[2].badge}</div>
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-700 font-bold text-lg border-4 border-orange-300">
                {topThree[2].name.split(" ")[0][0]}
              </div>
              <p className="text-sm font-semibold text-gray-700 mt-2">{topThree[2].name}</p>
              <p className="text-xs text-gray-500">{topThree[2].score}%</p>
              <div className="w-24 h-10 bg-orange-300 rounded-t-lg mt-2 flex items-center justify-center font-bold text-white text-lg">
                3rd
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full leaderboard table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Rankings</h3>

        {/* Show ellipsis between top 3 and your nearby ranks */}
        <div className="space-y-2">
          {/* Top 5 */}
          {rest.filter((e) => e.rank <= 5).map((entry) => (
            <LeaderboardRow key={entry.rank} entry={entry} />
          ))}

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 border-t border-dashed border-gray-200" />
            <span className="text-xs text-gray-400">· · ·</span>
            <div className="flex-1 border-t border-dashed border-gray-200" />
          </div>

          {/* Surrounding ranks */}
          {rest.filter((e) => e.rank > 5).map((entry) => (
            <LeaderboardRow key={entry.rank} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
};

function LeaderboardRow({
  entry,
}: {
  entry: {
    rank: number;
    name: string;
    score: number;
    exams: number;
    badge: string;
    isCurrentUser?: boolean;
  };
}) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
        entry.isCurrentUser
          ? "bg-blue-50 border-2 border-blue-300 shadow-sm"
          : "hover:bg-gray-50 border border-transparent"
      }`}
    >
      <div className="w-8 text-center">
        <span
          className={`text-sm font-bold ${
            entry.rank === 1
              ? "text-yellow-500"
              : entry.rank === 2
              ? "text-gray-400"
              : entry.rank === 3
              ? "text-orange-400"
              : "text-gray-500"
          }`}
        >
          #{entry.rank}
        </span>
      </div>
      <div className="text-xl w-7 text-center">{entry.badge}</div>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
          entry.isCurrentUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {entry.name.split(" ")[0][0]}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${entry.isCurrentUser ? "text-blue-700" : "text-gray-800"}`}>
          {entry.name}
          {entry.isCurrentUser && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              You
            </span>
          )}
        </p>
        <p className="text-xs text-gray-400">{entry.exams} exams taken</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${entry.isCurrentUser ? "text-blue-700" : "text-gray-800"}`}>
          {entry.score}%
        </p>
        <p className="text-xs text-gray-400">avg score</p>
      </div>
    </div>
  );
}

export default LeaderboardTab;

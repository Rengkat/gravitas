"use client";

import { getMasteryColor, getScoreColor } from "@/lib/constants/subjectTab-helper";
import { PERFORMANCE_DATA } from "@/lib/mock/performance";
import { ArrowDown, ArrowUp } from "lucide-react";

const TopicsTab = () => {
  const sorted = [...PERFORMANCE_DATA.topicMastery].sort((a, b) => a.score - b.score);

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["expert", "advanced", "intermediate", "beginner"] as const).map((level) => {
          const count = PERFORMANCE_DATA.topicMastery.filter((t) => t.masteryLevel === level).length;
          return (
            <div key={level} className={`rounded-xl p-4 text-center ${getMasteryColor(level)} bg-opacity-20`}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm font-medium capitalize mt-1">{level}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Topic Mastery Breakdown</h3>
        <div className="space-y-4">
          {sorted.map((topic, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{topic.topic}</span>
                <span className={`font-semibold ${getScoreColor(topic.score)}`}>
                  {topic.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${topic.score}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{topic.questionsAttempted} questions</span>
                <span className="flex items-center gap-1">
                  {topic.improvement >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {Math.abs(topic.improvement)}% improvement
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getMasteryColor(topic.masteryLevel)}`}>
                  {topic.masteryLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicsTab;

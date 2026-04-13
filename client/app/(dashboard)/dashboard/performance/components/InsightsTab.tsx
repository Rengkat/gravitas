"use client";

import { PERFORMANCE_DATA } from "@/lib/mock/performance";
import { AlertCircle, CheckCircle, ChevronRight, Lightbulb, Trophy, XCircle, Flag } from "lucide-react";

const InsightsTab = () => {
  return (
    <div className="space-y-6">
      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {PERFORMANCE_DATA.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={24} className="text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Areas for Improvement</h3>
          </div>
          <ul className="space-y-3">
            {PERFORMANCE_DATA.weaknesses.map((weakness, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <XCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Goals & Milestones */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Flag size={24} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Goals & Milestones</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERFORMANCE_DATA.goals.map((goal) => {
            const isRank = goal.unit === "rank";
            // For rank, lower is better
            const progress = isRank
              ? Math.max(0, Math.min(100, ((goal.current - goal.target) / goal.current) * 100))
              : Math.min(100, (goal.current / goal.target) * 100);
            const displayProgress = isRank
              ? Math.round(100 - (goal.current / 200) * 100)
              : Math.round(progress);
            const completed = isRank ? goal.current <= goal.target : goal.current >= goal.target;

            return (
              <div
                key={goal.id}
                className={`border rounded-xl p-4 ${
                  completed ? "border-green-200 bg-green-50" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{goal.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Deadline: {goal.deadline}</p>
                  </div>
                  {completed && (
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 ml-2" />
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>
                    {isRank ? `Current rank: #${goal.current}` : `${goal.current} / ${goal.target} ${goal.unit}`}
                  </span>
                  <span className="font-semibold">{displayProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      completed ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${displayProgress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={24} />
          <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
        </div>
        <ul className="space-y-3">
          {PERFORMANCE_DATA.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <ChevronRight size={18} className="mt-0.5 flex-shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Study Plan */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggested Study Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Daily</div>
              <div className="text-sm text-gray-600 mt-2">• 2 hours study</div>
              <div className="text-sm text-gray-600">• 30 practice questions</div>
              <div className="text-sm text-gray-600">• Review weak topics</div>
            </div>
          </div>
          <div className="border border-green-200 rounded-xl p-4 bg-green-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Weekly</div>
              <div className="text-sm text-gray-600 mt-2">• 2 full practice exams</div>
              <div className="text-sm text-gray-600">• Topic review sessions</div>
              <div className="text-sm text-gray-600">• Progress assessment</div>
            </div>
          </div>
          <div className="border border-purple-200 rounded-xl p-4 bg-purple-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Monthly</div>
              <div className="text-sm text-gray-600 mt-2">• Mock examinations</div>
              <div className="text-sm text-gray-600">• Performance review</div>
              <div className="text-sm text-gray-600">• Goal setting</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsTab;

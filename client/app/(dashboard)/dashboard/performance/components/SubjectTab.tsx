"use client";

import { getMasteryColor, getScoreColor } from "@/lib/constants/subjectTab-helper";
import { PERFORMANCE_DATA } from "@/lib/mock/performance";
import { ArrowDown, ArrowUp } from "lucide-react";

const SubjectTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PERFORMANCE_DATA.subjectPerformance.map((subject, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{subject.subject}</h3>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getMasteryColor(subject.masteryLevel)}`}
              >
                {subject.masteryLevel.toUpperCase()}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Performance Score</span>
                <span className={`font-semibold ${getScoreColor(subject.score)}`}>
                  {subject.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${subject.score}%` }}
                />
              </div>
              {/* vs Average indicator */}
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Class average: {subject.averageScore}%</span>
                <span className={subject.score >= subject.averageScore ? "text-green-500" : "text-red-500"}>
                  {subject.score >= subject.averageScore ? "+" : ""}{subject.score - subject.averageScore}% vs avg
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Questions</p>
                <p className="font-semibold text-gray-800">{subject.questionsAttempted}</p>
              </div>
              <div>
                <p className="text-gray-500">Correct</p>
                <p className="font-semibold text-gray-800">{subject.correctAnswers}</p>
              </div>
              <div>
                <p className="text-gray-500">Time Spent</p>
                <p className="font-semibold text-gray-800">
                  {Math.floor(subject.timeSpent / 60)}h {subject.timeSpent % 60}m
                </p>
              </div>
              <div>
                <p className="text-gray-500">Trend</p>
                <p
                  className={`font-semibold flex items-center gap-1 ${
                    subject.trend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {subject.trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {Math.abs(subject.trend)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectTab;

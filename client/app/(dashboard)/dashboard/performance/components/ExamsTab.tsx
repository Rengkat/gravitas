"use client";

import { getScoreColor } from "@/lib/constants/subjectTab-helper";
import { PERFORMANCE_DATA } from "@/lib/mock/performance";
import { ArrowDown, ArrowUp, Trophy } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ExamsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PERFORMANCE_DATA.examPerformance.map((exam, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{exam.examType}</h3>
              <Trophy
                size={24}
                className={exam.averageScore >= 80 ? "text-yellow-500" : "text-gray-400"}
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Average Score</span>
                <span className={`font-semibold ${getScoreColor(exam.averageScore)}`}>
                  {exam.averageScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${exam.averageScore}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-500">Exams Taken</p>
                <p className="font-semibold text-gray-800">{exam.examsTaken}</p>
              </div>
              <div>
                <p className="text-gray-500">Best Score</p>
                <p className="font-semibold text-green-600">{exam.bestScore}%</p>
              </div>
              <div>
                <p className="text-gray-500">Worst Score</p>
                <p className="font-semibold text-red-600">{exam.worstScore}%</p>
              </div>
              <div>
                <p className="text-gray-500">Trend</p>
                <p
                  className={`font-semibold flex items-center gap-1 ${
                    exam.trend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {exam.trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {Math.abs(exam.trend)}%
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Range: {exam.worstScore}% – {exam.bestScore}%
              </span>
              <button className="text-blue-600 text-sm hover:underline">View Details →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Exam Performance Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Exam Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart data={PERFORMANCE_DATA.examPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="examType" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageScore" name="Average Score" fill="#3B82F6" />
            <Bar dataKey="bestScore" name="Best Score" fill="#10B981" />
            <Bar dataKey="worstScore" name="Worst Score" fill="#EF4444" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExamsTab;

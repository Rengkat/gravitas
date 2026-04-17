"use client";

import { PERFORMANCE_DATA } from "@/lib/mock/performance";
import { CheckCircle, Clock, Target, Zap, Calendar } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OverviewTab = () => {
  // const [ismouted, setIsMounted] = useState(false);
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Target size={24} className="text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +{PERFORMANCE_DATA.overall.improvement}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {PERFORMANCE_DATA.overall.averageScore}%
          </h3>
          <p className="text-gray-600 text-sm">Average Score</p>
          <div className="mt-2 text-xs text-gray-500">Above average by 12%</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {PERFORMANCE_DATA.overall.correctAnswers}/{PERFORMANCE_DATA.overall.totalQuestions}
          </h3>
          <p className="text-gray-600 text-sm">Correct Answers</p>
          <div className="mt-2 text-xs text-gray-500">78.5% accuracy rate</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Clock size={24} className="text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {Math.floor(PERFORMANCE_DATA.overall.totalTimeSpent / 60)}h
          </h3>
          <p className="text-gray-600 text-sm">Total Study Time</p>
          <div className="mt-2 text-xs text-gray-500">
            {PERFORMANCE_DATA.overall.totalTimeSpent} minutes
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Zap size={24} className="text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{PERFORMANCE_DATA.overall.streak}</h3>
          <p className="text-gray-600 text-sm">Current Streak</p>
          <div className="mt-2 text-xs text-gray-500">
            Best: {PERFORMANCE_DATA.overall.bestStreak} days
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={PERFORMANCE_DATA.weeklyTrend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Mastery Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={PERFORMANCE_DATA.subjectPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Your Score"
                dataKey="score"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Radar
                name="Average"
                dataKey="averageScore"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Study Activity Heatmap */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Study Activity (Last 90 Days)</h3>
        </div>
        <div className="flex flex-wrap gap-1">
          {PERFORMANCE_DATA.studyHeatmap.map((day, idx) => {
            const intensity =
              day.count === 0
                ? "bg-gray-100"
                : day.count === 1
                  ? "bg-green-200"
                  : day.count === 2
                    ? "bg-green-300"
                    : day.count === 3
                      ? "bg-green-400"
                      : day.count === 4
                        ? "bg-green-500"
                        : "bg-green-600";
            return (
              <div
                key={idx}
                title={`${day.date}: ${day.count} session${day.count !== 1 ? "s" : ""}`}
                className={`w-3 h-3 rounded-sm ${intensity} cursor-pointer transition-opacity hover:opacity-70`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            {["bg-gray-100", "bg-green-200", "bg-green-300", "bg-green-400", "bg-green-600"].map(
              (c, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
              ),
            )}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Date", "Exam", "Subject", "Score", "Time Spent", "Accuracy"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {PERFORMANCE_DATA.recentActivity.map((activity, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{activity.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{activity.examType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{activity.subject}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    {activity.score}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{activity.timeSpent} min</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {Math.round((activity.questionsCorrect / activity.totalQuestions) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

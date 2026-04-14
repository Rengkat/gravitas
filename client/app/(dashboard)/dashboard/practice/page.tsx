"use client";

import { useState } from "react";
import {
  BookOpen,
  ListChecks,
  Settings,
  ChevronRight,
  ChevronLeft,
  Target,
  Zap,
  Sparkles,
  GraduationCap,
  CalendarDays,
  Hash,
  Clock,
  Check,
  CircleDot,
  PenLine,
  Microscope,
  Layers,
  Shuffle,
  BriefcaseBusiness,
} from "lucide-react";
import { PROFESSIONAL_EXAMS, SECONDARY_EXAMS, SUBJECTS, TOPICS } from "@/lib/constants/practice";
import { ExamCategory, PracticeConfig, QuestionType } from "@/types/practice";
import ExamCard from "./ExamCard";
import ProfCard from "./ProfileCard";
import SubjectSelector from "./SubjectSelector";
import SummaryPanel from "./SummaryPanel";
import StepIndicator from "./StepIndicator";

const YEARS = Array.from({ length: 11 }, (_, i) => (2024 - i).toString());
const QUESTION_COUNTS = [10, 20, 30, 40, 50, 60];
const DEFAULT_TIME = 60;

export default function PracticePage() {
  const [step, setStep] = useState(1);
  const [examCategory, setExamCategory] = useState<ExamCategory>("SECONDARY");
  const [config, setConfig] = useState<PracticeConfig>({ examType: null });
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const update = (updates: Partial<PracticeConfig>) =>
    setConfig((prev) => ({ ...prev, ...updates }));

  const isJamb = config.examType === "JAMB";
  const canProceed =
    config.examType === "PROFESSIONAL"
      ? !!config.professionalExam
      : isJamb
        ? (config.subjects?.length ?? 0) >= 1
        : !!config.examType && !!config.subject;

  const availableTopics =
    !isJamb && config.subject && TOPICS[config.subject] ? TOPICS[config.subject] : [];

  const exam =
    config.examType === "PROFESSIONAL"
      ? PROFESSIONAL_EXAMS.find((e) => e.id === config.professionalExam)
      : SECONDARY_EXAMS.find((e) => e.id === config.examType);

  /* ── STEP 1 ── */
  const renderStep1 = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What are you preparing for?</h2>
        <p className="text-gray-500 text-sm">Choose the exam category that applies to you</p>
      </div>

      {/* Category Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
          {(["SECONDARY", "PROFESSIONAL"] as ExamCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setExamCategory(cat)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${examCategory === cat ? "bg-white text-green-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <span className="inline-flex items-center gap-1.5">
                {cat === "SECONDARY" ? (
                  <>
                    <GraduationCap size={16} className="text-blue-600" />
                    <span>Secondary School</span>
                  </>
                ) : (
                  <>
                    <BriefcaseBusiness size={16} className="text-purple-600" />
                    <span>Professional</span>
                  </>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {examCategory === "SECONDARY" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {SECONDARY_EXAMS.map((e) => (
            <ExamCard
              key={e.id}
              exam={e}
              selected={config.examType === e.id}
              onClick={() =>
                update({
                  examType: e.id,
                  subject: undefined,
                  questionType: undefined,
                  professionalExam: undefined,
                })
              }
            />
          ))}
        </div>
      )}

      {examCategory === "PROFESSIONAL" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {PROFESSIONAL_EXAMS.map((e) => (
            <ProfCard
              key={e.id}
              exam={e}
              selected={config.professionalExam === e.id}
              onClick={() => update({ examType: "PROFESSIONAL", professionalExam: e.id })}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => config.examType && setStep(2)}
          disabled={!config.examType}
          className={`px-10 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 ${config.examType ? "bg-green-800 text-white hover:bg-green-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  /* ── STEP 2 ── */
  const renderStep2 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        {/* Subject */}
        {config.examType !== "PROFESSIONAL" && SUBJECTS[config.examType!] && (
          <SubjectSelector
            examType={config.examType!}
            subjects={SUBJECTS[config.examType!]}
            isJamb={isJamb}
            selected={isJamb ? (config.subjects ?? []) : config.subject ? [config.subject] : []}
            onChange={(vals) => {
              if (isJamb) {
                update({ subjects: vals, subject: undefined });
              } else {
                update({ subject: vals[0], subjects: undefined });
              }
              setSelectedTopics([]);
            }}
          />
        )}

        {/* Question Type */}
        {config.examType !== "JAMB" && config.examType !== "PROFESSIONAL" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <ListChecks size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-800">Question Type</h3>
                <p className="text-[11px] text-gray-400">How do you want to be tested?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(
                [
                  {
                    id: "MCQ",
                    label: "Multiple Choice",
                    desc: "Pick the best answer",
                    icon: CircleDot,
                    color: "text-blue-500",
                    activeBg: "border-blue-500 bg-blue-50",
                  },
                  {
                    id: "THEORY",
                    label: "Theory",
                    desc: "Written explanations",
                    icon: PenLine,
                    color: "text-violet-500",
                    activeBg: "border-violet-500 bg-violet-50",
                  },
                  {
                    id: "PRACTICAL",
                    label: "Practical",
                    desc: "Hands-on questions",
                    icon: Microscope,
                    color: "text-teal-500",
                    activeBg: "border-teal-500 bg-teal-50",
                  },
                  {
                    id: "ALL",
                    label: "Mixed",
                    desc: "All types combined",
                    icon: Layers,
                    color: "text-orange-500",
                    activeBg: "border-orange-500 bg-orange-50",
                  },
                ] as {
                  id: QuestionType;
                  label: string;
                  desc: string;
                  icon: typeof CircleDot;
                  color: string;
                  activeBg: string;
                }[]
              ).map((qt) => {
                const Icon = qt.icon;
                const active = config.questionType === qt.id;
                return (
                  <button
                    key={qt.id}
                    onClick={() => update({ questionType: qt.id })}
                    className={`p-3.5 rounded-xl text-left transition-all duration-150 border-2 ${active ? qt.activeBg : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                    <Icon size={20} className={`mb-2 ${active ? qt.color : "text-gray-400"}`} />
                    <div className="text-[13px] font-semibold text-gray-800">{qt.label}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{qt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Year */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <CalendarDays size={16} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-gray-800">Exam Year</h3>
              <p className="text-[11px] text-gray-400">Optional — random mix if not selected</p>
            </div>
            {config.year && (
              <button
                onClick={() => update({ year: undefined })}
                className="ml-auto text-[11px] text-gray-400 hover:text-red-500 transition-colors">
                Clear ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => update({ year: undefined })}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5 ${!config.year ? "bg-green-800 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              <Shuffle size={13} /> Random
            </button>
            {YEARS.map((yr) => (
              <button
                key={yr}
                onClick={() => update({ year: yr })}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${config.year === yr ? "bg-green-800 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* MCQ Settings */}
        {(config.questionType === "MCQ" ||
          config.examType === "JAMB" ||
          config.examType === "PROFESSIONAL" ||
          !config.questionType) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Settings size={16} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-800">Session Settings</h3>
                <p className="text-[11px] text-gray-400">Number of questions and time limit</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Hash size={14} className="text-gray-400" />
                  <span className="text-[13px] font-semibold text-gray-700">
                    Number of Questions
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUESTION_COUNTS.map((n) => (
                    <button
                      key={n}
                      onClick={() => update({ numQuestions: n })}
                      className={`w-14 h-11 rounded-xl text-[13px] font-bold transition-all ${config.numQuestions === n ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                      {n}
                    </button>
                  ))}
                  <input
                    type="number"
                    placeholder="Custom"
                    min={1}
                    max={200}
                    className="w-20 h-11 px-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onChange={(e) =>
                      update({ numQuestions: parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-[13px] font-semibold text-gray-700">Time Limit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-4 py-2.5 flex-1">
                    <input
                      title="time"
                      type="number"
                      value={config.timeLimit || DEFAULT_TIME}
                      min={5}
                      max={300}
                      onChange={(e) =>
                        update({ timeLimit: parseInt(e.target.value) || DEFAULT_TIME })
                      }
                      className="w-16 bg-transparent text-[15px] font-bold text-gray-800 focus:outline-none text-center"
                    />
                    <span className="text-[13px] text-gray-500 font-medium">minutes</span>
                  </div>
                  <button
                    onClick={() => update({ timeLimit: undefined })}
                    className="text-[12px] text-green-700 hover:text-green-800 font-semibold px-3 py-2.5 rounded-xl hover:bg-green-50 transition-all whitespace-nowrap">
                    Reset to {DEFAULT_TIME}m
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Topic Focus */}
        {availableTopics.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <Target size={16} className="text-teal-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-800">Focus Topics</h3>
                <p className="text-[11px] text-gray-400">
                  Optional — narrow down to specific areas in {config.subject}
                </p>
              </div>
              {selectedTopics.length > 0 && (
                <button
                  onClick={() => setSelectedTopics([])}
                  className="ml-auto text-[11px] text-gray-400 hover:text-red-500 transition-colors">
                  Clear all ✕
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableTopics.map((topic) => {
                const active = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() =>
                      setSelectedTopics((prev) =>
                        active ? prev.filter((t) => t !== topic) : [...prev, topic],
                      )
                    }
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[12px] font-semibold text-left transition-all border ${active ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"}`}>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${active ? "border-teal-500 bg-teal-500" : "border-gray-300"}`}>
                      {active && <Check size={8} className="text-white" />}
                    </div>
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Summary */}
      <div className="lg:col-span-1">
        <SummaryPanel
          config={config}
          topics={selectedTopics}
          onNext={() => setStep(3)}
          isReady={canProceed}
        />
      </div>
    </div>
  );

  /* ── STEP 3 ── */
  const renderStep3 = () => (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {exam && (
          <div className={`bg-gradient-to-r ${exam.bg} px-8 py-10 text-center`}>
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <exam.icon size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{exam.name} Practice</h2>
            <p className="text-white/70 text-sm">Your session is configured and ready</p>
          </div>
        )}
        <div className="p-8">
          <div className="space-y-3 mb-8">
            {[
              {
                icon: BookOpen,
                label: "Exam",
                value:
                  config.examType === "PROFESSIONAL" ? config.professionalExam : config.examType,
              },
              ...(config.subjects?.length
                ? [{ icon: BookOpen, label: "Subjects", value: config.subjects.join(", ") }]
                : config.subject
                  ? [{ icon: BookOpen, label: "Subject", value: config.subject }]
                  : []),
              { icon: ListChecks, label: "Question Type", value: config.questionType || "MCQ" },
              { icon: Hash, label: "Questions", value: `${config.numQuestions || 40} questions` },
              { icon: Clock, label: "Time", value: `${config.timeLimit || DEFAULT_TIME} minutes` },
              ...(config.year ? [{ icon: CalendarDays, label: "Year", value: config.year }] : []),
              ...(selectedTopics.length > 0
                ? [{ icon: Target, label: "Topics", value: `${selectedTopics.length} selected` }]
                : []),
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Icon size={15} className="text-green-700" />
                </div>
                <span className="text-[13px] text-gray-500 flex-1">{label}</span>
                <span className="text-[13px] font-bold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
              <ChevronLeft size={16} /> Adjust
            </button>
            <button
              onClick={() => console.log("start", config, selectedTopics)}
              className="flex-1 py-3 bg-green-800 text-white font-bold text-sm rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <Zap size={18} /> Start Practice Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 via-white to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 mb-4">
            <Sparkles size={14} className="text-green-700" />
            <span className="text-[12px] font-bold text-green-700 tracking-wide uppercase">
              Practice Center
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Start a Practice Session
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Configure your session in a few steps and start practising exam questions tailored to
            you.
          </p>
        </div>

        <StepIndicator step={step} />

        {step === 1 && renderStep1()}
        {step === 2 && config.examType && renderStep2()}
        {step === 3 && renderStep3()}

        {step === 2 && (
          <div className="mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700 font-medium transition-colors">
              <ChevronLeft size={16} /> Back to exam selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

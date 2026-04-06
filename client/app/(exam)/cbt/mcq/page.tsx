"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { AllAnswers, Answer, SubjectId } from "@/lib/constants/mcq";
import { buildInitialAnswers } from "./buildInitialAnswers";
import InstructionsPage from "./Instructions";
import QuestionNavigator from "./QuestionNavigator";
import { buildQuestions } from "./buildQuestions";
import { ExamLoader } from "@/lib/loaders";
import LeftQuestion from "./LeftQuestion";
import SubmitModel from "./SubmitModel";
import CbtNav from "../../CbtNav";
import CalculatorModal from "../../CalculatorModal";

type Subject = {
  id: string;
  name: string;
  questionCount: number;
};

const SUBJECTS: Subject[] = [
  { id: "english", name: "English", questionCount: 100 },
  { id: "chemistry", name: "Chemistry", questionCount: 100 },
  { id: "mathematics", name: "Mathematics", questionCount: 100 },
  { id: "physics", name: "Physics", questionCount: 100 },
];

export default function CBTExamPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [examStarted, setExamStarted] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<SubjectId>("physics");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // All answers persisted across subjects
  const [allAnswers, setAllAnswers] = useState<AllAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState(2 * 60 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Memoised question list — only recomputed when subject changes
  const currentQuestions = useMemo(
    () =>
      buildQuestions(currentSubject, SUBJECTS.find((s) => s.id === currentSubject)!.questionCount),
    [currentSubject],
  );

  // Current subject's answers, falling back to freshly initialised ones
  const currentAnswers: Answer[] = useMemo(
    () => allAnswers[currentSubject] ?? buildInitialAnswers(currentQuestions),
    [allAnswers, currentSubject, currentQuestions],
  );

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  // Initialise answers for a subject the first time it is visited
  useEffect(() => {
    if (!examStarted) return;
    setAllAnswers((prev: Record<SubjectId, Answer[]>) => {
      if (prev[currentSubject]) return prev; // already initialised
      return { ...prev, [currentSubject]: buildInitialAnswers(currentQuestions) };
    });
    setCurrentQuestionIndex(0);
  }, [currentSubject, examStarted, currentQuestions]);

  // ── Timer ──────────────────────────────────────────────
  const handleAutoSubmit = useCallback(() => {
    setIsSubmitted(true);
    router.push(`/dashboard/practice/session/${sessionId}/results`);
  }, [router, sessionId]);

  useEffect(() => {
    if (!examStarted || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, isSubmitted, handleAutoSubmit]);

  // ── Answer helpers ─────────────────────────────────────
  const updateCurrentSubjectAnswers = useCallback(
    (updater: (prev: Answer[]) => Answer[]) => {
      setAllAnswers((prev: AllAnswers) => ({
        ...prev,
        [currentSubject]: updater(prev[currentSubject] ?? buildInitialAnswers(currentQuestions)),
      }));
    },
    [currentSubject, currentQuestions],
  );

  const handleSelectOption = useCallback(
    (optionLetter: string) => {
      if (isSubmitted) return;
      updateCurrentSubjectAnswers((prev) =>
        prev.map((ans, idx) =>
          idx === currentQuestionIndex ? { ...ans, selectedOption: optionLetter } : ans,
        ),
      );
    },
    [isSubmitted, currentQuestionIndex, updateCurrentSubjectAnswers],
  );

  const handleFlagQuestion = useCallback(() => {
    if (isSubmitted) return;
    updateCurrentSubjectAnswers((prev) =>
      prev.map((ans, idx) =>
        idx === currentQuestionIndex ? { ...ans, isFlagged: !ans.isFlagged } : ans,
      ),
    );
  }, [isSubmitted, currentQuestionIndex, updateCurrentSubjectAnswers]);

  const markVisited = useCallback(
    (index: number) => {
      updateCurrentSubjectAnswers((prev) =>
        prev.map((ans, idx) => (idx === index ? { ...ans, isVisited: true } : ans)),
      );
    },
    [updateCurrentSubjectAnswers],
  );

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      markVisited(currentQuestionIndex + 1);
      setCurrentQuestionIndex((i) => i + 1);
    }
  }, [currentQuestionIndex, totalQuestions, markVisited]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((i) => i - 1);
  }, [currentQuestionIndex]);

  const handleNavigateToQuestion = useCallback(
    (index: number) => {
      markVisited(index);
      setCurrentQuestionIndex(index);
    },
    [markVisited],
  );

  // ── Text-to-speech ─────────────────────────────────────
  const handleReadAloud = useCallback(() => {
    if (!currentQuestion) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
    utterance.rate = 0.9;
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [currentQuestion, isSpeaking]);

  // Stop speech when question changes
  useEffect(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, currentSubject]);

  // ── Global keyboard shortcuts ──────────────────────────
  useEffect(() => {
    if (!examStarted || isSubmitted) return;

    const handler = (e: KeyboardEvent) => {
      // Don't intercept when calculator is open and user is typing
      if (showCalculator) return;

      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlePrevious();
          break;
        case "a":
        case "A":
          handleSelectOption("A");
          break;
        case "b":
        case "B":
          handleSelectOption("B");
          break;
        case "c":
        case "C":
          handleSelectOption("C");
          break;
        case "d":
        case "D":
          handleSelectOption("D");
          break;
        case "f":
        case "F":
          handleFlagQuestion();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    examStarted,
    isSubmitted,
    showCalculator,
    handleNext,
    handlePrevious,
    handleSelectOption,
    handleFlagQuestion,
  ]);

  const confirmSubmit = useCallback(() => {
    setIsSubmitted(true);
    setShowSubmitModal(false);
    router.push(`/dashboard/practice/session/${sessionId}/results`);
  }, [router, sessionId]);

  const currentSelectedOption = currentAnswers[currentQuestionIndex]?.selectedOption ?? null;
  const isCurrentFlagged = currentAnswers[currentQuestionIndex]?.isFlagged ?? false;

  const totalAnswered = useMemo(
    () => currentAnswers.filter((a) => a.selectedOption !== null).length,
    [currentAnswers],
  );

  const isLowTime = timeRemaining < 300;

  // ── Guards ─────────────────────────────────────────────
  if (!examStarted) {
    return <InstructionsPage onStart={() => setExamStarted(true)} />;
  }

  if (!currentQuestion) {
    return (
      <>
        <ExamLoader />
      </>
      // <div className="min-h-screen flex items-center justify-center">
      //   <div className="text-center">
      //     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto mb-4" />
      //     <p className="text-text-muted">Loading exam…</p>
      //   </div>
      // </div>
    );
  }

  /* ── RENDER ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-cream">
      {/* ── Top Nav ─────────────────────────────────────── */}
      <CbtNav
        setShowCalculator={setShowCalculator}
        handleFlagQuestion={handleFlagQuestion}
        isCurrentFlagged={isCurrentFlagged}
        isLowTime={isLowTime}
        timeRemaining={timeRemaining}
      />
      {/* ── Identity bar ────────────────────────────────── */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center text-gold font-serif text-lg"
            aria-hidden="true">
            A
          </div>
          <div>
            <div className="text-[13px] font-bold text-green-800 uppercase">Alienyi Daniel</div>
            <div className="text-[11px] text-text-muted">Student Pro · JAMB UTME 2025</div>
          </div>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="bg-green-800 text-white px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-green-700 transition-all">
          Submit
        </button>
      </div>

      {/* ── Subject tabs ─────────────────────────────────── */}
      <div className="bg-green-800/90 px-6" role="tablist" aria-label="Subjects">
        <div className="flex gap-1 overflow-x-auto">
          {SUBJECTS.map((subject) => {
            const isActive = currentSubject === subject.id;
            return (
              <button
                key={subject.id}
                role="tab"
                aria-label={`${subject.name}${isActive ? " (current subject)" : ""}`}
                onClick={() => setCurrentSubject(subject.id)}
                className={`px-6 py-3 text-[13px] font-semibold uppercase transition-all relative whitespace-nowrap ${
                  isActive
                    ? "text-gold border-b-2 border-gold"
                    : "text-white/60 hover:text-white/80"
                }`}>
                {subject.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Calculator modal ─────────────────────────────── */}
      {showCalculator && <CalculatorModal onClose={() => setShowCalculator(false)} />}

      {/* ── Main content ─────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Question */}
          <LeftQuestion
            currentQuestionIndex={currentQuestionIndex}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            currentSelectedOption={currentSelectedOption}
            handleSelectOption={handleSelectOption}
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            handleReadAloud={handleReadAloud}
            isSpeaking={isSpeaking}
          />
          {/* Right — Navigator */}
          <div>
            <QuestionNavigator
              totalQuestions={totalQuestions}
              currentIndex={currentQuestionIndex}
              answers={currentAnswers}
              onNavigate={handleNavigateToQuestion}
            />
          </div>
        </div>
      </main>

      {/* ── Submit modal ─────────────────────────────────── */}
      {showSubmitModal && (
        <SubmitModel
          totalAnswered={totalAnswered}
          totalQuestions={totalQuestions}
          setShowSubmitModal={setShowSubmitModal}
          confirmSubmit={confirmSubmit}
        />
      )}
    </div>
  );
}

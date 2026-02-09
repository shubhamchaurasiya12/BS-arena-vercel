"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BetPanel from "@/components/BetPanel";

type Question = {
  id: string;
  question: string;
  options: string[];
};

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get("subjectId");
  const week = searchParams.get("week");

  const [quizId, setQuizId] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const [betPlaced, setBetPlaced] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeUpSubmitting, setTimeUpSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // prevent duplicate submits
  const autoSubmitRef = useRef(false);
  const tabSwitchLock = useRef(false);

  /* =====================================================
     🔁 RECOVER EXISTING ATTEMPT
     ===================================================== */
  useEffect(() => {
    const savedAttemptId = localStorage.getItem("quizAttemptId");
    if (!savedAttemptId) {
      setInitializing(false);
      return;
    }

    async function recover() {
      try {
        const res = await fetch(`/api/quiz/attempt/${savedAttemptId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setAttemptId(data.attemptId);
        setQuestions(data.questions);
        setRemainingTime(data.quiz.remainingTime);
        setBetPlaced(true);

        const stored = localStorage.getItem(
          `quiz_answers_${savedAttemptId}`
        );
        setAnswers(stored ? JSON.parse(stored) : {});
      } catch {
        localStorage.removeItem("quizAttemptId");
        localStorage.removeItem(`quiz_answers_${savedAttemptId}`);
      } finally {
        setInitializing(false);
      }
    }

    recover();
  }, []);

  /* =====================================================
     📌 FETCH QUIZ META
     ===================================================== */
  useEffect(() => {
    if (initializing || attemptId || !subjectId || !week) return;

    async function fetchMeta() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/quiz/meta?subjectId=${subjectId}&week=${week}`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setQuizId(data.quizId);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "No quiz available"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMeta();
  }, [initializing, attemptId, subjectId, week]);

  /* =====================================================
     💾 AUTO-SAVE ANSWERS
     ===================================================== */
  useEffect(() => {
    if (attemptId) {
      localStorage.setItem(
        `quiz_answers_${attemptId}`,
        JSON.stringify(answers)
      );
    }
  }, [attemptId, answers]);

  /* =====================================================
     ▶️ START QUIZ
     ===================================================== */
  async function startQuiz(bet: number) {
    if (!quizId) return;

    try {
      setLoading(true);

      const res = await fetch("/api/quiz/start", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, bet }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setAttemptId(data.attemptId);
      setQuestions(data.questions);
      setRemainingTime(data.quiz.timeLimit);
      setBetPlaced(true);

      localStorage.setItem("quizAttemptId", data.attemptId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start quiz");
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     ⏱ TIMER (UI ONLY)
     ===================================================== */
  useEffect(() => {
    if (remainingTime === null) return;

    const t = setInterval(() => {
      setRemainingTime((v) => (v ? Math.max(v - 1, 0) : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [remainingTime]);

  /* =====================================================
     ⏰ AUTO-SUBMIT ON TIME UP
     ===================================================== */
  useEffect(() => {
    if (
      remainingTime === 0 &&
      attemptId &&
      !autoSubmitRef.current
    ) {
      autoSubmitRef.current = true;
      setTimeUpSubmitting(true);
      submitQuiz(true);
    }
  }, [remainingTime, attemptId]);

  /* =====================================================
     🚨 TAB SWITCH DETECTION
     ===================================================== */
  useEffect(() => {
    if (!attemptId) return;

    async function onVisibilityChange() {
      if (document.visibilityState !== "hidden") return;
      if (tabSwitchLock.current) return;

      tabSwitchLock.current = true;

      try {
        const res = await fetch("/api/quiz/tab-switch", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId }),
        });

        const data = await res.json();

        if (data?.warning) {
          alert(data.message);
        }

        if (data?.status === "FAILED_CHEATING") {
          alert("❌ Quiz auto-submitted due to tab switching");
          autoSubmitRef.current = true;
          setTimeUpSubmitting(true);
          await submitQuiz(true);
        }
      } finally {
        setTimeout(() => {
          tabSwitchLock.current = false;
        }, 1000);
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );
  }, [attemptId]);

  /* =====================================================
     📤 SUBMIT QUIZ
     ===================================================== */
  async function submitQuiz(isAuto = false) {
    if (!attemptId || (submitting && !isAuto)) return;

    try {
      setSubmitting(true);

      await fetch("/api/quiz/submit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, answers }),
      });

      await fetch("/api/quiz/apply-points", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });

      localStorage.removeItem("quizAttemptId");
      localStorage.removeItem(`quiz_answers_${attemptId}`);

      router.push(
        `/quiz-result?attemptId=${attemptId}&subjectId=${subjectId}&week=${week}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* =====================================================
     🧠 UI
     ===================================================== */
  if (!subjectId || !week) {
    return <p className="p-6 text-red-600">Invalid quiz link</p>;
  }

  if (initializing || loading) {
    return <p className="p-6 text-gray-600">Loading quiz…</p>;
  }

  if (error && !betPlaced) {
    return (
      <div className="p-6 text-center">
        <p>{error}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[rgb(255,250,246)]">
      {!betPlaced ? (
        <BetPanel onConfirm={startQuiz} />
      ) : (
        <>
          {remainingTime !== null && (
            <div className="mb-4 text-right font-semibold">
              {timeUpSubmitting
                ? "Submitting…"
                : `Time Left: ${remainingTime}s`}
            </div>
          )}

          {questions.map((q, i) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-xl mb-6"
            >
              <p className="font-semibold mb-2">
                {i + 1}. {q.question}
              </p>
              {q.options.map((opt, idx) => (
                <label key={idx} className="block">
                  <input
                    type="radio"
                    checked={answers[q.id] === idx}
                    onChange={() =>
                      setAnswers({ ...answers, [q.id]: idx })
                    }
                  />{" "}
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={() => submitQuiz(false)}
            disabled={
              submitting ||
              remainingTime === 0 ||
              Object.keys(answers).length !== questions.length
            }
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
}

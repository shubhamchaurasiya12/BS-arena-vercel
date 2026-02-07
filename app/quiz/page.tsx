"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BetPanel from "@/components/BetPanel";
import { useAuth } from "@/context/AuthContext";

type Question = {
  id: string;
  question: string;
  options: string[];
};

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user, setUser } = useAuth();

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

  // Prevent double auto-submit
  const autoSubmitRef = useRef(false);

  /* =====================================================
     🔁 RECOVER EXISTING ATTEMPT (RUNS FIRST)
     ===================================================== */
  useEffect(() => {
    if (!token) {
      setInitializing(false);
      return;
    }

    const savedAttemptId = localStorage.getItem("quizAttemptId");
    if (!savedAttemptId) {
      setInitializing(false);
      return;
    }

    async function recoverAttempt() {
      try {
        const res = await fetch(`/api/quiz/attempt/${savedAttemptId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        setAttemptId(data.attemptId);
        setQuestions(data.questions);
        setRemainingTime(data.quiz.remainingTime);
        setBetPlaced(true);

        const storedAnswers = localStorage.getItem(
          `quiz_answers_${savedAttemptId}`
        );

        setAnswers(storedAnswers ? JSON.parse(storedAnswers) : {});
      } catch {
        localStorage.removeItem("quizAttemptId");
        localStorage.removeItem(`quiz_answers_${savedAttemptId}`);
      } finally {
        setInitializing(false);
      }
    }

    recoverAttempt();
  }, [token]);

  /* =====================================================
     📌 FETCH QUIZ META (ONLY IF NO ACTIVE ATTEMPT)
     ===================================================== */
  useEffect(() => {
    if (initializing) return;
    if (attemptId) return;
    if (!token || !subjectId || !week) return;

    async function fetchMeta() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/quiz/meta?subjectId=${subjectId}&week=${week}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.message || "No quiz available right now"
          );
        }

        setQuizId(data.quizId);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No quiz available right now"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMeta();
  }, [initializing, attemptId, token, subjectId, week]);

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
    if (!quizId || !token || !user) return;

    try {
      setLoading(true);

      const res = await fetch("/api/quiz/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quizId, bet }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to start quiz");
      }

      setAttemptId(data.attemptId);
      setQuestions(data.questions);
      setRemainingTime(data.quiz.timeLimit);
      setBetPlaced(true);

      // 🔥 Real-time points update
      const updatedUser = {
        ...user,
        total_points: user.total_points - bet,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      localStorage.setItem("quizAttemptId", data.attemptId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to start quiz"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     ⏱ TIMER (UI ONLY)
     ===================================================== */
  useEffect(() => {
    if (remainingTime === null) return;

    const timer = setInterval(() => {
      setRemainingTime((t) =>
        t !== null ? Math.max(t - 1, 0) : null
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  /* =====================================================
     ⏰ AUTO-SUBMIT WHEN TIME = 0 (BACKEND VALIDATED)
     ===================================================== */
  useEffect(() => {
    if (
      remainingTime === 0 &&
      attemptId &&
      token &&
      !autoSubmitRef.current
    ) {
      autoSubmitRef.current = true;
      setTimeUpSubmitting(true);
      (async () => {
        await submitQuiz(true);
      })();
    }
  }, [remainingTime, attemptId, token]);

  /* =====================================================
     ⏱ FORMAT TIME
     ===================================================== */
  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  /* =====================================================
     📤 SUBMIT QUIZ
     ===================================================== */
  async function submitQuiz(isAuto = false) {
    if (!attemptId || !token) return;
    if (submitting && !isAuto) return;

    try {
      setSubmitting(true);

      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attemptId, answers }),
      });

      await fetch("/api/quiz/apply-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
     🔒 GUARDS
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
        <p className="text-gray-700">{error}</p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  /* =====================================================
     🧠 QUIZ UI
     ===================================================== */
  return (
    <div className="min-h-screen p-6 bg-[rgb(255,250,246)]">
      {!betPlaced ? (
        <BetPanel onConfirm={startQuiz} />
      ) : (
        <div>
          {remainingTime !== null && (
            <div className="mb-4 text-right text-sm font-semibold">
              {timeUpSubmitting ? (
                <span className="text-red-600">
                  Time’s up! Submitting…
                </span>
              ) : (
                <>
                  Time Left:{" "}
                  <span className="text-red-600">
                    {formatTime(remainingTime)}
                  </span>
                </>
              )}
            </div>
          )}

          {questions.map((q, i) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-6"
            >
              <p className="font-semibold mb-3 text-gray-800">
                {i + 1}. {q.question}
              </p>

              <div className="flex flex-col gap-3">
                {q.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 cursor-pointer text-gray-900"
                  >
                    <input
                      type="radio"
                      checked={answers[q.id] === idx}
                      disabled={remainingTime === 0 || submitting}
                      onChange={() =>
                        setAnswers({ ...answers, [q.id]: idx })
                      }
                      className="accent-black w-4 h-4"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => submitQuiz(false)}
            disabled={
              submitting ||
              remainingTime === 0 ||
              Object.keys(answers).length !== questions.length
            }
            className="bg-black text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-900 disabled:opacity-50 transition-all duration-300"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}
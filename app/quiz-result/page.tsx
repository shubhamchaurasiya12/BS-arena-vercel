"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type QuizQuestionResult = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  userAnswer: number | null;
  isCorrect: boolean;
};

type QuizResult = {
  attemptId: string;
  score: number;
  correct: number;
  total: number;
  won: boolean;
  bet: number;
  pointsChange: number;
  status: string;
  questions: QuizQuestionResult[];
};

export default function QuizResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const attemptId = searchParams.get("attemptId");
  const subjectId = searchParams.get("subjectId");
  const week = searchParams.get("week");
  const hasUpdatedUser = useRef(false);


  const { token, user, setUser } = useAuth();

  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================================
     📊 FETCH QUIZ RESULT
     ================================ */
  useEffect(() => {
    if (!attemptId || !token) {
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await fetch(
          `/api/quiz/result/${attemptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load results");
        }

        setResult(data);

        // ✅ Update user points if won
        if (data.won && data.pointsChange > 0 && user && !hasUpdatedUser.current) {
            hasUpdatedUser.current = true;
          const updatedUser = {
            ...user,
            total_points:
              user.total_points + data.pointsChange,
          };
          setUser(updatedUser);
          localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Failed to load results"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId, token, user, setUser]);

  /* ================================
     ⏳ LOADING
     ================================ */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }

  /* ================================
     ❌ ERROR
     ================================ */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  /* ================================
     🧠 RESULT UI
     ================================ */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Score Summary */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          Quiz Results
        </h1>

        <div className="text-center mb-6">
          <div
            className={`text-6xl font-bold mb-2 ${
              result.won
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {result.score}%
          </div>
          <p className="text-xl text-gray-700">
            {result.correct} / {result.total} correct
          </p>
        </div>

        <div
          className={`text-center p-4 rounded ${
            result.won
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          {result.won ? (
            <>
              <p className="text-2xl font-bold text-green-800 mb-2">
                🎉 Congratulations! You Won!
              </p>
              <p className="text-lg text-green-700">
                +{result.pointsChange} points earned
                (Bet: {result.bet})
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-red-800 mb-2">
                ❌ Better Luck Next Time
              </p>
              <p className="text-lg text-red-700">
                -{result.bet} points lost
              </p>
            </>
          )}
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Answer Review
        </h2>

        {result.questions.map((q, idx) => (
          <div
            key={q.id}
            className={`mb-6 p-4 rounded border-2 ${
              q.isCorrect
                ? "border-green-300 bg-green-50"
                : "border-red-300 bg-red-50"
            }`}
          >
            <div className="flex items-start gap-2 mb-3">
              <span
                className={`font-bold text-lg ${
                  q.isCorrect
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {q.isCorrect ? "✓" : "✗"}
              </span>
              <p className="font-medium text-gray-800">
                {idx + 1}. {q.question}
              </p>
            </div>

            <div className="ml-6 space-y-2">
              {q.options.map((opt, optIdx) => {
                const isCorrect =
                  optIdx === q.correctIndex;
                const isUser =
                  optIdx === q.userAnswer;

                return (
                  <div
                    key={optIdx}
                    className={`p-2 rounded ${
                      isCorrect
                        ? "bg-green-200 font-semibold"
                        : isUser
                        ? "bg-red-200"
                        : "bg-white"
                    }`}
                  >
                    {isCorrect && "✓ "}
                    {isUser && !isCorrect && "✗ "}
                    {opt}
                    {isCorrect && (
                      <span className="ml-2 text-sm text-green-700">
                        (Correct Answer)
                      </span>
                    )}
                    {isUser && !isCorrect && (
                      <span className="ml-2 text-sm text-red-700">
                        (Your Answer)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() =>
            router.push(
              `/quiz?subjectId=${subjectId}&week=${week}`
            )
          }
          className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700"
        >
          Retake Quiz
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

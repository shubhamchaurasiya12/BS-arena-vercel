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

  // Fetch Quiz Result
  useEffect(() => {
    if (!attemptId || !token) {
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/quiz/result/${attemptId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load results");

        setResult(data);

        if (data.won && data.pointsChange > 0 && user && !hasUpdatedUser.current) {
          hasUpdatedUser.current = true;
          const updatedUser = {
            ...user,
            total_points: user.total_points + data.pointsChange,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId, token, user, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(255,250,246)] flex items-center justify-center">
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[rgb(255,250,246)] flex items-center justify-center">
        <div className="bg-[rgb(225,220,213)] p-6 rounded-2xl shadow-xl border border-gray-200">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 bg-black text-white px-6 py-3 rounded-2xl shadow-md hover:bg-gray-900 w-full transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-[rgb(255,250,246)] p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Quiz Results
      </h1>
      <div className="mt-2 h-[1px] bg-gradient-to-r from-transparent via-[#003366]/20 to-transparent mb-6"></div>

      {/* Score Card */}
      <div className="bg-[rgb(225,220,213)] rounded-2xl shadow-xl border border-gray-200 p-6 mb-6 text-center">
        <div className={`text-6xl font-bold mb-2 ${result.won ? "text-green-600" : "text-red-600"}`}>
          {result.score}%
        </div>
        <p className="text-gray-700 text-xl mb-4">{result.correct} / {result.total} correct</p>

        <div className={`p-4 rounded-2xl ${result.won ? "bg-green-100" : "bg-red-100"}`}>
          {result.won ? (
            <>
              <p className="text-green-800 font-bold text-2xl mb-2">🎉 Congratulations! You Won!</p>
              <p className="text-green-700 text-lg">+{result.pointsChange} points earned (Bet: {result.bet})</p>
            </>
          ) : (
            <>
              <p className="text-red-800 font-bold text-2xl mb-2">❌ Better Luck Next Time</p>
              <p className="text-red-700 text-lg">-{result.bet} points lost</p>
            </>
          )}
        </div>
      </div>

      {/* Answer Review */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Answer Review</h2>
      <div className="mt-2 h-[1px] bg-gradient-to-r from-transparent via-[#003366]/20 to-transparent mb-6"></div>

      {result.questions.map((q, idx) => (
        <div
          key={q.id}
          className={`bg-[rgb(225,220,213)] rounded-2xl shadow-xl border border-gray-200 p-4 mb-4`}
        >
          <div className="flex items-start gap-2 mb-3">
            <span className={`font-bold text-lg ${q.isCorrect ? "text-green-600" : "text-red-600"}`}>
              {q.isCorrect ? "✓" : "✗"}
            </span>
            <p className="font-medium text-gray-800">{idx + 1}. {q.question}</p>
          </div>

          <div className="ml-6 space-y-2">
            {q.options.map((opt, optIdx) => {
              const isCorrect = optIdx === q.correctIndex;
              const isUser = optIdx === q.userAnswer;

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
                  {isCorrect && <span className="ml-2 text-sm text-green-700">(Correct Answer)</span>}
                  {isUser && !isCorrect && <span className="ml-2 text-sm text-red-700">(Your Answer)</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
        <button
          onClick={() => router.push(`/quiz?subjectId=${subjectId}&week=${week}`)}
          className="bg-black text-white px-8 py-3 rounded-2xl shadow-md hover:bg-gray-900 w-full md:w-auto transition-all duration-300"
        >
          Retake Quiz
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-black text-white px-8 py-3 rounded-2xl shadow-md hover:bg-gray-900 w-full md:w-auto transition-all duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MathText from "@/components/MathText";
import styles from "./quizresult.module.css";

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

// Main component that uses useSearchParams - wrapped in Suspense
function QuizResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const attemptId = searchParams.get("attemptId");
  const subjectId = searchParams.get("subjectId");
  const week = searchParams.get("week");
  const hasUpdatedUser = useRef(false);

  const { token, user, setUser, isLoading: authLoading } = useAuth();

  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to finish resolving
    if (authLoading) return;

    // No token after auth resolved → redirect with properly encoded callbackUrl
    if (!token) {
      const callbackUrl = encodeURIComponent(
        `/quiz-result?attemptId=${attemptId}&subjectId=${subjectId}&week=${week}`
      );
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    // No attemptId → show error
    if (!attemptId) {
      setError("No attempt ID provided");
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

        if (data.won && data.pointsChange > 0 && user && setUser && !hasUpdatedUser.current) {
          hasUpdatedUser.current = true;
          const updatedUser = {
            ...user,
            total_points: (user.total_points || 0) + data.pointsChange,
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
  }, [attemptId, token, authLoading]); // ← only deps that should re-trigger the fetch

  /* ── Auth loading ── */
  if (authLoading) {
    return (
      <div className={styles["qr-shell"]}>
        <div className={styles["qr-state-center"]}>
          <div className={styles["qr-spinner"]} />
          <p className={styles["qr-state-text"]}>Checking authentication…</p>
        </div>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className={styles["qr-shell"]}>
        <div className={styles["qr-state-center"]}>
          <div className={styles["qr-spinner"]} />
          <p className={styles["qr-state-text"]}>Loading results…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className={styles["qr-shell"]}>
        <div className={styles["qr-error-wrap"]}>
          <div className={styles["qr-error-icon"]}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className={styles["qr-error-title"]}>{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className={`${styles["qr-btn"]} ${styles["qr-btn--primary"]}`}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const scoreColor =
    result.score >= 70 ? "#16a34a" : result.score >= 40 ? "#003366" : "#dc2626";

  return (
    <div className={styles["qr-shell"]}>
      <div className={styles["qr-inner"]}>
        {/* ── Header ── */}
        <header className={`${styles["qr-header"]} ${styles["anim-1"]}`}>
          <div>
            <p className={styles["qr-label"]}>Week {week} · Results</p>
            <h1 className={styles["qr-heading"]}>
              Quiz <em>Results</em>
            </h1>
            <p className={styles["qr-subheading"]}>
              {result.correct} of {result.total} correct
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className={`${styles["qr-btn"]} ${styles["qr-btn--ghost"]}`}
          >
            Dashboard
          </button>
        </header>

        <div className={styles["qr-divider"]} />

        {/* ── Score card ── */}
        <div
          className={`${styles["qr-score-card"]} ${
            result.won ? styles["qr-score-card--won"] : styles["qr-score-card--lost"]
          } ${styles["anim-2"]}`}
        >
          <div className={styles["qr-score-num"]} style={{ color: scoreColor }}>
            {result.score}%
          </div>

          <div className={styles["qr-score-stats"]}>
            <div className={styles["qr-stat"]}>
              <span className={styles["qr-stat-value"]}>{result.correct}/{result.total}</span>
              <span className={styles["qr-stat-label"]}>Correct</span>
            </div>
            <div className={styles["qr-stat-divider"]} />
            <div className={styles["qr-stat"]}>
              <span className={styles["qr-stat-value"]}>{result.bet}</span>
              <span className={styles["qr-stat-label"]}>Bet (pts)</span>
            </div>
            <div className={styles["qr-stat-divider"]} />
            <div className={styles["qr-stat"]}>
              <span
                className={styles["qr-stat-value"]}
                style={{ color: result.won ? "#16a34a" : "#dc2626" }}
              >
                {result.won ? `+${result.pointsChange}` : `-${result.bet}`}
              </span>
              <span className={styles["qr-stat-label"]}>Points</span>
            </div>
          </div>

          <div
            className={`${styles["qr-result-banner"]} ${
              result.won ? styles["qr-result-banner--won"] : styles["qr-result-banner--lost"]
            }`}
          >
            <span className={styles["qr-result-banner__icon"]}>
              {result.won ? "🎉" : "📚"}
            </span>
            <div>
              <p className={styles["qr-result-banner__title"]}>
                {result.won ? "Congratulations! You Won!" : "Better Luck Next Time"}
              </p>
              <p className={styles["qr-result-banner__sub"]}>
                {result.won
                  ? `+${result.pointsChange} points earned from your ${result.bet}-point bet`
                  : `You lost your ${result.bet}-point bet. Review the answers below.`}
              </p>
            </div>
          </div>
        </div>

        {/* ── Questions ── */}
        <div className={`${styles["qr-section-header"]} ${styles["anim-3"]}`}>
          <span className={styles["qr-section-pip"]} />
          <h2 className={styles["qr-section-title"]}>Answer Review</h2>
        </div>

        <div className={`${styles["qr-questions"]} ${styles["anim-3"]}`}>
          {result.questions.map((q, idx) => (
            <div
              key={q.id}
              className={`${styles["qr-card"]} ${
                q.isCorrect ? styles["qr-card--correct"] : styles["qr-card--wrong"]
              }`}
            >
              <div className={styles["qr-q-header"]}>
                <span
                  className={`${styles["qr-q-badge"]} ${
                    q.isCorrect ? styles["qr-q-badge--correct"] : styles["qr-q-badge--wrong"]
                  }`}
                />
                <span className={styles["qr-q-num"]}>{idx + 1}</span>
                <div className={styles["qr-q-text"]}>
                  <MathText text={q.question} />
                </div>
              </div>

              <div className={styles["qr-options"]}>
                {q.options.map((opt, optIdx) => {
                  const isCorrect = optIdx === q.correctIndex;
                  const isUser = optIdx === q.userAnswer;
                  const isWrong = isUser && !isCorrect;

                  return (
                    <div
                      key={optIdx}
                      className={`${styles["qr-option"]} ${
                        isCorrect
                          ? styles["qr-option--correct"]
                          : isWrong
                          ? styles["qr-option--wrong"]
                          : ""
                      }`}
                    >
                      <span
                        className={`${styles["qr-option-dot"]} ${
                          isCorrect
                            ? styles["qr-option-dot--correct"]
                            : isWrong
                            ? styles["qr-option-dot--wrong"]
                            : styles["qr-option-dot--neutral"]
                        }`}
                      />
                      <span className={styles["qr-option-letter"]}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className={styles["qr-option-text"]}>
                        <MathText text={opt} />
                      </span>
                      {(isCorrect || isWrong) && (
                        <span
                          className={`${styles["qr-option-tag"]} ${
                            isCorrect
                              ? styles["qr-option-tag--correct"]
                              : styles["qr-option-tag--wrong"]
                          }`}
                        >
                          {isCorrect ? "Correct" : "Your answer"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Actions ── */}
        <div className={`${styles["qr-actions"]} ${styles["anim-3"]}`}>
          <button
            onClick={() => router.push(`/quiz?subjectId=${subjectId}&week=${week}`)}
            className={`${styles["qr-btn"]} ${styles["qr-btn--ghost"]}`}
          >
            Retake Quiz
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className={`${styles["qr-btn"]} ${styles["qr-btn--primary"]}`}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function QuizResultPage() {
  return (
    <Suspense fallback={
      <div className={styles["qr-shell"]}>
        <div className={styles["qr-state-center"]}>
          <div className={styles["qr-spinner"]} />
          <p className={styles["qr-state-text"]}>Loading results…</p>
        </div>
      </div>
    }>
      <QuizResultContent />
    </Suspense>
  );
}
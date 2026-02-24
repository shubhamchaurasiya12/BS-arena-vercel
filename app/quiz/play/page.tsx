// D:\BS-arena-NextJS\app\quiz\play\page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MathText from "@/components/MathText";
import s from "./quiz-play.module.css";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
};

export default function QuizPlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const subjectId = searchParams.get("subjectId");
  const bet       = searchParams.get("bet");
  const week      = searchParams.get("week");

  const [questions, setQuestions]   = useState<QuizQuestion[]>([]);
  const [answers, setAnswers]       = useState<Record<string, number>>({});
  const [attemptId, setAttemptId]   = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    if (!token || !subjectId || !bet) { setLoading(false); return; }

    async function start() {
      try {
        const startRes = await fetch("/api/quiz/start", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ quizId: subjectId, bet: Number(bet) }),
        });
        if (!startRes.ok) {
          const errData = await startRes.json();
          throw new Error(errData.message || "Failed to start quiz");
        }
        const { attemptId: newAttemptId } = await startRes.json();
        setAttemptId(newAttemptId);

        const qRes = await fetch(`/api/quiz/attempt/${newAttemptId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!qRes.ok) throw new Error("Failed to load questions");

        const data = await qRes.json();
        console.log("=== DEBUG START ===");
        console.log("Full API response:", data);
        console.log("Questions array:", data.questions);
        console.log("First question raw:", data.questions[0]);
        console.log("First question text:", data.questions[0]?.question);
        console.log("First option raw:", data.questions[0]?.options[0]);
        console.log("=== DEBUG END ===");
        setQuestions(data.questions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }

    start();
  }, [token, subjectId, bet]);

  const submit = async () => {
    if (!attemptId || !token) return;
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ attemptId, answers }),
      });
      if (!res.ok) throw new Error("Failed to submit quiz");
      router.push(`/quiz-result?attemptId=${attemptId}&subjectId=${subjectId}&week=${week}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit quiz");
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount    = questions.length;
  const progress      = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className={s.shell}>
        <div className={s.stateCenter}>
          <div className={s.spinner} />
          <p className={s.stateText}>Loading quiz…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className={s.shell}>
        <div className={s.errorWrap}>
          <div className={s.errorIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className={s.errorTitle}>{error}</p>
          <button onClick={() => router.push("/dashboard")} className={s.btnPrimary}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <div className={s.shell}>
      <div className={s.inner}>

        {/* ── Header ── */}
        <header className={`${s.header} ${s.anim1}`}>
          <div>
            <p className={s.label}>Week {week}</p>
            <h1 className={s.heading}>Quiz <em>Time</em></h1>
            <p className={s.subheading}>
              {answeredCount} of {totalCount} answered
            </p>
          </div>

          <div className={s.headerMeta}>
            <div className={s.betBadge}>
              <span className={s.betLabel}>Bet</span>
              <span className={s.betValue}>{bet} pts</span>
            </div>
          </div>
        </header>

        <div className={s.divider} />

        {/* ── Progress bar ── */}
        {totalCount > 0 && (
          <div className={`${s.progressWrap} ${s.anim2}`}>
            <div className={s.progressRow}>
              <span className={s.progressLabel}>Progress</span>
              <span className={s.progressPct}>{Math.round(progress)}%</span>
            </div>
            <div className={s.progressTrack}>
              <div className={s.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ── Questions ── */}
        <div className={`${s.questions} ${s.anim3}`}>
          {questions.map((q, idx) => (
            <div key={q.id} className={s.card}>

              {/* Question number + text */}
              <div className={s.qHeader}>
                <span className={s.qNum}>{idx + 1}</span>
                <div className={s.qText}>
                  <MathText text={q.question} />
                </div>
              </div>

              {/* Options */}
              <div className={s.options}>
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === i;
                  return (
                    <label
                      key={i}
                      className={`${s.option} ${selected ? s.optionSelected : ""}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={selected}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                        style={{ display: "none" }}
                      />
                      <span className={`${s.radio} ${selected ? s.radioSelected : ""}`}>
                        {selected && <span className={s.radioDot} />}
                      </span>
                      <span className={s.optionLetter}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={s.optionText}>
                        <MathText text={opt} />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Submit ── */}
        <div className={`${s.submitWrap} ${s.anim3}`}>
          {answeredCount < totalCount && (
            <p className={s.submitWarning}>
              {totalCount - answeredCount} question{totalCount - answeredCount !== 1 ? "s" : ""} unanswered
            </p>
          )}
          <button onClick={submit} className={s.btnSubmit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Submit Quiz
          </button>
        </div>

      </div>
    </div>
  );
}
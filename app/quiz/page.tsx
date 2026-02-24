// D:\BS-arena-NextJS\app\quiz\page.tsx
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BetPanel from "@/components/BetPanel";
import MathText from "@/components/MathText";
import s from "./quiz.module.css";

type Question = {
  id: string;
  question: string;
  options: string[];
};

// Main component that uses useSearchParams - wrapped in Suspense
function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get("subjectId");
  const week      = searchParams.get("week");

  const [quizId, setQuizId]                     = useState<string | null>(null);
  const [attemptId, setAttemptId]               = useState<string | null>(null);
  const [questions, setQuestions]               = useState<Question[]>([]);
  const [answers, setAnswers]                   = useState<Record<string, number>>({});
  const [remainingTime, setRemainingTime]       = useState<number | null>(null);
  const [betPlaced, setBetPlaced]               = useState(false);
  const [initializing, setInitializing]         = useState(true);
  const [loading, setLoading]                   = useState(false);
  const [submitting, setSubmitting]             = useState(false);
  const [timeUpSubmitting, setTimeUpSubmitting] = useState(false);
  const [error, setError]                       = useState<string | null>(null);

  const autoSubmitRef = useRef(false);
  const tabSwitchLock = useRef(false);

  function formatTime(seconds: number) {
    const hrs  = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2,"0")}:${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
    }
    return `${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
  }

  /* ── Recover existing attempt ── */
  useEffect(() => {
    const savedAttemptId = localStorage.getItem("quizAttemptId");
    if (!savedAttemptId) { setInitializing(false); return; }
    async function recover() {
      try {
        const res  = await fetch(`/api/quiz/attempt/${savedAttemptId}`, { credentials: "include" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAttemptId(data.attemptId);
        setQuestions(data.questions);
        setRemainingTime(data.quiz.remainingTime);
        setBetPlaced(true);
        const stored = localStorage.getItem(`quiz_answers_${savedAttemptId}`);
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

  /* ── Fetch quiz meta ── */
  useEffect(() => {
    if (initializing || attemptId || !subjectId || !week) return;
    async function fetchMeta() {
      try {
        setLoading(true);
        const res  = await fetch(`/api/quiz/meta?subjectId=${subjectId}&week=${week}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setQuizId(data.quizId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No quiz available");
      } finally {
        setLoading(false);
      }
    }
    fetchMeta();
  }, [initializing, attemptId, subjectId, week]);

  /* ── Auto-save answers ── */
  useEffect(() => {
    if (attemptId) localStorage.setItem(`quiz_answers_${attemptId}`, JSON.stringify(answers));
  }, [attemptId, answers]);

  /* ── Start quiz ── */
  async function startQuiz(bet: number) {
    if (!quizId) return;
    try {
      setLoading(true);
      const res  = await fetch("/api/quiz/start", {
        method: "POST", credentials: "include",
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

  /* ── Timer ── */
  useEffect(() => {
    if (remainingTime === null) return;
    const t = setInterval(() => setRemainingTime((v) => (v ? Math.max(v - 1, 0) : 0)), 1000);
    return () => clearInterval(t);
  }, [remainingTime]);

  /* ── Auto-submit on time up ── */
  useEffect(() => {
    if (remainingTime === 0 && attemptId && !autoSubmitRef.current) {
      autoSubmitRef.current = true;
      setTimeUpSubmitting(true);
      submitQuiz(true);
    }
  }, [remainingTime, attemptId]);

  /* ── Tab switch detection ── */
  useEffect(() => {
    if (!attemptId) return;
    async function onVisibilityChange() {
      if (document.visibilityState !== "hidden") return;
      if (tabSwitchLock.current) return;
      tabSwitchLock.current = true;
      try {
        const res  = await fetch("/api/quiz/tab-switch", {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId }),
        });
        const data = await res.json();
        if (data?.warning) alert(data.message);
        if (data?.status === "FAILED_CHEATING") {
          alert("❌ Quiz auto-submitted due to tab switching");
          autoSubmitRef.current = true;
          setTimeUpSubmitting(true);
          await submitQuiz(true);
        }
      } finally {
        setTimeout(() => { tabSwitchLock.current = false; }, 1000);
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [attemptId]);

  /* ── Submit quiz ── */
  async function submitQuiz(isAuto = false) {
    if (!attemptId || (submitting && !isAuto)) return;
    try {
      setSubmitting(true);
      await fetch("/api/quiz/submit", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, answers }),
      });
      await fetch("/api/quiz/apply-points", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });
      localStorage.removeItem("quizAttemptId");
      localStorage.removeItem(`quiz_answers_${attemptId}`);
      router.push(`/quiz-result?attemptId=${attemptId}&subjectId=${subjectId}&week=${week}`);
    } finally {
      setSubmitting(false);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const totalCount    = questions.length;
  const progress      = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
  const allAnswered   = answeredCount === totalCount && totalCount > 0;
  const timerUrgent   = remainingTime !== null && remainingTime <= 60;

  /* ── Early returns ── */
  if (!subjectId || !week) {
    return (
      <div className={s.shell}>
        <div className={s.stateCenter}>
          <p className={s.errorMsg}>Invalid quiz link. Please go back to your notes.</p>
        </div>
      </div>
    );
  }

  if (initializing || loading) {
    return (
      <div className={s.shell}>
        <div className={s.stateCenter}>
          <div className={s.spinner} />
          <p className={s.stateText}>{initializing ? "Recovering session…" : "Loading quiz…"}</p>
        </div>
      </div>
    );
  }

  if (error && !betPlaced) {
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

  /* ── Main render ── */
  return (
    <div className={s.shell}>
      {!betPlaced ? (
        /* ── Bet panel ── */
        <div className={s.inner}>
          <header className={`${s.header} ${s.anim1}`}>
            <div>
              <p className={s.label}>Week {week}</p>
              <h1 className={s.heading}>Place Your <em>Bet</em></h1>
              <p className={s.subheading}>Choose how many points to wager before starting</p>
            </div>
          </header>
          <div className={s.divider} />
          <BetPanel onConfirm={startQuiz} />
        </div>
      ) : (
        /* ── Active quiz ── */
        <div className={s.inner}>

          {/* ── Sticky header bar ── */}
          <div className={`${s.stickyBar} ${s.anim1}`}>
            <div className={s.stickyLeft}>
              <p className={s.label} style={{ marginBottom: 0 }}>Week {week}</p>
              <h1 className={s.heading} style={{ fontSize: "1.4rem", margin: 0 }}>
                Quiz <em>Active</em>
              </h1>
            </div>

            <div className={s.stickyRight}>
              <div className={s.progressPill}>
                <span className={s.progressPillText}>{answeredCount}/{totalCount}</span>
              </div>

              {remainingTime !== null && (
                <div className={`${s.timer} ${timerUrgent ? s.timerUrgent : ""}`}>
                  {timeUpSubmitting ? (
                    <span style={{ fontSize: 12 }}>Submitting…</span>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {formatTime(remainingTime)}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div className={`${s.progressWrap} ${s.anim2}`}>
            <div className={s.progressTrack}>
              <div className={s.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* ── Questions ── */}
          <div className={`${s.questions} ${s.anim3}`}>
            {questions.map((q, i) => (
              <div key={q.id} className={s.card}>
                <div className={s.qHeader}>
                  <span className={s.qNum}>{i + 1}</span>
                  <div className={s.qText}>
                    <MathText text={q.question} />
                  </div>
                </div>

                <div className={s.options}>
                  {q.options.map((opt, idx) => {
                    const selected = answers[q.id] === idx;
                    return (
                      <label key={idx} className={`${s.option} ${selected ? s.optionSelected : ""}`}>
                        <input
                          type="radio"
                          name={q.id}
                          checked={selected}
                          onChange={() => setAnswers({ ...answers, [q.id]: idx })}
                          style={{ display: "none" }}
                        />
                        <span className={`${s.radio} ${selected ? s.radioSelected : ""}`}>
                          {selected && <span className={s.radioDot} />}
                        </span>
                        <span className={s.optionLetter}>{String.fromCharCode(65 + idx)}</span>
                        <span className={s.optionText}><MathText text={opt} /></span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── Submit ── */}
          <div className={`${s.submitWrap} ${s.anim3}`}>
            {!allAnswered && (
              <p className={s.submitWarning}>
                {totalCount - answeredCount} question{totalCount - answeredCount !== 1 ? "s" : ""} still unanswered
              </p>
            )}
            <button
              onClick={() => submitQuiz(false)}
              disabled={submitting || remainingTime === 0 || !allAnswered}
              className={s.btnSubmit}
            >
              {submitting ? (
                <>
                  <div className={s.btnSpinner} />
                  Submitting…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Submit Quiz
                </>
              )}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

// Main page component with Suspense boundary
export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className={s.shell}>
        <div className={s.stateCenter}>
          <div className={s.spinner} />
          <p className={s.stateText}>Loading quiz…</p>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
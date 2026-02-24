//D:\BS-arena-NextJS\app\history\page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dock from "../components/Dock";

type QuizAttempt = {
  attemptId: string;
  quizId: string;
  subjectName: string;
  subjectId: string;
  week: number;
  score: number;
  accuracy: number;
  betStatus: string;
  bet: number;
  startTime: string;
  status: string;
};

type SubjectHistory = {
  subjectId: string;
  subjectName: string;
  attempts: QuizAttempt[];
};

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<SubjectHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/quiz/history", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch quiz history");
        const data = await res.json();
        setHistory(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load history");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ── Loading ──
  if (loading) {
    return (
      <main className="page-root">
        <div className="page-inner page-inner--narrow">
          <div className="loading-wrap">
            <div className="loading-spinner" />
            <p className="loading-text">Loading quiz history…</p>
          </div>
        </div>
      </main>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <main className="page-root">
        <div className="page-inner page-inner--narrow">
          <div className="banner banner--error" style={{ flexDirection: "column", alignItems: "flex-start", gap: "14px" }}>
            <span>{error}</span>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn--primary"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Empty ──
  if (history.length === 0) {
    return (
      <main className="page-root">
        <div className="page-inner page-inner--narrow">
          <header className="page-header anim-1">
            <div>
              <p className="page-label">Quiz History</p>
              <h1 className="page-heading">Your <em>attempts</em></h1>
              <p className="page-subheading">Review past quizzes and track your progress</p>
            </div>
          </header>
          <div className="page-divider" />

          <div className="card anim-2" style={{ textAlign: "center", padding: "52px 28px", maxWidth: 480, margin: "0 auto" }}>
            <div style={{
              width: 64, height: 64,
              background: "var(--navy-light)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px",
              margin: "0 auto 20px"
            }}>📚</div>
            <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.3rem", color: "var(--ink)", marginBottom: "8px" }}>
              No attempts yet
            </p>
            <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "28px", lineHeight: 1.6 }}>
              Start taking quizzes to see your history and track your progress here.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn--primary btn--lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Dock />
      </main>
    );
  }

  // ── Main ──
  return (
    <main className="page-root">
      <div className="page-inner" style={{ maxWidth: 1280 }}>

        {/* ── Header ── */}
        <header className="page-header anim-1">
          <div>
            <p className="page-label">Quiz History</p>
            <h1 className="page-heading">Your <em>attempts</em></h1>
            <p className="page-subheading">Review past quizzes and track your performance</p>
          </div>
        </header>
        <div className="page-divider" />

        {/* ── Subject Sections ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {history.map((subject, si) => (
            <section key={subject.subjectId} className={`anim-${Math.min(si + 2, 5)}`}>

              {/* Subject heading row */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "8px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="card-title-pip" />
                  <h2 style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)",
                    fontWeight: 400,
                    color: "var(--ink)",
                    margin: 0,
                  }}>
                    {subject.subjectName}
                  </h2>
                </div>
                <span className="pill pill--count">{subject.attempts.length} attempt{subject.attempts.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Attempts grid */}
              <div className="history-grid">
                {subject.attempts.map((attempt) => {
                  const won = attempt.betStatus === "Won Bet";
                  const scorePercent = (attempt.score / 10) * 100;

                  return (
                    <div key={attempt.attemptId} className="attempt-card">

                      {/* Card top row */}
                      <div className="attempt-card__header">
                        <div>
                          <p className="info-label">Week</p>
                          <p style={{
                            fontFamily: "'Instrument Serif', serif",
                            fontSize: "1.6rem",
                            fontWeight: 400,
                            color: "var(--navy-mid)",
                            lineHeight: 1,
                          }}>
                            {attempt.week}
                          </p>
                        </div>
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "6px"
                        }}>
                          <span style={{
                            background: "var(--navy)",
                            color: "#fff",
                            padding: "3px 10px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                          }}>
                            {subject.subjectName.substring(0, 3).toUpperCase()}
                          </span>
                          <span className={`pill ${won ? "pill--active" : "pill--inactive"}`}>
                            <span className="pill__dot" />
                            {won ? "Won" : "Lost"}
                          </span>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="attempt-card__stats">
                        <div className="attempt-stat">
                          <p style={{
                            fontFamily: "'Instrument Serif', serif",
                            fontSize: "1.5rem",
                            fontWeight: 400,
                            color: "var(--navy-mid)",
                            lineHeight: 1,
                            marginBottom: "4px",
                          }}>
                            {attempt.score}<span style={{ fontSize: "0.9rem", color: "var(--subtle)" }}>/10</span>
                          </p>
                          <p className="info-label">Score</p>
                        </div>

                        <div className="attempt-stat">
                          <p style={{
                            fontFamily: "'Instrument Serif', serif",
                            fontSize: "1.5rem",
                            fontWeight: 400,
                            color: "var(--navy-mid)",
                            lineHeight: 1,
                            marginBottom: "4px",
                          }}>
                            {attempt.accuracy}<span style={{ fontSize: "0.9rem", color: "var(--subtle)" }}>%</span>
                          </p>
                          <p className="info-label">Accuracy</p>
                        </div>

                        <div className="attempt-stat">
                          <p style={{
                            fontFamily: "'Instrument Serif', serif",
                            fontSize: "1.5rem",
                            fontWeight: 400,
                            color: won ? "#16a34a" : "var(--danger)",
                            lineHeight: 1,
                            marginBottom: "4px",
                          }}>
                            {attempt.bet}
                          </p>
                          <p className="info-label">Bet</p>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div style={{ marginBottom: "16px" }}>
                        <div className="contrib__track">
                          <div
                            className="contrib__fill"
                            style={{
                              width: `${scorePercent}%`,
                              background: scorePercent >= 70
                                ? "linear-gradient(90deg, #5ca176, #6da080)"
                                : scorePercent >= 40
                                ? "linear-gradient(90deg, var(--navy-mid), #0a5299)"
                                : "linear-gradient(90deg, #dc2626, #ef4444)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Date */}
                      <p style={{ fontSize: "11px", color: "var(--subtle)", marginBottom: "16px", letterSpacing: "0.02em" }}>
                        {formatDate(attempt.startTime)}
                      </p>

                      {/* CTA */}
                      <button
                        onClick={() =>
                          router.push(
                            `/quiz-result?attemptId=${attempt.attemptId}&subjectId=${attempt.subjectId}&week=${attempt.week}`
                          )
                        }
                        className="btn btn--primary btn--full"
                        style={{ fontSize: "13px", padding: "10px 16px" }}
                      >
                        View Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

      </div>

      <Dock />
    </main>
  );
}
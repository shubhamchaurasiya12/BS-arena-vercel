//D:\BS-arena-NextJS\app\leaderboard\page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dock from "../components/Dock";

type LeaderboardEntry = {
  id: string;
  name: string;
  type: "student" | "group";
  total_points: number;
  active_subject_count: number | null;
  total_members: number | null;
  leaderboard_points: number;
  position: number;
  isCurrentUser: boolean;
};

const MEDALS: Record<number, { emoji: string; label: string; accent: string; glow: string }> = {
  1: { emoji: "🥇", label: "1st",  accent: "#c9a84c", glow: "rgba(201,168,76,0.22)" },
  2: { emoji: "🥈", label: "2nd",  accent: "#9ca3af", glow: "rgba(156,163,175,0.2)"  },
  3: { emoji: "🥉", label: "3rd",  accent: "#c87941", glow: "rgba(200,121,65,0.2)"  },
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard", { credentials: "include", cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        setLeaderboard(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  // ── Loading ──
  if (loading) {
    return (
      <main className="page-root">
        <div className="page-inner" style={{ maxWidth: 760 }}>
          <div className="loading-wrap">
            <div className="loading-spinner" />
            <p className="loading-text">Loading leaderboard…</p>
          </div>
        </div>
      </main>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <main className="page-root">
        <div className="page-inner" style={{ maxWidth: 760 }}>
          <div className="banner banner--error" style={{ flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
            <span>{error}</span>
            <button onClick={() => router.push("/dashboard")} className="btn btn--primary">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  const podium = leaderboard.filter((e) => e.position <= 3);
  const rest   = leaderboard.filter((e) => e.position > 3);

  return (
    <main className="page-root">
      <div className="page-inner anim-1" style={{ maxWidth: 760 }}>

        {/* ── Header ── */}
        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <p className="page-label" style={{ justifyContent: "center", display: "flex" }}>Rankings</p>
          <h1 className="page-heading" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            The <em>Leaderboard</em>
          </h1>
          <p className="page-subheading">Ranked by average performance across all quizzes</p>
        </header>

        <div className="page-divider" />

        {/* ── Podium (top 3) ── */}
        {podium.length > 0 && (
          <div className="anim-2">

            {/* ── DESKTOP: classic 2·1·3 side-by-side podium ── */}
            <div className="podium-desktop">
              {[
                podium.find((e) => e.position === 2),
                podium.find((e) => e.position === 1),
                podium.find((e) => e.position === 3),
              ]
                .filter(Boolean)
                .map((entry) => {
                  if (!entry) return null;
                  const medal = MEDALS[entry.position];
                  return (
                    <div key={entry.id} className={`podium-col podium-col--${entry.position}`}>
                      <div
                        className={`podium-card podium-card--${entry.position} ${entry.isCurrentUser ? "podium-card--you" : ""}`}
                        style={{ boxShadow: entry.isCurrentUser ? undefined : `0 0 0 ${entry.position === 1 ? "2px" : "1.5px"} ${medal.accent}55, 0 16px 48px ${medal.glow}` }}
                      >
                        <span className="podium-emoji">{medal.emoji}</span>
                        <div className="podium-avatar" style={{ background: `linear-gradient(145deg, ${medal.accent}, ${medal.accent}99)` }}>
                          {entry.name[0]}
                          {entry.type === "group" && (
                            <span style={{ position: "absolute", bottom: -4, right: -4, fontSize: 12, background: "var(--navy)", borderRadius: 4, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>👥</span>
                          )}
                        </div>
                        <p className="podium-name">{entry.name}</p>
                        {entry.isCurrentUser && <span className="pill pill--member" style={{ margin: "4px auto 0" }}>You</span>}
                        <p className="podium-score">{entry.leaderboard_points.toFixed(2)}</p>
                        <p className="podium-score-label">Avg Performance</p>
                        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--subtle)" }}>
                            <span>Points</span><span style={{ fontWeight: 600, color: "var(--ink)" }}>{entry.total_points}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--subtle)" }}>
                            {entry.type === "student"
                              ? <><span>Subjects</span><span style={{ fontWeight: 600, color: "var(--ink)" }}>{entry.active_subject_count}</span></>
                              : <><span>Members</span><span style={{ fontWeight: 600, color: "var(--ink)" }}>{entry.total_members}/4</span></>
                            }
                          </div>
                        </div>
                      </div>
                      <div
                        className={`podium-plinth podium-plinth--${entry.position}`}
                        style={{ background: `linear-gradient(to bottom, ${medal.accent}22, ${medal.accent}08)` }}
                      />
                    </div>
                  );
                })}
            </div>

            {/* ── MOBILE: ranked 1·2·3 stacked rows ── */}
            <div className="podium-mobile">
              {[1, 2, 3].map((pos) => {
                const entry = podium.find((e) => e.position === pos);
                if (!entry) return null;
                const medal = MEDALS[entry.position];
                return (
                  <div
                    key={entry.id}
                    className={`podium-card podium-card--${entry.position} ${entry.isCurrentUser ? "podium-card--you" : ""}`}
                    style={{ boxShadow: entry.isCurrentUser ? undefined : `0 0 0 1.5px ${medal.accent}55, 0 8px 24px ${medal.glow}` }}
                  >
                    {/* Left: medal + avatar */}
                    <div className="podium-card-left">
                      <span className="podium-emoji">{medal.emoji}</span>
                      <div className="podium-avatar" style={{ background: `linear-gradient(145deg, ${medal.accent}, ${medal.accent}99)` }}>
                        {entry.name[0]}
                      </div>
                    </div>

                    {/* Body: name + meta */}
                    <div className="podium-card-body">
                      <p className="podium-name">
                        {entry.name}
                        {entry.isCurrentUser && <span className="pill pill--member" style={{ marginLeft: 6, fontSize: 10 }}>You</span>}
                      </p>
                      <div className="podium-meta">
                        <span style={{ fontSize: 11, color: "var(--subtle)" }}>
                          Points: <strong style={{ color: "var(--ink)" }}>{entry.total_points}</strong>
                        </span>
                        <span style={{ fontSize: 11, color: "var(--subtle)" }}>
                          {entry.type === "student"
                            ? <>Subjects: <strong style={{ color: "var(--ink)" }}>{entry.active_subject_count}</strong></>
                            : <>Members: <strong style={{ color: "var(--ink)" }}>{entry.total_members}/4</strong></>
                          }
                        </span>
                      </div>
                    </div>

                    {/* Right: score */}
                    <div className="podium-score-right">
                      <p className="podium-score">{entry.leaderboard_points.toFixed(2)}</p>
                      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--subtle)", textAlign: "right" }}>Avg Perf.</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ── Rest of leaderboard ── */}
        {rest.length > 0 && (
          <div className="anim-3">
            <div className="section-label">
              <span className="card-title-pip" />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
                All Rankings
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rest.map((entry) => (
                <div
                  key={entry.id}
                  className={`lb-entry ${entry.isCurrentUser ? "lb-entry--you" : ""}`}
                >
                  <span className="lb-entry__rank">{entry.position}</span>

                  <div className={`lb-entry__avatar ${entry.type === "group" ? "lb-entry__avatar--group" : ""}`}>
                    {entry.name[0]}
                  </div>

                  <div className="lb-entry__body">
                    <div className="lb-entry__name">
                      {entry.name}
                      {entry.type === "group" && (
                        <span className="pill pill--member" style={{ fontSize: 10, padding: "1px 7px" }}>Group</span>
                      )}
                      {entry.isCurrentUser && (
                        <span className="pill pill--active" style={{ fontSize: 10, padding: "1px 7px" }}>You</span>
                      )}
                    </div>
                    <div className="lb-entry__meta">
                      <span>Points: <strong style={{ color: "var(--ink)" }}>{entry.total_points}</strong></span>
                      {entry.type === "student"
                        ? <span>Subjects: <strong style={{ color: "var(--ink)" }}>{entry.active_subject_count}</strong></span>
                        : <span>Members: <strong style={{ color: "var(--ink)" }}>{entry.total_members}/4</strong></span>
                      }
                    </div>
                  </div>

                  <div className="lb-entry__score-wrap">
                    <div className="lb-entry__score">{entry.leaderboard_points.toFixed(2)}</div>
                    <div className="lb-entry__score-label">Avg Perf.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Back button ── */}
        <div className="anim-4" style={{ marginTop: 32 }}>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn btn--ghost btn--full btn--lg"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Dashboard
          </button>
        </div>

      </div>

      <Dock />
    </main>
  );
}
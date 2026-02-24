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

/* Narrow medal keys strictly */
type MedalPosition = 1 | 2 | 3;

const MEDALS: Record<MedalPosition, { emoji: string; label: string; accent: string; glow: string }> = {
  1: { emoji: "🥇", label: "1st", accent: "#c9a84c", glow: "rgba(201,168,76,0.22)" },
  2: { emoji: "🥈", label: "2nd", accent: "#9ca3af", glow: "rgba(156,163,175,0.2)" },
  3: { emoji: "🥉", label: "3rd", accent: "#c87941", glow: "rgba(200,121,65,0.2)" },
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard", {
          credentials: "include",
          cache: "no-store",
        });

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

  if (error) {
    return (
      <main className="page-root">
        <div className="page-inner" style={{ maxWidth: 760 }}>
          <div
            className="banner banner--error"
            style={{ flexDirection: "column", alignItems: "flex-start", gap: 14 }}
          >
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

  const podium = leaderboard.filter((e) => e.position <= 3);
  const rest = leaderboard.filter((e) => e.position > 3);

  return (
    <main className="page-root">
      <div className="page-inner anim-1" style={{ maxWidth: 760 }}>

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <p className="page-label" style={{ justifyContent: "center", display: "flex" }}>
            Rankings
          </p>
          <h1 className="page-heading" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            The <em>Leaderboard</em>
          </h1>
          <p className="page-subheading">
            Ranked by average performance across all quizzes
          </p>
        </header>

        <div className="page-divider" />

        {/* Podium */}
        {podium.length > 0 && (
          <div className="anim-2">

            {/* Desktop podium */}
            <div className="podium-desktop">
              {[2, 1, 3].map((pos) => {
                const entry = podium.find((e) => e.position === pos);
                if (!entry) return null;

                const medal = MEDALS[pos as MedalPosition];

                return (
                  <div key={entry.id} className={`podium-col podium-col--${pos}`}>
                    <div
                      className={`podium-card podium-card--${pos} ${entry.isCurrentUser ? "podium-card--you" : ""}`}
                      style={{
                        boxShadow: entry.isCurrentUser
                          ? undefined
                          : `0 0 0 ${pos === 1 ? "2px" : "1.5px"} ${medal.accent}55, 0 16px 48px ${medal.glow}`,
                      }}
                    >
                      <span className="podium-emoji">{medal.emoji}</span>

                      <div
                        className="podium-avatar"
                        style={{
                          background: `linear-gradient(145deg, ${medal.accent}, ${medal.accent}99)`,
                        }}
                      >
                        {entry.name[0]}
                      </div>

                      <p className="podium-name">{entry.name}</p>

                      {entry.isCurrentUser && (
                        <span className="pill pill--member" style={{ margin: "4px auto 0" }}>
                          You
                        </span>
                      )}

                      <p className="podium-score">
                        {entry.leaderboard_points.toFixed(2)}
                      </p>
                      <p className="podium-score-label">Avg Performance</p>
                    </div>

                    <div
                      className={`podium-plinth podium-plinth--${pos}`}
                      style={{
                        background: `linear-gradient(to bottom, ${medal.accent}22, ${medal.accent}08)`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Mobile podium */}
            <div className="podium-mobile">
              {[1, 2, 3].map((pos) => {
                const entry = podium.find((e) => e.position === pos);
                if (!entry) return null;

                const medal = MEDALS[pos as MedalPosition];

                return (
                  <div
                    key={entry.id}
                    className={`podium-card podium-card--${pos} ${entry.isCurrentUser ? "podium-card--you" : ""}`}
                    style={{
                      boxShadow: entry.isCurrentUser
                        ? undefined
                        : `0 0 0 1.5px ${medal.accent}55, 0 8px 24px ${medal.glow}`,
                    }}
                  >
                    <span className="podium-emoji">{medal.emoji}</span>
                    <div
                      className="podium-avatar"
                      style={{
                        background: `linear-gradient(145deg, ${medal.accent}, ${medal.accent}99)`,
                      }}
                    >
                      {entry.name[0]}
                    </div>

                    <div className="podium-score-right">
                      <p className="podium-score">
                        {entry.leaderboard_points.toFixed(2)}
                      </p>
                      <p className="podium-score-label">Avg Perf.</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div className="anim-3">
            {rest.map((entry) => (
              <div
                key={entry.id}
                className={`lb-entry ${entry.isCurrentUser ? "lb-entry--you" : ""}`}
              >
                <span className="lb-entry__rank">{entry.position}</span>
                <div className="lb-entry__avatar">{entry.name[0]}</div>

                <div className="lb-entry__body">
                  <div className="lb-entry__name">{entry.name}</div>
                  <div className="lb-entry__meta">
                    <span>
                      Points: <strong>{entry.total_points}</strong>
                    </span>
                  </div>
                </div>

                <div className="lb-entry__score-wrap">
                  <div className="lb-entry__score">
                    {entry.leaderboard_points.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back */}
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn btn--ghost btn--full btn--lg"
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>

      <Dock />
    </main>
  );
}
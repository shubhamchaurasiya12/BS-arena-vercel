// D:\BS-arena-NextJS\app\groups\page.tsx
"use client";

import { useEffect, useState } from "react";
import Dock from "../components/Dock";

type Member = {
  user_id: string;
  role: "admin" | "member";
  name: string;
  total_points: number;
  active_subject_count: number;
  leaderboard_point: number;
};

type GroupData = {
  group: {
    id: string;
    name: string;
    invite_code: string;
    is_active: boolean;
  } | null;
  stats: {
    total_points: number;
    total_leaderboard_points: number;
    total_members: number;
  } | null;
  members: Member[];
  myRole: "admin" | "member";
};

export default function GroupsPage() {
  const [data, setData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);

  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/groups/my")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  const handleCreate = async () => {
    setError("");
    const res = await fetch("/api/groups/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName }),
    });
    const result = await res.json();
    if (!res.ok) { setError(result.message || "Failed to create group"); return; }
    window.location.reload();
  };

  const handleJoin = async () => {
    setError("");
    const res = await fetch("/api/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode }),
    });
    const result = await res.json();
    if (!res.ok) { setError(result.message || "Failed to join group"); return; }
    window.location.reload();
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="page-root">
        <div className="page-inner page-inner--narrow">
          <div className="loading-wrap">
            <div className="loading-spinner" />
            <p className="loading-text">Loading your group…</p>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // IF USER NOT IN GROUP
  // =========================
  if (!data?.group) {
    return (
      <main className="page-root">
        <div className="page-inner page-inner--narrow">

          <header className="page-header anim-1" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div>
              <p className="page-label">Groups</p>
              <h1 className="page-heading">
                Join or <em>create</em> a group
              </h1>
              <p className="page-subheading">
                Collaborate with up to 4 members and compete on the leaderboard
              </p>
            </div>
          </header>

          <div className="page-divider" />

          {error && (
            <div className="banner banner--error anim-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className="form-grid anim-2">
            {/* Create Group */}
            <div className="form-card">
              <div className="form-card-icon form-card-icon--create">🏫</div>
              <h2 className="form-card-title">Create a Group</h2>
              <p className="form-card-desc">Start a new group and invite your classmates with a code.</p>

              <input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="input"
                style={{ marginBottom: '14px' }}
              />

              <button onClick={handleCreate} className="btn btn--primary btn--full btn--lg">
                Create Group
              </button>
            </div>

            {/* Join Group */}
            <div className="form-card">
              <div className="form-card-icon form-card-icon--join">🔑</div>
              <h2 className="form-card-title">Join a Group</h2>
              <p className="form-card-desc">Have an invite code? Enter it below to join your group.</p>

              <input
                type="text"
                placeholder="Enter invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="input"
                style={{ marginBottom: '14px' }}
              />

              <button onClick={handleJoin} className="btn btn--gold btn--full btn--lg">
                Join Group
              </button>
            </div>
          </div>
        </div>

        <Dock />
      </main>
    );
  }

  // =========================
  // IF USER IS IN GROUP
  // =========================
  const { group, stats, members, myRole } = data;

  const groupLeaderboardPoint =
    stats!.total_members > 0
      ? stats!.total_leaderboard_points / stats!.total_members
      : 0;

  const sortedMembers = [...members].sort(
    (a, b) => b.leaderboard_point - a.leaderboard_point
  );

  return (
    <main className="page-root">
      <div className="page-inner page-inner--narrow">

        {/* ── Header ── */}
        <header className="page-header anim-1" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <p className="page-label">Groups</p>
            <h1 className="page-heading">
              <em>{group.name}</em>
            </h1>
            <p className="page-subheading">
              Your study group overview and member performance
            </p>
          </div>
        </header>

        <div className="page-divider" />

        {/* ================= SECTION 1: GROUP CARD ================= */}
        <div className="card anim-2" style={{ marginBottom: '24px' }}>
          <div className="card-title">
            <span className="card-title-pip" />
            Group Overview
          </div>

          <div className="stats-grid">
            <div>
              <p className="info-label">Total Points</p>
              <p className="info-value info-value--large">{stats?.total_points}</p>
            </div>

            <div>
              <p className="info-label">Avg Leaderboard Pts</p>
              <p className="info-value info-value--large">{groupLeaderboardPoint.toFixed(2)}</p>
            </div>

            <div>
              <p className="info-label">Members</p>
              <p className="info-value">
                <span className="info-value--large">{stats?.total_members}</span>
                <span style={{ color: 'var(--subtle)', fontSize: '14px', fontWeight: 400 }}>/4</span>
              </p>
            </div>

            <div>
              <p className="info-label">Status</p>
              <div className={`pill ${group.is_active ? "pill--active" : "pill--inactive"}`}>
                <span className="pill__dot" />
                {group.is_active ? "Active" : "Incomplete"}
              </div>
            </div>
          </div>

          {/* Admin controls */}
          {myRole === "admin" && (
            <div className="admin-row">
              <div className="admin-row-label">
                <p className="info-label">Invite Code</p>
                <span className="invite-code">{group.invite_code}</span>
              </div>

              <button
                onClick={async () => {
                  await fetch("/api/groups/delete", { method: "POST" });
                  window.location.reload();
                }}
                className="btn btn--danger"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Delete Group
              </button>
            </div>
          )}

          {myRole === "member" && (
            <div style={{ marginTop: '22px', paddingTop: '22px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <button
                onClick={async () => {
                  await fetch("/api/groups/exit", { method: "POST" });
                  window.location.reload();
                }}
                className="btn btn--danger"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Exit Group
              </button>
            </div>
          )}
        </div>

        {/* ================= MINI LEADERBOARD ================= */}
        <div className="card anim-3" style={{ marginBottom: '24px' }}>
          <div className="card-title">
            <span className="card-title-pip" />
            Mini Leaderboard
          </div>

          <div className="lb-list">
            {sortedMembers.map((m, index) => (
              <div key={m.user_id} className="lb-row">
                <span className={`lb-row__rank ${index === 0 ? "lb-row__rank--top" : ""}`}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                </span>
                <span className="lb-row__name">{m.name}</span>
                <span className="lb-row__score">{m.leaderboard_point.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= MEMBER CARDS ================= */}
        <div className="card anim-4">
          <div className="card-title">
            <span className="card-title-pip" />
            Members
            <span className="subjects-count" style={{ marginLeft: 'auto', textTransform: 'none', letterSpacing: 0 }}>
              {members.length} of 4
            </span>
          </div>

          <div className="members-grid">
            {sortedMembers.map((m) => {
              const totalLP = stats?.total_leaderboard_points ?? 0;
              const rawContribution = totalLP > 0 ? (m.leaderboard_point / totalLP) * 100 : 0;
              const contribution = Math.min(Math.max(rawContribution, 0), 100);

              return (
                <div key={m.user_id} className="member-card">
                  <div className="member-card-header">
                    <div className="avatar avatar--md">
                      {m.name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="member-name">{m.name}</p>
                      <span className={`pill ${m.role === "admin" ? "pill--admin" : "pill--member"}`}>
                        {m.role === "admin" ? "★ Admin" : "Member"}
                      </span>
                    </div>
                  </div>

                  <div className="member-stats">
                    <div>
                      <p className="member-stat-label">LB Pts</p>
                      <p className="member-stat-value">{m.leaderboard_point.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="member-stat-label">Points</p>
                      <p className="member-stat-value">{m.total_points}</p>
                    </div>
                    <div>
                      <p className="member-stat-label">Subjects</p>
                      <p className="member-stat-value">{m.active_subject_count}</p>
                    </div>
                  </div>

                  <div className="contrib">
                    <div className="contrib__header">
                      <span className="contrib__label">Contribution</span>
                      <span className="contrib__pct">{contribution.toFixed(1)}%</span>
                    </div>
                    <div className="contrib__track">
                      <div className="contrib__fill" style={{ width: `${contribution}%` }} />
                    </div>
                  </div>

                  {myRole === "admin" && m.role !== "admin" && (
                    <div style={{ marginTop: '14px' }}>
                      <button
                        onClick={async () => {
                          await fetch("/api/groups/remove", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userIdToRemove: m.user_id }),
                          });
                          window.location.reload();
                        }}
                        className="btn btn--danger-sm"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="23" y2="14"/><line x1="23" y1="8" x2="17" y2="14"/>
                        </svg>
                        Remove Member
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dock />
    </main>
  );
}
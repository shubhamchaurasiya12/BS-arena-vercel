// app/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import DeleteSubjectButton from "@/components/DeleteSubjectButton";
import AuthUserSync from "@/components/AuthUserSync";
import VideoTools from "../components/VideoTools";
import Dock from "../components/Dock";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

type DashboardData = {
  user?: {
    id: string;
    name: string;
    email: string;
    total_points: number;
    active_subject_count: number;
  };
  subjects?: {
    subject_id: string;
    subjects: { name: string };
  }[];
  group?: {
    id: string;
    name: string;
    invite_code: string;
    is_active: boolean;
    total_points: number;
    total_members: number;
    group_average_lp: number;
  } | null;
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) redirect("/login");

  const { data: user } = await supabase
    .from("users")
    .select("id, name, email, total_points, active_subject_count")
    .eq("email", session.user.email)
    .maybeSingle();

  if (!user) redirect("/login");

  const { data: subjects } = await supabase
    .from("user_subjects")
    .select("subject_id, subjects(name)")
    .eq("user_id", user.id);

  /* ===============================
     FETCH GROUP DATA
  =============================== */

  const { data: membership } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let groupData = null;

  if (membership) {
    const { data: group } = await supabase
      .from("groups")
      .select("id, name, invite_code, is_active")
      .eq("id", membership.group_id)
      .single();

    const { data: stats } = await supabase
      .from("group_stats")
      .select("total_points, total_leaderboard_points, total_members")
      .eq("group_id", membership.group_id)
      .single();

    if (group && stats) {
      const groupAverageLP =
        stats.total_members > 0
          ? stats.total_leaderboard_points / stats.total_members
          : 0;

      groupData = {
        id: group.id,
        name: group.name,
        invite_code: group.invite_code,
        is_active: group.is_active,
        total_points: stats.total_points,
        total_members: stats.total_members,
        group_average_lp: groupAverageLP,
      };
    }
  }

  const data: DashboardData = {
    user,
    subjects: subjects || [],
    group: groupData,
  };

  const quizzesWon = 0;

  return (
    <main className="page-root">
      <div className="page-inner">
        {data.user && <AuthUserSync user={data.user} />}

        {/* ================= HEADER ================= */}
        <header className="page-header anim-1">
          <div>
            <p className="page-label">Dashboard</p>
            <h1 className="page-heading">
              Welcome back,{" "}
              <em>{data.user?.name || "Student"}</em>
            </h1>
            <p className="page-subheading">
              Track your progress and manage your subjects
            </p>
          </div>

          <div className="page-header-actions">
            <Link href="/groups">
              <button className="btn btn--primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                WhatsApp Community
              </button>
            </Link>
            <Link href="/rate-app">
              <button className="btn btn--ghost">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Rate App
              </button>
            </Link>
          </div>
        </header>

        <div className="page-divider" />

        {/* ================= MAIN GRID ================= */}
        <div className="dashboard-grid">

          {/* ================= LEFT SIDE ================= */}
          <div className="dashboard-left">

            {/* ===== STUDENT CARD ===== */}
            <div className="card anim-2">
              <div className="card-title">
                <span className="card-title-pip" />
                Student Card
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {/* Avatar uses global .avatar + .avatar--lg */}
                  <div className="avatar avatar--lg">
                    {data.user?.name?.[0] || "S"}
                  </div>
                  <div className="avatar__badge">✓</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', flex: 1 }}>
                  <div>
                    <p className="info-label">Name</p>
                    <p className="info-value">{data.user?.name || "Student"}</p>
                  </div>

                  <div>
                    <p className="info-label">Total Points</p>
                    <p className="info-value info-value--large">{data.user?.total_points ?? 0}</p>
                  </div>

                  <div>
                    <p className="info-label">Subjects</p>
                    <p className="info-value" style={{ fontSize: '13px' }}>
                      {data.subjects && data.subjects.length > 0
                        ? data.subjects.map((s) => s.subjects.name).join(", ")
                        : "None added yet"}
                    </p>
                  </div>

                  <div>
                    <p className="info-label">Quizzes Won</p>
                    <p className="info-value info-value--large">{quizzesWon}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== GROUP CARD ===== */}
            {data.group && (
              <div className="card anim-3">
                <div className="card-title">
                  <span className="card-title-pip" />
                  Group Card
                  <span style={{ fontSize: '16px', lineHeight: 1 }}>👥</span>
                </div>

                <div className="group-grid">
                  <div>
                    <p className="info-label">Group Name</p>
                    <p className="info-value">{data.group.name}</p>
                  </div>

                  <div>
                    <p className="info-label">Total Points</p>
                    <p className="info-value info-value--large">{data.group.total_points}</p>
                  </div>

                  <div>
                    <p className="info-label">Members</p>
                    <p className="info-value">
                      {data.group.total_members}
                      <span style={{ color: 'var(--subtle)', fontWeight: 400 }}>/4</span>
                    </p>
                  </div>

                  <div>
                    <p className="info-label">Avg Leaderboard Pts</p>
                    <p className="info-value info-value--large">{data.group.group_average_lp.toFixed(2)}</p>
                  </div>

                  <div>
                    <p className="info-label">Status</p>
                    <div className={`pill ${data.group.is_active ? "pill--active" : "pill--inactive"}`}>
                      <span className="pill__dot" />
                      {data.group.is_active ? "Active" : "Incomplete"}
                    </div>
                  </div>

                  <div>
                    <p className="info-label">Invite Code</p>
                    <span className="invite-code">{data.group.invite_code}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ===== SUBJECTS GRID ===== */}
            <div className="card anim-4">
              <div className="subjects-header">
                <div className="card-title" style={{ marginBottom: 0 }}>
                  <span className="card-title-pip" />
                  Selected Subjects
                </div>
                <span className="subjects-count">
                  {data.subjects?.length || 0} of 4
                </span>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="subject-grid">
                  {data.subjects?.slice(0, 4).map((s, idx) => (
                    <div key={s.subject_id} className="subject-tile-wrap">
                      <a
                        href={`/notes?subjectId=${s.subject_id}`}
                        className="subject-tile"
                      >
                        <span className="subject-tile__num">{idx + 1}</span>
                        <p className="subject-tile__name">{s.subjects.name}</p>
                        <p className="subject-tile__cta">View notes →</p>
                      </a>
                      <div className="subject-tile-delete">
                        <DeleteSubjectButton subjectId={s.subject_id} />
                      </div>
                    </div>
                  ))}

                  {Array.from({ length: Math.max(0, 4 - (data.subjects?.length || 0)) }).map((_, i) => (
                    <a key={i} href="/subject-selection" className="subject-tile--add">
                      <div className="subject-tile--add__icon">
                        <FaPlus />
                      </div>
                      <span className="subject-tile--add__label">Add Subject</span>
                      <span className="subject-tile--add__sublabel">Click to explore</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="dashboard-right anim-5">
            <VideoTools />
          </div>
        </div>
      </div>

      <Dock />
    </main>
  );
}
// app/notes/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NotesRenderer from "@/components/NotesRenderer";
import s from "./notes.module.css";

const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1);

type Note = {
  id: string;
  subject_id: string;
  week: number;
  phase: string;
  content: string;
  published: boolean;
};

// Main component that uses useSearchParams - wrapped in Suspense
function NotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId");

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [allNotes, setAllNotes] = useState<Note[]>([]);   // ✅ stores all 12 weeks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizDrawerOpen, setQuizDrawerOpen] = useState(false);

  // ✅ Derive current note from state — no extra fetch on week switch
  const currentNote = allNotes.find((n) => n.week === selectedWeek) ?? null;

  // ✅ Fetch ALL weeks once when subjectId changes (not on every week click)
  useEffect(() => {
    if (!subjectId) { setAllNotes([]); return; }

    async function fetchAllNotes() {
      setLoading(true);
      setError(null);
      try {
        // No &week param — fetches all 12 weeks in one request
        const res = await fetch(
          `/api/notes?subjectId=${subjectId}&phase=foundation`,
          { credentials: "include" }
        );
        if (res.status === 401) {
          setError("Session expired. Please log in again.");
          setAllNotes([]);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Failed to fetch notes: ${res.statusText}`);
        }
        const data: Note[] = await res.json();
        setAllNotes(data); // ✅ all weeks stored in state
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError(err instanceof Error ? err.message : "Failed to load notes. Please try again.");
        setAllNotes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAllNotes();
  }, [subjectId]); // ✅ only re-fetches when subject changes, not on week click

  if (!subjectId) {
    return (
      <div className={s.shell}>
        <div className={s.errorWrap}>
          <div className={s.errorIcon}>⚠</div>
          <p className={s.errorTitle}>Invalid notes link</p>
          <p className={s.errorSub}>Subject ID is missing. Please select a subject from the dashboard.</p>
          <button onClick={() => router.push("/dashboard")} className={s.btnPrimary}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.shell}>

      {/* ── Top bar ── */}
      <nav className={s.topbar}>
        <button onClick={() => router.push("/dashboard")} className={s.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          <span>Dashboard</span>
        </button>

        <div className={s.topbarCenter}>
          <span className={s.topbarPhase}>Foundation Phase</span>
        </div>

        {/* Mobile quiz trigger */}
        <button
          className={s.quizTrigger}
          onClick={() => setQuizDrawerOpen(true)}
          aria-label="Open quiz panel"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <span>Quizzes</span>
        </button>
      </nav>

      {/* ── Error banner ── */}
      {error && (
        <div className={s.bannerError}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* ── Page hero ── */}
      <header className={s.hero}>
        <div className={s.heroMeta}>
          <span className={s.heroBadge}>Foundation Phase</span>
          <span className={s.heroDot} />
          <span className={s.heroWeekLabel}>Week {selectedWeek} of {WEEKS.length}</span>
        </div>
        <h1 className={s.heroTitle}>
          Subject <em>Notes</em>
        </h1>
        <p className={s.heroSub}>Study material for Week {selectedWeek} · Foundation Phase</p>
      </header>

      {/* ── Week selector strip ── */}
      <div className={s.weekStrip}>
        <div className={s.weekTrack}>
          {WEEKS.map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              disabled={loading}
              className={[
                s.weekPill,
                selectedWeek === week ? s.weekPillActive : "",
                loading ? s.weekPillDisabled : "",
              ].filter(Boolean).join(" ")}
            >
              <span className={s.weekPillNum}>{week}</span>
              <span className={s.weekPillLabel}>Wk</span>
            </button>
          ))}
        </div>
        <div className={s.weekProgress}>
          <div
            className={s.weekProgressBar}
            style={{ width: `${(selectedWeek / WEEKS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Body: notes + sidebar ── */}
      <div className={s.body}>

        {/* Notes column */}
        <main className={s.notesCol}>
          <div className={s.notesMast}>
            <div className={s.notesMastLeft}>
              <span className={s.notesMastLabel}>Week</span>
              <span className={s.notesMastNum}>{String(selectedWeek).padStart(2, "0")}</span>
            </div>
            <div className={s.notesMastRight}>
              <h2 className={s.notesMastTitle}>Foundation Notes</h2>
              <p className={s.notesMastSub}>Read carefully · All weeks accumulate</p>
            </div>
          </div>

          <div className={s.notesCard}>
            {loading ? (
              <div className={s.stateCenter}>
                <div className={s.spinner} />
                <p className={s.stateText}>Fetching notes…</p>
              </div>
            ) : currentNote ? (
              <div className={s.notesBody}>
                <NotesRenderer content={currentNote.content} />
              </div>
            ) : (
              <div className={s.stateCenter}>
                <svg className={s.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p className={s.stateTitle}>No notes yet for Week {selectedWeek}</p>
                <p className={s.stateSub}>Check back later or explore another week.</p>
              </div>
            )}
          </div>
        </main>

        {/* Desktop quiz sidebar */}
        <aside className={s.sidebar}>
          <div className={s.quizCard}>
            <div className={s.quizCardHead}>
              <span className={s.quizCardLabel}>Weekly Quizzes</span>
              <span className={s.quizCardCount}>{WEEKS.length} available</span>
            </div>

            <div className={s.quizGrid}>
              {WEEKS.map((week) => (
                <button
                  key={week}
                  onClick={() => router.push(`/quiz?subjectId=${subjectId}&week=${week}`)}
                  className={[s.quizBtn, selectedWeek === week ? s.quizBtnActive : ""].filter(Boolean).join(" ")}
                  title={`Week ${week} Quiz`}
                >
                  <span className={s.quizBtnNum}>{week}</span>
                </button>
              ))}
            </div>

            <div className={s.quizDivider} />

            <button
              onClick={() => router.push(`/quiz?subjectId=${subjectId}&week=${selectedWeek}`)}
              className={s.quizCta}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Take Week {selectedWeek} Quiz
            </button>
          </div>
        </aside>
      </div>

      {/* ── Mobile quiz drawer ── */}
      {quizDrawerOpen && (
        <div className={s.drawerOverlay} onClick={() => setQuizDrawerOpen(false)}>
          <div className={s.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={s.drawerHandle} />
            <div className={s.drawerHead}>
              <span className={s.drawerTitle}>Weekly Quizzes</span>
              <button className={s.drawerClose} onClick={() => setQuizDrawerOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className={s.drawerGrid}>
              {WEEKS.map((week) => (
                <button
                  key={week}
                  onClick={() => {
                    router.push(`/quiz?subjectId=${subjectId}&week=${week}`);
                    setQuizDrawerOpen(false);
                  }}
                  className={[s.quizBtn, selectedWeek === week ? s.quizBtnActive : ""].filter(Boolean).join(" ")}
                >
                  <span className={s.quizBtnNum}>{week}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                router.push(`/quiz?subjectId=${subjectId}&week=${selectedWeek}`);
                setQuizDrawerOpen(false);
              }}
              className={s.quizCta}
              style={{ marginTop: 16 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Take Week {selectedWeek} Quiz
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Main page component with Suspense boundary
export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div style={{
          minHeight: "100vh",
          background: "var(--cream, rgb(255,250,246))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 36, height: 36,
              border: "3px solid rgba(0,33,71,0.1)",
              borderTopColor: "#003366",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#7a7670", fontSize: 14 }}>
              Loading…
            </p>
          </div>
        </div>
      }
    >
      <NotesContent />
    </Suspense>
  );
}
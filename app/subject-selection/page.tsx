"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./subjectselection.module.css";

type Subject = {
  id: string;
  name: string;
};

export default function SubjectSelectionPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      try {
        const res = await fetch("/api/subjects", { credentials: "include" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load subjects");
        }
        const data = await res.json();

        const subjectsArray: Subject[] = Array.isArray(data.subjects) ? data.subjects : [];
        const selectedSubjectIds: string[] = Array.isArray(data.selectedSubjectIds) ? data.selectedSubjectIds : [];

        if (!cancelled) {
          setSubjects(subjectsArray.filter((s) => !selectedSubjectIds.includes(s.id)));
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load subjects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSubjects();
    return () => { cancelled = true; };
  }, []);

  const addSubject = async () => {
    if (!selected) return;

    try {
      const res = await fetch("/api/subjects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subjectId: selected }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to add subject");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add subject");
    }
  };

  if (loading) {
    return (
      <div className={styles["ss-shell"]}>
        <div className={styles["ss-state-center"]}>
          <div className={styles["ss-spinner"]} />
          <p className={styles["ss-state-text"]}>Loading subjects…</p>
        </div>
      </div>
    );
  }

  return (
    <main className={styles["ss-shell"]}>
      <header className={`${styles["ss-header"]} ${styles["anim-1"]}`}>
        <p className={styles["ss-label"]}>Get Started</p>
        <h1 className={styles["ss-heading"]}>
          Select Your <em>Subjects</em>
        </h1>
        <p className={styles["ss-subheading"]}>
          Choose from available subjects to start learning
        </p>
      </header>

      <div className={`${styles["ss-content"]} ${styles["anim-2"]}`}>
        {error && (
          <div className={styles["ss-error-banner"]}>
            {error}
          </div>
        )}

        {subjects.length === 0 && !error && (
          <div className={styles["ss-empty"]}>
            <div className={styles["ss-empty-icon"]}>★</div>
            <p className={styles["ss-empty-title"]}>All subjects added</p>
            <p className={styles["ss-empty-sub"]}>
              You've already added all available subjects.
            </p>
          </div>
        )}

        <div className={styles["ss-grid"]}>
          {subjects.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id === selected ? null : s.id)}
              className={`${styles["ss-subject-btn"]} ${
                selected === s.id ? styles["ss-subject-btn--selected"] : ""
              }`}
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <span className={styles["ss-subject-idx"]}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles["ss-subject-name"]}>
                {s.name}
              </span>

              {selected === s.id && (
                <span className={styles["ss-subject-check"]}>✓</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles["ss-action"]}>
          {selected && (
            <p className={styles["ss-selection-hint"]}>
              <em>{subjects.find(s => s.id === selected)?.name}</em> selected
            </p>
          )}

          <button
            onClick={addSubject}
            disabled={!selected}
            className={styles["ss-add-btn"]}
          >
            Add Subject
          </button>
        </div>
      </div>
    </main>
  );
}
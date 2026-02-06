"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) throw new Error("Not authenticated");

        const res = await fetch("/api/subjects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Unauthorized");
        }

        const {
          subjects,
          selectedSubjectIds,
        }: {
          subjects: Subject[];
          selectedSubjectIds: string[];
        } = await res.json();

        if (!cancelled) {
          // ✅ hide already-added subjects (legacy behavior)
          setSubjects(
            subjects.filter(
              (s) => !selectedSubjectIds.includes(s.id)
            )
          );
        }
      } catch {
        if (!cancelled) setError("Failed to load subjects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSubjects();
    return () => {
      cancelled = true;
    };
  }, []);

  const addSubject = async () => {
    if (!selected) return;

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        setError("Not authenticated");
        return;
      }

      const res = await fetch("/api/subjects/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjectId: selected }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      // ✅ Go back to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to add subject"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading subjects...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        Add a Subject
      </h1>

      {error && (
        <div className="mb-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {subjects.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelected(s.id)}
            className={`p-4 rounded border text-center transition ${
              selected === s.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <button
        onClick={addSubject}
        disabled={!selected}
        className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        Add Subject
      </button>
    </main>
  );
}

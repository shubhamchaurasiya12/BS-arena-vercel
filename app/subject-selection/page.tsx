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
        // ✅ NextAuth: cookies are sent automatically
        const res = await fetch("/api/subjects", {
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to load subjects");
        }

        const { subjects, selectedSubjectIds } = await res.json();

        if (!cancelled) {
          setSubjects(
            subjects.filter(
              (s: Subject) => !selectedSubjectIds.includes(s.id)
            )
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load subjects"
          );
        }
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
      const res = await fetch("/api/subjects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subjectId: selected }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add subject");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(255,250,246)] text-black">
        Loading subjects...
      </div>
    );
  }

  return (
    <main className="min-h-screen -mt-8 -mb-3 bg-[rgb(255,250,246)] text-black">
      {/* ================= HEADER ================= */}
      <header className="w-full py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Select Your Subjects
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Choose from the available subjects to start learning
        </p>
      </header>

      {/* ================= HERO VIDEO ================= */}
      <div className="relative w-full h-[280px] md:h-[360px] overflow-hidden">
        {/* Top fade line */}
        <div className="absolute top-0 left-0 w-full h-[0.8px]
          bg-gradient-to-r from-transparent via-black/40 to-transparent z-10" />

        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Bottom fade line */}
        <div className="absolute bottom-0 left-0 w-full h-[0.8px]
          bg-gradient-to-r from-transparent via-black/40 to-transparent z-10" />
      </div>

      {/* ================= SUBJECT SECTION ================= */}
      <div className="max-w-6xl mx-auto p-6">
        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8 mt-8">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`p-5 rounded-xl border text-lg font-semibold transition-all duration-200
                ${
                  selected === s.id
                    ? "bg-black text-white border-black scale-105 shadow-lg"
                    : "bg-white border-gray-300 hover:shadow-md hover:bg-gray-50"
                }
              `}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* ADD BUTTON */}
        <div className="flex justify-center mb-10">
          <button
            onClick={addSubject}
            disabled={!selected}
            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 disabled:opacity-40"
          >
            Add Subject
          </button>
        </div>
      </div>
    </main>
  );
}

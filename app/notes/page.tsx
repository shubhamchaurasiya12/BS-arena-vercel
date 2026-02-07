"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1);

type Note = {
  id: string;
  content: string;
};

export default function NotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get("subjectId");

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showWeekSelector, setShowWeekSelector] = useState(false);

  useEffect(() => {
    if (!subjectId) {
      setCurrentNote(null);
      return;
    }

    async function fetchNotes() {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) return;

        const res = await fetch(
          `/api/notes?subjectId=${subjectId}&week=${selectedWeek}&phase=foundation`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error();

        const data: Note[] = await res.json();
        setCurrentNote(data[0] || null);
      } catch {
        setCurrentNote(null);
      }
    }

    fetchNotes();
  }, [subjectId, selectedWeek]);

  if (!subjectId) {
    return (
      <div className="min-h-screen bg-[rgb(255,250,246)] p-6">
        <p className="text-red-600 font-semibold">
          Invalid notes link. Subject missing.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(255,250,246)] p-6 md:p-10 font-sans">
      {/* ================= HEADER WITH BUTTON ================= */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Subject Notes
        </h1>

        <button
          onClick={() => setShowWeekSelector(!showWeekSelector)}
          className="bg-black text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:bg-gray-900 transition-all duration-300 text-sm md:text-base"
        >
          Get Notes
        </button>
      </div>

      {/* Decorative line */}
      <div className="mb-8 h-[1px] bg-gradient-to-r from-transparent via-[#003366] to-transparent"></div>

      {/* ================= HERO VIDEO SECTION ================= */}
      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-6 shadow-lg">
        <video
          src="/hero-video.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* ================= WEEK SELECTOR DROPDOWN ================= */}
      {showWeekSelector && (
        <div className="bg-[rgb(225,220,213)] rounded-2xl p-4 shadow-lg mb-8 border border-gray-200 flex flex-wrap gap-3 justify-center">
          {WEEKS.map((week) => (
            <button
              key={week}
              onClick={() => {
                setSelectedWeek(week);
                setShowWeekSelector(false); // close after selecting
              }}
              className={`px-4 py-2 rounded-xl font-medium border transition-all duration-300 ${
                selectedWeek === week
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>
      )}

      {/* ================= NOTES CONTENT ================= */}
      <div className="bg-[rgb(225,220,213)] rounded-2xl p-6 shadow-lg mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">
          Week {selectedWeek} Notes
        </h2>

        {currentNote ? (
          <p className="text-gray-800 whitespace-pre-wrap">
            {currentNote.content}
          </p>
        ) : (
          <p className="text-gray-500">No notes available for this week.</p>
        )}
      </div>

      {/* ================= QUIZ BUTTONS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {WEEKS.map((week) => (
          <button
            key={week}
            onClick={() =>
              router.push(`/quiz?subjectId=${subjectId}&week=${week}`)
            }
            className="bg-black text-white py-3 rounded-xl font-medium shadow-md hover:bg-gray-900 transition-all duration-300"
          >
            Week {week} Quiz
          </button>
        ))}
      </div>
    </div>
  );
}
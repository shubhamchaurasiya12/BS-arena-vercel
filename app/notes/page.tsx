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

  // ✅ Hook is ALWAYS called
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

        if (!res.ok) {
          throw new Error();
        }

        const data: Note[] = await res.json();
        setCurrentNote(data[0] || null);
      } catch {
        setCurrentNote(null);
      }
    }

    fetchNotes();
  }, [subjectId, selectedWeek]);

  // 🔹 Guard AFTER hooks
  if (!subjectId) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p className="text-red-600 font-semibold">
          Invalid notes link. Subject missing.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">
        Subject Notes
      </h1>

      {/* Week Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {WEEKS.map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`px-3 py-1 rounded border ${
              selectedWeek === week
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            Week {week}
          </button>
        ))}
      </div>

      {/* Notes Content */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Week {selectedWeek} Notes
        </h2>

        {currentNote ? (
          <p className="text-gray-700 whitespace-pre-wrap">
            {currentNote.content}
          </p>
        ) : (
          <p className="text-gray-500">
            No notes available for this week.
          </p>
        )}
      </div>

      {/* Quiz Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {WEEKS.map((week) => (
          <button
            key={week}
            onClick={() =>
              router.push(
                `/quiz?subjectId=${subjectId}&week=${week}`
              )
            }
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Week {week} Quiz
          </button>
        ))}
      </div>
    </div>
  );
}

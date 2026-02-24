//D:\BS-arena-NextJS\components\SubjectSelector.tsx
"use client";

import { useState } from "react";

type Subject = {
  id: string;
  name: string;
};

export function SubjectSelector({
  subjects,
  selectedIds,
}: {
  subjects: Subject[];
  selectedIds: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedIds)
  );
  const [loading, setLoading] = useState(false);

  const toggle = async (subjectId: string) => {
    if (loading) return;

    const next = new Set(selected);

    // Toggle logic
    if (next.has(subjectId)) {
      next.delete(subjectId);
    } else {
      if (next.size >= 4) {
        alert("Maximum 4 subjects allowed");
        return;
      }
      next.add(subjectId);
    }

    const nextArray = Array.from(next);

    // Optimistic update
    setSelected(next);
    setLoading(true);

    try {
      const res = await fetch("/api/subjects/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subjectIds: nextArray,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update subjects");
      }
    } catch (err) {
      console.error(err);

      // Rollback on error
      setSelected(new Set(selectedIds));
      alert("Failed to update subjects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {subjects.map((s) => {
        const isSelected = selected.has(s.id);

        return (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            disabled={loading}
            className={`p-4 rounded border text-left transition ${
              isSelected
                ? "bg-green-100 border-green-400"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <h2 className="font-semibold">{s.name}</h2>
            <p className="text-sm text-gray-600">
              {isSelected ? "Selected" : "Not selected"}
            </p>
          </button>
        );
      })}
    </div>
  );
}

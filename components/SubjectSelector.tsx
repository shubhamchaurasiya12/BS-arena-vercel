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
  const [selected, setSelected] = useState(new Set(selectedIds));
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggle = async (subjectId: string) => {
    const isSelected = selected.has(subjectId);
    setLoadingId(subjectId);

    await fetch("/api/subjects/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectId,
        selected: !isSelected,
      }),
    });

    setSelected((prev) => {
      const next = new Set(prev);
      if (isSelected) {
        next.delete(subjectId);
      } else {
        next.add(subjectId);
      }
      return next;
    });

    setLoadingId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {subjects.map((s) => {
        const isSelected = selected.has(s.id);
        return (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            disabled={loadingId === s.id}
            className={`p-4 rounded border text-left ${
              isSelected
                ? "bg-green-100 border-green-400"
                : "bg-white border-gray-300"
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

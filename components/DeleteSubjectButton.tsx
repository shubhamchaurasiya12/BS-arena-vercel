"use client";

import { useRouter } from "next/navigation";

export default function DeleteSubjectButton({
  subjectId,
}: {
  subjectId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const token = document.cookie
      .split("; ")
      .find((r) => r.startsWith("token="))
      ?.split("=")[1];

    if (!token) return;

    await fetch(`/api/subjects/${subjectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Re-fetch SSR data
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 text-sm hover:text-red-700"
      title="Remove subject"
    >
      ✕
    </button>
  );
}

//D:\BS-arena-NextJS\components\DeleteSubjectButton.tsx
"use client";
import { useRouter } from "next/navigation";

export default function DeleteSubjectButton({
  subjectId,
}: {
  subjectId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    try {
      const res = await fetch(`/api/subjects/${subjectId}`, {
        method: "DELETE",
        credentials: "include", // ✅ important for NextAuth session
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to remove subject");
      }

      // Refresh SSR dashboard data
      router.refresh();
    } catch (err) {
      console.error("Delete subject error:", err);
      alert("Failed to remove subject");
    }
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

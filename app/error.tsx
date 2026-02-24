//D:\BS-arena-NextJS\app\error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">
        Something went wrong
      </h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
};

export default function QuizPlayPage({
  searchParams,
}: {
  searchParams: { subjectId: string; bet: string };
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    async function start() {
      const token = document.cookie
        .split("; ")
        .find((r) => r.startsWith("token="))
        ?.split("=")[1];

      if (!token) return;

      const startRes = await fetch("/api/quiz/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId: searchParams.subjectId,
          bet: Number(searchParams.bet),
        }),
      });

      const { attemptId } = await startRes.json();
      setAttemptId(attemptId);

      const qRes = await fetch(
        `/api/quiz/questions?attemptId=${attemptId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const qs: QuizQuestion[] = await qRes.json();
      setQuestions(qs);
    }

    start();
  }, [searchParams.subjectId, searchParams.bet]);

  const submit = async () => {
    if (!attemptId) return;

    const token = document.cookie
      .split("; ")
      .find((r) => r.startsWith("token="))
      ?.split("=")[1];

    if (!token) return;

    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ attemptId, answers }),
    });

    const result = await res.json();
    alert(`Result: ${result.result}`);
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Quiz</h1>

      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <p className="font-semibold">{q.question}</p>
          {q.options.map((opt, i) => (
            <label key={i} className="block">
              <input
                type="radio"
                name={q.id}
                onChange={() =>
                  setAnswers((a) => ({ ...a, [q.id]: i }))
                }
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Quiz
      </button>
    </main>
  );
}

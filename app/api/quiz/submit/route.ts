// app/api/quiz/submit/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { submitQuizAttempt } from "@/lib/quiz.service";

type ServiceError = {
  message?: string;
  status?: number;
};

function isAnswerMap(value: unknown): value is Record<string, number> {
  if (typeof value !== "object" || value === null) return false;
  return Object.values(value).every((v) => typeof v === "number");
}

export async function POST(req: NextRequest) {
  try {
    // 🔐 Auth (NextAuth)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 📦 Payload
    const body = await req.json();
    const attemptId: unknown = body.attemptId;
    const answers: unknown = body.answers;

    if (typeof attemptId !== "string" || !isAnswerMap(answers)) {
      return NextResponse.json(
        { message: "attemptId and valid answers are required" },
        { status: 400 }
      );
    }

    // 📤 Submit quiz
    const result = await submitQuizAttempt({
      userId,
      attemptId,
      answers,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    let message = "Quiz submission failed";
    let status = 500;

    if (typeof err === "object" && err !== null) {
      const serviceErr = err as ServiceError;
      if (serviceErr.message) message = serviceErr.message;
      if (serviceErr.status) status = serviceErr.status;
    }

    return NextResponse.json({ message }, { status });
  }
}

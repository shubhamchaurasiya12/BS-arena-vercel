import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { submitQuizAttempt } from "@/lib/quiz.service";
import { getQuizAttempt } from "@/lib/quiz.service";

type JwtPayload = {
  userId: string;
};

type ServiceError = {
  message?: string;
  status?: number;
};

function isAnswerMap(value: unknown): value is Record<string, number> {
  if (typeof value !== "object" || value === null) return false;

  for (const v of Object.values(value)) {
    if (typeof v !== "number") return false;
  }

  return true;
}

export async function POST(req: NextRequest) {
  try {
    /* 🔐 Auth */
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const { userId } = verifyToken<JwtPayload>(token);

    /* 📦 Payload */
    const body = await req.json();
    const attemptId: unknown = body.attemptId;
    const answers: unknown = body.answers;

    if (typeof attemptId !== "string" || !isAnswerMap(answers)) {
      return NextResponse.json(
        { message: "attemptId and valid answers are required" },
        { status: 400 }
      );
    }

    /* 📤 Normal submit */
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
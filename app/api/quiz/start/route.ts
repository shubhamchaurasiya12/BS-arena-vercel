import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { startQuizAttempt } from "@/lib/quiz.service";

type JwtPayload = {
  userId: string;
};

type ServiceError = {
  message?: string;
  status?: number;
};

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
    const quizId: unknown = body.quizId;
    const bet: unknown = body.bet;

    if (typeof quizId !== "string" || typeof bet !== "number") {
      return NextResponse.json(
        { message: "quizId and bet are required" },
        { status: 400 }
      );
    }

    /* ▶️ Start quiz (SERVICE LAYER) */
    const result = await startQuizAttempt({
      userId,
      quizId,
      bet,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    let message = "Failed to start quiz";
    let status = 500;

    if (typeof err === "object" && err !== null) {
      const serviceErr = err as ServiceError;

      if (typeof serviceErr.message === "string") {
        message = serviceErr.message;
      }

      if (typeof serviceErr.status === "number") {
        status = serviceErr.status;
      }
    }

    return NextResponse.json({ message }, { status });
  }
}

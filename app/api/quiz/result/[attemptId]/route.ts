import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getQuizResult } from "@/lib/quiz.service";

type JwtPayload = {
  userId: string;
};

type ServiceError = {
  message?: string;
  status?: number;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ attemptId: string }> }
) {
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

    /* 📌 Params — MUST be awaited in Next.js 15 */
    const { attemptId } = await context.params;

    if (!attemptId || typeof attemptId !== "string") {
      return NextResponse.json(
        { message: "attemptId is required" },
        { status: 400 }
      );
    }

    /* 📊 Fetch result */
    const result = await getQuizResult({ userId, attemptId });

    return NextResponse.json(result);
  } catch (err: unknown) {
    let message = "Failed to fetch quiz result";
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

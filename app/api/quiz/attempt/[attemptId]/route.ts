import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getQuizAttempt } from "@/lib/quiz.service";

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

    /* 📌 Params — MUST be awaited */
    const { attemptId } = await context.params;

    if (!attemptId) {
      return NextResponse.json(
        { message: "attemptId is required" },
        { status: 400 }
      );
    }

    const result = await getQuizAttempt({ userId, attemptId });
    return NextResponse.json(result);
  } catch (err: unknown) {
    let message = "Failed to fetch quiz attempt";
    let status = 500;

    if (typeof err === "object" && err !== null) {
      const e = err as ServiceError;
      if (typeof e.message === "string") message = e.message;
      if (typeof e.status === "number") status = e.status;
    }

    return NextResponse.json({ message }, { status });
  }
}

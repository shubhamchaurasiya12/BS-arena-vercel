// app/api/quiz/result/[attemptId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getQuizResult } from "@/lib/quiz.service";

type ServiceError = {
  message?: string;
  status?: number;
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ attemptId: string }> }
) {
  try {
    // 🔐 Auth (NextAuth)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 📌 Params
    const { attemptId } = await context.params;

    if (!attemptId || typeof attemptId !== "string") {
      return NextResponse.json(
        { message: "attemptId is required" },
        { status: 400 }
      );
    }

    // 📊 Fetch result
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

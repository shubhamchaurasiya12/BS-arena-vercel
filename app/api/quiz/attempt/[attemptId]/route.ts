// app/api/quiz/attempt/[attemptId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getQuizAttempt } from "@/lib/quiz.service";

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

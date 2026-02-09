// app/api/quiz/apply-points/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { applyQuizPoints } from "@/lib/quiz.service";

type ServiceError = {
  message?: string;
  status?: number;
};

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

    if (typeof attemptId !== "string") {
      return NextResponse.json(
        { message: "attemptId is required" },
        { status: 400 }
      );
    }

    // 💰 Apply points
    const result = await applyQuizPoints({
      userId,
      attemptId,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    let message = "Failed to apply points";
    let status = 500;

    if (typeof err === "object" && err !== null) {
      const serviceErr = err as ServiceError;
      if (serviceErr.message) message = serviceErr.message;
      if (serviceErr.status) status = serviceErr.status;
    }

    return NextResponse.json({ message }, { status });
  }
}

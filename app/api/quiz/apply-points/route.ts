import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { applyQuizPoints } from "@/lib/quiz.service";

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
    const attemptId: unknown = body.attemptId;

    if (typeof attemptId !== "string") {
      return NextResponse.json(
        { message: "attemptId is required" },
        { status: 400 }
      );
    }

    /* 💰 Apply points */
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

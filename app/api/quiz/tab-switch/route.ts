import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { recordTabSwitch } from "@/lib/quiz.service";

type JwtPayload = { userId: string };

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = verifyToken<JwtPayload>(authHeader.slice(7));
    const { attemptId } = await req.json();

    if (!attemptId) {
      return NextResponse.json(
        { message: "attemptId is required" },
        { status: 400 }
      );
    }

    const result = await recordTabSwitch({ userId, attemptId });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch quiz attempt";
    return NextResponse.json({ message }, { status: 500 });
  }
}

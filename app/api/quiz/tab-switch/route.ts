// app/api/quiz/tab-switch/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { recordTabSwitch } from "@/lib/quiz.service";

export async function POST(req: NextRequest) {
  try {
    // 🔐 Auth (NextAuth)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 📦 Payload
    const { attemptId } = await req.json();

    if (typeof attemptId !== "string") {
      return NextResponse.json(
        { message: "attemptId is required" },
        { status: 400 }
      );
    }

    const result = await recordTabSwitch({ userId, attemptId });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to record tab switch";
    return NextResponse.json({ message }, { status: 500 });
  }
}

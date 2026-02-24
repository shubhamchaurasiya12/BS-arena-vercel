//D:\BS-arena-NextJS\app\api\quiz\route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { recordTabSwitch } from "@/lib/quiz.service";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const attemptId = body.attemptId;

  if (typeof attemptId !== "string") {
    return NextResponse.json(
      { message: "attemptId is required" },
      { status: 400 }
    );
  }

  const result = await recordTabSwitch({
    userId: session.user.id,
    attemptId,
  });

  return NextResponse.json(result);
}

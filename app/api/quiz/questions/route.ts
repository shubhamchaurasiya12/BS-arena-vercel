import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

type JwtPayload = { userId: string };

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7); // guaranteed string
    const { userId } = verifyToken<JwtPayload>(token);

    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get("attemptId");

    if (!attemptId) {
      return NextResponse.json({ message: "Missing attemptId" }, { status: 400 });
    }

    const { data: attempt } = await supabase
      .from("quiz_attempts")
      .select("user_id, selected_questions")
      .eq("id", attemptId)
      .single();

    if (!attempt || attempt.user_id !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { data: questions } = await supabase
      .from("questions")
      .select("id, question, options")
      .in("id", attempt.selected_questions);

    return NextResponse.json(questions || []);
  } catch {
    return NextResponse.json(
      { message: "Failed to load questions" },
      { status: 500 }
    );
  }
}

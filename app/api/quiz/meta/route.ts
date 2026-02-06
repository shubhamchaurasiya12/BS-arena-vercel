import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

type JwtPayload = { userId: string };

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    verifyToken<JwtPayload>(authHeader.slice(7));

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const week = searchParams.get("week");

    if (!subjectId || !week) {
      return NextResponse.json(
        { message: "subjectId and week required" },
        { status: 400 }
      );
    }

    const { data: quiz, error } = await supabase
      .from("quizzes")
      .select("id")
      .eq("subject_id", subjectId)
      .eq("week", week)
      .single();

    if (error || !quiz) {
      return NextResponse.json(
        { message: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ quizId: quiz.id });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch quiz meta" },
      { status: 500 }
    );
  }
}

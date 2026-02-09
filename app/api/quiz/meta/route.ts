// app/api/quiz/meta/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Auth (NextAuth)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 📌 Params
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const week = searchParams.get("week");

    if (!subjectId || !week) {
      return NextResponse.json(
        { message: "subjectId and week required" },
        { status: 400 }
      );
    }

    // 🔎 Fetch quiz meta
    const { data: quiz, error } = await supabase
      .from("quizzes")
      .select("id")
      .eq("subject_id", subjectId)
      .eq("week", week)
      .maybeSingle();

    if (error || !quiz) {
      return NextResponse.json(
        { message: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ quizId: quiz.id });
  } catch (err) {
    console.error("Quiz meta error:", err);
    return NextResponse.json(
      { message: "Failed to fetch quiz meta" },
      { status: 500 }
    );
  }
}

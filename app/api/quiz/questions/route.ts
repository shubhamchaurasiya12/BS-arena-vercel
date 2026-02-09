// app/api/quiz/questions/route.ts

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

    const userId = session.user.id;

    // 📌 Params
    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get("attemptId");

    if (!attemptId) {
      return NextResponse.json(
        { message: "Missing attemptId" },
        { status: 400 }
      );
    }

    // 🔎 Fetch attempt
    const { data: attempt } = await supabase
      .from("quiz_attempts")
      .select("user_id, selected_questions")
      .eq("id", attemptId)
      .maybeSingle();

    if (!attempt) {
      return NextResponse.json(
        { message: "Quiz attempt not found" },
        { status: 404 }
      );
    }

    // 🚫 Ownership check
    if (attempt.user_id !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 📚 Fetch questions
    const { data: questions, error } = await supabase
      .from("questions")
      .select("id, question, options")
      .in("id", attempt.selected_questions);

    if (error) {
      throw error;
    }

    return NextResponse.json(questions ?? []);
  } catch (err) {
    console.error("Quiz questions error:", err);
    return NextResponse.json(
      { message: "Failed to load questions" },
      { status: 500 }
    );
  }
}

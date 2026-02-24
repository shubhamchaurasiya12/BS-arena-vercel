//app/api/quiz/questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

type SelectedQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  questionOrder: number;
};

// Helper function to clean LaTeX escaping from database
function cleanLatex(text: string): string {
  // PostgreSQL/JSON double-escapes backslashes, so we convert \\\\ to \
  return text.replace(/\\\\/g, '\\');
}

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

    // 📚 Return questions from selected_questions with cleaned LaTeX
    const selectedQuestions = attempt.selected_questions as SelectedQuestion[];
    
    const questions = selectedQuestions.map(q => ({
      id: q.id,
      question: cleanLatex(q.question),
      options: q.options.map(opt => cleanLatex(opt)),
    }));

    return NextResponse.json(questions);
  } catch (err) {
    console.error("Quiz questions error:", err);
    return NextResponse.json(
      { message: "Failed to load questions" },
      { status: 500 }
    );
  }
}
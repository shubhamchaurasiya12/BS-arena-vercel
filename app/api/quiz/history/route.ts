// app/api/quiz/history/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // 🔐 Auth check (NextAuth session)
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 📚 Fetch user's selected subjects
    const { data: userSubjects } = await supabase
      .from("user_subjects")
      .select("subject_id, subjects(id, name)")
      .eq("user_id", userId);

    if (!userSubjects || userSubjects.length === 0) {
      return NextResponse.json([]);
    }

    const subjectIds = userSubjects.map((us) => us.subject_id);

    // 📊 Fetch quiz attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from("quiz_attempts")
      .select("id, quiz_id, score, status, start_time, bet")
      .eq("user_id", userId)
      .in("status", ["COMPLETED", "FAILED_SCORE", "AUTO_SUBMITTED"])
      .order("start_time", { ascending: false });

    if (attemptsError) {
      console.error("Quiz history API error:", attemptsError);
      return NextResponse.json(
        { message: "Failed to fetch quiz history" },
        { status: 500 }
      );
    }

    if (!attempts || attempts.length === 0) {
      return NextResponse.json([]);
    }

    // 📚 Fetch quiz details for all attempts
    const quizIds = attempts.map((a) => a.quiz_id);
    const { data: quizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .select("id, subject_id, week")
      .in("id", quizIds);

    if (quizzesError) {
      console.error("Quizzes fetch error:", quizzesError);
      return NextResponse.json(
        { message: "Failed to fetch quiz details" },
        { status: 500 }
      );
    }

    // 📖 Fetch subject details
    const quizSubjectIds = quizzes?.map((q) => q.subject_id) || [];
    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("id, name")
      .in("id", quizSubjectIds);

    if (subjectsError) {
      console.error("Subjects fetch error:", subjectsError);
      return NextResponse.json(
        { message: "Failed to fetch subject details" },
        { status: 500 }
      );
    }

    // 🗺️ Create lookup maps
    const quizMap = new Map(quizzes?.map((q) => [q.id, q]) || []);
    const subjectMap = new Map(subjects?.map((s) => [s.id, s]) || []);

    // 🔍 Filter attempts by user's selected subjects and build history
    const filteredAttempts = attempts
      .map((attempt) => {
        const quiz = quizMap.get(attempt.quiz_id);
        if (!quiz) return null;

        const subject = subjectMap.get(quiz.subject_id);
        if (!subject || !subjectIds.includes(quiz.subject_id)) return null;

        // Calculate accuracy (same as score)
        const accuracy = attempt.score || 0;

        // Determine bet status
        const betStatus = accuracy >= 80 ? "Won Bet" : "Lost Bet";

        return {
          attemptId: attempt.id,
          quizId: attempt.quiz_id,
          subjectName: subject.name,
          subjectId: quiz.subject_id,
          week: quiz.week,
          score: attempt.score || 0,
          accuracy,
          betStatus,
          bet: attempt.bet || 0,
          startTime: attempt.start_time,
          status: attempt.status,
        };
      })
      .filter((a) => a !== null);

    // 📦 Group attempts by subject
    const groupedBySubject: Record<string, any[]> = {};

    filteredAttempts.forEach((attempt: any) => {
      const subjectId = attempt.subjectId;

      if (!groupedBySubject[subjectId]) {
        groupedBySubject[subjectId] = [];
      }

      groupedBySubject[subjectId].push(attempt);
    });

    // 🔤 Sort subjects alphabetically and attempts by most recent
    const sortedHistory = Object.entries(groupedBySubject)
      .sort(([, a], [, b]) => {
        const nameA = a[0]?.subjectName || "";
        const nameB = b[0]?.subjectName || "";
        return nameA.localeCompare(nameB);
      })
      .map(([subjectId, attempts]) => ({
        subjectId,
        subjectName: attempts[0]?.subjectName || "Unknown",
        attempts: attempts.sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        ),
      }));

    return NextResponse.json(sortedHistory);
  } catch (err) {
    console.error("Quiz history error:", err);
    return NextResponse.json(
      { message: "Failed to fetch quiz history" },
      { status: 500 }
    );
  }
}
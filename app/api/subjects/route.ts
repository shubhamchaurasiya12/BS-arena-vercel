// app/api/subjects/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET(_req: NextRequest) {
  // 🔐 Auth check
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // 📘 All subjects
    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("id, name");

    if (subjectsError) throw subjectsError;

    // 📌 User-selected subjects
    const { data: userSubjects, error: userSubjectsError } = await supabase
      .from("user_subjects")
      .select("subject_id")
      .eq("user_id", userId);

    if (userSubjectsError) throw userSubjectsError;

    return NextResponse.json({
      subjects: subjects ?? [],
      selectedSubjectIds: (userSubjects ?? []).map((s) => s.subject_id),
    });
  } catch (err) {
    console.error("Subjects API error:", err);
    return NextResponse.json(
      { message: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

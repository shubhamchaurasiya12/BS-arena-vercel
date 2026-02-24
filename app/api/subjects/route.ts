// app/api/subjects/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Auth
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 📘 Fetch all subjects
    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("id, name")
      .order("name");

    if (subjectsError) throw subjectsError;

    // 📌 Fetch user selected subjects
    const { data: userSubjects, error: userSubjectsError } =
      await supabase
        .from("user_subjects")
        .select("subject_id")
        .eq("user_id", userId);

    if (userSubjectsError) throw userSubjectsError;

    const selectedSubjectIds =
      userSubjects?.map((s) => s.subject_id) ?? [];

    return NextResponse.json({
      subjects: subjects ?? [],
      selectedSubjectIds,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

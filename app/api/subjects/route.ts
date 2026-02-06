import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

type JwtPayload = {
  userId: string;
};

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { userId } = verifyToken<JwtPayload>(token);

    // All subjects
    const { data: subjects } = await supabase
      .from("subjects")
      .select("id, name");

    // User-selected subjects
    const { data: userSubjects } = await supabase
      .from("user_subjects")
      .select("subject_id")
      .eq("user_id", userId);

    return NextResponse.json({
      subjects: subjects || [],
      selectedSubjectIds: (userSubjects || []).map(
        (s) => s.subject_id
      ),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

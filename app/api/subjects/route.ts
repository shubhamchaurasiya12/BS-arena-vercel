import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    // ✅ Get NextAuth session instead of JWT
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; // SAME as JWT userId before

    // ✅ All subjects (unchanged)
    const { data: subjects } = await supabase
      .from("subjects")
      .select("id, name");

    // ✅ User-selected subjects (unchanged)
    const { data: userSubjects } = await supabase
      .from("user_subjects")
      .select("subject_id")
      .eq("user_id", userId);

    return NextResponse.json({
      subjects: subjects || [],
      selectedSubjectIds: (userSubjects || []).map((s) => s.subject_id),
    });
  } catch (err) {
    console.error("Subjects API Error:", err);
    return NextResponse.json(
      { message: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
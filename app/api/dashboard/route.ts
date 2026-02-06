import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

type JwtPayload = {
  userId: string;
};

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 🔐 Decode JWT
    const decoded = verifyToken<JwtPayload>(token);
    const userId = decoded.userId;

    // 👤 Fetch user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(
        "id, name, email, total_points, active_subject_count"
      )
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 📚 Fetch subjects
    const { data: subjects, error: subjectsError } =
      await supabase
        .from("user_subjects")
        .select("subject_id, subjects(name)")
        .eq("user_id", userId);

    if (subjectsError) {
      // Same behavior as Express: return empty subjects
      return NextResponse.json({
        user,
        subjects: [],
      });
    }

    return NextResponse.json({
      user,
      subjects: subjects || [],
    });
  } catch {
    return NextResponse.json(
      { message: "Dashboard error" },
      { status: 500 }
    );
  }
}

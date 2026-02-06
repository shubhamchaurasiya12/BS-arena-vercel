import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

type JwtPayload = { userId: string };

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7); // always string
    const { userId } = verifyToken<JwtPayload>(token);

    const { subjectId } = await req.json();

    if (!subjectId) {
      return NextResponse.json(
        { message: "subjectId is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch current subjects
    const { data: currentSubjects } = await supabase
      .from("user_subjects")
      .select("subject_id")
      .eq("user_id", userId);

    const subjectIds =
      currentSubjects?.map((s) => s.subject_id) ?? [];

    // 2️⃣ Validations (same as legacy)
    if (subjectIds.includes(subjectId)) {
      return NextResponse.json(
        { message: "Subject already selected" },
        { status: 400 }
      );
    }

    if (subjectIds.length >= 4) {
      return NextResponse.json(
        { message: "Maximum 4 subjects allowed" },
        { status: 400 }
      );
    }

    // 3️⃣ Insert subject
    await supabase.from("user_subjects").insert({
      id: uuidv4(),
      user_id: userId,
      subject_id: subjectId,
    });

    // 4️⃣ Update count
    await supabase
      .from("users")
      .update({
        active_subject_count: subjectIds.length + 1,
      })
      .eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ addUserSubject error:", err);
    return NextResponse.json(
      { message: "Failed to add subject" },
      { status: 500 }
    );
  }
}

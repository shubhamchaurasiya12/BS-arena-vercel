import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await verifyToken(); // ✅ NextAuth session

    const { subjectId } = await req.json();
    if (!subjectId) {
      return NextResponse.json({ message: "subjectId required" }, { status: 400 });
    }

    const { data: currentSubjects } = await supabase
      .from("user_subjects")
      .select("subject_id")
      .eq("user_id", userId);

    const subjectIds = currentSubjects?.map(s => s.subject_id) ?? [];

    if (subjectIds.includes(subjectId)) {
      return NextResponse.json({ message: "Already selected" }, { status: 400 });
    }

    if (subjectIds.length >= 4) {
      return NextResponse.json({ message: "Max 4 subjects" }, { status: 400 });
    }

    await supabase.from("user_subjects").insert({
      id: uuidv4(),
      user_id: userId,
      subject_id: subjectId,
    });

    await supabase
      .from("users")
      .update({ active_subject_count: subjectIds.length + 1 })
      .eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
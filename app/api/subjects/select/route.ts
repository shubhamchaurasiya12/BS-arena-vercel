import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

type JwtPayload = { userId: string };

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const { userId } = verifyToken<JwtPayload>(token);

    const { subjectIds } = await req.json();

    // ✅ EXACT legacy validation
    if (!Array.isArray(subjectIds) || subjectIds.length > 4) {
      return NextResponse.json(
        { message: "Invalid subject selection" },
        { status: 400 }
      );
    }

    // 1️⃣ Remove existing subjects
    await supabase
      .from("user_subjects")
      .delete()
      .eq("user_id", userId);

    // 2️⃣ Insert new ones
    if (subjectIds.length > 0) {
      await supabase.from("user_subjects").insert(
        subjectIds.map((id: string) => ({
          id: uuidv4(),
          user_id: userId,
          subject_id: id,
        }))
      );
    }

    // 3️⃣ Update count
    await supabase
      .from("users")
      .update({ active_subject_count: subjectIds.length })
      .eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("selectSubjects error:", err);
    return NextResponse.json(
      { message: "Subject update failed" },
      { status: 500 }
    );
  }
}

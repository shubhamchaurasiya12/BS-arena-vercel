// app/api/subjects/select/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  // 🔐 Auth
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
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

    // 2️⃣ Insert new subjects
    if (subjectIds.length > 0) {
      await supabase.from("user_subjects").insert(
        subjectIds.map((id: string) => ({
          id: uuidv4(),
          user_id: userId,
          subject_id: id,
        }))
      );
    }

    // 3️⃣ Update active subject count
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

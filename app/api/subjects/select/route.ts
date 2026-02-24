// app/api/subjects/select/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    // 🔐 Authenticate
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 📦 Parse body safely
    const body = await req.json();
    const subjectIds = body?.subjectIds;

    // ✅ Validate input
    if (
      !Array.isArray(subjectIds) ||
      subjectIds.length > 4 ||
      subjectIds.some((id) => typeof id !== "string")
    ) {
      return NextResponse.json(
        { message: "Invalid subject selection" },
        { status: 400 }
      );
    }

    // 🧹 Remove duplicates (safety)
    const uniqueSubjectIds = [...new Set(subjectIds)];

    // 🔁 1️⃣ Remove all existing subjects for user
    const { error: deleteError } = await supabase
      .from("user_subjects")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Delete subjects error:", deleteError);
      throw deleteError;
    }

    // ➕ 2️⃣ Insert new subjects
    if (uniqueSubjectIds.length > 0) {
      const insertPayload = uniqueSubjectIds.map((subjectId) => ({
        id: uuidv4(),
        user_id: userId,
        subject_id: subjectId,
      }));

      const { error: insertError } = await supabase
        .from("user_subjects")
        .insert(insertPayload);

      if (insertError) {
        console.error("Insert subjects error:", insertError);
        throw insertError;
      }
    }

    // 🔢 3️⃣ Update active subject count
    const { error: updateError } = await supabase
      .from("users")
      .update({ active_subject_count: uniqueSubjectIds.length })
      .eq("id", userId);

    if (updateError) {
      console.error("Update count error:", updateError);
      throw updateError;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("selectSubjects error:", error);

    return NextResponse.json(
      { message: "Subject update failed" },
      { status: 500 }
    );
  }
}

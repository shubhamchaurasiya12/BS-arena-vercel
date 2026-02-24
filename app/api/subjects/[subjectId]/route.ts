// app/api/subjects/[subjectId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: { subjectId?: string } }
) {
  // 🔐 Auth
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const subjectId = params.subjectId;

  if (!subjectId) {
    return NextResponse.json(
      { message: "subjectId is required" },
      { status: 400 }
    );
  }

  // 🗑 Remove subject
  await supabase
    .from("user_subjects")
    .delete()
    .eq("user_id", userId)
    .eq("subject_id", subjectId);

  // 🔢 Recalculate active_subject_count
  const { count } = await supabase
    .from("user_subjects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // 🔄 Update user
  await supabase
    .from("users")
    .update({ active_subject_count: count ?? 0 })
    .eq("id", userId);

  // 🔁 Redirect back to dashboard
  return NextResponse.redirect(new URL("/dashboard", req.url));
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ subjectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { subjectId } = await context.params;
    const userId = session.user.id;

    if (!subjectId) {
      return NextResponse.json(
        { message: "Subject ID missing" },
        { status: 400 }
      );
    }

    /* =========================
       1️⃣ Delete relation
    ========================== */
    const { error: deleteError } = await supabase
      .from("user_subjects")
      .delete()
      .eq("user_id", userId)
      .eq("subject_id", subjectId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      throw deleteError;
    }

    /* =========================
       2️⃣ Recalculate count
    ========================== */
    const { count, error: countError } = await supabase
      .from("user_subjects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Count error:", countError);
      throw countError;
    }

    /* =========================
       3️⃣ Update users table
    ========================== */
    const { error: updateError } = await supabase
      .from("users")
      .update({ active_subject_count: count ?? 0 })
      .eq("id", userId);

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete route error:", err);

    return NextResponse.json(
      { message: "Failed to remove subject" },
      { status: 500 }
    );
  }
}

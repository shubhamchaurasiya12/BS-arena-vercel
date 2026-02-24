//D:\BS-arena-NextJS\app\api\subjects\delete\route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { subjectId } = await req.json();

    if (!subjectId) {
      return NextResponse.json(
        { message: "Subject ID required" },
        { status: 400 }
      );
    }

    // 1️⃣ Delete subject relation
    const { error: deleteError } = await supabase
      .from("user_subjects")
      .delete()
      .eq("user_id", userId)
      .eq("subject_id", subjectId);

    if (deleteError) throw deleteError;

    // 2️⃣ Recalculate actual count from DB
    const { count, error: countError } = await supabase
      .from("user_subjects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) throw countError;

    // 3️⃣ Update users table
    const { error: updateError } = await supabase
      .from("users")
      .update({ active_subject_count: count ?? 0 })
      .eq("id", userId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete subject error:", error);

    return NextResponse.json(
      { message: "Failed to delete subject" },
      { status: 500 }
    );
  }
}

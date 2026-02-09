// app/api/subjects/add/route.ts

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

  // 📥 Body
  const { subjectId } = await req.json();

  if (!subjectId) {
    return NextResponse.json(
      { message: "subjectId required" },
      { status: 400 }
    );
  }

  // 📚 Existing subjects
  const { data: currentSubjects } = await supabase
    .from("user_subjects")
    .select("subject_id")
    .eq("user_id", userId);

  const subjectIds = currentSubjects?.map((s) => s.subject_id) ?? [];

  if (subjectIds.includes(subjectId)) {
    return NextResponse.json(
      { message: "Already selected" },
      { status: 400 }
    );
  }

  if (subjectIds.length >= 4) {
    return NextResponse.json(
      { message: "Max 4 subjects allowed" },
      { status: 400 }
    );
  }

  // ➕ Insert subject
  await supabase.from("user_subjects").insert({
    id: uuidv4(),
    user_id: userId,
    subject_id: subjectId,
  });

  // 🔄 Update count
  await supabase
    .from("users")
    .update({ active_subject_count: subjectIds.length + 1 })
    .eq("id", userId);

  return NextResponse.json({ success: true });
}

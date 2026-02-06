import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

type JwtPayload = { userId: string };

export async function POST(
  req: NextRequest,
  { params }: { params: { subjectId?: string } }
) {
  // 1️⃣ Validate Authorization header
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7); // safer than split

  if (!token) {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }

  // 2️⃣ Validate route param
  const subjectId = params.subjectId;
  if (!subjectId) {
    return NextResponse.json(
      { message: "subjectId is required" },
      { status: 400 }
    );
  }

  // 3️⃣ Verify JWT
  const { userId } = verifyToken<JwtPayload>(token);

  // 4️⃣ Delete subject
  await supabase
    .from("user_subjects")
    .delete()
    .eq("user_id", userId)
    .eq("subject_id", subjectId);

  // 5️⃣ Recalculate active_subject_count
  const { count } = await supabase
    .from("user_subjects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // 6️⃣ Update user
  await supabase
    .from("users")
    .update({ active_subject_count: count || 0 })
    .eq("id", userId);

  // 7️⃣ Redirect back to dashboard
  return NextResponse.redirect(
    new URL("/dashboard", req.url)
  );
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ subjectId?: string }> }
) {
  // 1️⃣ Unwrap params (IMPORTANT)
  const { subjectId } = await context.params;

  if (!subjectId) {
    return NextResponse.json(
      { message: "subjectId is required" },
      { status: 400 }
    );
  }

  // 2️⃣ Auth
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);
  const { userId } = verifyToken<JwtPayload>(token);

  // 3️⃣ Delete subject
  await supabase
    .from("user_subjects")
    .delete()
    .eq("user_id", userId)
    .eq("subject_id", subjectId);

  // 4️⃣ Recalculate subject count
  const { count } = await supabase
    .from("user_subjects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // 5️⃣ Update user
  await supabase
    .from("users")
    .update({ active_subject_count: count || 0 })
    .eq("id", userId);

  return NextResponse.json({ success: true });
}
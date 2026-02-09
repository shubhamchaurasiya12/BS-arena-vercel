// app/api/notes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  // 🔐 Auth check (NextAuth session)
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 📥 Query params
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");
  const week = searchParams.get("week");
  const phase = searchParams.get("phase");

  if (!subjectId || !week || !phase) {
    return NextResponse.json(
      { message: "Missing query parameters" },
      { status: 400 }
    );
  }

  // 📚 Fetch notes
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("subject_id", subjectId)
    .eq("week", Number(week))
    .eq("phase", phase);

  if (error) {
    console.error("Notes API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch notes" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

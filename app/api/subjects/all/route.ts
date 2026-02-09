// app/api/subjects/all/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // 🔐 Auth (NextAuth session)
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 📘 Fetch all subjects
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name");

  if (error) {
    console.error("Subjects all API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch subjects" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

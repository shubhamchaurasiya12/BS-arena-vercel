// app/api/pomodoro/active/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", false)
      .eq("invalidated", false)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(data ?? null);

  } catch (err) {
    console.error("Pomodoro active error:", err);
    return NextResponse.json(
      { message: "Failed to fetch active session" },
      { status: 500 }
    );
  }
}

// app/api/pomodoro/invalidate/route.ts

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
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { message: "sessionId required" },
        { status: 400 }
      );
    }

    await supabase
      .from("pomodoro_sessions")
      .update({
        invalidated: true,
        end_time: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("user_id", userId);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Pomodoro invalidate error:", err);
    return NextResponse.json(
      { message: "Failed to invalidate session" },
      { status: 500 }
    );
  }
}

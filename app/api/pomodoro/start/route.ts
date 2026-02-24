// app/api/pomodoro/start/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { mode } = await req.json();

    if (mode !== "SHORT" && mode !== "LONG") {
      return NextResponse.json(
        { message: "Invalid mode" },
        { status: 400 }
      );
    }

    const duration = mode === "SHORT" ? 1500 : 3000;

    // 🚫 Check existing active session
    const { data: existing } = await supabase
      .from("pomodoro_sessions")
      .select("id")
      .eq("user_id", userId)
      .eq("completed", false)
      .eq("invalidated", false)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { message: "Active session already exists" },
        { status: 400 }
      );
    }

    const newSession = {
      id: uuidv4(),
      user_id: userId,
      subject_id: null,
      mode,
      duration,
      start_time: new Date().toISOString(),
      completed: false,
      invalidated: false,
      points_earned: 0,
    };

    const { error } = await supabase
      .from("pomodoro_sessions")
      .insert(newSession);

    if (error) throw error;

    return NextResponse.json({
      sessionId: newSession.id,
      startTime: newSession.start_time,
      duration,
      mode,
    });

  } catch (err) {
    console.error("Pomodoro start error:", err);
    return NextResponse.json(
      { message: "Failed to start session" },
      { status: 500 }
    );
  }
}

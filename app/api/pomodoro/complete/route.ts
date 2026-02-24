// app/api/pomodoro/complete/route.ts

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

    const { data: pomodoro, error } = await supabase
      .from("pomodoro_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !pomodoro) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    if (pomodoro.completed || pomodoro.invalidated) {
      return NextResponse.json(
        { message: "Session already finalized" },
        { status: 400 }
      );
    }

    const now = Date.now();
    const start = new Date(pomodoro.start_time).getTime();
    const elapsedSeconds = Math.floor((now - start) / 1000);

    if (elapsedSeconds < pomodoro.duration) {
      // ⛔ Too early → invalidate
      await supabase
        .from("pomodoro_sessions")
        .update({
          invalidated: true,
          end_time: new Date().toISOString(),
        })
        .eq("id", sessionId);

      return NextResponse.json(
        { message: "Session invalidated (too early)" },
        { status: 400 }
      );
    }

    const points = pomodoro.mode === "SHORT" ? 5 : 10;

    // ✅ Mark completed
    await supabase
      .from("pomodoro_sessions")
      .update({
        completed: true,
        end_time: new Date().toISOString(),
        points_earned: points,
      })
      .eq("id", sessionId);

    // ➕ Update user points
    await supabase.rpc("increment_user_points", {
      user_id_input: userId,
      points_input: points,
    });

    return NextResponse.json({ pointsEarned: points });

  } catch (err) {
    console.error("Pomodoro complete error:", err);
    return NextResponse.json(
      { message: "Failed to complete session" },
      { status: 500 }
    );
  }
}

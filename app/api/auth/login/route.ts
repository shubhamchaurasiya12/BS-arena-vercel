import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";

const BONUS_POINTS = 100;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );
    }

    // Fetch user
    const { data: user, error } = await supabase
      .from("users")
      .select(
        "id, name, email, password_hash, total_points, active_subject_count, has_received_welcome_bonus"
      )
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    let updatedPoints = user.total_points;

    // 🎁 Welcome bonus (same logic as Express)
    if (!user.has_received_welcome_bonus) {
      updatedPoints += BONUS_POINTS;

      await supabase
        .from("users")
        .update({
          total_points: updatedPoints,
          has_received_welcome_bonus: true,
        })
        .eq("id", user.id);

      await supabase.from("points_history").insert({
        id: uuidv4(),
        user_id: user.id,
        change: BONUS_POINTS,
        reason: "Welcome bonus on first login",
      });
    }

    // Sign JWT
    const token = signToken({ userId: user.id });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        total_points: updatedPoints,
        active_subject_count: user.active_subject_count,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

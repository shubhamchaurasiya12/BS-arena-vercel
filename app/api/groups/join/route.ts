// app/api/groups/join/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

/* ================================
   🔁 AUTHORITATIVE RECALCULATION
================================ */
async function recalculateGroupStats(groupId: string) {
  // Fetch all members AFTER insert is fully committed
  const { data: members, error: memberError } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (memberError || !members) return;

  let totalPoints = 0;
  let totalLP = 0;

  for (const member of members) {
    const { data: user } = await supabase
      .from("users")
      .select("total_points, active_subject_count")
      .eq("id", member.user_id)
      .single();

    if (!user) continue;

    const lp =
      user.total_points /
      Math.max(user.active_subject_count, 1);

    totalPoints += user.total_points;
    totalLP += lp;
  }

  const totalMembers = members.length;

  await supabase
    .from("group_stats")
    .update({
      total_points: totalPoints,
      total_leaderboard_points: totalLP,
      total_members: totalMembers,
      updated_at: new Date(),
    })
    .eq("group_id", groupId);

  await supabase
    .from("groups")
    .update({
      is_active: totalMembers >= 2,
    })
    .eq("id", groupId);
}

/* ================================
   🚪 JOIN GROUP
================================ */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { inviteCode } = await req.json();

    if (!inviteCode) {
      return NextResponse.json(
        { message: "Invite code required" },
        { status: 400 }
      );
    }

    // ============================
    // Check if already in group
    // ============================
    const { data: existingMembership } = await supabase
      .from("group_members")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingMembership) {
      return NextResponse.json(
        { message: "You are already in a group." },
        { status: 400 }
      );
    }

    // ============================
    // Find group by invite code
    // ============================
    const { data: group } = await supabase
      .from("groups")
      .select("*")
      .eq("invite_code", inviteCode)
      .maybeSingle();

    if (!group) {
      return NextResponse.json(
        { message: "Invalid invite code" },
        { status: 404 }
      );
    }

    // ============================
    // Check member limit
    // ============================
    const { data: stats } = await supabase
      .from("group_stats")
      .select("total_members")
      .eq("group_id", group.id)
      .single();

    if (!stats) {
      return NextResponse.json(
        { message: "Group stats not found" },
        { status: 500 }
      );
    }

    if (stats.total_members >= 4) {
      return NextResponse.json(
        { message: "Group is full" },
        { status: 400 }
      );
    }

    // ============================
    // Insert membership
    // IMPORTANT: use .select() to ensure commit
    // ============================
    const { error: insertError } = await supabase
      .from("group_members")
      .insert({
        group_id: group.id,
        user_id: userId,
        role: "member",
      })
      .select(); // 🔥 ensures the row is committed before recalculation

    if (insertError) {
      return NextResponse.json(
        { message: "Failed to join group" },
        { status: 500 }
      );
    }

    // ============================
    // Recalculate authoritative totals
    // ============================
    await recalculateGroupStats(group.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Join group error:", err);
    return NextResponse.json(
      { message: "Failed to join group" },
      { status: 500 }
    );
  }
}

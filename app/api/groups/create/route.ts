// app/api/groups/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import { randomBytes } from "crypto";

/* ================================
   🔑 GENERATE INVITE CODE
================================ */
function generateInviteCode() {
  return randomBytes(4).toString("hex");
}

/* ================================
   🔁 AUTHORITATIVE RECALCULATION
================================ */
async function recalculateGroupStats(groupId: string) {
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
   🏗 CREATE GROUP
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
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Group name is required" },
        { status: 400 }
      );
    }

    // ============================
    // Ensure user not already in group
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
    // Generate unique invite code
    // ============================
    let inviteCode = generateInviteCode();
    let codeExists = true;

    while (codeExists) {
      const { data } = await supabase
        .from("groups")
        .select("id")
        .eq("invite_code", inviteCode)
        .maybeSingle();

      if (!data) {
        codeExists = false;
      } else {
        inviteCode = generateInviteCode();
      }
    }

    // ============================
    // Insert group
    // ============================
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({
        name,
        created_by: userId,
        invite_code: inviteCode,
        is_active: false,
      })
      .select()
      .single();

    if (groupError || !group) {
      throw groupError;
    }

    // ============================
    // Insert admin membership (commit guaranteed)
    // ============================
    const { error: memberError } = await supabase
      .from("group_members")
      .insert({
        group_id: group.id,
        user_id: userId,
        role: "admin",
      })
      .select(); // 🔥 ensure insert committed

    if (memberError) {
      throw memberError;
    }

    // ============================
    // Create empty stats row
    // ============================
    const { error: statsError } = await supabase
      .from("group_stats")
      .insert({
        group_id: group.id,
        total_points: 0,
        total_leaderboard_points: 0,
        total_members: 0,
      });

    if (statsError) {
      throw statsError;
    }

    // ============================
    // Authoritative recalculation
    // ============================
    await recalculateGroupStats(group.id);

    return NextResponse.json({ group });
  } catch (err) {
    console.error("Create group error:", err);
    return NextResponse.json(
      { message: "Failed to create group" },
      { status: 500 }
    );
  }
}

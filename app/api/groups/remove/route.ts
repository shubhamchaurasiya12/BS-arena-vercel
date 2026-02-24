// app/api/groups/remove/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

// 🔥 Authoritative recalculation
async function recalculateGroupStats(groupId: string) {
  const { data: members } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (!members) return;

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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const adminId = session.user.id;
    const { userIdToRemove } = await req.json();

    if (!userIdToRemove) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    // 🔍 Verify admin membership
    const { data: adminMembership } = await supabase
      .from("group_members")
      .select("group_id, role")
      .eq("user_id", adminId)
      .maybeSingle();

    if (!adminMembership || adminMembership.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can remove members" },
        { status: 403 }
      );
    }

    const groupId = adminMembership.group_id;

    if (adminId === userIdToRemove) {
      return NextResponse.json(
        { message: "Admin cannot remove themselves" },
        { status: 400 }
      );
    }

    // 🔍 Verify target user is in same group
    const { data: targetMembership } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userIdToRemove)
      .maybeSingle();

    if (!targetMembership) {
      return NextResponse.json(
        { message: "User not in this group" },
        { status: 400 }
      );
    }

    // ❌ Remove member
    await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userIdToRemove);

    // 🔥 Recalculate group stats
    await recalculateGroupStats(groupId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Remove member error:", err);
    return NextResponse.json(
      { message: "Failed to remove member" },
      { status: 500 }
    );
  }
}

// app/api/groups/exit/route.ts

import { NextResponse } from "next/server";
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

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 🔍 Check membership
    const { data: membership } = await supabase
      .from("group_members")
      .select("group_id, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json(
        { message: "Not in a group" },
        { status: 400 }
      );
    }

    if (membership.role === "admin") {
      return NextResponse.json(
        { message: "Admin must delete group" },
        { status: 400 }
      );
    }

    const groupId = membership.group_id;

    // ❌ Remove membership
    await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    // 🔥 Recalculate group stats
    await recalculateGroupStats(groupId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Exit group error:", err);
    return NextResponse.json(
      { message: "Failed to exit group" },
      { status: 500 }
    );
  }
}

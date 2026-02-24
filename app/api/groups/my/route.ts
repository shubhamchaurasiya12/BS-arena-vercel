// app/api/groups/my/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ============================
    // 1️⃣ Check Membership
    // ============================

    const { data: membership } = await supabase
      .from("group_members")
      .select("group_id, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ group: null });
    }

    const groupId = membership.group_id;

    // ============================
    // 2️⃣ Fetch Group Info
    // ============================

    const { data: group } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    // ============================
    // 3️⃣ Fetch Group Stats
    // ============================

    const { data: stats } = await supabase
      .from("group_stats")
      .select("*")
      .eq("group_id", groupId)
      .single();

    // ============================
    // 4️⃣ Fetch Members
    // ============================

    const { data: members } = await supabase
      .from("group_members")
      .select(
        "user_id, role, users(name, total_points, active_subject_count)"
      )
      .eq("group_id", groupId);

    if (!members) {
      return NextResponse.json({
        group,
        stats,
        members: [],
        myRole: membership.role,
      });
    }

    // ============================
    // 5️⃣ Compute Live Leaderboard Points
    // ============================

    const enrichedMembers = members.map((m: any) => {
      const totalPoints = m.users?.total_points ?? 0;
      const subjectCount =
        m.users?.active_subject_count ?? 1;

      const leaderboardPoint =
        totalPoints / Math.max(subjectCount, 1);

      return {
        user_id: m.user_id,
        role: m.role,
        name: m.users?.name ?? "Unknown",
        total_points: totalPoints,
        active_subject_count: subjectCount,
        leaderboard_point: leaderboardPoint,
      };
    });

    return NextResponse.json({
      group,
      stats,
      members: enrichedMembers,
      myRole: membership.role,
    });
  } catch (err) {
    console.error("My group error:", err);
    return NextResponse.json(
      { message: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

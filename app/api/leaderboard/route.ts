// app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

type LeaderboardEntry = {
  id: string;
  name: string;
  type: "student" | "group";
  total_points: number;
  active_subject_count: number | null;
  total_members: number | null;
  leaderboard_points: number;
  isCurrentUser: boolean;
  position?: number;
};

/* =====================================================
   🗄️ SERVER-SIDE CACHE
   Stores the leaderboard (without isCurrentUser) for
   CACHE_TTL_MS milliseconds. All users share one cached
   result — only the isCurrentUser flag is personalised
   per request after the cache is hit.
   ===================================================== */
const CACHE_TTL_MS = 60_000; // 60 seconds

let cachedData: Omit<LeaderboardEntry, "isCurrentUser">[] | null = null;
let cacheTimestamp = 0;

async function getLeaderboardData(): Promise<Omit<LeaderboardEntry, "isCurrentUser">[]> {
  const now = Date.now();

  // ✅ Return cached data if still fresh
  if (cachedData && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedData;
  }

  /* =====================================================
     1️⃣ FETCH STUDENTS + GROUPS IN PARALLEL
     ===================================================== */
  const [usersResult, groupsResult] = await Promise.all([
    supabase
      .from("users")
      .select("id, name, total_points, active_subject_count"),

    supabase
      .from("groups")
      .select(`
        id,
        name,
        is_active,
        group_stats (
          total_points,
          total_leaderboard_points,
          total_members
        )
      `)
      .eq("is_active", true),
  ]);

  if (usersResult.error) throw usersResult.error;
  if (groupsResult.error) throw groupsResult.error;

  /* =====================================================
     2️⃣ BUILD STUDENT ENTRIES
     ===================================================== */
  const studentLeaderboard: Omit<LeaderboardEntry, "isCurrentUser">[] =
    (usersResult.data ?? []).map((user) => {
      const subjectCount = user.active_subject_count ?? 0;
      return {
        id: user.id,
        name: user.name,
        type: "student",
        total_points: user.total_points ?? 0,
        active_subject_count: subjectCount,
        total_members: null,
        leaderboard_points: subjectCount > 0
          ? user.total_points / subjectCount
          : 0,
      };
    });

  /* =====================================================
     3️⃣ BUILD GROUP ENTRIES
     ===================================================== */
  const groupLeaderboard: Omit<LeaderboardEntry, "isCurrentUser">[] =
    (groupsResult.data ?? [])
      .filter((g: any) => g.group_stats && g.group_stats.total_members > 0)
      .map((group: any) => {
        const stats = group.group_stats;
        return {
          id: group.id,
          name: group.name,
          type: "group",
          total_points: stats.total_points ?? 0,
          active_subject_count: null,
          total_members: stats.total_members,
          leaderboard_points: stats.total_members > 0
            ? stats.total_leaderboard_points / stats.total_members
            : 0,
        };
      });

  /* =====================================================
     4️⃣ COMBINE, SORT, ASSIGN POSITIONS
     ===================================================== */
  const combined = [...studentLeaderboard, ...groupLeaderboard];
  combined.sort((a, b) => b.leaderboard_points - a.leaderboard_points);
  const withPositions = combined.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));

  // ✅ Store in cache
  cachedData = withPositions;
  cacheTimestamp = now;

  return withPositions;
}

/* =====================================================
   ROUTE HANDLER
   ===================================================== */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // ✅ Get cached (or freshly fetched) leaderboard
    const data = await getLeaderboardData();

    // ✅ Personalise isCurrentUser flag without touching cache
    const finalLeaderboard: LeaderboardEntry[] = data.map((entry) => ({
      ...entry,
      isCurrentUser: entry.id === currentUserId,
    }));

    return NextResponse.json(finalLeaderboard, {
      headers: {
        // ✅ Tell the browser to treat response as fresh for 30s
        // so rapid re-visits don't even hit the server
        "Cache-Control": "private, max-age=30",
      },
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json(
      { message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
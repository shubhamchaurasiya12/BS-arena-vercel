//D:\BS-arena-NextJS\app\api\groups\delete\route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { data: membership } = await supabase
      .from("group_members")
      .select("group_id, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!membership || membership.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can delete group" },
        { status: 403 }
      );
    }

    await supabase
      .from("groups")
      .delete()
      .eq("id", membership.group_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete group error:", err);
    return NextResponse.json(
      { message: "Failed to delete group" },
      { status: 500 }
    );
  }
}

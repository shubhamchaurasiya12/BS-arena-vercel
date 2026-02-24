// D:\BS-arena-NextJS\lib\adminGuard.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !user || user.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }

  return { userId: session.user.id };
}

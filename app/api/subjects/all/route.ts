import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

type JwtPayload = { userId: string };

export async function GET(req: NextRequest) {
  // 1️⃣ Auth
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);
  verifyToken<JwtPayload>(token); // we only need to verify

  // 2️⃣ Fetch all subjects
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name");

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}

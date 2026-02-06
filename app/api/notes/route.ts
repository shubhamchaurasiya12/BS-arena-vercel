import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

type JwtPayload = { userId: string };

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    verifyToken<JwtPayload>(authHeader.slice(7));

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const week = searchParams.get("week");
    const phase = searchParams.get("phase");

    if (!subjectId || !week || !phase) {
      return NextResponse.json(
        { message: "Missing query parameters" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("subject_id", subjectId)
      .eq("week", Number(week))
      .eq("phase", phase);

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

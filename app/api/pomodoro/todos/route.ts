// app/api/pomodoro/todos/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

/* ================= GET TODOS ================= */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { data, error } = await supabase
      .from("pomodoro_todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data ?? []);

  } catch (err) {
    console.error("GET todos error:", err);
    return NextResponse.json(
      { message: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

/* ================= CREATE TODO ================= */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { message: "Text is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pomodoro_todos")
      .insert({
        user_id: userId,
        text: text.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });

  } catch (err) {
    console.error("POST todo error:", err);
    return NextResponse.json(
      { message: "Failed to create todo" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE TODO ================= */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id, done } = await req.json();

    if (!id || typeof done !== "boolean") {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("pomodoro_todos")
      .update({ done })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("PATCH todo error:", err);
    return NextResponse.json(
      { message: "Failed to update todo" },
      { status: 500 }
    );
  }
}

/* ================= DELETE TODO ================= */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Todo id required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("pomodoro_todos")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE todo error:", err);
    return NextResponse.json(
      { message: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validation (same as Express)
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { error } = await supabase.from("users").insert({
      id: uuidv4(),
      name,
      email,
      password_hash: hashedPassword,
      total_points: 0,
      active_subject_count: 0,
      has_received_welcome_bonus: false,
    });

    if (error) {
    // Handle duplicate email gracefully
    if (error.code === "23505") {
        return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
        );
    }

    return NextResponse.json(
        { message: "Registration failed" },
        { status: 400 }
    );
    }


    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function GET() {
  try {
    const users = await query("SELECT id, username, email, role, full_name FROM users");
    return NextResponse.json(users);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

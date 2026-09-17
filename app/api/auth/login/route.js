import { NextResponse } from "next/server";
import { ensureSchema, isDbConfigured } from "@/lib/db";
import { verifyPin, setSessionCookie } from "@/lib/auth-server";

export async function POST(request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "No database is configured yet. Ask your admin to set DATABASE_URL.", code: "db_not_configured" },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request.", code: "server_error" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const pin = (body.pin || "").trim();

  if (!name || !pin) {
    return NextResponse.json({ error: "Enter your name and PIN.", code: "missing_fields" }, { status: 400 });
  }

  try {
    const sql = await ensureSchema();
    const rows = await sql`SELECT id, name, role, pin_hash FROM users WHERE lower(name) = lower(${name})`;
    const user = rows[0];

    if (!user || !verifyPin(pin, user.pin_hash)) {
      return NextResponse.json({ error: "Incorrect name or PIN.", code: "invalid_credentials" }, { status: 401 });
    }

    const publicUser = { id: user.id, name: user.name, role: user.role };
    return setSessionCookie(NextResponse.json({ user: publicUser }), publicUser);
  } catch (err) {
    return NextResponse.json({ error: err.message || "Something went wrong.", code: "server_error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { ensureSchema, isDbConfigured } from "@/lib/db";
import { hashPin, setSessionCookie } from "@/lib/auth-server";

export async function POST(request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "No database is configured yet. Ask your admin to set DATABASE_URL." }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const pin = (body.pin || "").trim();
  const hrCode = (body.hrCode || "").trim();

  if (name.length < 2 || name.length > 60) {
    return NextResponse.json({ error: "Please enter your name (2–60 characters)." }, { status: 400 });
  }
  if (!/^\d{4,8}$/.test(pin)) {
    return NextResponse.json({ error: "PIN must be 4–8 digits." }, { status: 400 });
  }

  try {
    const sql = await ensureSchema();

    const existing = await sql`SELECT id FROM users WHERE lower(name) = lower(${name})`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "That name is already taken. Try signing in instead." }, { status: 409 });
    }

    const role = hrCode && process.env.HR_SIGNUP_CODE && hrCode === process.env.HR_SIGNUP_CODE ? "hr" : "learner";
    const pinHash = hashPin(pin);

    const rows = await sql`
      INSERT INTO users (name, pin_hash, role)
      VALUES (${name}, ${pinHash}, ${role})
      RETURNING id, name, role
    `;
    const user = rows[0];

    return setSessionCookie(NextResponse.json({ user }), user);
  } catch (err) {
    if (err.code === "23505") {
      return NextResponse.json({ error: "That name is already taken. Try signing in instead." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}

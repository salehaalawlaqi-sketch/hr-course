import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { ensureSchema } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const sql = await ensureSchema();
  const rows = await sql`
    SELECT topic_id, passed, best_score, last_attempt FROM progress WHERE user_id = ${user.id}
  `;

  const progress = {};
  for (const row of rows) {
    progress[row.topic_id] = { passed: row.passed, bestScore: row.best_score, lastAttempt: row.last_attempt };
  }
  return NextResponse.json({ progress });
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { topicId, grade } = body;
  if (!topicId || typeof grade?.score !== "number") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const sql = await ensureSchema();
  const existing = await sql`
    SELECT passed, best_score FROM progress WHERE user_id = ${user.id} AND topic_id = ${topicId}
  `;
  const passed = Boolean(grade.passed) || existing[0]?.passed || false;
  const bestScore = Math.max(grade.score, existing[0]?.best_score ?? 0);

  await sql`
    INSERT INTO progress (user_id, topic_id, passed, best_score, last_attempt)
    VALUES (${user.id}, ${topicId}, ${passed}, ${bestScore}, now())
    ON CONFLICT (user_id, topic_id)
    DO UPDATE SET passed = ${passed}, best_score = ${bestScore}, last_attempt = now()
  `;

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { ensureSchema } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in.", code: "not_signed_in" }, { status: 401 });
  if (user.role !== "hr") return NextResponse.json({ error: "HR access only.", code: "hr_only" }, { status: 403 });

  const sql = await ensureSchema();
  const users = await sql`SELECT id, name, created_at FROM users ORDER BY created_at ASC`;
  const progressRows = await sql`SELECT user_id, topic_id, passed, best_score, last_attempt FROM progress`;

  const progressByUser = {};
  for (const row of progressRows) {
    if (!progressByUser[row.user_id]) progressByUser[row.user_id] = {};
    progressByUser[row.user_id][row.topic_id] = {
      passed: row.passed,
      bestScore: row.best_score,
      lastAttempt: row.last_attempt,
    };
  }

  const summaries = users.map((u) => ({
    profile: { id: u.id, name: u.name, createdAt: u.created_at },
    progress: progressByUser[u.id] || {},
  }));

  return NextResponse.json({ summaries });
}

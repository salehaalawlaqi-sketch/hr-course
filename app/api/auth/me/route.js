import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { isDbConfigured } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user, dbConfigured: isDbConfigured() });
}

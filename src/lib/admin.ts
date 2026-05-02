import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }), session: null };
  if (session.role !== "admin") return { error: NextResponse.json({ error: "Not authorized" }, { status: 403 }), session: null };
  return { error: null, session };
}

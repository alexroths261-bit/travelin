// Force dynamic - reads cookies at runtime
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const destinations = await prisma.destination.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ destinations });
}

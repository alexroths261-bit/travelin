// Force dynamic
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: { packages: { orderBy: { duration: "asc" } } },
  });

  if (!destination) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(destination);
}

// Force dynamic
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in" }, { status: 401 });
  try {
    const { destinationId, rating, comment } = await request.json();
    if (!destinationId || !rating || !comment) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    if (rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    const review = await prisma.review.create({
      data: { userId: session.userId as string, destinationId, rating: parseInt(rating), comment },
      include: { user: { select: { name: true } }, destination: { select: { name: true } } },
    });
    const allReviews = await prisma.review.findMany({ where: { destinationId }, include: { user: { select: { name: true } }, destination: { select: { name: true } } }, orderBy: { createdAt: "desc" } });
    const avgRating = allReviews.length > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 0;
    await prisma.destination.update({ where: { id: destinationId }, data: { rating: Math.round(avgRating * 10) / 10 } });
    return NextResponse.json({ review });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destId = searchParams.get("destinationId");
  const where = destId ? { destinationId: destId } : {};
  const reviews = await prisma.review.findMany({
    where,
    include: { user: { select: { name: true } }, destination: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json({ reviews });
}

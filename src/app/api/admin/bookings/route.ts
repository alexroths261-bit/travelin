// Force dynamic - reads cookies at runtime
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const bookings = await prisma.booking.findMany({ include: { user: { select: { name: true, email: true } }, package: { include: { destination: true } } }, orderBy: { createdAt: "desc" }, take: 50 });
  const totalRevenue = await prisma.booking.aggregate({ where: { status: "confirmed" }, _sum: { totalPrice: true } });
  const totalBookings = await prisma.booking.count();
  const totalUsers = await prisma.user.count({ where: { role: "user" } });
  const totalPackages = await prisma.package.count();
  return NextResponse.json({ bookings, stats: { revenue: totalRevenue._sum.totalPrice || 0, bookings: totalBookings, users: totalUsers, packages: totalPackages } });
}

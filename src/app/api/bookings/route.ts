import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Please log in first" }, { status: 401 });
    const { packageId, travelers } = await request.json();
    if (!packageId || !travelers || travelers < 1) return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    const totalPrice = pkg.pricePerPerson * travelers;
    const booking = await prisma.booking.create({
      data: { userId: session.userId as string, packageId, travelers, totalPrice, status: "pending" },
      include: { package: { include: { destination: true } } },
    });
    return NextResponse.json({ booking });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Booking failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const bookings = await prisma.booking.findMany({
      where: { userId: session.userId as string },
      include: { package: { include: { destination: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bookings });
  } catch { return NextResponse.json({ error: "Failed to fetch" }, { status: 500 }); }
}

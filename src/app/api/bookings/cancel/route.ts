// Force dynamic
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in" }, { status: 401 });
  try {
    const { bookingId } = await request.json();
    if (!bookingId) return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.status !== "pending") return NextResponse.json({ error: "Can only cancel pending bookings" }, { status: 400 });
    if (booking.userId !== session.userId) return NextResponse.json({ error: "Not your booking" }, { status: 403 });
    await prisma.booking.update({ where: { id: bookingId }, data: { status: "cancelled" } });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

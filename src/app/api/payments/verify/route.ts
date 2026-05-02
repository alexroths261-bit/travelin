// Force dynamic
export const dynamic = "force-dynamic";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return NextResponse.json({ error: "Not configured" }, { status: 500 });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

    if (expected !== razorpay_signature) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "confirmed", paymentId: razorpay_payment_id },
    });

    await prisma.payment.create({
      data: {
        bookingId,
        razorpayId: razorpay_payment_id,
        amount: 0,
        status: "success",
      },
    });

    return NextResponse.json({ success: true, message: "Payment verified" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}

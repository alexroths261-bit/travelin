// Force dynamic
export const dynamic = "force-dynamic";

import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, bookingId } = await request.json();
    if (!amount || amount < 1) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    console.log("Razorpay config:", { keyId: keyId?.substring(0, 10), hasSecret: !!keySecret });
    if (!keyId || !keySecret) return NextResponse.json({ error: "Razorpay not configured. KEY=" + (keyId || "missing") }, { status: 500 });
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: bookingId,
      notes: { bookingId },
    });
    return NextResponse.json({ order, key: keyId });
  } catch (error: any) {
    console.error("Razorpay FULL error:", error);
    return NextResponse.json({ error: error.message || "Payment init failed" }, { status: 500 });
  }
}

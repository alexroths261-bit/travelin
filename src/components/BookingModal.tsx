"use client";
import { useState } from "react";
import { X, Minus, Plus, Check, Loader2, CreditCard } from "lucide-react";

interface Pkg {
  id: string;
  title: string;
  duration: number;
  pricePerPerson: number;
  meals: string;
  tours: number;
  airportTransfer: boolean;
  privateCab: boolean;
  flights: boolean;
  destination: { name: string };
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: Pkg | null;
}

export default function BookingModal({ isOpen, onClose, pkg }: BookingModalProps) {
  const [travelers, setTravelers] = useState(1);
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");

  if (!isOpen || !pkg) return null;

  const total = pkg.pricePerPerson * travelers;

  const resetAndClose = () => {
    setTravelers(1);
    setStep("details");
    setError("");
    setBookingId("");
    onClose();
  };

  const handleProceed = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id, travelers }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) setError("Please log in first to book.");
        else setError(data.error || "Booking failed");
      } else {
        setBookingId(data.booking.id);
        setStep("payment");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, bookingId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment init failed");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "travelIN",
        description: `${pkg.destination.name} - ${pkg.duration} Day Plan`,
        order_id: data.order.id,
        handler: async (response: any) => {
          const verify = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, bookingId }),
          });
          const vData = await verify.json();
          if (vData.success) setStep("success");
          else setError("Payment verification failed");
          setLoading(false);
        },
        prefill: { name: "", email: "" },
        theme: { color: "#16a34a" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={resetAndClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {step === "success" ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-brand-600" /></div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 text-sm mb-2">Your trip to {pkg.destination.name} is confirmed.</p>
            <p className="text-gray-400 text-xs mb-6">Booking ID: {bookingId}</p>
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left">
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Package</span><span className="font-semibold text-gray-900">{pkg.duration}-Day Plan</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Travelers</span><span className="font-semibold text-gray-900">{travelers}</span></div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between"><span className="text-gray-700 font-semibold">Total Paid</span><span className="text-brand-700 font-black text-lg">₹{total.toLocaleString("en-IN")}</span></div>
            </div>
            <button onClick={resetAndClose} className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition">Done</button>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900">{step === "details" ? "Book Your Trip" : "Complete Payment"}</h2>
                <p className="text-gray-400 text-sm">{pkg.destination.name} • {pkg.duration}-Day Plan</p>
              </div>
              <button onClick={resetAndClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6">
              {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>}

              {step === "details" ? (
                <div className="space-y-5">
                  <div className="bg-gray-50 rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Price per person</span><span className="font-semibold">₹{pkg.pricePerPerson.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Duration</span><span className="font-semibold">{pkg.duration} Days / {pkg.duration - 1} Nights</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Meals</span><span className="font-semibold">{pkg.meals}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Guided Tours</span><span className="font-semibold">{pkg.tours}</span></div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Number of Travelers</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"><Minus className="w-4 h-4" /></button>
                      <span className="text-2xl font-black text-gray-900 w-12 text-center">{travelers}</span>
                      <button onClick={() => setTravelers(Math.min(20, travelers + 1))} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="bg-brand-50 rounded-2xl p-5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Total Cost</span>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">₹{pkg.pricePerPerson.toLocaleString("en-IN")} × {travelers}</div>
                        <div className="text-2xl font-black text-brand-700">₹{total.toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleProceed} disabled={loading} className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-50 transition shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Proceed to Payment"}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-gray-50 rounded-2xl p-5 text-center">
                    <CreditCard className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Amount to pay</p>
                    <p className="text-3xl font-black text-gray-900">₹{total.toLocaleString("en-IN")}</p>
                  </div>
                  <button onClick={handlePay} disabled={loading} className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-50 transition shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening Razorpay...</> : "Pay with Razorpay"}
                  </button>
                  <button onClick={() => setStep("details")} className="w-full py-2.5 rounded-xl text-gray-500 text-sm font-medium hover:text-gray-700 transition">← Back to details</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

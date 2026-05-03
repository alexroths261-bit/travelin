"use client";
import { useState, useEffect } from "react";
import { MapPin, Calendar, Users, IndianRupee, CheckCircle2, Clock, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { getSession } from "@/lib/auth";

interface Booking {
  id: string;
  travelers: number;
  totalPrice: number;
  status: string;
  travelDate: string | null;
  createdAt: string;
  package: { title: string; duration: number; destination: { name: string } };
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then(r => {
        if (r.status === 401) { window.location.href = "/"; throw new Error(); }
        return r.json();
      }),
      fetch("/api/auth/me").then(r => r.json()),
    ]).then(([bData, uData]) => {
      if (bData.bookings) setBookings(bData.bookings);
      if (uData.user) setUser(uData.user);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusBadge = (s: string) => {
    if (s === "confirmed") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold"><CheckCircle2 className="w-3 h-3" />Confirmed</span>;
    if (s === "cancelled") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold"><XCircle className="w-3 h-3" />Cancelled</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-semibold"><Clock className="w-3 h-3" />Pending</span>;
  };

  const formatDate = (d: string | null) => {
    if (!d) return "Not set";
    return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-gray-900">travel<span className="text-brand-500">IN</span></span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-100 text-brand-700">My Bookings</span>
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-gray-500">Hi, {user.name}</span>}
          <a href="/" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition"><ArrowLeft className="w-4 h-4" />Home</a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-gray-300" />
            </div>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-400 text-sm mb-6">Explore our destinations and book your first trip!</p>
            <a href="/" className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition text-sm">
              <MapPin className="w-4 h-4" /> Browse Packages
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-brand-500" />
                        <h3 className="font-bold text-gray-900">{b.package.destination.name}</h3>
                        {statusBadge(b.status)}
                      </div>
                      <p className="text-gray-500 text-sm">{b.package.title} • {b.package.duration} Days</p>
                      <p className="text-xs text-gray-400 mt-1">Booking ID: {b.id.substring(0, 12)}...</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="text-2xl font-black text-gray-900">₹{b.totalPrice.toLocaleString("en-IN")}</div>
                      <div className="text-xs text-gray-400">₹{Math.round(b.totalPrice / b.travelers).toLocaleString("en-IN")} × {b.travelers} travelers</div>
                    </div>
                    {b.status === "pending" && <button onClick={async () => {
                      if (!confirm("Cancel this booking?")) return;
                      const res = await fetch("/api/bookings/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId: b.id }) });
                      if (res.ok) setBookings(bookings.map(x => x.id === b.id ? { ...x, status: "cancelled" } : x));
                    }} className="text-xs font-medium text-red-500 hover:text-red-700 transition">Cancel Booking</button>}
                  </div>
                  <div className="border-t border-gray-100 pt-4 mt-4 grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center"><Calendar className="w-4 h-4 text-brand-600" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Travel Date</p>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(b.travelDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Users className="w-4 h-4 text-blue-600" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Travelers</p>
                        <p className="text-sm font-semibold text-gray-900">{b.travelers}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><IndianRupee className="w-4 h-4 text-purple-600" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Booked On</p>
                        <p className="text-sm font-semibold text-gray-900">{new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

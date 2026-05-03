"use client";
import { useState, useEffect } from "react";
import { BarChart3, Package, Users, IndianRupee, ArrowLeft } from "lucide-react";

interface Booking {
  id: string;
  travelers: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  pkg: { title: string; duration: number; destination: { name: string } };
}

interface Stats { revenue: number; bookings: number; users: number; packages: number; }

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({ revenue: 0, bookings: 0, users: 0, packages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/bookings").then(r => {
      if (r.status === 401 || r.status === 403) { window.location.href = "/"; return null; }
      return r.json();
    }).then(data => { if (data) { setBookings(data.bookings); setStats(data.stats); } }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (bookingId: string, status: string) => {
    if (status === "cancelled" && !confirm("Cancel this booking?")) return;
    await fetch("/api/admin/bookings/status", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId, status }) });
    window.location.reload();
  };

  const statusBadge = (s: string) => {
    if (s === "confirmed") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">Confirmed</span>;
    if (s === "cancelled") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">Cancelled</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-semibold">Pending</span>;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-gray-900">travel<span className="text-brand-500">IN</span></span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-100 text-brand-700">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin/packages" className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition">Manage Packages</a>
          <a href="/" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition"><ArrowLeft className="w-4 h-4" />Back to Site</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[{ label: "Total Revenue", value: stats.revenue, icon: IndianRupee, color: "bg-brand-100 text-brand-700" }, { label: "Total Bookings", value: stats.bookings, icon: BarChart3, color: "bg-blue-100 text-blue-700" }, { label: "Total Users", value: stats.users, icon: Users, color: "bg-purple-100 text-purple-700" }, { label: "Active Packages", value: stats.packages, icon: Package, color: "bg-amber-100 text-amber-700" }].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3"><span className="text-sm text-gray-500 font-medium">{s.label}</span><div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}><s.icon className="w-4.5 h-4.5" /></div></div>
              <div className="text-2xl font-black text-gray-900">{s.label === "Total Revenue" ? "₹" + s.value.toLocaleString("en-IN") : s.value}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Recent Bookings</h2></div>
          {bookings.length === 0 ? (
            <div className="px-6 py-16 text-center"><Package className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">No bookings yet.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Travelers</th>
                    <th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Actions</th>
                    <th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4"><div className="font-medium text-gray-900">{b.user.name}</div><div className="text-xs text-gray-400">{b.user.email}</div></td>
                      <td className="px-6 py-4"><div className="font-medium text-gray-900">{b.pkg.destination.name}</div><div className="text-xs text-gray-400">{b.pkg.duration}-Day Plan</div></td>
                      <td className="px-6 py-4 text-gray-600">{b.travelers}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₹{b.totalPrice.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">{statusBadge(b.status)}</td>
                      <td className="px-6 py-4">
                        {b.status === "pending" && (
                          <button onClick={() => handleStatus(b.id, "confirmed")} className="text-xs font-medium text-green-600 hover:text-green-700 mr-2">Confirm</button>
                        )}
                        {b.status === "confirmed" && (
                          <button onClick={() => handleStatus(b.id, "cancelled")} className="text-xs font-medium text-red-500 hover:text-red-700">Cancel</button>
                        )}
                        {b.status === "cancelled" && <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

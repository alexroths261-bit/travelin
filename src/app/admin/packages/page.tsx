"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

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
  label: string | null;
  destination: { id: string; name: string };
}

interface Dest { id: string; name: string; }

const emptyForm = { destinationId: "", title: "", duration: "5", pricePerPerson: "", meals: "All Meals", tours: "3", airportTransfer: "false", privateCab: "false", flights: "false", label: "" };

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [destinations, setDestinations] = useState<Dest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/packages").then(r => { if (r.status === 401 || r.status === 403) { window.location.href = "/"; throw new Error(); } return r.json(); }),
      fetch("/api/admin/destinations").then(r => r.json()),
    ]).then(([pkgs, dests]) => { setPackages(pkgs.packages); setDestinations(dests.destinations); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm, destinationId: destinations[0]?.id || "" }); setModalOpen(true); };
  const openEdit = (pkg: Pkg) => {
    setEditing(pkg);
    setForm({ destinationId: pkg.destination.id, title: pkg.title, duration: String(pkg.duration), pricePerPerson: String(pkg.pricePerPerson), meals: pkg.meals, tours: String(pkg.tours), airportTransfer: String(pkg.airportTransfer), privateCab: String(pkg.privateCab), flights: String(pkg.flights), label: pkg.label || "" });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    const res = await fetch("/api/admin/packages", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      const data = await res.json();
      if (editing) setPackages(packages.map(p => p.id === editing.id ? data.pkg : p));
      else setPackages([data.pkg, ...packages]);
      setModalOpen(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/admin/packages?id=" + id, { method: "DELETE" });
    if (res.ok) setPackages(packages.filter(p => p.id !== id));
    setDeleteId(null);
  };

  const labelColors: Record<string, string> = { "Most Popular": "bg-brand-100 text-brand-700", "Quick Getaway": "bg-gray-100 text-gray-600", "Week Special": "bg-blue-100 text-blue-700", "Deep Explore": "bg-amber-100 text-amber-700", "Ultimate Tour": "bg-purple-100 text-purple-700" };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-gray-900">travel<span className="text-brand-500">IN</span></span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-100 text-brand-700">Manage Packages</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAdd} className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"><Plus className="w-4 h-4" />Add Package</button>
          <a href="/admin" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition"><ArrowLeft className="w-4 h-4" />Dashboard</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">{packages.length} Packages</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-left"><th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Package</th><th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Destination</th><th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Duration</th><th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Price</th><th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Label</th><th className="px-6 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {packages.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{pkg.title}</td>
                    <td className="px-6 py-4 text-gray-600">{pkg.destination.name}</td>
                    <td className="px-6 py-4 text-gray-600">{pkg.duration} Days</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{pkg.pricePerPerson.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">{pkg.label ? <span className={`pill text-xs ${labelColors[pkg.label] || "bg-gray-100 text-gray-600"}`}>{pkg.label}</span> : <span className="text-gray-300">—</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(pkg)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(pkg.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{editing ? "Edit Package" : "Add Package"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Destination</label>
                <select value={form.destinationId} onChange={e => setForm({ ...form, destinationId: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-500">
                  {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Kerala Weekend Escape" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Duration (days)</label>
                  <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-500">
                    {[3,5,7,10,15].map(d => <option key={d} value={d}>{d} Days</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price per person (₹)</label>
                  <input type="number" value={form.pricePerPerson} onChange={e => setForm({ ...form, pricePerPerson: e.target.value })} required placeholder="3499" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Meals</label>
                  <select value={form.meals} onChange={e => setForm({ ...form, meals: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-500">
                    <option>Breakfast & Dinner</option><option>All Meals</option><option>All Meals + Snacks</option><option>All-Inclusive</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Guided Tours</label>
                  <input type="number" value={form.tours} onChange={e => setForm({ ...form, tours: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Label</label>
                <select value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-500">
                  <option value="">None</option><option>Quick Getaway</option><option>Most Popular</option><option>Week Special</option><option>Deep Explore</option><option>Ultimate Tour</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { key: "airportTransfer", label: "Airport Transfer" },
                  { key: "privateCab", label: "Private Cab" },
                  { key: "flights", label: "Flights" },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[item.key as keyof typeof form] === "true"} onChange={e => setForm({ ...form, [item.key]: String(e.target.checked) })} className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </label>
                ))}
              </div>
              <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : editing ? "Update Package" : "Create Package"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
            <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Delete Package?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

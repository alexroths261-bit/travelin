"use client";
import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import BookingModal from "./BookingModal";

interface Pkg {
  id: string;
  description: string;
  title: string;
  duration: number;
  pricePerPerson: number;
  meals: string;
  tours: number;
  airportTransfer: boolean;
  privateCab: boolean;
  flights: boolean;
  label: string | null;
}

interface Dest {
  name: string;
  slug: string;
  packages: Pkg[];
}

export default function PackagesSection({ destinations }: { destinations: Dest[] }) {
  const [active, setActive] = useState(destinations[0]?.slug || "");
  const [toastMsg, setToastMsg] = useState("");
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#pkg-")) {
      const slug = hash.replace("#pkg-", "");
      const found = destinations.find(d => d.slug === slug);
      if (found) setActive(slug);
    }
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible.current) { visible.current = true; ref.current?.classList.add("visible"); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const handleBook = (pkg: Pkg, destName: string) => {
    setSelectedPkg({ ...pkg, destination: { name: destName } });
    setBookingOpen(true);
  };

  const current = destinations.find((d) => d.slug === active);
  const labelColors: Record<string, string> = {
    "Quick Getaway": "bg-gray-100 text-gray-600",
    "Most Popular": "bg-brand-100 text-brand-700",
    "Week Special": "bg-brand-100 text-brand-700",
    "Deep Explore": "bg-amber-100 text-amber-700",
    "Ultimate Tour": "bg-purple-100 text-purple-700",
  };

  return (
    <section id="packages" ref={ref} className="py-20 sm:py-28 px-5 sm:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-badge mb-4"><span className="text-xs">✦</span> Travel Packages</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">Choose Your <span className="text-brand-600">Perfect Plan</span></h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">Flexible durations for every schedule. All packages include accommodation, meals, and guided tours.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {destinations.map((d) => (
            <button key={d.slug} onClick={() => setActive(d.slug)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${active === d.slug ? "bg-brand-700 text-white shadow-md shadow-brand-700/20" : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300"}`}>{d.name}</button>
          ))}
        </div>
        {current && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {current.packages.map((pkg) => {
              const featured = pkg.label === "Most Popular";
              return (
                <div key={pkg.id} className={`pkg-card bg-white rounded-2xl p-6 flex flex-col ${featured ? "featured relative" : ""}`}>
                  {featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="pill bg-brand-600 text-white text-xs shadow-lg shadow-brand-600/30">Most Popular</span></div>}
                  <div className="mb-4">
                    <span className={`pill text-xs ${labelColors[pkg.label || ""] || "bg-gray-100 text-gray-600"}`}>{pkg.label}</span>
                    <h3 className="font-serif text-lg font-bold text-gray-900 mt-3">{pkg.duration}-Day Plan</h3>
                  </div>
                  <div className="flex-1">
                    <ul className="space-y-2.5 mb-4">
                      <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />{pkg.duration - 1} Nights Stay</li>
                      <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />{pkg.meals}</li>
                      <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />{pkg.tours} Guided Tour{pkg.tours > 1 ? "s" : ""}</li>
                      <li className={`flex items-start gap-2 text-sm ${pkg.airportTransfer ? "text-gray-600" : "text-gray-300"}`}>{pkg.airportTransfer ? <Check className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" /> : <X className="w-4 h-4 mt-0.5 shrink-0" />}Airport Transfer</li>
                      {pkg.privateCab && <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />Private Cab</li>}
                      {pkg.flights && <li className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />Flights Included</li>}
                    </ul>
                  </div>
                    {pkg.description && (
                      <div className="mb-6 border-t border-gray-100 pt-3">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Itinerary Preview</p>
                        <div className="space-y-1.5">
                          {pkg.description.split("Day ").filter(Boolean).slice(0, 3).map((day, i) => {
                            const parts = day.split(":");
                            return <p key={i} className="text-xs text-gray-500"><span className="font-semibold text-gray-700">Day {parts[0]?.trim()}:</span> {parts[1]?.trim()}</p>;
                          })}
                          {pkg.description.split("Day ").filter(Boolean).length > 3 && <p className="text-xs text-brand-600 font-medium">+ {pkg.description.split("Day ").filter(Boolean).length - 3} more days</p>}
                        </div>
                      </div>
                    )}

                  <div>
                    <div className="text-2xl font-black text-gray-900">₹{pkg.pricePerPerson.toLocaleString("en-IN")}</div>
                    <div className="text-xs text-gray-400 mb-4">per person</div>
                    <button onClick={() => handleBook(pkg, current.name)} className={featured ? "btn-glow w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-600/25" : "w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-brand-400 hover:text-brand-700 transition-all"}>Book Now</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} pkg={selectedPkg} />
      {toastMsg && <div className="toast show fixed top-6 right-6 z-[100] bg-brand-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-brand-700 flex items-center gap-3"><span className="text-sm font-medium">{toastMsg}</span></div>}
    </section>
  );
}

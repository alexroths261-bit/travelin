"use client";
import { useState } from "react";
import { Search, MapPin, Star, ArrowRight } from "lucide-react";

const imgMap: Record<string, string> = {
  kerala: "https://picsum.photos/seed/kerala-green/600/400.jpg",
  rajasthan: "https://picsum.photos/seed/rajasthan-palace/600/400.jpg",
  kedarnath: "https://picsum.photos/seed/kedarnath-temple/600/400.jpg",
  delhi: "https://picsum.photos/seed/delhi-monument/600/400.jpg",
  odisha: "https://picsum.photos/seed/odisha-temple2/600/400.jpg",
  bangalore: "https://picsum.photos/seed/bangalore-garden/600/400.jpg",
};

interface Dest { id: string; name: string; slug: string; tagline: string; description: string; rating: number; packages: { pricePerPerson: number }[]; reviews: { comment: string; user: { name: string } }[]; }

export default function DestinationGrid({ destinations }: { destinations: Dest[] }) {
  const [query, setQuery] = useState("");
  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.tagline.toLowerCase().includes(query.toLowerCase()) ||
    d.description.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <section id="destinations" className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="section-badge mb-4"><span className="text-xs">✦</span> Popular Destinations</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">Where Will You Go <span className="text-brand-600">Next?</span></h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">Handpicked destinations showcasing India&apos;s incredible diversity.</p>
        </div>
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search destinations..." value={query} onChange={e => setQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 bg-white shadow-sm" />
          {query && <p className="text-center text-xs text-gray-400 mt-2">Showing {filtered.length} of {destinations.length} destinations</p>}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16"><Search className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400">No destinations match &ldquo;{query}&rdquo;</p></div>
          ) : filtered.map(dest => (
            <a key={dest.id} href={`#pkg-${dest.slug}`} id={dest.slug} className="dest-card bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 block">
              <div className="relative h-56 overflow-hidden">
                <img src={imgMap[dest.slug] || imgMap.kerala} alt={dest.name} className="dest-img w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 left-4"><span className="pill bg-white/95 text-brand-800 shadow-sm"><Star className="w-3 h-3 fill-brand-500 text-brand-500" /> {dest.rating}</span></div>
                <div className="absolute bottom-4 right-4"><span className="pill bg-brand-600 text-white shadow-lg shadow-brand-600/30">{dest.packages.length} Packages</span></div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">{dest.name}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1.5 mb-3"><MapPin className="w-3.5 h-3.5 text-brand-500" />{dest.tagline}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{dest.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-700 font-bold text-lg">₹{dest.packages[0]?.pricePerPerson.toLocaleString("en-IN")} <span className="text-xs font-normal text-gray-400">/person</span></span>
                  <span className="text-brand-600 text-sm font-semibold flex items-center gap-1">View Plans <ArrowRight className="w-4 h-4" /></span>
                </div>
                {dest.reviews.length > 0 && (<div className="mt-3 pt-3 border-t border-gray-100"><p className="text-xs text-gray-400 mb-1">Latest review:</p><p className="text-xs text-gray-600 italic">&ldquo;{dest.reviews[0].comment}&rdquo; — {dest.reviews[0].user.name}</p></div>)}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { Star, MessageSquarePlus } from "lucide-react";
import ReviewModal from "./ReviewModal";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
  destination: { name: string };
}

interface DestOption {
  id: string;
  name: string;
}

export default function TestimonialsSection({ destinations }: { destinations: DestOption[] }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState<DestOption | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  const fetchReviews = () => {
    fetch("/api/reviews")
      .then(r => r.json())
      .then(d => { if (d.reviews) setReviews(d.reviews); })
      .catch(() => {});
  };

  useEffect(() => { fetchReviews(); }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible.current) { visible.current = true; ref.current?.classList.add("visible"); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const handleNewReview = (dest: DestOption) => {
    setSelectedDest(dest);
    setModalOpen(true);
  };

  const colors = ["bg-brand-700", "bg-orange-700", "bg-purple-700", "bg-blue-700", "bg-pink-700", "bg-teal-700", "bg-indigo-700", "bg-red-700", "bg-yellow-700"];

  return (
    <section id="testimonials" ref={ref} className="fade-section py-20 sm:py-28 px-5 sm:px-8 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
            <Star className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Traveler Reviews</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Loved by <span className="text-brand-400">5000+</span> Travelers
          </h2>
        </div>

        <div className="flex justify-center mb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-brand-500/20 rounded-2xl blur-md group-hover:bg-brand-500/30 transition" />
            <button onClick={() => handleNewReview(destinations[0])} className="relative flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-500 transition shadow-lg shadow-brand-600/25">
              <MessageSquarePlus className="w-4 h-4" /> Write a Review
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {destinations.map(d => (
            <button key={d.id} onClick={() => handleNewReview(d)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white transition">
              {d.name}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <MessageSquarePlus className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map((r, i) => {
              const initials = r.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <div key={r.id} className="testimonial-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
                  <div className="flex gap-1 mb-4">
                    {Array(5).fill(null).map((_, si) => (
                      <Star key={si} className={`w-4 h-4 ${si < r.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">&ldquo;{r.comment}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white font-bold text-sm`}>{initials}</div>
                    <div>
                      <div className="text-white font-semibold text-sm">{r.user.name}</div>
                      <div className="text-white/30 text-xs">{r.destination.name}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedDest && (
        <ReviewModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedDest(null); fetchReviews(); }}
          destinationId={selectedDest.id}
          destinationName={selectedDest.name}
        />
      )}
    </section>
  );
}

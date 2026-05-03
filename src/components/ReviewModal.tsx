"use client";
import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationId: string;
  destinationName: string;
}

export default function ReviewModal({ isOpen, onClose, destinationId, destinationName }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) setError("Please log in first to leave a review.");
        else setError(data.error || "Failed to submit review");
      } else {
        setSuccess("Review submitted!");
        setTimeout(() => { onClose(); setComment(""); setRating(5); setSuccess(""); window.location.reload(); }, 1000);
      }
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-400"><X className="w-5 h-5" /></button>
        <div className="text-center mb-6">
          <h2 className="font-serif text-xl font-bold text-gray-900">Write a Review</h2>
          <p className="text-gray-400 text-sm mt-1">{destinationName}</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Your Rating</label>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)} className="p-1 transition">
                  <Star className={`w-7 h-7 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Your Review</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={4} placeholder="Share your experience..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition resize-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Compass, Menu, X, LogOut } from "lucide-react";
import AuthModal from "./AuthModal";

const links = [
  { label: "Destinations", href: "#destinations" },
  { label: "Packages", href: "#packages" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector(".hero-section");
      const h = el ? (el as HTMLElement).offsetHeight : 0;
      setScrolled(window.scrollY > h - 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user) setUser(d.user);
    }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  const txt = scrolled ? "text-gray-600" : "text-white/70";
  const txtH = scrolled ? "hover:text-brand-600" : "hover:text-white";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 shadow-[0_1px_20px_rgba(0,0,0,0.06)]" : ""}`} style={scrolled ? { backdropFilter: "blur(20px)" } : {}}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30"><Compass className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-bold tracking-tight"><span className={scrolled ? "text-gray-900" : "text-white"}>travel</span><span className="text-brand-400">IN</span></span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              {links.map(l => (<a key={l.label} href={l.href} className={`nav-link text-sm font-medium ${txt} ${txtH}`}>{l.label}</a>))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className={`text-sm font-medium ${scrolled ? "text-gray-700" : "text-white/90"}`}>Hi, {user.name.split(" ")[0]}</span>
                  {user.role === "admin" && <a href="/admin" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-100 text-brand-700 hover:bg-brand-200 transition">Admin</a>}
                  <button onClick={handleLogout} className={`p-2 rounded-lg transition ${scrolled ? "text-gray-500 hover:bg-gray-100 hover:text-red-500" : "text-white/70 hover:bg-white/10 hover:text-red-400"}`}><LogOut className="w-4 h-4" /></button>
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthMode("login"); setAuthOpen(true); }} className={`text-sm font-medium px-4 py-2 rounded-lg transition ${scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/80 hover:bg-white/10"}`}>Log In</button>
                  <button onClick={() => { setAuthMode("signup"); setAuthOpen(true); }} className="btn-glow bg-brand-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl">Sign Up</button>
                </>
              )}
            </div>
            <button className={`md:hidden p-2 rounded-lg transition ${scrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"}`} onClick={() => setOpen(!open)}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <div className={`mobile-menu md:hidden ${open ? "open" : ""}`}>
            <div className="pb-5 pt-2 space-y-1">
              {links.map(l => (<a key={l.label} href={l.href} onClick={() => setOpen(false)} className={`block text-sm font-medium px-4 py-3 rounded-lg transition ${txt} ${scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"}`}>{l.label}</a>))}
              <div className="flex gap-2 pt-3 px-4">
                {user ? (
                  <>
                    <span className={`flex-1 text-sm font-medium py-2.5 text-center`}>Hi, {user.name.split(" ")[0]}</span>
                    <button onClick={handleLogout} className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-red-200 text-red-600">Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setAuthMode("login"); setAuthOpen(true); setOpen(false); }} className={`flex-1 text-sm font-medium py-2.5 rounded-lg border transition ${scrolled ? "text-gray-600 border-gray-200" : "text-white/80 border-white/20"}`}>Log In</button>
                    <button onClick={() => { setAuthMode("signup"); setAuthOpen(true); setOpen(false); }} className="flex-1 bg-brand-500 text-white text-sm font-semibold py-2.5 rounded-lg">Sign Up</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </>
  );
}

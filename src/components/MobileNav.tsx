"use client";
import { usePathname } from "next/navigation";
import { Home, MapPin, Package, ClipboardList, User } from "lucide-react";
const links = [
  { href: "/", icon: Home, label: "Home" },
  { href: "#destinations", icon: MapPin, label: "Explore" },
  { href: "#packages", icon: Package, label: "Packages" },
  { href: "/my-bookings", icon: ClipboardList, label: "Bookings" },
  { href: "/profile", icon: User, label: "Profile" },
];
export default function MobileNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 px-2 py-2 safe-area-inset-bottom">
      <div className="flex justify-around">
        {links.map(l => (
          <a key={l.label} href={l.href} className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl hover:bg-gray-50 transition">
            <l.icon className="w-5 h-5 text-gray-500" />
            <span className="text-[10px] text-gray-500 font-medium">{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

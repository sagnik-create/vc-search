"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, List, Bookmark, Target } from "lucide-react"; // Wait, I need to check if lucide-react is installed

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Lists", href: "/lists", icon: List },
    { name: "Saved Searches", href: "/saved-searches", icon: Bookmark },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            VC<span className="text-blue-600">Scout</span>
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.name === "Companies"); // just as an example
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
            Me
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">Investigator</p>
            <p className="text-xs text-gray-500 truncate">Demo Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

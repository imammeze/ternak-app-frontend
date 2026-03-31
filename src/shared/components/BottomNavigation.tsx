"use client";

import { Home, Clock, QrCode, FileText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const pathname = usePathname();

  const checkActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 max-w-md z-9999 w-full bg-white flex justify-between items-end px-6 py-4 rounded-t-[30px] shadow-[0_-10px_40px_rgb(0,0,0,0.08)]">
      <Link
        href="/"
        className="flex flex-col items-center gap-1 cursor-pointer group">
        <Home
          size={24}
          className={`transition-colors duration-300 ${checkActive("/") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}
        />
        <span
          className={`text-[10px] font-medium transition-colors duration-300 ${checkActive("/") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}>
          Home
        </span>
      </Link>

      <Link
        href="/activity"
        className="flex flex-col items-center gap-1 cursor-pointer group">
        <Clock
          size={24}
          className={`transition-colors duration-300 ${checkActive("/activity") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}
        />
        <span
          className={`text-[10px] font-medium transition-colors duration-300 ${checkActive("/activity") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}>
          Activity
        </span>
      </Link>

      <div className="relative -top-6 flex flex-col items-center cursor-pointer">
        <div className="bg-emerald-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 text-white transform rotate-45 hover:scale-105 transition-transform">
          <QrCode size={26} className="-rotate-45" />
        </div>
      </div>

      <Link
        href="/stock-susu"
        className="flex flex-col items-center gap-1 cursor-pointer group">
        <FileText
          size={24}
          className={`transition-colors duration-300 ${checkActive("/report") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}
        />
        <span
          className={`text-[10px] font-medium transition-colors duration-300 ${checkActive("/report") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}>
          Stock
        </span>
      </Link>

      <Link
        href="/profile"
        className="flex flex-col items-center gap-1 cursor-pointer group">
        <User
          size={24}
          className={`transition-colors duration-300 ${checkActive("/profile") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}
        />
        <span
          className={`text-[10px] font-medium transition-colors duration-300 ${checkActive("/profile") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}>
          Profile
        </span>
      </Link>
    </div>
  );
}

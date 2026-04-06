"use client";

import { useEffect, useState } from "react";
import { Home, Clock, FileText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

export default function BottomNavigation() {
  const pathname = usePathname();

  const { user, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  const roleName = user?.roles?.[0]?.name?.toLowerCase() || "";

  const showActivity = ["admin", "manager", "karyawan"].includes(roleName);
  const showStock = ["admin", "manager", "karyawan"].includes(roleName);

  return (
    <div className="fixed bottom-0 max-w-md z-9999 w-full bg-white flex justify-evenly items-end py-4 rounded-t-[30px] shadow-[0_-10px_40px_rgb(0,0,0,0.08)]">
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

      {isClient && isAuthenticated && showActivity && (
        <Link
          href="/activity"
          className="flex flex-col items-center gap-1 cursor-pointer group animate-in fade-in zoom-in duration-300">
          <Clock
            size={24}
            className={`transition-colors duration-300 ${checkActive("/activity") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}
          />
          <span
            className={`text-[10px] font-medium transition-colors duration-300 ${checkActive("/activity") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}>
            Activity
          </span>
        </Link>
      )}

      {isClient && isAuthenticated && showStock && (
        <Link
          href="/stock-susu"
          className="flex flex-col items-center gap-1 cursor-pointer group animate-in fade-in zoom-in duration-300">
          <FileText
            size={24}
            className={`transition-colors duration-300 ${checkActive("/stock-susu") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}
          />
          <span
            className={`text-[10px] font-medium transition-colors duration-300 ${checkActive("/stock-susu") ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}>
            Stock
          </span>
        </Link>
      )}

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

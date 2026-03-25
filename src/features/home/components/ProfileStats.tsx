"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function ProfileStats() {
  const { user, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const roleName = user?.roles?.[0]?.name.toLowerCase() || "guest";

  const formattedRole = roleName.charAt(0).toUpperCase() + roleName.slice(1);

  const StatCard = ({
    title,
    value,
    unit,
  }: {
    title: string;
    value: string | number;
    unit?: string;
  }) => (
    <div className="flex-1 bg-slate-50 p-3 rounded-2xl text-center border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-500 font-medium mb-1 line-clamp-1">
        {title}
      </p>
      <p className="text-xl font-bold text-emerald-800 flex items-baseline justify-center gap-1">
        {value} {unit && <span className="text-sm font-bold">{unit}</span>}
      </p>
    </div>
  );

  const renderStatsByRole = () => {
    if (!isAuthenticated) return null;

    switch (roleName) {
      case "admin":
        return (
          <>
            <StatCard title="Ternak" value="120" />
            <StatCard title="Susu" value="45" unit="L" />
            <StatCard title="User" value="6" />
          </>
        );

      case "manager":
        return (
          <>
            <StatCard title="Ternak" value="120" />
            <StatCard title="Susu" value="45" unit="L" />
            <StatCard title="Stock Susu" value="15" unit="L" />
          </>
        );

      case "stakeholder":
        return (
          <>
            <StatCard title="Ternak (Milikku)" value="30" />
            <StatCard title="Susu (Milikku)" value="12" unit="L" />
            <StatCard title="Omset" value="4.5" unit="Jt" />
          </>
        );

      case "karyawan":
        return (
          <>
            <StatCard title="Jumlah Hadir" value="22" unit="Hr" />
            <StatCard title="Sisa Libur" value="2" unit="Hr" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-emerald-800 rounded-full flex items-center justify-center text-white shadow-sm">
          <User size={28} />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 text-lg">
            {isAuthenticated ? user?.name : "Pengguna Tamu"}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {isAuthenticated ? formattedRole : "Silakan Login"}
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-3">{renderStatsByRole()}</div>
    </div>
  );
}

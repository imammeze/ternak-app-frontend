"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Milk,
  ShieldQuestion,
  Users,
  BarChart3,
  CalendarCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function ActionMenu() {
  const { user, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasPermission = (permissionName: string) => {
    if (!user) return false;

    const hasDirectPermission =
      user.permissions &&
      user.permissions.some((p: any) => p.name === permissionName);

    const hasRolePermission =
      user.roles &&
      user.roles.some((role: any) => {
        return (
          role.permissions &&
          role.permissions.some((p: any) => p.name === permissionName)
        );
      });

    return hasDirectPermission || hasRolePermission;
  };

  if (!isClient) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {hasPermission("akses menu input data") && (
        <Link
          href="/input-data"
          className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer">
          <Pencil size={32} className="text-emerald-600 stroke-[1.5]" />
          <span className="text-sm font-medium text-gray-700 text-center">
            Input Data
          </span>
        </Link>
      )}

      {hasPermission("akses menu produksi susu") && (
        <Link
          href="/data-susu"
          className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer">
          <Milk size={32} className="text-emerald-600 stroke-[1.5]" />
          <span className="text-sm font-medium text-gray-700 text-center">
            Produksi Susu
          </span>
        </Link>
      )}

      {hasPermission("akses menu data ternak") && (
        <Link
          href="/data-ternak"
          className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer">
          <ShieldQuestion size={32} className="text-emerald-600 stroke-[1.5]" />
          <span className="text-sm font-medium text-gray-700 text-center">
            Data Ternak
          </span>
        </Link>
      )}

      {hasPermission("akses menu user management") && (
        <Link
          href="/user-management"
          className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer">
          <Users size={32} className="text-emerald-600 stroke-[1.5]" />
          <span className="text-sm font-medium text-gray-700 text-center">
            User Management
          </span>
        </Link>
      )}

      {hasPermission("akses menu report finansial") && (
        <Link
          href="/report"
          className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer">
          <BarChart3 size={32} className="text-emerald-600 stroke-[1.5]" />
          <span className="text-sm font-medium text-gray-700 text-center">
            Report Finansial
          </span>
        </Link>
      )}

      {hasPermission("akses menu absen") && (
        <Link
          href="/absen"
          className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer">
          <CalendarCheck size={32} className="text-emerald-600 stroke-[1.5]" />
          <span className="text-sm font-medium text-gray-700 text-center">
            Absen
          </span>
        </Link>
      )}
    </div>
  );
}

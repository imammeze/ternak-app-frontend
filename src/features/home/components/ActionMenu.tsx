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
  Home,
  ClipboardList,
  ListChecks,
  CalendarOff,
  CalendarDays,
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

  const hasRole = (allowedRoles: string[]) => {
    if (!user || !user.roles) return false;
    return user.roles.some((role: any) =>
      allowedRoles.includes(role.name.toLowerCase()),
    );
  };

  if (!isClient) return null;
  if (!isAuthenticated) return null;

  const allMenus = [
    {
      id: "input-data",
      label: "Input Data",
      href: "/input-data",
      icon: Pencil,
      show: hasPermission("akses menu input data"),
    },
    {
      id: "produksi-susu",
      label: "Produksi Susu",
      href: "/data-susu",
      icon: Milk,
      show: hasPermission("akses menu produksi susu"),
    },
    {
      id: "data-ternak",
      label: "Data Ternak",
      href: "/data-ternak",
      icon: ShieldQuestion,
      show: hasPermission("akses menu data ternak"),
    },
    {
      id: "manajemen-kandang",
      label: "Manajemen Kandang",
      href: "/manajemen-kandang",
      icon: Home,
      show: hasRole(["admin", "manager"]),
    },
    {
      id: "manajemen-user",
      label: "Manajemen User",
      href: "/user-management",
      icon: Users,
      show: hasPermission("akses menu user management"),
    },
    {
      id: "report-finansial",
      label: "Report Finansial",
      href: "/report",
      icon: BarChart3,
      show: hasPermission("akses menu report finansial"),
    },
    {
      id: "absen",
      label: "Absen",
      href: "/absen",
      icon: CalendarCheck,
      show: hasPermission("akses menu absen"),
    },
    {
      id: "data-kehadiran",
      label: "Data Kehadiran",
      href: "/absen/histori",
      icon: ClipboardList,
      show: hasRole(["admin", "manager"]),
    },
    {
      id: "manajemen-aktivitas",
      label: "Aktivitas Absen",
      href: "/manajemen-aktivitas",
      icon: ListChecks,
      show: hasRole(["admin", "manager"]),
    },
    {
      id: "pengajuan-libur",
      label: "Pengajuan Libur",
      icon: CalendarOff,
      href: "/absen/riwayat-libur",
      show: hasRole(["admin", "manager"]),
    },
    {
      id: "kalender",
      label: "Kalender",
      icon: CalendarDays,
      href: "/kalender",
      show: hasRole(["admin", "manager"]),
    },
  ];

  const visibleMenus = allMenus.filter((menu) => menu.show);

  return (
    <div className="grid grid-cols-2 gap-4">
      {visibleMenus.map((menu, index) => {
        const isLastAndOdd =
          visibleMenus.length % 2 !== 0 && index === visibleMenus.length - 1;

        const IconComponent = menu.icon;

        return (
          <Link
            key={menu.id}
            href={menu.href}
            className={`bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer ${
              isLastAndOdd ? "col-span-2" : ""
            }`}>
            <IconComponent
              size={32}
              className="text-emerald-600 stroke-[1.5]"
            />
            <span className="text-sm font-medium text-gray-700 text-center">
              {menu.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

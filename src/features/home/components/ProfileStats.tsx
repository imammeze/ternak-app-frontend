"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";

export default function ProfileStats() {
  const { user, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  const [userCount, setUserCount] = useState<number | string>("...");
  const [ternakCount, setTernakCount] = useState<number | string>("...");
  const [susuTotal, setSusuTotal] = useState<number | string>("...");
  const [susuStock, setSusuStock] = useState<number | string>("...");

  const [jumlahHadir, setJumlahHadir] = useState<number | string>("...");

  useEffect(() => {
    setIsClient(true);

    const fetchDashboardData = async () => {
      try {
        const role = user?.roles?.[0]?.name.toLowerCase();

        if (role === "admin") {
          const resUsers = await api.get("/api/users");
          setUserCount(resUsers.data.users.length);
        }

        if (role === "admin" || role === "manager" || role === "stakeholder") {
          const resTernak = await api.get("/api/ternak");
          setTernakCount(resTernak.data.data.length);

          const resProduksi = await api.get("/api/produksi-susu");

          let produksiKomersial = 0;

          const totalProduksi = resProduksi.data.data.reduce(
            (acc: number, curr: any) => {
              const liter1L =
                (Number(curr.pagi_1l || 0) + Number(curr.sore_1l || 0)) * 1;
              const liter250ml =
                (Number(curr.pagi_250ml || 0) + Number(curr.sore_250ml || 0)) *
                0.25;
              const literCempe =
                (Number(curr.pagi_cempe_ml || 0) +
                  Number(curr.sore_cempe_ml || 0)) /
                1000;

              produksiKomersial += liter1L + liter250ml;

              return acc + liter1L + liter250ml + literCempe;
            },
            0,
          );

          let totalPengeluaran = 0;
          if (role === "admin" || role === "manager") {
            const resPengeluaran = await api.get("/api/pengeluaran-susu");
            totalPengeluaran = resPengeluaran.data.data.reduce(
              (acc: number, curr: any) => acc + Number(curr.total_liter),
              0,
            );
          }

          setSusuTotal(parseFloat(totalProduksi.toFixed(2)));
          setSusuStock(
            parseFloat((produksiKomersial - totalPengeluaran).toFixed(2)),
          );
        }

        if (role === "karyawan") {
          const resAbsen = await api.get("/api/absen/histori");

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const kehadiranBulanIni = resAbsen.data.data.filter((item: any) => {
            const itemDate = new Date(item.waktu_absen);
            return (
              itemDate.getMonth() === currentMonth &&
              itemDate.getFullYear() === currentYear &&
              item.tipe === "Masuk"
            );
          });

          setJumlahHadir(kehadiranBulanIni.length);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        setUserCount("?");
        setTernakCount("?");
        setSusuTotal("?");
        setSusuStock("?");
        setJumlahHadir("?");
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

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
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mb-1 line-clamp-1">
        {title}
      </p>
      <p className="text-lg font-black text-emerald-800 flex items-baseline justify-center gap-0.5">
        {value} {unit && <span className="text-[12px] font-bold">{unit}</span>}
      </p>
    </div>
  );

  const renderStatsByRole = () => {
    if (!isAuthenticated) return null;

    switch (roleName) {
      case "admin":
        return (
          <>
            <StatCard title="Ternak" value={ternakCount} />
            <StatCard title="Produksi Susu" value={susuTotal} unit="L" />
            <StatCard title="User" value={userCount} />
          </>
        );

      case "manager":
        return (
          <>
            <StatCard title="Ternak" value={ternakCount} />
            <StatCard title="Produksi Susu" value={susuTotal} unit="L" />
            <StatCard title="Stock Susu" value={susuStock} unit="L" />
          </>
        );

      case "stakeholder":
        return (
          <>
            <StatCard title="Ternak (Milikku)" value={ternakCount} />
            <StatCard title="Susu (Milikku)" value={susuTotal} unit="L" />
            <StatCard title="Omset" value="" unit="" />
          </>
        );

      case "karyawan":
        return (
          <>
            <StatCard title="Jumlah Hadir" value={jumlahHadir} unit="Hr" />
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
      <div className="flex justify-between gap-2.5">{renderStatsByRole()}</div>
    </div>
  );
}

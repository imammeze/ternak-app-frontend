"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, AlignJustify, List, BarChart2 } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

import FilterAbsensi from "../../../features/absen/histori/components/FilterAbsensi";
import TabelRekapan from "../../../features/absen/histori/components/TabelRekapan";
import TabelRiwayat from "../../../features/absen/histori/components/TabelRiwayat";
import TimelineRiwayat from "../../../features/absen/histori/components/TimelineRiwayat";

export interface Absensi {
  id: number;
  tipe: string;
  waktu_absen: string;
  status_kehadiran?: string | null;
  latitude: string;
  longitude: string;
  catatan: string | null;
  aktivitas: string[] | null;
  user?: { id: number; name: string };
}

export default function HistoriAbsensiPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [histori, setHistori] = useState<Absensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [activeTab, setActiveTab] = useState<"riwayat" | "rekapan">("riwayat");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filterBulan, setFilterBulan] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    const fetchHistori = async () => {
      try {
        const response = await api.get("/api/absen/histori");
        setHistori(response.data.data);
      } catch (err: any) {
        console.error("Gagal mengambil histori:", err);
        setErrorMsg("Gagal memuat data riwayat absensi.");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchHistori();
  }, [isAuthenticated]);

  const roleName = user?.roles?.[0]?.name.toLowerCase() || "";
  const isAdminOrManager = ["admin", "manager"].includes(roleName);

  const filteredHistori = useMemo(() => {
    return histori.filter((item) => {
      const dateObj = new Date(item.waktu_absen);
      const itemMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
      const itemDate = `${itemMonth}-${String(dateObj.getDate()).padStart(2, "0")}`;

      if (filterTanggal) return itemDate === filterTanggal;
      if (filterBulan) return itemMonth === filterBulan;
      return true;
    });
  }, [histori, filterBulan, filterTanggal]);

  useEffect(() => { setCurrentPage(1); }, [filterBulan, filterTanggal]);

  const totalPages = Math.ceil(filteredHistori.length / itemsPerPage);
  const currentData = filteredHistori.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const rekapData = useMemo(() => {
    const result: Record<number, { id: number; name: string; hadir: number; ontime: number; lembur: number }> = {};
    filteredHistori.forEach((item) => {
      if (!item.user) return;
      const userId = item.user.id;

      if (!result[userId]) result[userId] = { id: userId, name: item.user.name, hadir: 0, ontime: 0, lembur: 0 };

      if (item.tipe === "Masuk") {
        result[userId].hadir += 1;
        if (item.status_kehadiran === "Tepat Waktu") result[userId].ontime += 1;
      } else if (item.tipe === "Mulai Lembur") {
        result[userId].lembur += 1;
      }
    });
    return Object.values(result).sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredHistori]);

  if (!isClient) return null;

  return (
    <>
      <div className="flex items-center px-4 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link href="/" className="p-2 cursor-pointer transition-colors"><ChevronLeft size={24} /></Link>
        <h1 className="text-lg font-semibold ml-2 tracking-wide">
          {isAdminOrManager ? "Data Kehadiran" : "Histori Absensi"}
        </h1>
      </div>

      <div className="flex-1 bg-slate-50 px-5 pt-6 pb-32 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-sm">Memuat data...</p>
          </div>
        ) : errorMsg ? (
          <div className="text-center mt-10 text-rose-500 text-sm font-medium p-4 bg-rose-50 rounded-2xl">{errorMsg}</div>
        ) : histori.length === 0 ? (
          <div className="text-center mt-20 text-gray-400">
            <AlignJustify size={48} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium text-sm">Belum ada data kehadiran.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            <FilterAbsensi 
              filterBulan={filterBulan} setFilterBulan={setFilterBulan}
              filterTanggal={filterTanggal} setFilterTanggal={setFilterTanggal}
            />

            {isAdminOrManager ? (
              <>
                <div className="flex bg-gray-200/50 p-1 rounded-xl mb-2">
                  <button onClick={() => setActiveTab("riwayat")} className={`flex-1 flex justify-center gap-2 py-2.5 text-sm font-bold rounded-lg ${activeTab === "riwayat" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <List size={16} /> Riwayat
                  </button>
                  <button onClick={() => setActiveTab("rekapan")} className={`flex-1 flex justify-center gap-2 py-2.5 text-sm font-bold rounded-lg ${activeTab === "rekapan" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <BarChart2 size={16} /> Rekapan
                  </button>
                </div>

                {activeTab === "riwayat" && (
                  <TabelRiwayat 
                    data={currentData} 
                    currentPage={currentPage} totalPages={totalPages} 
                    onPrevPage={handlePrevPage} onNextPage={handleNextPage} 
                  />
                )}
                {activeTab === "rekapan" && <TabelRekapan data={rekapData} />}
              </>
            ) : (
              <TimelineRiwayat data={currentData} />
            )}

          </div>
        )}
      </div>
    </>
  );
}
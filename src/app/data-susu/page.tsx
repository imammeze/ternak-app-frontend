"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Info,
  List,
  Table as TableIcon,
  LineChart,
  Filter,
  XCircle,
} from "lucide-react";
import api from "@/lib/axios";

import SummarySusu from "@/features/produksi-susu/components/SummarySusu";
import ListSusu from "@/features/produksi-susu/components/ListSusu";
import TabelSusu from "@/features/produksi-susu/components/TabelSusu";
import GrafikSusu from "@/features/produksi-susu/components/GrafikSusu";

export interface ProduksiSusu {
  id: string;
  tanggal: string;
  kepemilikan: string;
  total_liter: string | number;
  petugas: string;
  pemilik?: { name: string };
  jumlah_ternak: number;
  pagi_1l: number;
  sore_1l: number;
  pagi_250ml: number;
  sore_250ml: number;
  pagi_cempe_ml: number;
  sore_cempe_ml: number;
}

export default function RiwayatSusuPage() {
  const [susuList, setSusuList] = useState<ProduksiSusu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<"riwayat" | "tabel" | "grafik">(
    "riwayat",
  );
  const [filterBulan, setFilterBulan] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");

  useEffect(() => {
    const fetchSusu = async () => {
      try {
        const response = await api.get("/api/produksi-susu");
        setSusuList(response.data.data);
      } catch (err: any) {
        console.error("Gagal mengambil data:", err);
        setError("Gagal memuat riwayat produksi susu.");
      } finally {
        setLoading(false);
      }
    };
    fetchSusu();
  }, []);

  // 1. Logika Filter
  const filteredSusu = useMemo(() => {
    return susuList.filter((s) => {
      const dateObj = new Date(s.tanggal);
      const itemMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
      const itemDate = `${itemMonth}-${String(dateObj.getDate()).padStart(2, "0")}`;

      if (filterTanggal) return itemDate === filterTanggal;
      if (filterBulan) return itemMonth === filterBulan;
      return true;
    });
  }, [susuList, filterBulan, filterTanggal]);

  // 2. Hitung Total Liter
  const totalKeseluruhan = filteredSusu.reduce(
    (acc, curr) => acc + Number(curr.total_liter),
    0,
  );

  // 3. Persiapkan Data Grafik
  const chartData = useMemo(() => {
    const grouped: Record<
      string,
      { date: string; displayDate: string; total: number }
    > = {};
    filteredSusu.forEach((s) => {
      if (!grouped[s.tanggal]) {
        grouped[s.tanggal] = {
          date: s.tanggal,
          displayDate: new Date(s.tanggal).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          }),
          total: 0,
        };
      }
      grouped[s.tanggal].total += Number(s.total_liter);
    });
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [filteredSusu]);

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Data Produksi Susu</h1>
        <Link
          href="/input-data/produksi-susu"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <Plus size={24} />
        </Link>
      </div>

      <div className="flex-1 bg-slate-50 px-5 pt-6 pb-32 overflow-y-auto">
        {/* KOTAK FILTER */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 mb-4">
          <div className="bg-gray-50 p-2 rounded-xl text-gray-400 shrink-0">
            <Filter size={18} />
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="month"
              value={filterBulan}
              onChange={(e) => {
                setFilterBulan(e.target.value);
                setFilterTanggal("");
              }}
              className="flex-1 text-[12px] font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 outline-none focus:border-emerald-500 transition-colors"
            />
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => {
                setFilterTanggal(e.target.value);
                setFilterBulan("");
              }}
              className="flex-1 text-[12px] font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          {(filterBulan || filterTanggal) && (
            <button
              onClick={() => {
                setFilterBulan("");
                setFilterTanggal("");
              }}
              className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0">
              <XCircle size={18} />
            </button>
          )}
        </div>

        {/* WIDGET TOTAL (Komponen) */}
        {!loading && !error && (
          <SummarySusu
            totalLiter={totalKeseluruhan}
            totalRecord={filteredSusu.length}
          />
        )}

        {/* TABS MENU */}
        <div className="flex bg-gray-200/50 p-1 rounded-xl mb-5">
          <button
            onClick={() => setActiveTab("riwayat")}
            className={`flex-1 flex justify-center items-center gap-1.5 py-2.5 text-[12px] font-bold rounded-lg transition-all ${activeTab === "riwayat" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}>
            <List size={14} /> Riwayat
          </button>
          <button
            onClick={() => setActiveTab("tabel")}
            className={`flex-1 flex justify-center items-center gap-1.5 py-2.5 text-[12px] font-bold rounded-lg transition-all ${activeTab === "tabel" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}>
            <TableIcon size={14} /> Tabel
          </button>
          <button
            onClick={() => setActiveTab("grafik")}
            className={`flex-1 flex justify-center items-center gap-1.5 py-2.5 text-[12px] font-bold rounded-lg transition-all ${activeTab === "grafik" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}>
            <LineChart size={14} /> Grafik
          </button>
        </div>

        {/* RENDER KONTEN BERDASARKAN TAB */}
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
          </div>
        ) : error ? (
          <div className="text-center mt-10 text-rose-500 text-sm font-medium">
            {error}
          </div>
        ) : filteredSusu.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <Info size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-sm">
              Tidak ada data untuk rentang waktu tersebut.
            </p>
          </div>
        ) : (
          <>
            {activeTab === "riwayat" && <ListSusu data={filteredSusu} />}
            {activeTab === "tabel" && <TabelSusu data={filteredSusu} />}
            {activeTab === "grafik" && <GrafikSusu data={chartData} />}
          </>
        )}
      </div>
    </>
  );
}

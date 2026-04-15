"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  LogIn,
  LogOut,
  Clock,
  TimerOff,
  AlignJustify,
  FileText,
  ListTodo,
  CheckCircle2,
  User,
  List,
  BarChart2,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

interface Absensi {
  id: number;
  tipe: string;
  waktu_absen: string;
  status_kehadiran?: string | null;
  latitude: string;
  longitude: string;
  catatan: string | null;
  aktivitas: string[] | null;
  user?: {
    id: number;
    name: string;
  };
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

  useEffect(() => {
    setIsClient(true);
  }, []);

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

    if (isAuthenticated) {
      fetchHistori();
    }
  }, [isAuthenticated]);

  const roleName = user?.roles?.[0]?.name.toLowerCase() || "";
  const isAdminOrManager = ["admin", "manager"].includes(roleName);

  const totalPages = Math.ceil(histori.length / itemsPerPage);
  const currentData = histori.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const rekapData = useMemo(() => {
    const result: Record<
      number,
      {
        id: number;
        name: string;
        hadir: number;
        ontime: number;
        lembur: number;
      }
    > = {};

    histori.forEach((item) => {
      if (!item.user) return; 
      const userId = item.user.id;

      if (!result[userId]) {
        result[userId] = {
          id: userId,
          name: item.user.name,
          hadir: 0,
          ontime: 0,
          lembur: 0,
        };
      }

      if (item.tipe === "Masuk") {
        result[userId].hadir += 1;
        if (item.status_kehadiran === "Tepat Waktu") {
          result[userId].ontime += 1;
        }
      } else if (item.tipe === "Mulai Lembur") {
        result[userId].lembur += 1;
      }
    });

    return Object.values(result).sort((a, b) => a.name.localeCompare(b.name));
  }, [histori]);

  const getStyleByType = (tipe: string) => {
    switch (tipe) {
      case "Masuk":
        return {
          color: "text-emerald-500",
          bg: "bg-emerald-50",
          indicator: "bg-emerald-400",
          icon: LogIn,
        };
      case "Keluar":
        return {
          color: "text-rose-500",
          bg: "bg-rose-50",
          indicator: "bg-rose-400",
          icon: LogOut,
        };
      case "Mulai Lembur":
        return {
          color: "text-purple-500",
          bg: "bg-purple-50",
          indicator: "bg-purple-400",
          icon: Clock,
        };
      case "Selesai Lembur":
        return {
          color: "text-orange-500",
          bg: "bg-orange-50",
          indicator: "bg-orange-400",
          icon: TimerOff,
        };
      default:
        return {
          color: "text-gray-500",
          bg: "bg-gray-50",
          indicator: "bg-gray-400",
          icon: AlignJustify,
        };
    }
  };

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatJam = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isClient) return null;

  return (
    <>
      <div className="flex items-center px-4 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link href="/" className="p-2 cursor-pointer transition-colors">
          <ChevronLeft size={24} />
        </Link>
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
          <div className="text-center mt-10 text-rose-500 text-sm font-medium p-4 bg-rose-50 rounded-2xl border border-rose-100">
            {errorMsg}
          </div>
        ) : histori.length === 0 ? (
          <div className="text-center mt-20 text-gray-400 flex flex-col items-center">
            <AlignJustify size={48} className="mb-3 opacity-50" />
            <p className="font-medium text-sm">Belum ada data kehadiran.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {isAdminOrManager ? (
              <>
                <div className="flex bg-gray-200/50 p-1 rounded-xl mb-2">
                  <button
                    onClick={() => setActiveTab("riwayat")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      activeTab === "riwayat"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    <List size={16} strokeWidth={2.5} /> Riwayat
                  </button>
                  <button
                    onClick={() => setActiveTab("rekapan")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      activeTab === "rekapan"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    <BarChart2 size={16} strokeWidth={2.5} /> Rekapan
                  </button>
                </div>

                {activeTab === "riwayat" && (
                  <>
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-emerald-50 border-b border-emerald-100">
                              <th className="py-3 px-4 text-[11px] font-bold text-emerald-800 uppercase tracking-wider whitespace-nowrap">
                                Karyawan
                              </th>
                              <th className="py-3 px-4 text-[11px] font-bold text-emerald-800 uppercase tracking-wider whitespace-nowrap">
                                Tanggal & Jam
                              </th>
                              <th className="py-3 px-4 text-[11px] font-bold text-emerald-800 uppercase tracking-wider whitespace-nowrap">
                                Tipe
                              </th>
                              <th className="py-3 px-4 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                                Keterangan
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {currentData.map((item) => {
                              const style = getStyleByType(item.tipe);
                              return (
                                <tr
                                  key={item.id}
                                  className="hover:bg-gray-50 transition-colors">
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                        <User
                                          size={14}
                                          className="text-gray-500"
                                        />
                                      </div>
                                      <span className="text-sm font-bold text-gray-800 whitespace-nowrap">
                                        {item.user?.name || "-"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-700">
                                      {formatTanggal(item.waktu_absen)}
                                    </div>
                                    <div className="text-[11px] font-medium text-gray-400">
                                      {formatJam(item.waktu_absen)} WIB
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-1.5 items-start">
                                      <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${style.bg} ${style.color}`}>
                                        {item.tipe}
                                      </span>

                                      {item.tipe === "Masuk" &&
                                        item.status_kehadiran && (
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                              item.status_kehadiran ===
                                              "Tepat Waktu"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                : "bg-rose-50 text-rose-600 border-rose-200"
                                            }`}>
                                            {item.status_kehadiran}
                                          </span>
                                        )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 min-w-[200px]">
                                    {item.catatan && (
                                      <div className="text-[12px] text-gray-600 line-clamp-2 italic">
                                        "{item.catatan}"
                                      </div>
                                    )}
                                    {item.aktivitas &&
                                      Array.isArray(item.aktivitas) &&
                                      item.aktivitas.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {item.aktivitas
                                            .slice(0, 2)
                                            .map((act, idx) => (
                                              <span
                                                key={idx}
                                                className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-medium border border-gray-200">
                                                {act}
                                              </span>
                                            ))}
                                          {item.aktivitas.length > 2 && (
                                            <span className="text-[10px] text-gray-400 font-medium">
                                              +{item.aktivitas.length - 2} lagi
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    {!item.catatan &&
                                      (!item.aktivitas ||
                                        item.aktivitas.length === 0) && (
                                        <span className="text-[12px] text-gray-400">
                                          -
                                        </span>
                                      )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-2">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}>
                          <ChevronLeft size={18} /> Prev
                        </button>
                        <span className="text-sm font-bold text-gray-600">
                          Hal{" "}
                          <span className="text-emerald-600">
                            {currentPage}
                          </span>{" "}
                          dari {totalPages}
                        </span>
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}>
                          Next <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "rekapan" && (
                  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-emerald-600 text-white border-b border-emerald-700">
                            <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                              Nama Karyawan
                            </th>
                            <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-center">
                              Hadir
                            </th>
                            <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-center">
                              Tepat Waktu
                            </th>
                            <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-center">
                              Lembur
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {rekapData.map((rekap) => (
                            <tr
                              key={rekap.id}
                              className="hover:bg-gray-50 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-sm text-gray-800 whitespace-nowrap">
                                {rekap.name}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                  {rekap.hadir}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                  {rekap.ontime}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="text-sm font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                                  {rekap.lembur}
                                </span>
                              </td>
                            </tr>
                          ))}

                          {rekapData.length === 0 && (
                            <tr>
                              <td
                                colSpan={4}
                                className="py-8 text-center text-sm font-medium text-gray-400">
                                Tidak ada data rekap absensi.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              currentData.map((item) => {
                const style = getStyleByType(item.tipe);
                const IconComponent = style.icon;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.indicator}`}></div>
                    <div className="flex justify-between items-start pl-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${style.bg} ${style.color}`}>
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-bold text-[15px] leading-tight ${style.color}`}>
                              {item.tipe}
                            </h3>
                            {item.tipe === "Masuk" && item.status_kehadiran && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                  item.status_kehadiran === "Tepat Waktu"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-rose-50 text-rose-600 border-rose-200"
                                }`}>
                                {item.status_kehadiran}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 mt-1">
                            <CalendarDays size={12} />{" "}
                            {formatTanggal(item.waktu_absen)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-gray-800 tabular-nums tracking-tight">
                          {formatJam(item.waktu_absen)}
                        </span>
                      </div>
                    </div>
                    <div className="pl-2 flex flex-col gap-2 mt-2 pt-3 border-t border-gray-50">
                      <div className="flex items-start gap-2 text-[12px] font-medium text-gray-500">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-blue-400"
                        />
                        <span className="line-clamp-1">
                          Lat: {Number(item.latitude).toFixed(5)}, Lng:{" "}
                          {Number(item.longitude).toFixed(5)}
                        </span>
                      </div>
                      {item.catatan && (
                        <div className="flex items-start gap-2 text-[12px] font-medium text-gray-600 bg-gray-50 p-2 rounded-lg mt-1 border border-gray-100">
                          <FileText
                            size={14}
                            className="mt-0.5 shrink-0 text-gray-400"
                          />
                          <span className="italic">"{item.catatan}"</span>
                        </div>
                      )}
                      {item.aktivitas &&
                        Array.isArray(item.aktivitas) &&
                        item.aktivitas.length > 0 && (
                          <div className="mt-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase mb-1.5">
                              <ListTodo size={12} /> Aktivitas Diselesaikan:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {item.aktivitas.map((act, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-[11px] font-bold border border-emerald-100">
                                  <CheckCircle2
                                    size={10}
                                    className="text-emerald-500"
                                  />{" "}
                                  {act}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}

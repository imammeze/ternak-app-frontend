"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  UserCheck,
  UserMinus,
  Clock,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

interface Absensi {
  id: number;
  tipe: string;
  waktu_absen: string;
  user?: { id: number; name: string };
}

interface PengajuanLibur {
  id: number;
  tanggal: string;
  status: string;
  user?: { id: number; name: string };
}

export default function KalenderKehadiranPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  const [historiList, setHistoriList] = useState<Absensi[]>([]);
  const [liburList, setLiburList] = useState<PengajuanLibur[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAbsen, resLibur] = await Promise.all([
          api.get("/api/absen/histori"),
          api.get("/api/pengajuan-libur"),
        ]);
        setHistoriList(resAbsen.data.data);
        setLiburList(resLibur.data.data);
      } catch (err) {
        console.error("Gagal menarik data kalender:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isSameDay = (dateString: string, compareDate: Date) => {
    const d = new Date(dateString);
    return (
      d.getFullYear() === compareDate.getFullYear() &&
      d.getMonth() === compareDate.getMonth() &&
      d.getDate() === compareDate.getDate()
    );
  };

  const getDayData = (day: number) => {
    const targetDate = new Date(year, month, day);

    const rawMasuk = historiList.filter(
      (h) => h.tipe === "Masuk" && isSameDay(h.waktu_absen, targetDate),
    );
    const uniqueMasuk = Array.from(
      new Map(rawMasuk.map((item) => [item.user?.id, item])).values(),
    );

    const liburACC = liburList.filter(
      (l) => l.status === "Disetujui" && isSameDay(l.tanggal, targetDate),
    );

    const liburPending = liburList.filter(
      (l) =>
        l.status === "Menunggu Persetujuan" && isSameDay(l.tanggal, targetDate),
    );

    return { masuk: uniqueMasuk, liburACC, liburPending, targetDate };
  };

  const handleDayClick = (day: number) => {
    const targetDate = new Date(year, month, day);
    setSelectedDay(targetDate);
    setIsModalOpen(true);
  };

  if (!isClient) return null;

  const selectedData = selectedDay ? getDayData(selectedDay.getDate()) : null;

  return (
    <>
      <div className="flex items-center px-4 pt-10 pb-4 bg-indigo-600 text-white z-10 sticky top-0 shadow-sm">
        <Link href="/" className="p-2 cursor-pointer transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold ml-2 tracking-wide">
          Kalender Kehadiran
        </h1>
      </div>

      <div className="flex-1 bg-slate-50 px-4 pt-6 pb-32 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-indigo-50/30">
              <button
                onClick={prevMonth}
                className="p-2 bg-white rounded-full shadow-sm text-indigo-600 hover:bg-indigo-50">
                <ChevronLeft size={20} />
              </button>
              <h2 className="font-black text-gray-800 text-lg flex items-center gap-2">
                <CalendarIcon size={20} className="text-indigo-500" />
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 bg-white rounded-full shadow-sm text-indigo-600 hover:bg-indigo-50">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 p-3 pb-1">
              {dayNames.map((day, i) => (
                <div
                  key={i}
                  className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 p-3 pt-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="h-20 sm:h-24 rounded-xl bg-gray-50/50"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const data = getDayData(day);
                const hasData =
                  data.masuk.length > 0 ||
                  data.liburACC.length > 0 ||
                  data.liburPending.length > 0;
                const isToday = isSameDay(
                  new Date().toISOString(),
                  new Date(year, month, day),
                );

                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`h-20 sm:h-24 p-1 rounded-xl border flex flex-col cursor-pointer transition-all hover:border-indigo-300 hover:shadow-md ${isToday ? "bg-indigo-50/50 border-indigo-200" : "bg-white border-gray-100"}`}>
                    <span
                      className={`text-[12px] font-bold self-end px-1.5 py-0.5 rounded-md mb-1 ${isToday ? "bg-indigo-600 text-white" : "text-gray-700"}`}>
                      {day}
                    </span>

                    <div className="flex flex-col gap-0.5 overflow-y-auto no-scrollbar">
                      {data.masuk.length > 0 && (
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-between">
                          <span>Masuk</span> <span>{data.masuk.length}</span>
                        </span>
                      )}
                      {data.liburACC.length > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-between">
                          <span>Libur</span> <span>{data.liburACC.length}</span>
                        </span>
                      )}
                      {data.liburPending.length > 0 && (
                        <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-between">
                          <span>Wait</span>{" "}
                          <span>{data.liburPending.length}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>{" "}
                Hadir
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div> Libur
                (ACC)
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>{" "}
                Pending
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedData && (
        <div className="fixed inset-0 z-99999 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-50 w-full sm:max-w-md h-[80vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white rounded-t-3xl sm:rounded-t-3xl sticky top-0 z-10 shrink-0">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Detail Kehadiran
                </h3>
                <p className="text-xs font-medium text-indigo-600">
                  {selectedData.targetDate.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:bg-gray-100 rounded-full p-1.5 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                  <UserCheck size={18} className="text-emerald-500" />
                  <h4 className="font-bold text-sm text-gray-800">
                    Karyawan Masuk ({selectedData.masuk.length})
                  </h4>
                </div>
                {selectedData.masuk.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {selectedData.masuk.map((item) => (
                      <li
                        key={`m-${item.id}`}
                        className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-bold text-gray-700">
                          {item.user?.name}
                        </span>
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded uppercase">
                          Hadir
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    Tidak ada karyawan yang masuk.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                  <UserMinus size={18} className="text-blue-500" />
                  <h4 className="font-bold text-sm text-gray-800">
                    Libur Disetujui ({selectedData.liburACC.length})
                  </h4>
                </div>
                {selectedData.liburACC.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {selectedData.liburACC.map((item) => (
                      <li
                        key={`la-${item.id}`}
                        className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-bold text-gray-700">
                          {item.user?.name}
                        </span>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase">
                          Libur
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    Tidak ada karyawan libur.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                  <Clock size={18} className="text-amber-500" />
                  <h4 className="font-bold text-sm text-gray-800">
                    Menunggu Persetujuan ({selectedData.liburPending.length})
                  </h4>
                </div>
                {selectedData.liburPending.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {selectedData.liburPending.map((item) => (
                      <li
                        key={`lp-${item.id}`}
                        className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-bold text-gray-700">
                          {item.user?.name}
                        </span>
                        <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-2 py-1 rounded uppercase">
                          Pending
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    Tidak ada pengajuan tertunda.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  CalendarOff,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

interface Pengajuan {
  id: number;
  tanggal: string;
  catatan: string;
  status: string;
  created_at: string;
  user?: { name: string };
}

export default function RiwayatLiburPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchPengajuan = async () => {
    try {
      const response = await api.get("/api/pengajuan-libur");
      setPengajuanList(response.data.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      toast.error("Gagal memuat data riwayat libur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchPengajuan();
  }, [isAuthenticated]);

  const roleName = user?.roles?.[0]?.name.toLowerCase() || "";
  const isAdminOrManager = ["admin", "manager"].includes(roleName);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const loadingToast = toast.loading("Memperbarui status...");
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.put(`/api/pengajuan-libur/${id}/status`, { status: newStatus });

      setPengajuanList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
      toast.success(`Pengajuan ${newStatus}!`, { id: loadingToast });
    } catch (err) {
      toast.error("Gagal memperbarui status.", { id: loadingToast });
    }
  };

  const confirmAction = (id: number, nama: string, newStatus: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in fade-in" : "animate-out fade-out"} max-w-sm w-full bg-white shadow-xl rounded-2xl flex flex-col ring-1 ring-black/5 z-999999`}>
          <div className="p-5 flex gap-4 items-start">
            <div
              className={`p-2.5 rounded-full shrink-0 ${newStatus === "Disetujui" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {newStatus === "Disetujui" ? "Setujui" : "Tolak"} Pengajuan?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tindakan ini untuk pengajuan libur <b>{nama}</b>.
              </p>
            </div>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-bl-2xl">
              Batal
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleUpdateStatus(id, newStatus);
              }}
              className={`w-full py-3.5 text-sm font-black rounded-br-2xl ${newStatus === "Disetujui" ? "text-emerald-600 hover:bg-emerald-50" : "text-rose-600 hover:bg-rose-50"}`}>
              Ya, {newStatus}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const getStatusStyle = (status: string) => {
    if (status === "Disetujui")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Ditolak")
      return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Disetujui") return <CheckCircle2 size={14} />;
    if (status === "Ditolak") return <XCircle size={14} />;
    return <Clock size={14} />;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!isClient) return null;

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-10 pb-4 bg-rose-500 text-white z-10 sticky top-0 shadow-sm">
        <div className="flex items-center">
          <Link
            href={isAdminOrManager ? "/" : "/absen"}
            className="p-2 cursor-pointer transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-lg font-semibold ml-2 tracking-wide">
            {isAdminOrManager ? "Daftar Pengajuan Libur" : "Riwayat Libur"}
          </h1>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 px-5 pt-6 pb-32 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pengajuanList.length === 0 ? (
          <div className="text-center mt-20 text-gray-400 flex flex-col items-center">
            <CalendarOff size={48} className="mb-3 opacity-50" />
            <p className="font-medium text-sm">
              Belum ada riwayat pengajuan libur.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pengajuanList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-3">
                  <div>
                    {isAdminOrManager && (
                      <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-1">
                        <User size={14} className="text-blue-500" />{" "}
                        {item.user?.name}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-rose-600 font-black text-lg">
                      {formatDate(item.tanggal)}
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                    {getStatusIcon(item.status)} {item.status}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <FileText
                    size={16}
                    className="shrink-0 text-gray-400 mt-0.5"
                  />
                  <span className="leading-relaxed italic">
                    {item.catatan && item.catatan !== "-"
                      ? `"${item.catatan}"`
                      : "Tidak ada catatan."}
                  </span>
                </div>

                {isAdminOrManager && (
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                    {item.status !== "Ditolak" && (
                      <button
                        onClick={() =>
                          confirmAction(
                            item.id,
                            item.user?.name || "",
                            "Ditolak",
                          )
                        }
                        className="flex-1 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-[12px] transition-colors">
                        {item.status === "Disetujui"
                          ? "BATALKAN & TOLAK"
                          : "TOLAK"}
                      </button>
                    )}

                    {item.status !== "Disetujui" && (
                      <button
                        onClick={() =>
                          confirmAction(
                            item.id,
                            item.user?.name || "",
                            "Disetujui",
                          )
                        }
                        className="flex-1 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl font-bold text-[12px] transition-colors">
                        {item.status === "Ditolak"
                          ? "REVISI JADI SETUJU"
                          : "SETUJUI"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

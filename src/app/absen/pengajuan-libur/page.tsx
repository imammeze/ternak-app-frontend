"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronLeft, CalendarOff, FileText } from "lucide-react";
import api from "@/lib/axios";

export default function PengajuanLiburFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ tanggal: "", catatan: "" });

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/pengajuan-libur", formData);
      toast.success("Pengajuan libur berhasil dikirim!");
      router.push("/absen/riwayat-libur");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengirim pengajuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center px-4 pt-10 pb-4 bg-rose-500 text-white z-10 sticky top-0 shadow-sm">
        <Link href="/absen" className="p-2 cursor-pointer transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold ml-2 tracking-wide">
          Form Pengajuan Libur
        </h1>
      </div>

      <div className="flex-1 bg-slate-50 px-5 pt-6 pb-32 overflow-y-auto">
        <div className="bg-white rounded-3xl w-full shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 bg-rose-50/30 flex items-center gap-3">
            <div className="bg-rose-100 p-2.5 rounded-xl text-rose-600">
              <CalendarOff size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Buat Pengajuan</h3>
              <p className="text-[11px] font-medium text-gray-500 mt-0.5">
                Pilih tanggal dan isi keterangan jika perlu.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Tanggal Libur *
              </label>
              <input
                type="date"
                required
                min={minDate}
                value={formData.tanggal}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal: e.target.value })
                }
                className="w-full text-sm font-semibold text-gray-800 border border-gray-200 rounded-xl p-3.5 outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Alasan / Catatan
                </label>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                  Opsional
                </span>
              </div>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 text-gray-400">
                  <FileText size={18} />
                </div>
                <textarea
                  rows={4}
                  value={formData.catatan}
                  onChange={(e) =>
                    setFormData({ ...formData, catatan: e.target.value })
                  }
                  className="w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-xl p-3.5 pl-10 outline-none focus:border-rose-500 resize-none transition-colors"
                  placeholder="Misal: Acara keluarga di luar kota..."></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${isSubmitting ? "bg-rose-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700 active:scale-[0.98] shadow-rose-200"}`}>
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "KIRIM PENGAJUAN"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

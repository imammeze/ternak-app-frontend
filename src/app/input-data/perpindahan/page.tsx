"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Tag,
  MapPin,
  Home,
  FileText,
  ArrowRightLeft,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/axios";

export default function InputPerpindahanPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    tanggal_tindakan: new Date().toISOString().split("T")[0],
    id_ternak: "",
    kandang_awal: "",
    kandang_tujuan: "",
    catatan: "",
  });

  const [ternakList, setTernakList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchTernak = async () => {
      try {
        const response = await api.get("/api/ternak");
        setTernakList(response.data.data);
      } catch (err) {
        console.error("Gagal memuat daftar ternak:", err);
      }
    };
    fetchTernak();
  }, []);

  const handleTernakChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedTernak = ternakList.find((t) => t.id_ternak === selectedId);

    setFormData((prev) => ({
      ...prev,
      id_ternak: selectedId,
      kandang_awal: selectedTernak?.no_kandang || "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (!formData.id_ternak) {
      setErrorMsg("Mohon pilih ID Ternak terlebih dahulu.");
      setIsLoading(false);
      return;
    }

    if (formData.kandang_awal === formData.kandang_tujuan) {
      setErrorMsg("Kandang tujuan tidak boleh sama dengan kandang asal.");
      setIsLoading(false);
      return;
    }

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/perpindahan-ternak", formData);

      toast.success("Perpindahan sukses! Lokasi sapi otomatis diperbarui.");
      router.push("/input-data");
    } catch (err: any) {
      console.error("Gagal memindahkan:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menyimpan data ke server.",
      );
      setIsLoading(false);
    }
  };

  const daftarKandang = [
    "KDG A01 - Kandang Timur",
    "KDG A02 - Kandang Barat",
    "KDG B01 - Karantina",
    "KDG B02 - Isolasi",
    "KDG C01 - Pembibitan",
  ];

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/input-data"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Pindah Kandang</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        {errorMsg && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700">
            <AlertCircle size={24} className="text-rose-500 shrink-0" />
            <p className="font-semibold text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm mb-2">
            <div className="flex items-center gap-3">
              <CalendarDays size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Tanggal
              </span>
            </div>
            <input
              type="date"
              name="tanggal_tindakan"
              value={formData.tanggal_tindakan}
              onChange={handleChange}
              required
              className="text-[15px] font-medium text-gray-800 outline-none text-right bg-transparent cursor-pointer w-36"
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm relative">
              <div className="flex items-center gap-3">
                <Tag size={20} className="text-emerald-700" />
                <span className="text-[15px] text-gray-700 font-medium">
                  ID Ternak
                </span>
              </div>
              <select
                name="id_ternak"
                value={formData.id_ternak}
                onChange={handleTernakChange}
                className="appearance-none bg-transparent text-[15px] font-medium text-gray-800 text-right pr-6 outline-none cursor-pointer z-10 w-48 truncate">
                <option value="" disabled>
                  -- Pilih Sapi --
                </option>
                {ternakList.map((t) => (
                  <option key={t.id_ternak} value={t.id_ternak}>
                    {t.id_ternak} - {t.nama_ternak}
                  </option>
                ))}
              </select>
              <ChevronRight
                size={16}
                className="text-gray-400 absolute right-3"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-gray-100 shadow-sm opacity-80 mt-2">
            <div className="flex items-center gap-3 pointer-events-none">
              <Home size={20} className="text-gray-500" />
              <span className="text-[15px] text-gray-600 font-medium">
                Kandang Asal
              </span>
            </div>
            <input
              type="text"
              name="kandang_awal"
              value={formData.kandang_awal}
              readOnly
              placeholder="Pilih sapi dulu..."
              className="flex-1 text-[15px] text-right font-medium text-gray-500 outline-none bg-transparent ml-4 truncate"
            />
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-emerald-100 p-2 rounded-full border-[5px] border-slate-50">
              <ArrowRightLeft
                size={18}
                className="text-emerald-600 transform rotate-90"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border border-emerald-200 rounded-xl p-3.5 bg-emerald-50 shadow-sm relative">
            <div className="flex items-center gap-3 pointer-events-none">
              <MapPin size={20} className="text-emerald-700" />
              <span className="text-[15px] text-emerald-900 font-medium">
                Kandang Tujuan
              </span>
            </div>
            <select
              name="kandang_tujuan"
              value={formData.kandang_tujuan}
              onChange={handleChange}
              className="appearance-none bg-transparent text-[15px] text-right font-bold text-emerald-800 outline-none cursor-pointer pr-6 absolute right-3 w-48 truncate">
              <option value="" disabled>
                Pilih Tujuan
              </option>
              {daftarKandang.map((kd) => (
                <option key={kd} value={kd}>
                  {kd}
                </option>
              ))}
            </select>
            <ChevronRight
              size={18}
              className="text-emerald-600 absolute right-3 pointer-events-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <FileText size={20} className="text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                placeholder="Alasan perpindahan (Opsional)..."
                className="flex-1 text-[15px] font-medium text-gray-800 outline-none bg-transparent truncate"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full text-white font-semibold py-4 rounded-xl shadow-lg transition-colors tracking-wider mb-8 flex justify-center items-center gap-2 ${
              isLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-[#6db6a5] hover:bg-emerald-600 shadow-emerald-200"
            }`}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "SIMPAN PERPINDAHAN"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

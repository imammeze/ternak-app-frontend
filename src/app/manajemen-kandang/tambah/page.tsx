"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Hash,
  Home,
  Maximize2,
  Tag,
  Activity,
  FileText,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/axios";

export default function CreateKandangPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    kode_kandang: "",
    nama_kandang: "",
    kapasitas: "",
    jenis: "Umum",
    status: "Aktif",
    catatan: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setValidationErrors({});

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/kandang", {
        ...formData,
        kapasitas: Number(formData.kapasitas),
      });

      toast.success("Kandang baru berhasil ditambahkan!");
      router.push("/manajemen-kandang");
    } catch (err: any) {
      console.error("Gagal menambah kandang:", err);

      if (err.response?.status === 422) {
        setErrorMsg("Terdapat kesalahan pada isian form Anda.");
        setValidationErrors(err.response.data.errors);
      } else {
        setErrorMsg(
          err.response?.data?.message || "Gagal menyimpan data ke server.",
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/manajemen-kandang"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Tambah Kandang</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 shadow-sm">
            <AlertCircle size={24} className="text-rose-500 shrink-0" />
            <p className="font-semibold text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center border ${validationErrors.kode_kandang ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white"} rounded-xl p-3.5 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-200 transition-all`}>
              <Hash
                size={20}
                className={
                  validationErrors.kode_kandang
                    ? "text-rose-500 mr-3"
                    : "text-emerald-600 mr-3"
                }
              />
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Kode Kandang
                </label>
                <input
                  type="text"
                  name="kode_kandang"
                  value={formData.kode_kandang}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: A01"
                  className="w-full text-[15px] font-bold text-gray-800 outline-none bg-transparent placeholder-gray-300 uppercase"
                />
              </div>
            </div>
            {validationErrors.kode_kandang && (
              <p className="text-xs text-rose-500 ml-2 font-medium">
                {validationErrors.kode_kandang[0]}
              </p>
            )}
          </div>

          <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-200 transition-all">
            <Home size={20} className="text-emerald-600 mr-3" />
            <div className="flex-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Nama / Lokasi Kandang
              </label>
              <input
                type="text"
                name="nama_kandang"
                value={formData.nama_kandang}
                onChange={handleChange}
                required
                placeholder="Contoh: Kandang Timur"
                className="w-full text-[15px] font-semibold text-gray-800 outline-none bg-transparent placeholder-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-200 transition-all">
            <Maximize2 size={20} className="text-emerald-600 mr-3" />
            <div className="flex-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Kapasitas Maksimal
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="kapasitas"
                  value={formData.kapasitas}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="0"
                  className="w-full text-[15px] font-semibold text-gray-800 outline-none bg-transparent placeholder-gray-300"
                />
                <span className="text-sm font-bold text-gray-400 ml-2">
                  Ekor
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 bg-white shadow-sm relative">
              <div className="flex items-center gap-2 pointer-events-none z-10">
                <Tag size={18} className="text-emerald-600" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Jenis
                  </span>
                </div>
              </div>
              <select
                name="jenis"
                value={formData.jenis}
                onChange={handleChange}
                className="appearance-none bg-transparent text-[13px] font-bold text-gray-800 text-right pr-5 outline-none cursor-pointer absolute right-2 inset-y-0 pl-16 z-20">
                <option value="Umum">Umum</option>
                <option value="Laktasi">Laktasi</option>
                <option value="Karantina">Karantina</option>
                <option value="Isolasi">Isolasi</option>
                <option value="Pembibitan">Pembibitan</option>
              </select>
              <ChevronRight
                size={14}
                className="text-gray-400 absolute right-2 pointer-events-none z-10 transform rotate-90"
              />
            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 bg-white shadow-sm relative">
              <div className="flex items-center gap-2 pointer-events-none z-10">
                <Activity size={18} className="text-emerald-600" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </span>
                </div>
              </div>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="appearance-none bg-transparent text-[13px] font-bold text-gray-800 text-right pr-5 outline-none cursor-pointer absolute right-2 inset-y-0 pl-16 z-20">
                <option value="Aktif">Aktif</option>
                <option value="Penuh">Penuh</option>
                <option value="Renovasi">Renovasi</option>
              </select>
              <ChevronRight
                size={14}
                className="text-gray-400 absolute right-2 pointer-events-none z-10 transform rotate-90"
              />
            </div>
          </div>

          <div className="flex flex-col border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-200 transition-all mt-2">
            <div className="flex items-center mb-2">
              <FileText size={18} className="text-gray-400 mr-2" />
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Catatan Tambahan
              </label>
            </div>
            <textarea
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              rows={3}
              placeholder="Detail lokasi atau catatan khusus..."
              className="w-full text-[14px] font-medium text-gray-800 outline-none bg-transparent placeholder-gray-300 resize-none"></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all tracking-wider flex justify-center items-center gap-2 ${
              isLoading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-[#6db6a5] hover:bg-emerald-600 shadow-emerald-200 active:scale-[0.98]"
            }`}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "SIMPAN KANDANG"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

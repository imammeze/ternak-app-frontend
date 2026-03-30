"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Activity,
  Stethoscope,
  Pill,
  Syringe,
  FileText,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/axios";

export default function InputPerawatanPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    tanggal_tindakan: new Date().toISOString().split("T")[0],
    id_ternak: "",
    diagnosa: "",
    obat: "",
    dosis: "",
    satuan_dosis: "ml",
    catatan: "",
  });

  const [ternakList, setTernakList] = useState<
    { id_ternak: string; nama_ternak: string }[]
  >([]);
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/perawatan-ternak", {
        ...formData,
        dosis: Number(formData.dosis),
      });

      toast.success("Data perawatan berhasil disimpan!");
      router.push("/input-data");
    } catch (err: any) {
      console.error("Gagal menyimpan:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menyimpan data ke server.",
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/input-data"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Input Perawatan</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        {errorMsg && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700">
            <AlertCircle size={24} className="text-rose-500 shrink-0" />
            <p className="font-semibold text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Tanggal Tindakan
              </span>
            </div>
            <input
              type="date"
              name="tanggal_tindakan"
              value={formData.tanggal_tindakan}
              onChange={handleChange}
              required
              className="text-[15px] font-medium text-gray-800 outline-none bg-transparent cursor-pointer text-right w-36"
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3.5 bg-white shadow-sm relative">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-emerald-700" />
                <span className="text-[15px] text-gray-700 font-medium">
                  ID Ternak
                </span>
              </div>
              <select
                name="id_ternak"
                value={formData.id_ternak}
                onChange={handleChange}
                className="appearance-none bg-transparent text-[15px] font-medium text-gray-800 text-right pr-6 outline-none cursor-pointer z-10 w-48 truncate">
                <option value="" disabled>
                  -- Pilih Ternak --
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

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <Stethoscope size={20} className="text-emerald-600" />
                <span className="text-[15px] font-medium text-gray-700">
                  Diagnosa
                </span>
              </div>
              <input
                type="text"
                name="diagnosa"
                value={formData.diagnosa}
                onChange={handleChange}
                required
                placeholder="Gejala/Sakit..."
                className="flex-1 text-[15px] font-medium text-right text-gray-800 outline-none bg-transparent ml-2"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <Pill size={20} className="text-emerald-600" />
                <span className="text-[15px] font-medium text-gray-700">
                  Obat
                </span>
              </div>
              <input
                type="text"
                name="obat"
                value={formData.obat}
                onChange={handleChange}
                required
                placeholder="Nama obat..."
                className="flex-1 text-[15px] font-medium text-right text-gray-800 outline-none bg-transparent ml-2"
              />
            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm mt-1">
              <div className="flex items-center gap-3">
                <Syringe size={20} className="text-emerald-700" />
                <span className="text-[15px] text-gray-700 font-medium">
                  Dosis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  name="dosis"
                  value={formData.dosis}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  className="w-16 text-[15px] font-medium text-gray-800 text-right outline-none bg-transparent border-b border-gray-300 focus:border-emerald-500"
                />
                <div className="relative border-l border-gray-200 pl-2">
                  <select
                    name="satuan_dosis"
                    value={formData.satuan_dosis}
                    onChange={handleChange}
                    className="appearance-none bg-transparent text-[15px] font-medium text-center text-gray-800 pr-5 outline-none cursor-pointer z-10">
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="cc">cc</option>
                    <option value="tablet">tablet</option>
                    <option value="tetes">tetes</option>
                  </select>
                  <ChevronRight
                    size={14}
                    className="text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none transform rotate-90"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center gap-3 px-3.5">
              <FileText size={20} className="text-emerald-700" />
              <span className="text-[15px] text-gray-700 font-medium">
                Catatan (Opsional)
              </span>
            </div>
            <div className="border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                rows={3}
                placeholder="Tambah instruksi atau observasi..."
                className="w-full text-[15px] font-medium text-gray-800 outline-none bg-transparent resize-none"></textarea>
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
              "SIMPAN PERAWATAN"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

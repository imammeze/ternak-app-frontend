"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Milk,
  Baby,
  User,
  AlertCircle,
  Droplets,
  Activity,
  Lock,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import IconInputRow from "@/features/inputan/produksi-susu/components/IconInputRow";
import IconSelectRow from "@/features/inputan/produksi-susu/components/IconSelectRow";

export default function InputProduksiSusuPage() {
  const router = useRouter();

  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    kepemilikan: "Milik Sendiri",
    user_id: "",
    jumlah_ternak: "",
    pagi_1l: "",
    pagi_250ml: "",
    pagi_cempe: "",
    sore_1l: "",
    sore_250ml: "",
    sore_cempe: "",
    petugas: "",
    catatan: "",
  });

  const [stakeholders, setStakeholders] = useState<
    { id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, petugas: user.name }));
    }
  }, [user]);

  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        const response = await api.get("/api/list-stakeholders");
        setStakeholders(response.data);
      } catch (err) {
        console.error("Gagal memuat daftar stakeholder:", err);
      }
    };
    fetchStakeholders();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalProduksi = (
    (parseFloat(formData.pagi_1l) || 0) * 1 +
    (parseFloat(formData.pagi_250ml) || 0) * 0.25 +
    (parseFloat(formData.pagi_cempe) || 0) / 1000 +
    (parseFloat(formData.sore_1l) || 0) * 1 +
    (parseFloat(formData.sore_250ml) || 0) * 0.25 +
    (parseFloat(formData.sore_cempe) || 0) / 1000
  ).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (formData.kepemilikan === "Milik Stakeholder" && !formData.user_id) {
      setErrorMsg("Mohon pilih nama Stakeholder terlebih dahulu.");
      setIsLoading(false);
      return;
    }

    const payload = {
      tanggal: formData.tanggal,
      kepemilikan: formData.kepemilikan,
      user_id:
        formData.kepemilikan === "Milik Sendiri" ? null : formData.user_id,
      jumlah_ternak: Number(formData.jumlah_ternak) || 0,
      pagi_1l: Number(formData.pagi_1l) || 0,
      pagi_250ml: Number(formData.pagi_250ml) || 0,
      pagi_cempe_ml: Number(formData.pagi_cempe) || 0,
      sore_1l: Number(formData.sore_1l) || 0,
      sore_250ml: Number(formData.sore_250ml) || 0,
      sore_cempe_ml: Number(formData.sore_cempe) || 0,
      total_liter: Number(totalProduksi),
      petugas: formData.petugas,
      catatan: formData.catatan,
    };

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/produksi-susu", payload);

      toast.success("Data produksi susu berhasil dicatat!");
      router.push("/input-data");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Gagal menyimpan data.");
      setIsLoading(false);
    }
  };

  const kepemilikanOptions = [
    { value: "Milik Sendiri", label: "Milik Sendiri" },
    { value: "Milik Stakeholder", label: "Milik Stakeholder" },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/input-data"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Input Susu</h1>
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
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4 mb-2">
            <IconInputRow
              icon={CalendarDays}
              label="Tanggal"
              name="tanggal"
              type="date"
              value={formData.tanggal}
              onChange={handleChange}
              width="w-36"
            />
            <div className="border-t border-dashed border-gray-200"></div>
            <IconSelectRow
              icon={Droplets}
              label="Kepemilikan"
              name="kepemilikan"
              value={formData.kepemilikan}
              onChange={handleChange}
              options={kepemilikanOptions}
              iconColor="text-emerald-700"
            />

            {formData.kepemilikan === "Milik Stakeholder" && (
              <div className="flex items-center justify-between relative mt-2 p-3 bg-emerald-50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="text-sm font-semibold text-emerald-800">
                  Pilih Nama:
                </span>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  className="appearance-none bg-transparent text-sm font-bold text-emerald-900 text-right pr-6 outline-none cursor-pointer z-10 w-48 truncate">
                  <option value="" disabled>
                    -- Pilih Stakeholder --
                  </option>
                  {stakeholders.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronRight
                  size={16}
                  className="text-emerald-600 absolute right-3"
                />
              </div>
            )}

            <div className="border-t border-dashed border-gray-200"></div>
            <IconInputRow
              icon={Activity}
              label="Jumlah Ternak"
              name="jumlah_ternak"
              type="number"
              value={formData.jumlah_ternak}
              onChange={handleChange}
              width="w-16"
              suffix="Ekor"
              iconColor="text-blue-500"
            />
          </div>

          <h2 className="text-sm font-semibold text-gray-500 mt-2 ml-1">
            Susu Pagi
          </h2>
          <IconInputRow
            icon={Milk}
            label="Susu Pagi 1 L"
            name="pagi_1l"
            value={formData.pagi_1l}
            onChange={handleChange}
            type="number"
            suffix="Pcs"
            width="w-12"
          />
          <IconInputRow
            icon={Milk}
            label="Susu Pagi 250 ml"
            name="pagi_250ml"
            value={formData.pagi_250ml}
            onChange={handleChange}
            type="number"
            suffix="Pcs"
            width="w-12"
          />
          <IconInputRow
            icon={Baby}
            label="Susu Pagi Cempe"
            name="pagi_cempe"
            value={formData.pagi_cempe}
            onChange={handleChange}
            type="number"
            suffix="ml"
            width="w-16"
          />

          <h2 className="text-sm font-semibold text-gray-500 mt-3 ml-1">
            Susu Sore
          </h2>
          <IconInputRow
            icon={Milk}
            label="Susu Sore 1 L"
            name="sore_1l"
            value={formData.sore_1l}
            onChange={handleChange}
            type="number"
            suffix="Pcs"
            width="w-12"
          />
          <IconInputRow
            icon={Milk}
            label="Susu Sore 250 ml"
            name="sore_250ml"
            value={formData.sore_250ml}
            onChange={handleChange}
            type="number"
            suffix="Pcs"
            width="w-12"
          />
          <IconInputRow
            icon={Baby}
            label="Susu Sore Cempe"
            name="sore_cempe"
            value={formData.sore_cempe}
            onChange={handleChange}
            type="number"
            suffix="ml"
            width="w-16"
          />

          <div className="flex items-center justify-between mt-4 px-2">
            <span className="text-[15px] font-bold text-gray-800">
              Total Produksi
            </span>
            <div className="bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl border border-emerald-100">
              {totalProduksi > "0.00" ? totalProduksi : "0"} Liter
            </div>
          </div>

          <h2 className="text-sm font-semibold text-gray-500 mt-3 ml-1">
            Petugas & Catatan
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5 bg-gray-50 shadow-sm opacity-90 relative">
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-400" />
                <span className="text-[15px] text-gray-600 font-medium">
                  Petugas
                </span>
              </div>
              <input
                type="text"
                name="petugas"
                value={formData.petugas || "Memuat..."}
                readOnly
                className="flex-1 text-[15px] font-bold text-gray-600 text-right outline-none bg-transparent ml-4 truncate pr-6 pointer-events-none"
              />
              <Lock size={14} className="text-gray-400 absolute right-3" />
            </div>
            <div className="border border-gray-200 rounded-xl p-3.5 bg-white shadow-sm">
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                rows={2}
                placeholder="Tambah catatan..."
                className="w-full text-[15px] font-medium text-gray-800 outline-none bg-transparent resize-none"></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full text-white font-semibold py-4 rounded-xl shadow-lg transition-colors tracking-wider mb-8 flex justify-center items-center gap-2 ${isLoading ? "bg-emerald-400 cursor-not-allowed" : "bg-[#6db6a5] hover:bg-emerald-600 shadow-emerald-200"}`}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "SIMPAN"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

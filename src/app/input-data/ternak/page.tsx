"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import api from "@/lib/axios";
import FormInput from "@/features/inputan/ternak/components/FormInput";
import FormSelect from "@/features/inputan/ternak/components/FormSelect";

export default function InputTernakPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    id_ternak: "",
    nama_ternak: "",
    jenis_ternak: "Sapera",
    jenis_kelamin: "Jantan",
    no_kandang: "",
    kepemilikan: "Milik Sendiri",
    user_id: "",
    asal_usul: "Beli",
    harga_beli: "",
    tanggal_lahir: "",
    berat_lahir: "",
    id_induk: "",
    id_pejantan: "",
    tipe_kelahiran: "Singel",
    catatan: "",
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const [stakeholders, setStakeholders] = useState<
    { id: string; name: string }[]
  >([]);
  const [ternakList, setTernakList] = useState<any[]>([]);
  const [kandangList, setKandangList] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const resUsers = await api.get("/api/users");
        const stakeholderList = resUsers.data.users.filter((u: any) =>
          u.roles?.some((r: any) => r.name.toLowerCase() === "stakeholder"),
        );
        setStakeholders(stakeholderList);

        const resTernak = await api.get("/api/ternak");
        setTernakList(resTernak.data.data);

        const resKandang = await api.get("/api/kandang");
        setKandangList(resKandang.data.data);
      } catch (err) {
        console.error("Gagal memuat data awal:", err);
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name])
      setValidationErrors((prev) => ({ ...prev, [name]: [] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFoto(e.target.files[0]);
      if (validationErrors["foto"])
        setValidationErrors((prev) => ({ ...prev, foto: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setValidationErrors({});

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (
        formData.asal_usul === "Beli" &&
        [
          "tanggal_lahir",
          "berat_lahir",
          "id_induk",
          "id_pejantan",
          "tipe_kelahiran",
        ].includes(key)
      )
        return;
      if (formData.asal_usul === "Lahir" && key === "harga_beli") return;
      if (formData.kepemilikan === "Milik Sendiri" && key === "user_id") return;

      if (value !== "") submitData.append(key, value);
    });

    if (foto) submitData.append("foto", foto);

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/ternak", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Data ternak berhasil disimpan!");
      router.push("/input-data");
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrorMsg("Terdapat kesalahan pada isian form Anda.");
        setValidationErrors(err.response.data.errors);
      } else {
        setErrorMsg(
          err.response?.status === 403
            ? "Akses ditolak."
            : "Terjadi kesalahan server.",
        );
      }
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
        <h1 className="text-lg font-bold tracking-wide">Input Ternak</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto">
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700">
            <AlertCircle size={24} className="text-rose-500 shrink-0" />
            <p className="font-semibold text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput
            label="ID Ternak"
            name="id_ternak"
            value={formData.id_ternak}
            onChange={handleChange}
            error={validationErrors.id_ternak}
            placeholder="Masukkan ID"
            required
          />
          <FormInput
            label="Nama Ternak"
            name="nama_ternak"
            value={formData.nama_ternak}
            onChange={handleChange}
            error={validationErrors.nama_ternak}
            placeholder="Masukkan Nama"
            required
          />

          <FormSelect
            label="Jenis Ternak"
            name="jenis_ternak"
            value={formData.jenis_ternak}
            onChange={handleChange}
            options={["Sapera", "Sanen", "Etawa", "Jawa Randu"]}
          />
          <FormSelect
            label="Jenis Kelamin"
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            options={["Jantan", "Betina"]}
          />

          <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm relative focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-200 transition-all">
            <label className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Pilih Kandang
            </label>
            <select
              name="no_kandang"
              value={formData.no_kandang}
              onChange={handleChange}
              className="w-full text-[15px] font-semibold text-gray-800 outline-none bg-transparent appearance-none cursor-pointer pr-4 pt-2 truncate"
              required>
              <option value="" disabled>
                -- Pilih Lokasi Kandang --
              </option>
              {kandangList.map((k) => (
                <option key={k.id} value={k.kode_kandang}>
                  {k.kode_kandang} - {k.nama_kandang} ({k.jenis})
                </option>
              ))}
            </select>
            <ChevronRight
              size={16}
              className="text-gray-400 absolute right-3 bottom-3.5 transform rotate-90 pointer-events-none"
            />
          </div>

          <FormSelect
            label="Kepemilikan"
            name="kepemilikan"
            value={formData.kepemilikan}
            onChange={handleChange}
            options={["Milik Sendiri", "Titipan"]}
          />

          {formData.kepemilikan === "Titipan" && (
            <div
              className={`flex items-center justify-between border ${validationErrors.user_id ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white"} rounded-xl p-3 relative shadow-sm animate-in fade-in slide-in-from-top-2 duration-300`}>
              <span className="text-sm text-gray-600">
                Pemilik <span className="text-rose-500">*</span>
              </span>
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="appearance-none bg-transparent text-sm font-medium text-gray-800 text-center outline-none cursor-pointer z-10 w-48 truncate">
                <option value="" disabled>
                  -- Pilih Nama --
                </option>
                {stakeholders.map((stakeholder) => (
                  <option key={stakeholder.id} value={stakeholder.id}>
                    {stakeholder.name}
                  </option>
                ))}
              </select>
              <ChevronRight
                size={16}
                className="text-gray-400 absolute right-3"
              />
            </div>
          )}
          {validationErrors.user_id && formData.kepemilikan === "Titipan" && (
            <p className="text-xs text-rose-500 ml-1">
              {validationErrors.user_id[0]}
            </p>
          )}

          <FormSelect
            label="Asal Usul"
            name="asal_usul"
            value={formData.asal_usul}
            onChange={handleChange}
            options={["Beli", "Lahir"]}
          />

          {formData.asal_usul === "Beli" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <FormInput
                label="Harga Beli"
                name="harga_beli"
                type="number"
                value={formData.harga_beli}
                onChange={handleChange}
                placeholder="0"
                prefix="Rp"
                width="w-24"
              />
            </div>
          )}

          {formData.asal_usul === "Lahir" && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <FormInput
                label="Tanggal Lahir"
                name="tanggal_lahir"
                type="date"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                width="w-32"
              />
              <FormInput
                label="Berat Lahir"
                name="berat_lahir"
                type="number"
                value={formData.berat_lahir}
                onChange={handleChange}
                placeholder="0"
                suffix="kg"
                width="w-16"
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm relative">
                  <label className="block text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">
                    ID Induk (Betina)
                  </label>
                  <select
                    name="id_induk"
                    value={formData.id_induk}
                    onChange={handleChange}
                    className="w-full text-sm font-medium text-gray-800 outline-none bg-transparent appearance-none cursor-pointer pr-4 truncate">
                    <option value="">Opsional</option>
                    {ternakList
                      .filter(
                        (t) =>
                          t.jenis_kelamin === "Betina" &&
                          t.id_ternak !== formData.id_pejantan,
                      )
                      .map((t) => (
                        <option key={t.id_ternak} value={t.id_ternak}>
                          {t.id_ternak} - {t.nama_ternak}
                        </option>
                      ))}
                  </select>
                  <ChevronRight
                    size={14}
                    className="text-gray-400 absolute right-2 bottom-3.5 transform rotate-90 pointer-events-none"
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm relative">
                  <label className="block text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">
                    ID Pejantan (Jantan)
                  </label>
                  <select
                    name="id_pejantan"
                    value={formData.id_pejantan}
                    onChange={handleChange}
                    className="w-full text-sm font-medium text-gray-800 outline-none bg-transparent appearance-none cursor-pointer pr-4 truncate">
                    <option value="">Opsional</option>
                    {ternakList
                      .filter(
                        (t) =>
                          t.jenis_kelamin === "Jantan" &&
                          t.id_ternak !== formData.id_induk,
                      )
                      .map((t) => (
                        <option key={t.id_ternak} value={t.id_ternak}>
                          {t.id_ternak} - {t.nama_ternak}
                        </option>
                      ))}
                  </select>
                  <ChevronRight
                    size={14}
                    className="text-gray-400 absolute right-2 bottom-3.5 transform rotate-90 pointer-events-none"
                  />
                </div>
              </div>

              <FormSelect
                label="Tipe Kelahiran"
                name="tipe_kelahiran"
                value={formData.tipe_kelahiran}
                onChange={handleChange}
                options={["Singel", "Twin", "Triplet"]}
              />
            </div>
          )}

          <div className="mt-2">
            <label className="block text-sm text-gray-600 mb-1.5 ml-1">
              Foto Ternak
            </label>
            <label
              className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed shadow-sm rounded-xl cursor-pointer transition-colors ${foto ? "border-emerald-400 bg-emerald-50" : validationErrors.foto ? "border-rose-400 bg-rose-50" : "border-gray-300 bg-white hover:bg-gray-50"}`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud
                  size={24}
                  className={
                    foto ? "text-emerald-600 mb-2" : "text-gray-400 mb-2"
                  }
                />
                <p className="text-xs text-gray-500 font-medium text-center px-4 line-clamp-1">
                  {foto ? foto.name : "Klik untuk upload foto (Maks 2MB)"}
                </p>
              </div>
              <input
                type="file"
                name="foto"
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg, image/webp"
              />
            </label>
            {validationErrors.foto && (
              <p className="text-xs text-rose-500 mt-1 ml-1">
                {validationErrors.foto[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5 ml-1">
              Catatan Tambahan
            </label>
            <textarea
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              rows={3}
              placeholder="Kondisi kesehatan, ciri khusus..."
              className="w-full border border-gray-200 bg-white shadow-sm rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-emerald-500 resize-none"></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-4 w-full text-white font-bold py-4 rounded-xl shadow-lg transition-colors tracking-wider flex justify-center items-center gap-2 ${isLoading ? "bg-emerald-400 cursor-not-allowed" : "bg-[#6db6a5] hover:bg-emerald-600 shadow-emerald-200"}`}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "SIMPAN DATA"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

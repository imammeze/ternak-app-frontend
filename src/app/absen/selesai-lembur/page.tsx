"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  ListTodo,
} from "lucide-react";
import api from "@/lib/axios";

const DAFTAR_AKTIVITAS = [
  "Lembur Pakan Malam",
  "Pemerahan Extra",
  "Pembersihan Area Khusus",
  "Pengecekan Ternak Sakit",
  "Penanganan Kelahiran Ternak",
  "Perbaikan Darurat Fasilitas",
];

export default function SelesaiLemburPage() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [waktu, setWaktu] = useState(new Date());
  const [lokasi, setLokasi] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });
  const [lokasiLoading, setLokasiLoading] = useState(true);
  const [lokasiError, setLokasiError] = useState("");

  const [aktivitas, setAktivitas] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setWaktu(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLokasiError("Browser Anda tidak mendukung fitur GPS.");
      setLokasiLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLokasi({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLokasiLoading(false);
      },
      (error) => {
        console.error("Error GPS:", error);
        setLokasiError("Gagal mendapatkan lokasi. Pastikan Izin Lokasi aktif.");
        setLokasiLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  const toggleAktivitas = (item: string) => {
    setAktivitas((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    if (!lokasi.lat || !lokasi.lng) {
      setErrorMsg("Menunggu lokasi GPS. Pastikan Izin Lokasi diaktifkan.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      tipe: "Selesai Lembur",
      waktu_absen: waktu.toISOString(),
      latitude: String(lokasi.lat),
      longitude: String(lokasi.lng),
      aktivitas: aktivitas,
    };

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/absen/selesai-lembur", payload);

      toast.success("Selesai Lembur Berhasil! Selamat beristirahat.");
      router.push("/absen");
    } catch (err: any) {
      console.error("Gagal absen:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menyimpan data absensi.",
      );
      setIsSubmitting(false);
    }
  };

  const timeString = waktu.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateString = waktu.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="flex items-center px-4 pt-10 pb-4 bg-orange-600 text-white z-10 sticky top-0 shadow-sm">
        <Link href="/absen" className="p-2 cursor-pointer transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold ml-2 tracking-wide">
          Selesai Lembur
        </h1>
      </div>

      <div className="flex-1 bg-slate-50 px-5 pt-6 pb-32 overflow-y-auto">
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 shadow-sm">
            <AlertCircle size={24} className="text-rose-500 shrink-0" />
            <p className="font-semibold text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center mb-5 relative overflow-hidden">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 z-10">
            Waktu Selesai
          </p>
          <h2 className="text-5xl font-black text-orange-600 tracking-tight z-10 tabular-nums">
            {isClient ? timeString : "--.--.--"}
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-2 z-10">
            {isClient ? dateString : "Memuat tanggal..."}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
          <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-3">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Titik Koordinat
              </p>
              <p className="text-sm font-bold text-gray-800">
                Lokasi Perangkat
              </p>
            </div>
          </div>

          <div className="px-2">
            {lokasiLoading ? (
              <div className="flex items-center gap-2 text-sm font-medium text-amber-500">
                <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                Mencari sinyal GPS...
              </div>
            ) : lokasiError ? (
              <p className="text-sm font-medium text-rose-500 flex items-center gap-2">
                <AlertCircle size={16} /> {lokasiError}
              </p>
            ) : (
              <p className="text-sm font-medium text-emerald-600 flex items-center gap-2">
                <CheckCircle2 size={16} /> Lat: {lokasi.lat?.toFixed(5)}, Lng:{" "}
                {lokasi.lng?.toFixed(5)}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <ListTodo size={20} className="text-orange-500" />
              <h3 className="font-bold text-gray-800 text-sm">
                Pekerjaan Lembur Diselesaikan
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Pilih aktivitas lembur yang telah Anda kerjakan (bisa lebih dari
              satu).
            </p>

            <div className="flex flex-col gap-2.5">
              {DAFTAR_AKTIVITAS.map((item) => {
                const isSelected = aktivitas.includes(item);
                return (
                  <label
                    key={item}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-orange-50 border-orange-200"
                        : "bg-transparent border-gray-100 hover:bg-gray-50"
                    }`}>
                    <div className="mt-0.5 relative flex items-center justify-center shrink-0">
                      <input
                        type="checkbox"
                        className="peer opacity-0 absolute w-full h-full cursor-pointer"
                        checked={isSelected}
                        onChange={() => toggleAktivitas(item)}
                      />
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-orange-500 border-orange-500"
                            : "bg-white border-gray-300"
                        }`}>
                        {isSelected && (
                          <CheckSquare size={14} className="text-white" />
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[14px] font-medium transition-colors ${isSelected ? "text-orange-700" : "text-gray-600"}`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || lokasiLoading || !!lokasiError}
            className={`mt-2 w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all tracking-wider flex justify-center items-center gap-2 ${
              isSubmitting || lokasiLoading || !!lokasiError
                ? "bg-orange-300 cursor-not-allowed opacity-80"
                : "bg-orange-600 hover:bg-orange-700 shadow-orange-200 active:scale-[0.98]"
            }`}>
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "SELESAI LEMBUR"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

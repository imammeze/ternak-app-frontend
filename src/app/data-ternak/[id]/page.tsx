"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Info,
  MapPin,
  Calendar,
  Activity,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import api from "@/lib/axios";

export default function DetailTernakPage() {
  const params = useParams();
  const id = params.id as string;

  const [ternak, setTernak] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetailTernak = async () => {
      try {
        const response = await api.get(`/api/ternak/${id}`);
        setTernak(response.data.data);
      } catch (err: any) {
        console.error("Gagal mengambil detail:", err);
        setError("Data ternak tidak ditemukan atau terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetailTernak();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-emerald-600">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="font-medium text-sm">Memuat profil ternak...</p>
      </div>
    );
  }

  if (error || !ternak) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-rose-50 text-rose-600 p-6 rounded-3xl flex flex-col items-center">
          <Info size={40} className="mb-3 text-rose-400" />
          <p className="font-bold">{error}</p>
          <Link
            href="/data-ternak"
            className="mt-4 bg-white px-4 py-2 rounded-xl text-rose-600 font-bold shadow-sm">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3 text-gray-500">
        <Icon size={18} className="text-emerald-500" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-800 text-right">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <Link
          href="/data-ternak"
          className="cursor-pointer bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Profil Ternak</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-slate-50 pb-32 overflow-y-auto">
        <div className="bg-white rounded-b-3xl shadow-sm overflow-hidden mb-6 relative">
          {ternak.foto_url ? (
            <div className="w-full h-full bg-gray-200 relative">
              <img
                src={ternak.foto_url}
                alt={ternak.nama_ternak}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-emerald-50 flex flex-col items-center justify-center text-emerald-300">
              <ImageIcon size={48} className="mb-2" />
              <p className="text-sm font-medium text-emerald-600">
                Tidak ada foto
              </p>
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {ternak.id_ternak}
                </span>
                <h2 className="text-2xl font-black text-gray-800 mt-2">
                  {ternak.nama_ternak}
                </h2>
              </div>
              <span
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${ternak.jenis_kelamin === "Jantan" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"}`}>
                {ternak.jenis_kelamin}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Tag size={18} className="text-emerald-600" /> Informasi Dasar
            </h3>
            <InfoRow
              icon={Info}
              label="Jenis Ternak"
              value={ternak.jenis_ternak}
            />
            <InfoRow icon={MapPin} label="Kandang" value={ternak.no_kandang} />
            <InfoRow
              icon={Tag}
              label="Kepemilikan"
              value={ternak.kepemilikan}
            />
            <InfoRow
              icon={Activity}
              label="Asal Usul"
              value={ternak.asal_usul}
            />
            {ternak.asal_usul === "Beli" && (
              <InfoRow
                icon={Tag}
                label="Harga Beli"
                value={
                  ternak.harga_beli
                    ? `Rp ${Number(ternak.harga_beli).toLocaleString("id-ID")}`
                    : "-"
                }
              />
            )}
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-600" /> Riwayat
              Kelahiran
            </h3>
            <InfoRow
              icon={Calendar}
              label="Tgl Lahir"
              value={ternak.tanggal_lahir}
            />
            <InfoRow
              icon={Activity}
              label="Berat Lahir"
              value={ternak.berat_lahir ? `${ternak.berat_lahir} kg` : "-"}
            />
            <InfoRow
              icon={Info}
              label="Tipe Kelahiran"
              value={ternak.tipe_kelahiran}
            />
            <InfoRow icon={Tag} label="ID Induk" value={ternak.id_induk} />
            <InfoRow
              icon={Tag}
              label="ID Pejantan"
              value={ternak.id_pejantan}
            />
          </div>

          {ternak.catatan && (
            <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100 shadow-sm">
              <h3 className="font-bold text-amber-800 mb-2 text-sm">
                Catatan Khusus:
              </h3>
              <p className="text-sm text-amber-700 leading-relaxed font-medium">
                {ternak.catatan}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

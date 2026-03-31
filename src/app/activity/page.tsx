"use client";

import { useEffect, useState } from "react";
import {
  Activity as ActivityIcon,
  PlusCircle,
  Stethoscope,
  ArrowRightLeft,
  Clock,
  Info,
} from "lucide-react";
import api from "@/lib/axios";

interface ActivityLog {
  id: string;
  tipe: "input_ternak" | "perawatan" | "perpindahan";
  judul: string;
  deskripsi: string;
  id_ternak: string;
  waktu: string;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get("/api/activity");
        setActivities(response.data.data);
      } catch (err) {
        console.error("Gagal mengambil aktivitas:", err);
        setError("Gagal memuat riwayat aktivitas.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getActivityStyle = (tipe: string) => {
    switch (tipe) {
      case "input_ternak":
        return {
          icon: PlusCircle,
          color: "text-blue-500",
          bg: "bg-blue-100",
          border: "border-blue-200",
        };
      case "perawatan":
        return {
          icon: Stethoscope,
          color: "text-rose-500",
          bg: "bg-rose-100",
          border: "border-rose-200",
        };
      case "perpindahan":
        return {
          icon: ArrowRightLeft,
          color: "text-amber-500",
          bg: "bg-amber-100",
          border: "border-amber-200",
        };
      default:
        return {
          icon: ActivityIcon,
          color: "text-emerald-500",
          bg: "bg-emerald-100",
          border: "border-emerald-200",
        };
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-10 pb-4 bg-emerald-600 text-white z-10 sticky top-0 shadow-sm">
        <h1 className="text-lg font-bold tracking-wide flex items-center gap-2">
          <ActivityIcon size={22} /> Aktivitas Terkini
        </h1>
      </div>

      <div className="flex-1 bg-slate-50 px-6 pt-6 pb-32 overflow-y-auto min-h-screen">
        <p className="text-sm font-medium text-gray-500 mb-6 px-1">
          Memantau semua pergerakan dan riwayat input data di peternakan.
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-sm">Memuat aktivitas...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-10 text-rose-500 text-sm font-medium">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center mt-20 text-gray-500 flex flex-col items-center">
            <Info size={40} className="mb-3 text-gray-300" />
            <p className="font-medium text-sm">Belum ada aktivitas tercatat.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-200 ml-4 space-y-6">
            {activities.map((item, index) => {
              const Style = getActivityStyle(item.tipe);
              const IconComp = Style.icon;

              return (
                <div
                  key={item.id}
                  className="relative pl-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}>
                  <div
                    className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full border-4 border-slate-50 flex items-center justify-center ${Style.bg} ${Style.color} shadow-sm z-10`}>
                    <IconComp size={14} strokeWidth={3} />
                  </div>

                  <div
                    className={`bg-white rounded-2xl p-4 shadow-sm border ${Style.border}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-800 text-[15px]">
                        {item.judul}
                      </h3>
                    </div>

                    <p className="text-[14px] font-medium text-gray-600 leading-snug mb-3">
                      {item.deskripsi}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                      <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wide">
                        {item.id_ternak}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                        <Clock size={12} />
                        <span>{formatTime(item.waktu)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

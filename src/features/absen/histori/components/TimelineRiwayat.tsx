import {
  CalendarDays,
  MapPin,
  FileText,
  ListTodo,
  CheckCircle2,
} from "lucide-react";
import { getStyleByType, formatTanggal, formatJam } from "../utils/formatters";

export default function TimelineRiwayat({ data }: { data: any[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-sm font-medium">
          Tidak ada riwayat untuk filter tersebut.
        </p>
      </div>
    );
  }

  return (
    <>
      {data.map((item) => {
        const style = getStyleByType(item.tipe);
        const IconComponent = style.icon;

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden mb-4">
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.indicator}`}></div>
            <div className="flex justify-between items-start pl-2 mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${style.bg} ${style.color}`}>
                  <IconComponent size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-bold text-[15px] leading-tight ${style.color}`}>
                      {item.tipe}
                    </h3>
                    {item.tipe === "Masuk" && item.status_kehadiran && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                          item.status_kehadiran === "Tepat Waktu"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                        }`}>
                        {item.status_kehadiran}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 mt-1">
                    <CalendarDays size={12} /> {formatTanggal(item.waktu_absen)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-gray-800 tabular-nums tracking-tight">
                  {formatJam(item.waktu_absen)}
                </span>
              </div>
            </div>
            <div className="pl-2 flex flex-col gap-2 mt-2 pt-3 border-t border-gray-50">
              <div className="flex items-start gap-2 text-[12px] font-medium text-gray-500">
                <MapPin size={14} className="mt-0.5 shrink-0 text-blue-400" />
                <span className="line-clamp-1">
                  Lat: {Number(item.latitude).toFixed(5)}, Lng:{" "}
                  {Number(item.longitude).toFixed(5)}
                </span>
              </div>
              {item.catatan && (
                <div className="flex items-start gap-2 text-[12px] font-medium text-gray-600 bg-gray-50 p-2 rounded-lg mt-1 border border-gray-100">
                  <FileText
                    size={14}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />
                  <span className="italic">"{item.catatan}"</span>
                </div>
              )}
              {item.aktivitas &&
                Array.isArray(item.aktivitas) &&
                item.aktivitas.length > 0 && (
                  <div className="mt-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase mb-1.5">
                      <ListTodo size={12} /> Aktivitas Diselesaikan:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.aktivitas.map((act: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-[11px] font-bold border border-emerald-100">
                          <CheckCircle2
                            size={10}
                            className="text-emerald-500"
                          />{" "}
                          {act}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </>
  );
}

import { User, ChevronLeft, ChevronRight } from "lucide-react";
import { getStyleByType, formatTanggal, formatJam } from "../utils/formatters";

interface TabelRiwayatProps {
  data: any[];
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function TabelRiwayat({
  data,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: TabelRiwayatProps) {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50 border-b border-emerald-100">
                <th className="py-3 px-4 text-[11px] font-bold text-emerald-800 uppercase tracking-wider whitespace-nowrap">
                  Karyawan
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-emerald-800 uppercase tracking-wider whitespace-nowrap">
                  Tanggal & Jam
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-emerald-800 uppercase tracking-wider whitespace-nowrap">
                  Tipe
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm font-medium text-gray-400">
                    Tidak ada data riwayat untuk filter tersebut.
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const style = getStyleByType(item.tipe);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                            <User size={14} className="text-gray-500" />
                          </div>
                          <span className="text-sm font-bold text-gray-800 whitespace-nowrap">
                            {item.user?.name || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-700">
                          {formatTanggal(item.waktu_absen)}
                        </div>
                        <div className="text-[11px] font-medium text-gray-400">
                          {formatJam(item.waktu_absen)} WIB
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${style.bg} ${style.color}`}>
                            {item.tipe}
                          </span>
                          {item.tipe === "Masuk" && item.status_kehadiran && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                item.status_kehadiran === "Tepat Waktu"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                  : "bg-rose-50 text-rose-600 border-rose-200"
                              }`}>
                              {item.status_kehadiran}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 min-w-[200px]">
                        {item.catatan && (
                          <div className="text-[12px] text-gray-600 line-clamp-2 italic">
                            "{item.catatan}"
                          </div>
                        )}
                        {item.aktivitas &&
                          Array.isArray(item.aktivitas) &&
                          item.aktivitas.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.aktivitas
                                .slice(0, 2)
                                .map((act: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-medium border border-gray-200">
                                    {act}
                                  </span>
                                ))}
                              {item.aktivitas.length > 2 && (
                                <span className="text-[10px] text-gray-400 font-medium">
                                  +{item.aktivitas.length - 2} lagi
                                </span>
                              )}
                            </div>
                          )}
                        {!item.catatan &&
                          (!item.aktivitas || item.aktivitas.length === 0) && (
                            <span className="text-[12px] text-gray-400">-</span>
                          )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-2">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}>
            <ChevronLeft size={18} /> Prev
          </button>
          <span className="text-sm font-bold text-gray-600">
            Hal <span className="text-emerald-600">{currentPage}</span> dari{" "}
            {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}>
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </>
  );
}

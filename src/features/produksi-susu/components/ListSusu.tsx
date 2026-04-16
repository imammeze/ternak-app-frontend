import {
  CalendarDays,
  Droplets,
  Activity,
  Calculator,
  User,
  Baby,
} from "lucide-react";
import { formatDate } from "../utils/formatters";
import { ProduksiSusu } from "@/app/data-susu/page";

export default function ListSusu({ data }: { data: ProduksiSusu[] }) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {data.map((susu) => {
        const qty1L = Number(susu.pagi_1l || 0) + Number(susu.sore_1l || 0);
        const qty250ml =
          Number(susu.pagi_250ml || 0) + Number(susu.sore_250ml || 0);
        const qtyCempe =
          Number(susu.pagi_cempe_ml || 0) + Number(susu.sore_cempe_ml || 0);
        const popTernak = Number(susu.jumlah_ternak || 0);
        const totalLiter = Number(susu.total_liter || 0);
        const rataRataPerEkor =
          popTernak > 0 ? (totalLiter / popTernak).toFixed(2) : "0.00";

        return (
          <div
            key={susu.id}
            className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col relative overflow-hidden">
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${susu.kepemilikan === "Milik Sendiri" ? "bg-emerald-400" : "bg-amber-400"}`}></div>

            <div className="flex justify-between items-center ml-2 border-b border-gray-50 pb-3 mb-3">
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarDays size={18} className="text-emerald-600" />
                <span className="font-bold text-sm">
                  {formatDate(susu.tanggal)}
                </span>
              </div>
              <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <span className="font-black text-emerald-700 text-sm">
                  {totalLiter.toFixed(2)} L
                </span>
              </div>
            </div>

            <div className="ml-2 mb-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50/70 border border-emerald-100 p-2 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
                    1 Liter
                  </span>
                  <span className="text-sm font-black text-emerald-800">
                    {qty1L}{" "}
                    <span className="text-[10px] font-bold text-emerald-600">
                      Pcs
                    </span>
                  </span>
                </div>
                <div className="bg-emerald-50/70 border border-emerald-100 p-2 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
                    250 ml
                  </span>
                  <span className="text-sm font-black text-emerald-800">
                    {qty250ml}{" "}
                    <span className="text-[10px] font-bold text-emerald-600">
                      Pcs
                    </span>
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-2 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Baby size={10} /> Cempe
                  </span>
                  <span className="text-sm font-black text-amber-800">
                    {qtyCempe}{" "}
                    <span className="text-[10px] font-bold text-amber-600">
                      ml
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="ml-2 flex flex-col gap-2 border-t border-gray-50 pt-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Droplets
                  size={14}
                  className={
                    susu.kepemilikan === "Milik Sendiri"
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }
                />
                <span>
                  {susu.kepemilikan === "Milik Sendiri"
                    ? "Milik Sendiri"
                    : `Stakeholder: ${susu.pemilik?.name || "Tidak Diketahui"}`}
                </span>
              </div>

              {popTernak > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-[11px] font-bold border border-purple-100">
                    <Activity size={12} className="text-purple-500" />{" "}
                    {popTernak} Ekor
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[11px] font-bold border border-blue-100">
                    <Calculator size={12} className="text-blue-500" /> Rata:{" "}
                    {rataRataPerEkor} L/Ekor
                  </div>
                </div>
              )}

              {susu.petugas && (
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-1">
                  <User size={14} className="text-blue-500" />
                  <span>Petugas: {susu.petugas}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

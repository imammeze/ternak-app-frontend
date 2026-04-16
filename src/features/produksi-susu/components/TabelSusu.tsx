import { formatDate } from "../utils/formatters";
import { ProduksiSusu } from "@/app/data-susu/page";

export default function TabelSusu({ data }: { data: ProduksiSusu[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-600 text-white border-b border-emerald-700">
              <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                Tanggal
              </th>
              <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                Kepemilikan
              </th>
              <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-right whitespace-nowrap">
                Jumlah Susu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((susu) => (
              <tr key={susu.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-800">
                    {formatDate(susu.tanggal)}
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                      susu.kepemilikan === "Milik Sendiri"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}>
                    {susu.kepemilikan}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <span className="text-sm font-black text-gray-800">
                    {Number(susu.total_liter).toFixed(2)} L
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

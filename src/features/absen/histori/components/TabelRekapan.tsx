interface RekapData {
  id: number;
  name: string;
  hadir: number;
  ontime: number;
  lembur: number;
}

export default function TabelRekapan({ data }: { data: RekapData[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-600 text-white border-b border-emerald-700">
              <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                Nama Karyawan
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-center">
                Hadir
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-center">
                Tepat Waktu
              </th>
              <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-center">
                Lembur
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((rekap) => (
              <tr key={rekap.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-sm text-gray-800 whitespace-nowrap">
                  {rekap.name}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    {rekap.hadir}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {rekap.ontime}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="text-sm font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                    {rekap.lembur}
                  </span>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-sm font-medium text-gray-400">
                  Tidak ada data rekap absensi untuk filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

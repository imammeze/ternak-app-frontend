import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  date: string;
  displayDate: string;
  total: number;
}

export default function GrafikSusu({ data }: { data: ChartData[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 text-sm">Grafik Produksi</h3>
        <p className="text-[11px] font-medium text-gray-400">
          Total akumulasi harian berdasarkan filter bulan di atas.
        </p>
      </div>

      <div className="w-full h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 600 }}
              />
              {/* Solusi Error TypeScript menggunakan 'any' */}
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  fontWeight: "bold",
                }}
                formatter={(value: any) => [
                  `${Number(value).toFixed(2)} Liter`,
                  "Total Susu",
                ]}
                labelStyle={{
                  color: "#9ca3af",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
                activeDot={{
                  r: 6,
                  fill: "#10b981",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
            Data tidak cukup untuk membuat grafik.
          </div>
        )}
      </div>
    </div>
  );
}

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useSettings } from "../hooks/useSettings";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { AssetDataPoint } from "../types";

const COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f97316", // Orange
  "#eab308", // Yellow
  "#10b981", // Emerald
];

const AssetChart = ({ data }: { data: AssetDataPoint[] }) => {
  const { formatValue, theme } = useSettings();

  // Calculate total for the center label
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-full p-8 transition-colors duration-500 bg-white border shadow-sm dark:bg-slate-900 rounded-[2.5rem] border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
          Asset Allocation
        </h3>
      </div>

      <div className="relative w-full aspect-square">
        {/* Total Value Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">
            {totalValue > 1000000
              ? `${(totalValue / 1000000).toFixed(1)}M`
              : formatValue(totalValue)}
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={6}
              dataKey="value"
              nameKey="name"
              stroke="none"
              animationBegin={0}
              animationDuration={1000}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-opacity outline-none cursor-pointer hover:opacity-80"
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: ValueType | undefined): [string, string] => {
                const numericValue = typeof value === "number" ? value : Number(value || 0);
                return [formatValue(numericValue), "Allocation"];
              }}
              contentStyle={{
                borderRadius: "20px",
                border: "none",
                backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff", // slate-800 vs white
                boxShadow: theme === "dark"
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
                  : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                padding: "16px",
                backdropFilter: "blur(8px)",
              }}
              itemStyle={{
                fontSize: "12px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: theme === "dark" ? "#38bdf8" : "#2563eb",
              }}
            />

            <Legend
              iconType="circle"
              iconSize={6}
              verticalAlign="bottom"
              layout="horizontal"
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={(value) => (
                <span className="text-[9px] font-black tracking-widest uppercase text-slate-500 dark:text-slate-400 px-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetChart;
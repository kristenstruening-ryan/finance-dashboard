import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { useSettings } from "../hooks/useSettings";
import { PieChart as PieIcon } from "lucide-react";
import type { AssetDataPoint } from "../types";

interface LegendItem {
  value: string;
  color?: string;
  type?: string;
}

interface AssetChartProps {
  data: AssetDataPoint[];
}

const AssetChart = ({ data }: AssetChartProps) => {
  const { formatValue, theme } = useSettings();

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#6366f1",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
  ];

  return (
    <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8">
        <PieIcon size={16} className="text-blue-500" />
        <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
          Distribution
        </h2>
      </div>

      <div className="flex-1 w-full h-75 min-h-75 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={70}
              paddingAngle={8}
              dataKey="value"
              nameKey="name"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((_entry: AssetDataPoint, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
                border: "none",
                borderRadius: "1rem",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
                fontWeight: "900",
                color: theme === "dark" ? "#f1f5f9" : "#1e293b",
              }}
              itemStyle={{ color: "#3b82f6" }}
              formatter={(value: unknown) => {
                const numericValue = typeof value === "number" ? value : 0;
                return [formatValue(numericValue), "Value"];
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {(payload as LegendItem[] | undefined)?.map(
                    (entry, index) => (
                      <div
                        key={`legend-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          {entry.value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetChart;

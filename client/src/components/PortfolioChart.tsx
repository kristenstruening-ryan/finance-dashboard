import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";
import { useSettings } from "../hooks/useSettings";
import { Loader2, TrendingUp } from "lucide-react";
// Import the types we found in your types.ts
import type {
  CustomTooltipProps,
  ChartDataPoint,
  PortfolioHistoryEntry,
} from "../types";

const CustomTooltip = ({
  active,
  payload,
  label,
  formatValue,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white border shadow-2xl rounded-3xl dark:bg-slate-900 border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="text-xl font-black text-blue-600 dark:text-blue-400">
          {formatValue(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const PortfolioChart = () => {
  const { formatValue, theme } = useSettings();
  const [history, setHistory] = useState<PortfolioHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } =
          await api.get<PortfolioHistoryEntry[]>("/assets/history");
        setHistory(data || []);
      } catch (err) {
        console.error("Failed to fetch portfolio history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // FIX: Explicitly typing 'entry' as PortfolioHistoryEntry solves the 'any' error
  const chartData = useMemo<ChartDataPoint[]>(() => {
    return history.map((entry: PortfolioHistoryEntry) => ({
      ...entry,
      displayDate: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [history]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-100 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1 text-slate-400">
            <TrendingUp size={14} />
            <span className=" font-black tracking-[0.2em] uppercase text-[10px]">
              Performance
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-[16px]">
            Portfolio Growth
          </h2>
        </div>
      </div>

      <div className="w-full h-75 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke={theme === "dark" ? "#1e293b" : "#f1f5f9"}
              strokeDasharray="8 8"
            />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              stroke="#94a3b8"
              fontSize={10}
              fontWeight="900"
              dy={15}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              tickFormatter={(v) => formatValue(v)}
              axisLine={false}
              tickLine={false}
              stroke="#94a3b8"
              fontSize={10}
              fontWeight="900"
              width={80}
            />
            <Tooltip
              content={<CustomTooltip formatValue={formatValue} />}
              cursor={{
                stroke: "#3b82f6",
                strokeWidth: 2,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke="#3b82f6"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={1500}
              activeDot={{
                r: 6,
                strokeWidth: 0,
                fill: "#3b82f6",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioChart;

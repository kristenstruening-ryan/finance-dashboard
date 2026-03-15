import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import api from "../api/axios";
import { useSettings } from "../hooks/useSettings";
import { useNavigate } from "react-router-dom";
import type { Asset } from "../types";
import {
  Loader2,
  TrendingUp,
  ArrowRight,
  Activity,
  PieChart,
  ArrowUpRight,
} from "lucide-react";
import type {
  CustomTooltipProps,
  ChartDataPoint,
  PortfolioHistoryEntry,
} from "../types";

// --- Sub-components ---

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

const TopAssets = ({
  assets,
  formatValue,
}: {
  assets: Asset[];
  formatValue: (val: number) => string;
}) => {
  const sortedAssets = [...(assets || [])]
    .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
    .slice(0, 4);

  if (sortedAssets.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <PieChart size={16} className="text-blue-500" />
        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
          Primary Holdings
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sortedAssets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center justify-between p-6 transition-all border bg-slate-50/50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 rounded-4xl hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-500/5 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 font-black text-blue-600 transition-all bg-white shadow-sm dark:bg-slate-800 rounded-2xl group-hover:bg-blue-600 group-hover:text-white">
                {asset.symbol?.[0]}
              </div>
              <div>
                <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                  {asset.symbol}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {asset.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black tracking-tight text-slate-900 dark:text-slate-200">
                {formatValue(asset.totalValue || 0)}
              </p>
              <div className="flex items-center justify-end gap-1 text-emerald-500">
                <ArrowUpRight size={12} />
                <span className="text-[10px] font-black uppercase">Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Component ---

const Analytics = () => {
  const { formatValue, currency, setCurrency, theme } = useSettings();
  const navigate = useNavigate();
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const [historyRes, assetsRes] = await Promise.all([
          api.get<PortfolioHistoryEntry[]>("/assets/history", {
            signal: controller.signal,
          }),
          api.get<Asset[]>("/assets", { signal: controller.signal }),
        ]);

        const formattedData = (historyRes.data || []).map((entry) => ({
          ...entry,
          displayDate: new Date(entry.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }));

        setData(formattedData);
        setAssets(assetsRes.data || []);
      } catch (error) {
        if (!axios.isCancel(error)) console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const currentBalance = data.length > 0 ? data[data.length - 1].totalValue : 0;
  const previousBalance =
    data.length > 1 ? data[data.length - 2].totalValue : 0;
  const percentageChange = previousBalance
    ? ((currentBalance - previousBalance) / previousBalance) * 100
    : 0;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-4">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Syncing Market Data
        </p>
      </div>
    );

  return (
    <div className="p-8 lg:p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-sm animate-in fade-in duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col items-start justify-between gap-8 mb-12 lg:flex-row lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            {(["USD", "EUR", "GBP", "BTC"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-6 py-2 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all ${
                  currency === curr
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Activity size={14} />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                Market Valuation
              </span>
            </div>
            <h3 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white">
              {formatValue(currentBalance)}
            </h3>
            <div className="flex items-center gap-3 mt-4">
              <span
                className={`flex items-center text-xs font-black px-4 py-1.5 rounded-full ${
                  percentageChange >= 0
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                }`}
              >
                <TrendingUp size={14} className="mr-1.5" />
                {percentageChange >= 0 ? "+" : ""}
                {percentageChange.toFixed(2)}%
              </span>
              <span className="text-[10px] font-black tracking-[0.15em] uppercase text-slate-400">
                24h Performance
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/portfolio")}
          className="flex items-center gap-3 px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white uppercase transition-all bg-blue-600 hover:bg-blue-700 rounded-3xl shadow-xl shadow-blue-500/20 group"
        >
          Detailed Portfolio
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Chart Area */}
      <div className="w-full mt-8 h-100">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
              fontWeight="black"
              dy={15}
            />
            <YAxis
              tickFormatter={(v) => formatValue(v)}
              axisLine={false}
              tickLine={false}
              stroke="#94a3b8"
              fontSize={10}
              fontWeight="black"
              width={80}
            />
            <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke="#3b82f6"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{
                r: 8,
                strokeWidth: 4,
                stroke: theme === "dark" ? "#0f172a" : "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <TopAssets assets={assets} formatValue={formatValue} />
    </div>
  );
};

export default Analytics;

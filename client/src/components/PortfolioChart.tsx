import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/axios';

// 1. Define the shape of the data coming from the Backend
interface PortfolioHistoryEntry {
  id: number;
  userId: number;
  date: string;
  totalValue: number;
}

// 2. Define the shape for the Chart (including our formatted display date)
interface ChartDataPoint extends PortfolioHistoryEntry {
  displayDate: string;
}

const PortfolioChart = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // Use the interface in the axios get call
        const { data: rawHistory } = await api.get<PortfolioHistoryEntry[]>('/assets/history');

        // 3. Map with the explicit type instead of 'any'
        const formatted = rawHistory.map((point: PortfolioHistoryEntry): ChartDataPoint => ({
          ...point,
          displayDate: new Date(point.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        }));

        setData(formatted);
      } catch (err) {
        console.error("Chart data error:", err);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Performance</h3>
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase">30 Days</span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
          <XAxis
            dataKey="displayDate"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
            minTickGap={30}
          />
          <YAxis hide={true} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontWeight: 800, color: '#1e293b' }}
          />
          <Area
            type="monotone"
            dataKey="totalValue"
            stroke="#2563eb"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioChart;
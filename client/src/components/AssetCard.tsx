import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  DollarSign,
} from "lucide-react";
import type { AssetProps } from "../types";

const AssetCard: React.FC<AssetProps> = ({
  asset,
  onEdit,
  onDelete,
  formatValue,
}) => {
  const isPositive = (asset.roi ?? 0) >= 0;

  return (
    <div className="relative group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-4xl shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
      {/* Header: Icon & Symbol */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl ${isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}
          >
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
              {asset.symbol}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-30">
              {asset.name}
            </p>
          </div>
        </div>

        {/* Action Buttons (Visible on Hover) */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(asset)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(asset.id)}
            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Market Value
          </p>
          <p className="font-black text-slate-900 dark:text-white">
            {formatValue(asset.totalValue ?? 0)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Return (ROI)
          </p>
          <p
            className={`font-black ${isPositive ? "text-emerald-500" : "text-rose-500"}`}
          >
            {isPositive ? "+" : ""}
            {asset.roi?.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Footer: Details Bar */}
      <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
            <DollarSign size={10} />
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            {asset.amount} Units @ {formatValue(asset.purchasePrice)}
          </span>
        </div>

        {/* Visual indicator of Total Gain */}
        <span
          className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${isPositive ? "bg-emerald-500/5 text-emerald-600" : "bg-rose-500/5 text-rose-600"}`}
        >
          {isPositive ? "Gain" : "Loss"}:{" "}
          {formatValue(Math.abs(asset.totalGain ?? 0))}
        </span>
      </div>
    </div>
  );
};

export default AssetCard;

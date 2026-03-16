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
    <div className="relative group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 md:p-6 rounded-4xl shadow-sm hover:border-blue-500/30 transition-all duration-300">

      {/* Header: Icon & Name */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
            }`}
          >
            {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-slate-900 dark:text-white leading-tight uppercase text-sm md:text-base truncate">
              {asset.symbol}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
              {asset.name}
            </p>
          </div>
        </div>

        {/* Desktop-Only Action Buttons */}
        <div className="hidden lg:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(asset)} className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
          <button onClick={() => onDelete(asset.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 mb-6">
        <div>
          <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Market Value
          </p>
          <p className="font-black text-xs md:text-sm text-slate-900 dark:text-white truncate">
            {formatValue(asset.totalValue ?? 0)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Return (ROI)
          </p>
          <p className={`font-black text-xs md:text-sm ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
            {isPositive ? "+" : ""}{asset.roi?.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Footer: Details & Mobile Actions */}
      <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center gap-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 shrink-0">
              <DollarSign size={10} />
            </div>
            {/* Reduced units font to prevent clipping in that bottom-left area */}
            <span className="text-[9px] font-bold text-slate-500 truncate">
              {asset.amount} Units
            </span>
          </div>

          <span
            className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md shrink-0 ${
              isPositive ? "bg-emerald-500/5 text-emerald-600" : "bg-rose-500/5 text-rose-600"
            }`}
          >
            {isPositive ? "Gain" : "Loss"}: {formatValue(Math.abs(asset.totalGain ?? 0))}
          </span>
        </div>

        {/* Mobile Action Row */}
        <div className="flex lg:hidden gap-2">
          <button
            onClick={() => onEdit(asset)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase text-slate-500"
          >
            <Edit2 size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(asset.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl text-[9px] font-black uppercase text-rose-500"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
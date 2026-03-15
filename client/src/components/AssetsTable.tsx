import { useState } from "react";
import { Trash2, Edit3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Asset } from "../types";
import { useSettings } from "../hooks/useSettings";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";
import api from "../api/axios";

const AssetsTable = ({
  assets,
  onRefresh,
  onEdit,
}: {
  assets: Asset[];
  onRefresh: () => void;
  onEdit: (asset: Asset) => void;
}) => {
  const { formatValue } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  const handleDeleteClick = (asset: Asset) => {
    setAssetToDelete(asset);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;
    try {
      await api.delete(`/assets/${assetToDelete.id}`);
      toast.success(`${assetToDelete.symbol} removed`);
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete asset");
      console.error(error);
    } finally {
      setIsModalOpen(false);
      setAssetToDelete(null);
    }
  };

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Asset
              </th>
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Holdings
              </th>
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Current Price
              </th>
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Net Value
              </th>
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-right uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {assets.map((asset) => {
              const profit =
                asset.totalValue - asset.amount * asset.purchasePrice;
              const isProfit = profit >= 0;

              return (
                <tr
                  key={asset.id}
                  className="transition-all hover:bg-blue-50/30 dark:hover:bg-blue-500/5 group"
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center text-xs font-black text-blue-600 transition-transform bg-white border shadow-sm w-11 h-11 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl group-hover:scale-110">
                        {asset.symbol[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black truncate text-slate-900 dark:text-white">
                          {asset.symbol}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                          {asset.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                      {asset.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Units held
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {formatValue(asset.currentPrice)}
                    </p>
                    <div
                      className={`flex items-center gap-1 text-[9px] font-black uppercase ${isProfit ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {isProfit ? (
                        <ArrowUpRight size={10} />
                      ) : (
                        <ArrowDownRight size={10} />
                      )}
                      {formatValue(Math.abs(profit))}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-base font-black tracking-tighter text-blue-600 dark:text-blue-400">
                      {formatValue(asset.totalValue)}
                    </p>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => onEdit(asset)}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-md transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(asset)}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-rose-600 hover:shadow-md transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 font-black text-blue-600 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
                  {asset.symbol[0]}
                </div>
                <div>
                  <h4 className="font-black leading-tight text-slate-900 dark:text-white">
                    {asset.symbol}
                  </h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {asset.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(asset)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(asset)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-rose-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50 dark:border-slate-800">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Holdings
                </p>
                <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                  {asset.amount.toLocaleString()} {asset.symbol}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Net Value
                </p>
                <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {formatValue(asset.totalValue)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Remove Asset"
        message={`Confirm deletion of ${assetToDelete?.symbol}? This will remove all associated trade data.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AssetsTable;

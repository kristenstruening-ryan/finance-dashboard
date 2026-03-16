import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Clock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import type { TransactionWithAsset } from "../types";
import ConfirmModal from "./ConfirmModal";

const RecentActivity = () => {
  const [transactions, setTransactions] = useState<TransactionWithAsset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get<TransactionWithAsset[]>(
          "/assets/transactions",
        );
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      }
    };
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    try {
      await api.delete("/trades");
      setTransactions([]);
      setIsModalOpen(false);
      toast.success("History cleared");
    } catch (error) {
      toast.error("Failed to clear history");
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-4xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
          History
        </h3>
        <div className="flex items-center gap-2 text-slate-400">
          {transactions.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
          <Clock size={14} />
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-87.5 pr-1 custom-scrollbar">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50"
          >
            {/* 1. Icon (Fixed Width) */}
            <div
              className={`p-2 rounded-lg shrink-0 ${
                t.type === "BUY"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              {t.type === "BUY" ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownLeft size={14} />
              )}
            </div>

            {/* 2. Asset & Date (Flexible Middle - Truncates if needed) */}
            <div className="min-w-0">
              <p className="font-black text-slate-900 dark:text-white uppercase text-[10px] leading-none truncate">
                {t.asset?.symbol || "N/A"}
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">
                {new Date(t.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* 3. Amounts (Right Aligned - Fixed Width) */}
            <div className="text-right shrink-0">
              <p
                className={`font-black text-[10px] leading-none ${t.type === "BUY" ? "text-slate-900 dark:text-white" : "text-rose-500"}`}
              >
                {t.type === "BUY" ? "" : "-"}$
                {t.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">
                {t.shares.toFixed(2)} units
              </p>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-center py-10 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            No Activity
          </p>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Wipe History?"
        message="This will permanently delete all logs."
        onConfirm={handleClearHistory}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RecentActivity;

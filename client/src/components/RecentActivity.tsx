import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Clock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import type { TransactionWithAsset } from "../types";
import ConfirmModal from "./ConfirmModal"; // Import your existing modal

const RecentActivity = () => {
  const [transactions, setTransactions] = useState<TransactionWithAsset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get<TransactionWithAsset[]>("/trades");
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    try {
      await api.delete("/trades");
      setTransactions([]);
      setIsModalOpen(false); // Close modal on success
      toast.success("History cleared");
    } catch (error) {
      toast.error("Failed to clear history");
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Execution History
        </h3>
        <div className="flex items-center gap-3">
          {transactions.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)} // Open modal instead of window.confirm
              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
              title="Clear History"
            >
              <Trash2 size={16} />
            </button>
          )}
          <Clock size={18} className="text-slate-400" />
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  t.type === "BUY"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-rose-500/10 text-rose-600"
                }`}
              >
                {t.type === "BUY" ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownLeft size={16} />
                )}
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-wider">
                  {t.type} {t.asset.symbol}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-slate-900 dark:text-white">
                $
                {t.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                {t.shares.toFixed(4)} Units
              </p>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-center py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            No Trades Executed Yet
          </p>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Wipe History?"
        message="This will permanently delete all your trade activity logs. This action cannot be undone."
        onConfirm={handleClearHistory}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RecentActivity;

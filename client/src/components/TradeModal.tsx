import { X, ArrowRight } from "lucide-react";

interface Trade {
  symbol: string;
  name: string;
  action: "BUY" | "SELL";
  amount: number; // The dollar amount to trade
  shares: number; // Calculated shares based on current price
}

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trades: Trade[];
}

const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  trades,
}) => {
  if (!isOpen) return null;

  const totalBuy = trades
    .filter((t) => t.action === "BUY")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalSell = trades
    .filter((t) => t.action === "SELL")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
              Review Orders
            </h2>
            <p className="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400">
              Execution Blueprint
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* Trade List */}
        <div className="p-8 space-y-4 overflow-y-auto max-h-100">
          {trades.map((trade, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-[10px] ${trade.action === "BUY" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}
                >
                  {trade.action}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">
                    {trade.symbol}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {trade.shares.toFixed(4)} Units
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 dark:text-white">
                  $
                  {Math.abs(trade.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                  Market Order
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Totals */}
        <div className="p-8 border-t bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Total Liquidated
              </p>
              <p className="text-xl font-black text-rose-500">
                ${totalSell.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Total Reinvested
              </p>
              <p className="text-xl font-black text-emerald-500">
                ${totalBuy.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={onConfirm}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
          >
            Execute All Trades <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;

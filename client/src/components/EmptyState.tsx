import { Plus, PieChart } from "lucide-react";

const EmptyState = ({ onAddClick }: { onAddClick: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center transition-all duration-300 bg-white border-2 border-dashed dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-[2.5rem]">

      {/* Icon Container */}
      <div className="flex items-center justify-center w-24 h-24 mb-8 transition-transform duration-500 rounded-full bg-slate-50 dark:bg-slate-800/50 hover:scale-110">
        <PieChart className="w-12 h-12 text-slate-300 dark:text-slate-600" />
      </div>

      {/* Text Content */}
      <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        Start Building Your Portfolio
      </h3>
      <p className="max-w-sm mb-10 font-medium leading-relaxed text-slate-500 dark:text-slate-400">
        You haven't added any assets yet. Add your first stock, crypto, or
        commodity to start tracking your wealth in real-time.
      </p>

      {/* Action Button */}
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-8 py-4 font-black text-xs uppercase tracking-widest text-white transition-all bg-blue-600 shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 hover:scale-[1.02] active:scale-95 rounded-2xl"
      >
        <Plus size={18} strokeWidth={3} />
        Add Your First Asset
      </button>
    </div>
  );
};

export default EmptyState;
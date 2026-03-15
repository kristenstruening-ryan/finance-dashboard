import type { ConfirmModalProps } from "../types";
import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 duration-300 z-120 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-[2.5rem] animate-in zoom-in-95 duration-200">
        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center">
          <div className="p-4 mb-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500">
            <AlertTriangle size={32} />
          </div>

          <h3 className="mb-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>

          {/* Message */}
          <p className="mb-8 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-4 text-xs font-black tracking-widest uppercase transition-all rounded-2xl text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-4 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-rose-600 shadow-rose-200 dark:shadow-none hover:bg-rose-700 active:scale-95 rounded-2xl"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

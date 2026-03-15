import React, { useState, useEffect, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import { X, Loader2, Save, Trash2 } from "lucide-react";
import api from "../api/axios";
import type { EditAssetModalProps } from "../types";
import ConfirmModal from "./ConfirmModal";

const EditAssetModal = ({
  isOpen,
  onClose,
  onAssetUpdated,
  asset,
}: EditAssetModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // State for ConfirmModal

  const [amount, setAmount] = useState(asset.amount.toString());
  const [purchasePrice, setPurchasePrice] = useState(
    asset.purchasePrice.toString(),
  );

  useEffect(() => {
    setAmount(asset.amount.toString());
    setPurchasePrice(asset.purchasePrice.toString());
  }, [asset]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const updatePromise = api.put(`/assets/${asset.id}`, {
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
    });

    toast.promise(updatePromise, {
      loading: `Updating ${asset.symbol}...`,
      success: () => {
        onAssetUpdated();
        onClose();
        setIsSaving(false);
        return "Position updated!";
      },
      error: (err) => {
        setIsSaving(false);
        return err.response?.data?.message || "Failed to update asset.";
      },
    });
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    try {
      await api.delete(`/assets/${asset.id}`);
      toast.success(`${asset.symbol} removed.`);
      onAssetUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to delete asset.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center p-4 duration-300 z-110 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
        <div className="w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-[2.5rem] animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 font-black text-blue-600 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
                {asset.symbol[0]}
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Edit {asset.symbol}
                </h2>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                  {asset.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 transition-all rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Quantity
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  className="w-full px-4 py-4 font-bold transition-all border outline-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  value={amount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAmount(e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Avg. Price
                </label>
                <div className="relative">
                  <span className="absolute font-bold text-sm left-4 top-[1.1rem] text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    className="w-full py-4 pl-8 pr-4 font-bold transition-all border outline-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={purchasePrice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPurchasePrice(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isSaving || isDeleting}
                className="flex items-center justify-center w-full gap-3 py-5 font-black text-xs uppercase tracking-widest text-white transition-all bg-blue-600 shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] rounded-[1.25rem] disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(true)} // Open ConfirmModal
                disabled={isSaving || isDeleting}
                className="flex items-center justify-center w-full gap-2 py-4 font-black text-[10px] uppercase tracking-[0.15em] transition-all text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/5 rounded-2xl disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Trash2 size={16} /> Delete Position
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Remove Asset"
        message={`Are you sure you want to remove ${asset.symbol}? This action will permanently delete this position from your portfolio.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default EditAssetModal;

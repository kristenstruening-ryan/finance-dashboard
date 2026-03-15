import { useState, useEffect, useMemo, useCallback } from "react";
import EditAssetModal from "../components/EditAssetModal";
import {
  ArrowLeft,
  Plus,
  Loader2,
  Briefcase,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AssetsTable from "../components/AssetsTable";
import type { Asset, PortfolioSummary } from "../types";
import AddAssetModal from "../components/AddAssetModal";
import { useSettings } from "../hooks/useSettings";

const Portfolio = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const { formatValue } = useSettings();
  const navigate = useNavigate();

  // Wrapped in useCallback to prevent unnecessary re-renders
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      // NOTE: Destructuring data to match the new backend response structure
      const { data } = await api.get<{
        assets: Asset[];
        summary: PortfolioSummary;
      }>("/assets");

      // Ensure we are setting the array specifically
      setAssets(Array.isArray(data.assets) ? data.assets : []);
    } catch (error) {
      console.error("Failed to fetch assets", error);
      setAssets([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Ensure totalValue handles potential string values from the database
  const totalValue = useMemo(
    () =>
      assets.reduce((acc, asset) => acc + (Number(asset.totalValue) || 0), 0),
    [assets],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="absolute w-12 h-12 border-4 rounded-full border-blue-500/10" />
        </div>
        <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 animate-pulse">
          Syncing Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 duration-500 animate-in fade-in">
      <div className="mx-auto space-y-10 max-w-7xl">
        {/* Navigation & Title */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all text-slate-400 hover:text-blue-600 hover:translate-x-1"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Portfolio Holdings
              </h1>
              <p className="font-medium text-slate-500 dark:text-slate-400">
                A detailed breakdown of your {assets.length} active holdings.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-8 py-5 text-[10px] font-black tracking-widest text-white uppercase transition-all bg-blue-600 shadow-xl rounded-2xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
          >
            <Plus size={18} /> Add New Asset
          </button>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4 p-6 bg-white border dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="p-3 text-blue-600 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
              <Briefcase size={20} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Net Worth
              </p>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {formatValue(totalValue)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white border dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl">
              <TrendingUp size={20} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Active Holdings
              </p>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {assets.length} Assets
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white border dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="p-3 text-purple-600 bg-purple-50 dark:bg-purple-500/10 rounded-2xl">
              <PieChart size={20} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Diversification
              </p>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                Active
              </p>
            </div>
          </div>
        </div>

        {/* The Table Section */}
        <div className="bg-white border shadow-sm dark:bg-slate-900 rounded-[2.5rem] border-slate-100 dark:border-slate-800">
          <AssetsTable
            assets={assets}
            onRefresh={fetchAssets}
            onEdit={(asset) => setEditingAsset(asset)}
          />
        </div>

        {/* Modals */}
        <AddAssetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAssetAdded={fetchAssets}
        />

        {editingAsset && (
          <EditAssetModal
            isOpen={!!editingAsset}
            asset={editingAsset}
            onClose={() => setEditingAsset(null)}
            onAssetUpdated={fetchAssets}
          />
        )}
      </div>
    </div>
  );
};

export default Portfolio;

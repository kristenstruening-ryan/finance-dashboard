import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import AssetCard from "../components/AssetCard";
import {
  RefreshCw,
  Plus,
  Search,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Wallet,
} from "lucide-react";

// Components
import AddAssetModal from "../components/AddAssetModal";
import EditAssetModal from "../components/EditAssetModal";
import AssetChart from "../components/AssetChart"; // Distribution Pie Chart
import PortfolioChart from "../components/PortfolioChart"; // 30-day History Line Chart
import RecentActivity from "../components/RecentActivity"; // Execution History
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";

// Hooks & Types
import { useSettings } from "../hooks/useSettings";
import type { Asset, PortfolioSummary } from "../types";

const Dashboard = () => {
  const { formatValue } = useSettings();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("Investor");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<number | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<{
        assets: Asset[];
        summary: PortfolioSummary;
      }>("/assets");

      const storedUser = localStorage.getItem("user");
      if (storedUser) setUserName(JSON.parse(storedUser).name || "Investor");

      setAssets(data.assets || []);
      setSummary(data.summary || null);
    } catch (error) {
      toast.error("Failed to load live portfolio data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const topMover = useMemo(() => {
    if (assets.length === 0) return null;
    return [...assets].sort(
      (a, b) => Math.abs(b.roi || 0) - Math.abs(a.roi || 0),
    )[0];
  }, [assets]);

  const distributionData = useMemo(() => {
    return assets.map((asset) => ({
      name: asset.symbol,
      value: asset.totalValue,
    }));
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [assets, searchQuery]);

  const confirmDelete = async () => {
    if (!assetToDelete) return;
    try {
      await api.delete(`/assets/${assetToDelete}`);
      setIsDeleteModalOpen(false);
      setAssetToDelete(null);
      fetchAssets();
      toast.success("Asset removed!");
    } catch (error) {
      toast.error("Delete failed.");
      console.error(error);
    }
  };

  if (loading && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
          Syncing Market Data...
        </p>
      </div>
    );
  }

  const isPositive = summary && summary.totalGain >= 0;

  return (
    <div className="min-h-screen pb-20 space-y-10 duration-500 animate-in fade-in">
      {!loading && assets.length === 0 ? (
        <EmptyState onAddClick={() => setIsAddModalOpen(true)} />
      ) : (
        <>
          {/* Section 1: Welcome & Global Stats */}
          <header className="space-y-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Welcome back, {userName} 👋
              </h1>
              <p className="font-medium text-slate-500 dark:text-slate-400">
                Performance is {isPositive ? "up" : "down"}{" "}
                <span
                  className={
                    isPositive
                      ? "text-emerald-500 font-bold"
                      : "text-rose-500 font-bold"
                  }
                >
                  {Math.abs(summary?.totalROI || 0).toFixed(2)}%
                </span>{" "}
                this month.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 bg-white border shadow-sm dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-3xl">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                  Portfolio Value
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {formatValue(summary?.totalMarketValue || 0)}
                </p>
              </div>

              <div className="p-6 bg-white border shadow-sm dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-3xl">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                  Total Gain/Loss
                </p>
                <p
                  className={`text-2xl font-black ${isPositive ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {isPositive ? "+" : ""}
                  {formatValue(summary?.totalGain || 0)}
                </p>
              </div>

              {topMover && (
                <div className="flex items-center justify-between col-span-1 p-6 text-white bg-blue-600 shadow-xl md:col-span-2 rounded-3xl shadow-blue-500/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      {topMover.roi >= 0 ? (
                        <TrendingUp size={20} />
                      ) : (
                        <TrendingDown size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                        Top Performer
                      </p>
                      <p className="font-black">
                        {topMover.symbol}{" "}
                        <span className="ml-2 opacity-80">
                          {topMover.roi.toFixed(2)}%
                        </span>
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/lab"
                    className="p-3 transition-colors hover:bg-white/10 rounded-xl"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* Section 2: Main Analytics Row */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Performance Line Chart (Now 2/4 width) */}
            <div className="lg:col-span-2">
              <PortfolioChart />
            </div>

            {/* Distribution Pie Chart (1/4 width) */}
            <div className="lg:col-span-1">
              <AssetChart data={distributionData} />
            </div>

            {/* Execution History (1/4 width) */}
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>

          {/* Section 3: Asset Control Bar */}
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <Wallet className="text-blue-600" size={32} />
                </div>
                <div>
                  <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
                    Total Invested (Cost Basis)
                  </h2>
                  <p className="text-4xl font-black text-slate-900 dark:text-white leading-none mt-1">
                    {formatValue(summary?.totalCostBasis || 0)}
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-3 md:w-auto shrink-0">
                <button
                  onClick={fetchAssets}
                  className="p-5 transition-all border rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
                >
                  <RefreshCw
                    size={24}
                    className={
                      loading
                        ? "animate-spin text-blue-500"
                        : "text-slate-600 dark:text-white"
                    }
                  />
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-5 text-[10px] font-black tracking-widest text-white uppercase bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  <Plus size={18} /> Add New Asset
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Holdings List */}
          <div className="space-y-8">
            <div className="flex flex-col justify-between gap-6 px-2 md:flex-row md:items-end">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-[16px]">
                    Portfolio Holdings
                  </h2>
                </div>

                {/* Distribution Bar */}
                <div className="flex h-1.5 w-64 overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-full">
                  {distributionData.map((item, idx) => (
                    <div
                      key={item.name}
                      style={{
                        width: `${(item.value / (summary?.totalMarketValue || 1)) * 100}%`,
                        backgroundColor: `hsl(${idx * 45 + 210}, 70%, 50%)`,
                      }}
                      title={`${item.name}: ${item.value}`}
                    />
                  ))}
                </div>
              </div>

              {/* Search Bar - Now correctly aligned to the right/bottom */}
              <div className="relative w-full md:w-96">
                <Search
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Filter by name or symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-12 pr-4 text-sm font-bold transition-all bg-white border shadow-sm outline-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>

            {/* Assets Grid */}
            {filteredAssets.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAssets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onEdit={setEditingAsset}
                    onDelete={(id) => {
                      setAssetToDelete(id);
                      setIsDeleteModalOpen(true);
                    }}
                    formatValue={formatValue}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 rounded-[3rem]">
                <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                  No matches found
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-xs font-black tracking-widest text-blue-500 uppercase"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Remove Asset"
        message="Are you sure? This will permanently delete the asset and its trade history."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;

import { useState, useEffect, useMemo } from "react";
import { useSettings } from "../hooks/useSettings";
import {
  Beaker,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Trophy,
  Target,
  Info,
  Scale,
  X,
  ArrowRight,
} from "lucide-react";
import { useConfetti } from "../hooks/useConfetti";
import RiskGauge from "../components/RiskGauge";
import type { Asset, PortfolioSummary } from "../types";
import api from "../api/axios";

// --- SUB-COMPONENTS ---

interface Trade {
  symbol: string;
  name: string;
  action: "BUY" | "SELL";
  amount: number;
  shares: number;
}

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trades: Trade[];
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, onConfirm, trades }) => {
  if (!isOpen) return null;

  const totalBuy = trades.filter(t => t.action === "BUY").reduce((acc, t) => acc + t.amount, 0);
  const totalSell = trades.filter(t => t.action === "SELL").reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white">Review Orders</h2>
            <p className="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400">Execution Blueprint</p>
          </div>
          <button onClick={onClose} className="p-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-4 overflow-y-auto max-h-100">
          {trades.map((trade, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-[10px] ${trade.action === 'BUY' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                  {trade.action}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">{trade.symbol}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{trade.shares.toFixed(4)} Units</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 dark:text-white">
                  ${Math.abs(trade.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Market Order</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 border-t bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">Total Liquidated</p>
              <p className="text-xl font-black text-left text-rose-500">${totalSell.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">Total Reinvested</p>
              <p className="text-xl font-black text-right text-emerald-500">${totalBuy.toLocaleString()}</p>
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

// --- MAIN COMPONENT ---

interface SimAsset extends Asset {
  simWeight: number;
  originalWeight: number;
}

type StrategyGoal = "Aggressive" | "Balanced" | "Conservative";

const VaultLab = () => {
  const { fireConfetti } = useConfetti();
  const { formatValue } = useSettings();

  const [assets, setAssets] = useState<SimAsset[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [goal, setGoal] = useState<StrategyGoal>("Balanced");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. INITIAL LOAD
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const { data } = await api.get<{ assets: Asset[]; summary: PortfolioSummary }>("/assets");
        const fetchedAssets = data.assets || [];
        const total = data.summary?.totalMarketValue || 0;
        setTotalValue(total);

        const savedSim = localStorage.getItem("vault_lab_sim");

        const baseAssets = fetchedAssets.map((a) => {
          const weight = total > 0 ? ((Number(a.totalValue) || 0) / total) * 100 : 100 / fetchedAssets.length;
          return { ...a, originalWeight: weight, simWeight: weight };
        });

        if (savedSim) {
          const parsed = JSON.parse(savedSim) as Pick<SimAsset, "id" | "simWeight">[];
          const synced = baseAssets.map((ba) => ({
            ...ba,
            simWeight: parsed.find((p) => p.id === ba.id)?.simWeight ?? ba.simWeight,
          }));
          setAssets(synced);
        } else {
          setAssets(baseAssets);
        }
      } catch (error) {
        console.error("Failed to load lab data", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    loadAssets();
  }, []);

  //  USER SESSION SYNC
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const lastSimUser = localStorage.getItem("vault_lab_user_context");
    if (storedUser && storedUser !== lastSimUser) {
      localStorage.removeItem("vault_lab_sim");
      localStorage.setItem("vault_lab_user_context", storedUser);
      window.location.reload();
    }
  }, []);

  //  ANALYTICS ENGINE
  const totalSimWeight = useMemo(() =>
    assets.reduce((acc, a) => acc + (Number(a.simWeight) || 0), 0),
  [assets]);

  const riskScore = useMemo(() => {
    if (assets.length === 0 || totalSimWeight === 0) return 0;
    const concentration = assets.reduce((acc, a) => acc + Math.pow(Number(a.simWeight) / 100, 2), 0) * 100;
    const volatility = assets.reduce((acc, a) =>
      acc + (Math.abs(Number(a.change24h || 0)) * (Number(a.simWeight) / 100)), 0);
    return Math.min(100, Math.max(5, concentration * 0.4 + volatility * 15));
  }, [assets, totalSimWeight]);

  const stats = useMemo(() => {
    if (assets.length === 0) return { returns: 0, dollarImpact: 0 };
    const returns = assets.reduce((acc, a) => {
      const weightFactor = (Number(a.simWeight) || 0) / 100;
      const performance = Number(a.change24h) || Number(a.roi) || 0;
      return acc + performance * weightFactor;
    }, 0);
    return { returns, dollarImpact: (returns / 100) * totalValue };
  }, [assets, totalValue]);

  const diversificationScore = useMemo(() => {
    if (assets.length === 0) return 0;
    const hhi = assets.reduce((acc, a) => acc + Math.pow(Number(a.simWeight) / 100, 2), 0);
    return Math.max(0, Math.min(100, (1 - hhi) * 100 + assets.length * 2));
  }, [assets]);

  //  TRADE LOGIC
  const tradeAnalysis = useMemo(() => {
    const trades = assets.map((asset) => {
      const diff = (Number(asset.simWeight) / 100) * totalValue - (Number(asset.totalValue) || 0);
      return {
        ...asset,
        difference: diff,
        action: diff > 0 ? ("BUY" as const) : ("SELL" as const),
      };
    }).filter((trade) => Math.abs(trade.difference) > 1);
    return { trades };
  }, [assets, totalValue]);

  const preparedTrades = useMemo(() => {
    return tradeAnalysis.trades.map((t) => ({
      symbol: t.symbol,
      name: t.name,
      action: t.action,
      amount: Math.abs(t.difference),
      shares: Math.abs(t.difference) / (Number(t.currentPrice) || 1),
    }));
  }, [tradeAnalysis.trades]);

  //  STRATEGY ENGINE
  const applyStrategyTemplate = (selectedGoal: StrategyGoal) => {
    setGoal(selectedGoal);
    if (assets.length === 0) return;
    const sortedByRisk = [...assets].sort((a, b) =>
      Math.abs(Number(b.change24h || 0)) - Math.abs(Number(a.change24h || 0))
    );

    let remainingWeight = 100;
    const newAssets = sortedByRisk.map((asset, idx) => {
      let targetWeight = 0;
      if (idx === sortedByRisk.length - 1) {
        targetWeight = Math.max(0, remainingWeight);
      } else {
        if (selectedGoal === "Aggressive") {
          targetWeight = idx < 2 ? 35 : remainingWeight / (sortedByRisk.length - idx);
        } else if (selectedGoal === "Conservative") {
          targetWeight = Math.min(remainingWeight, 100 / sortedByRisk.length);
        } else {
          targetWeight = idx < 3 ? 20 : remainingWeight / (sortedByRisk.length - idx);
        }
        targetWeight = Math.min(targetWeight, remainingWeight);
        remainingWeight -= targetWeight;
      }
      return { ...asset, simWeight: targetWeight };
    });
    setAssets(newAssets);
  };

  const portfolioStatus = useMemo(() => {
    const limits = { Aggressive: 85, Balanced: 55, Conservative: 30 };
    const targetLimit = limits[goal];
    const isOptimized = riskScore <= targetLimit && diversificationScore > 50;
    return isOptimized
      ? { label: "Optimized", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30", icon: <Trophy size={12} /> }
      : { label: "High Risk/Low Mix", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30", icon: <ShieldAlert size={12} /> };
  }, [riskScore, goal, diversificationScore]);

  //  HANDLERS
  const handleSliderChange = (id: number, newValue: number) => {
    setAssets((prev) => {
      const targetIndex = prev.findIndex((a) => a.id === id);
      if (targetIndex === -1) return prev;
      const diff = newValue - prev[targetIndex].simWeight;
      const otherAssets = prev.filter((_, idx) => idx !== targetIndex);
      const totalOtherWeight = otherAssets.reduce((acc, a) => acc + a.simWeight, 0);

      return prev.map((asset, idx) => {
        if (idx === targetIndex) return { ...asset, simWeight: newValue };
        if (totalOtherWeight > 0) {
          const reduction = (asset.simWeight / totalOtherWeight) * diff;
          return { ...asset, simWeight: Math.max(0, asset.simWeight - reduction) };
        }
        return { ...asset, simWeight: Math.max(0, asset.simWeight - diff / (prev.length - 1)) };
      });
    });
  };

  const handleCommitClick = () => {
    if (preparedTrades.length > 0) setIsModalOpen(true);
  };

  const handleFinalExecution = () => {
    setIsModalOpen(false);
    if (portfolioStatus.label === "Optimized") fireConfetti();
    setAssets(prev => prev.map(a => ({ ...a, originalWeight: a.simWeight })));
    localStorage.setItem("vault_lab_sim", JSON.stringify(assets));
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  if (isLoading) return <LabSkeleton />;

  return (
    <div className="relative min-h-screen pb-20 space-y-10 duration-700 animate-in fade-in">
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
          <div className="max-w-sm w-full bg-white dark:bg-slate-900 p-10 rounded-[3rem] text-center space-y-6 shadow-2xl border border-white/10">
            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full shadow-lg bg-emerald-500 shadow-emerald-500/30">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Strategy Saved</h2>
            <button onClick={() => setIsSuccess(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all dark:text-white">Dismiss</button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-500 font-black uppercase text-[10px] tracking-[0.3em]">
            <Beaker size={24} />
            <span>Vault Lab Alpha</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight dark:text-white">Strategy Simulator</h1>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1 shadow-inner">
          {(["Conservative", "Balanced", "Aggressive"] as StrategyGoal[]).map((g) => (
            <button key={g} onClick={() => applyStrategyTemplate(g)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${goal === g ? "bg-white dark:bg-slate-700 text-blue-600 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"}`}>{g}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black dark:text-white">Manual Allocation</h2>
            <div className={`px-3 py-1 rounded-lg text-[10px] font-black ${Math.abs(totalSimWeight - 100) > 0.5 ? "bg-rose-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>{totalSimWeight.toFixed(1)}% TOTAL</div>
          </div>
          <div className="space-y-8">
            {assets.map((asset) => (
              <div key={asset.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{asset.symbol}</span>
                  <span className="text-sm font-black text-blue-500">{asset.simWeight.toFixed(1)}%</span>
                </div>
                <input type="range" min="0" max="100" step="0.1" value={asset.simWeight} onChange={(e) => handleSliderChange(asset.id, parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none accent-blue-600 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className={`transition-all duration-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border ${riskScore > 60 ? "bg-slate-950 border-rose-500/30" : "bg-slate-900 border-white/5"}`}>
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale size={18} className="text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Engine Diagnostics</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${portfolioStatus.bg} ${portfolioStatus.border} ${portfolioStatus.color}`}>
                  {portfolioStatus.icon}
                  <span className="text-[9px] font-black uppercase tracking-widest">{portfolioStatus.label}</span>
                </div>
              </div>
              <div className="flex justify-center py-4"><RiskGauge score={riskScore} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 text-left border rounded-3xl bg-white/5 border-white/10">
                  <Zap size={20} className="mb-2 text-yellow-400" />
                  <p className="text-[9px] font-black uppercase opacity-40">Est. Return</p>
                  <p className="text-2xl font-black">{stats.returns.toFixed(2)}%</p>
                  <p className={`text-[10px] font-bold mt-1 ${stats.dollarImpact >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{stats.dollarImpact >= 0 ? "+" : ""}{formatValue(stats.dollarImpact)}</p>
                </div>
                <div className="p-6 text-left border rounded-3xl bg-white/5 border-white/10">
                  <Target size={20} className="mb-2 text-blue-400" />
                  <p className="text-[9px] font-black uppercase opacity-40">Diversity Score</p>
                  <p className="text-2xl font-black">{diversificationScore.toFixed(0)}/100</p>
                  <div className="w-full h-1 mt-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full transition-all duration-1000 bg-blue-500" style={{ width: `${diversificationScore}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400"><Info size={20} /></div>
              <div>
                <p className="mb-1 text-xs font-black tracking-widest uppercase dark:text-white">Current Goal: {goal}</p>
                <p className="text-[10px] font-medium text-slate-500 max-w-50 leading-tight">
                  {goal === "Aggressive" ? "High concentration in volatile assets." : goal === "Conservative" ? "Broad exposure across stable assets." : "A balanced mix of growth and stability."}
                </p>
              </div>
            </div>
            <button
              onClick={handleCommitClick}
              disabled={Math.abs(totalSimWeight - 100) > 0.5}
              className={`px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 ${Math.abs(totalSimWeight - 100) > 0.5 ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105"}`}
            >
              Commit Strategy
            </button>
          </div>
        </div>
      </div>

      <TradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleFinalExecution}
        trades={preparedTrades}
      />
    </div>
  );
};

const LabSkeleton = () => (
  <div className="p-10 space-y-10 animate-pulse">
    <div className="w-1/3 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
    <div className="grid grid-cols-2 gap-10">
      <div className="h-96 bg-slate-50 dark:bg-slate-900 rounded-[3rem]" />
      <div className="h-96 bg-slate-50 dark:bg-slate-900 rounded-[3rem]" />
    </div>
  </div>
);

export default VaultLab;
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  X,
  Search,
  Loader2,
  TrendingUp,
  CircleDollarSign,
  Zap,
} from "lucide-react";
import api from "../api/axios";
import type { SearchResult, AddAssetModalProps } from "../types";

const DUMMY_ASSETS: SearchResult[] = [
  { symbol: "BTC", name: "Bitcoin", type: "crypto" },
  { symbol: "ETH", name: "Ethereum", type: "crypto" },
  { symbol: "AAPL", name: "Apple Inc.", type: "stock" },
  { symbol: "TSLA", name: "Tesla Inc.", type: "stock" },
];

const AddAssetModal = ({
  isOpen,
  onClose,
  onAssetAdded,
}: AddAssetModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  const [amount, setAmount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<SearchResult | null>(null);

  // SEARCH LOGIC
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    let isCancelled = false;
    const searchTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/assets/search?q=${query}`);
        if (!isCancelled) {
          const apiResults = data.stocks || [];
          if (apiResults.length > 0) {
            setResults(apiResults);
          } else {
            handleFallbackSearch(query);
          }
        }
      } catch (error) {
        if (!isCancelled) handleFallbackSearch(query);
        console.error(error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }, 400);

    return () => {
      isCancelled = true;
      clearTimeout(searchTimer);
    };
  }, [query]);

  // AUTO-FETCH MARKET PRICE LOGIC
  useEffect(() => {
    if (!selectedAsset) {
      setMarketPrice(null);
      return;
    }

    const fetchPrice = async () => {
      setIsFetchingPrice(true);
      try {
        const { data } = await api.get(`/market/quote/${selectedAsset.symbol}`);
        const price = data.price || data.c || data.lastPrice;
        if (price) {
          console.log("Price received:", price); 
          setMarketPrice(data.price);
          setPurchasePrice(data.price.toString());
        }
      } catch (error) {
        console.error("Could not fetch market price", error);
        setMarketPrice(null);
      } finally {
        setIsFetchingPrice(false);
      }
    };

    fetchPrice();
  }, [selectedAsset]);


  const handleFallbackSearch = (searchQuery: string) => {
    const filtered = DUMMY_ASSETS.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setResults(filtered);
  };

  const handleClose = () => {
    setQuery("");
    setAmount("");
    setPurchasePrice("");
    setMarketPrice(null);
    setSelectedAsset(null);
    setResults([]);
    onClose();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !amount || !purchasePrice) return;

    const numAmount = parseFloat(amount);
    const numPrice = parseFloat(purchasePrice);

    if (numAmount <= 0 || numPrice <= 0) {
      toast.error("Please enter values greater than 0");
      return;
    }

    setIsSaving(true);
    try {
      await api.post("/assets", {
        symbol: selectedAsset.symbol.toUpperCase(),
        name: selectedAsset.name,
        amount: numAmount,
        purchasePrice: numPrice,
        category: selectedAsset.type?.toLowerCase().includes("crypto")
          ? "Crypto"
          : "Stock",
      });

      toast.success(`${selectedAsset.symbol} added successfully!`);
      onAssetAdded();
      handleClose();
    } catch (err: unknown) {
      let errorMessage = "Failed to add asset.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 duration-300 z-100 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Add Asset
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Search the markets for your holding
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-3 transition-colors rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search
              className="absolute left-4 top-4 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search symbol (e.g. BTC, AAPL)..."
              className="w-full py-4 pl-12 pr-4 transition-all border outline-none bg-slate-50 dark:bg-slate-950 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Results List */}
          <div className="space-y-2 overflow-y-auto max-h-48 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-6">
                <Loader2 className="text-blue-500 animate-spin" size={24} />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Searching...
                </p>
              </div>
            ) : (
              results.map((result) => (
                <button
                  key={`${result.symbol}-${result.name}`}
                  type="button"
                  onClick={() => setSelectedAsset(result)}
                  className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${
                    selectedAsset?.symbol === result.symbol
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-900 dark:text-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${result.type?.toLowerCase().includes("crypto") ? "bg-orange-100 dark:bg-orange-500/10" : "bg-emerald-100 dark:bg-emerald-500/10"}`}
                    >
                      {result.type?.toLowerCase().includes("crypto") ? (
                        <CircleDollarSign
                          size={20}
                          className="text-orange-600 dark:text-orange-500"
                        />
                      ) : (
                        <TrendingUp
                          size={20}
                          className="text-emerald-600 dark:text-emerald-500"
                        />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-black tracking-tight">
                        {result.symbol}
                      </p>
                      <p className="text-xs font-medium truncate text-slate-500 max-w-37.5">
                        {result.name}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Form Section */}
          {selectedAsset && (
            <form
              onSubmit={handleAdd}
              className="pt-8 space-y-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block mb-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    placeholder="0.00"
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border outline-none rounded-xl border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      Avg. Price (USD)
                    </label>
                    {marketPrice !== null && (
                      <button
                        type="button"
                        onClick={() => setPurchasePrice(marketPrice.toString())}
                        className="text-[9px] font-black text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-all"
                      >
                        <Zap size={10} fill="currentColor" />
                        USE MARKET
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute text-sm left-4 top-3.5 font-bold text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="0.00"
                      className="w-full py-3.5 border outline-none px-8 bg-slate-50 dark:bg-slate-950 rounded-xl border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                    />
                    {isFetchingPrice && (
                      <Loader2
                        size={14}
                        className="absolute text-blue-500 right-4 top-4 animate-spin"
                      />
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center w-full gap-2 py-4 font-black text-white transition-all bg-blue-600 shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 hover:scale-[1.02] active:scale-95 rounded-2xl disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  `Add ${selectedAsset.symbol} to Portfolio`
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;

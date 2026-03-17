import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as assetService from "../services/assetService";
import * as priceService from "../services/priceService";
import { assetUpdateSchema } from '../schemas/assetSchema';
import { prisma } from "../lib/prisma";

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  isLocal?: boolean;
  region?: string;
  currency?: string;
}

/**
 * Adds or updates an asset in the user's portfolio.
 */
export const addAsset = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: "User not authenticated" });

    const { name, symbol, amount, purchasePrice, category } = req.body;

    // Validate that purchasePrice is provided and is a number
    if (!name || !symbol || amount === undefined || purchasePrice === undefined || !category) {
      return res.status(400).json({ error: "Missing required asset fields" });
    }

    const newAsset = await assetService.upsertAsset(userId, {
      name,
      symbol: symbol.toUpperCase(),
      amount: Number(amount),
      purchasePrice: Number(purchasePrice),
      category,
    });

    return res.status(201).json({
      message: "Asset added successfully!",
      asset: newAsset,
    });
  } catch (error) {
    console.error("Add asset error:", error);
    return res.status(500).json({ error: "Failed to add asset" });
  }
};

/**
 * Updates the daily portfolio value for history tracking.
 */
const recordDailyValue = async (userId: number, totalValue: number) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  try {
    await prisma.portfolioHistory.upsert({
      where: { userId_date: { userId, date: today } },
      update: { totalValue },
      create: { userId, date: today, totalValue },
    });
  } catch (error) {
    console.error("History tracking failed:", error);
  }
};

/**
 * Retrieves all assets for a user, fetches live prices,
 * and calculates individual and total portfolio performance.
 */
export const getAssetsByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const assets = await assetService.getUserAssets(userId);
    const STALE_TIME = 15 * 60 * 1000; // 15 minutes

    const enhancedAssets = await Promise.all(
      assets.map(async (asset: any) => {
        const now = Date.now();
        const lastUpdate = new Date(asset.updatedAt).getTime();
        const isStale = now - lastUpdate > STALE_TIME;

        let currentPrice = asset.lastPrice || 0;

        // Fetch fresh price if data is stale or missing
        if (isStale || currentPrice === 0) {
          try {
            const data = await priceService.getStockData(asset.symbol);
            const freshPrice = data?.price;

            if (freshPrice && freshPrice !== currentPrice) {
              currentPrice = freshPrice;
              await assetService.updateAssetPrice(asset.id, freshPrice);
            }
          } catch (error) {
            console.error(`Price refresh skipped for ${asset.symbol}`);
          }
        }

        // Performance Calculations
        const costBasis = (asset.purchasePrice || 0) * asset.amount;
        const marketValue = currentPrice * asset.amount;
        const totalGain = marketValue - costBasis;
        const roi = costBasis > 0 ? (totalGain / costBasis) * 100 : 0;

        return {
          ...asset,
          currentPrice,
          totalValue: marketValue,
          costBasis,
          totalGain,
          roi,
        };
      }),
    );

    const totalMarketValue = enhancedAssets.reduce((acc: any, a: any) => acc + a.totalValue, 0);
    const totalCostBasis = enhancedAssets.reduce((acc: any, a: any) => acc + a.costBasis, 0);
    const totalGain = totalMarketValue - totalCostBasis;
    const totalROI = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0;

    recordDailyValue(userId, totalMarketValue);

    return res.status(200).json({
      assets: enhancedAssets,
      summary: {
        totalMarketValue,
        totalCostBasis,
        totalGain,
        totalROI
      }
    });
  } catch (error) {
    console.error("Get assets error:", error);
    return res.status(500).json({ error: "Failed to fetch assets" });
  }
};

export const searchAssets = async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string)?.trim();
    if (!query || query.length < 2) return res.status(200).json({ stocks: [] });

    const localAssets = await prisma.asset.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { symbol: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    });

    const formattedLocal: SearchResult[] = localAssets.map((asset: any) => ({
      symbol: asset.symbol,
      name: asset.name,
      type: asset.category,
      isLocal: true,
    }));

    let stockMatches: SearchResult[] = [];

    try {
      stockMatches = await priceService.searchSymbols(query);
      if (!Array.isArray(stockMatches)) stockMatches = [];
    } catch (apiError) {
      console.warn("External search API failed.");
    }

    const combined = [...formattedLocal, ...stockMatches];

    const uniqueResults = Array.from(
      new Map(
        combined.map((item) => [item.symbol.toUpperCase(), item]),
      ).values(),
    );

    return res.status(200).json({ stocks: uniqueResults });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Search failed" });
  }
};

export const removeAsset = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const assetId = Number(req.params.id);

    if (isNaN(assetId) || !userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const result = await assetService.deleteAsset(assetId, userId);
    if (result.count === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Delete failed" });
  }
};

export const updateQuantity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const assetId = Number(req.params.id);
    const amount = Number(req.body.amount);

    if (!userId || isNaN(assetId) || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const updated = await assetService.updateAssetQuantity(
      assetId,
      userId,
      amount,
    );
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Update failed" });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const history = await assetService.getPortfolioHistory(userId);
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch history" });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const transactions = await assetService.getRecentTransactions(userId);
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
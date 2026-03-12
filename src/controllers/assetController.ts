import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as assetService from "../services/assetService";
import * as priceService from "../services/priceService";
import { prisma } from "../lib/prisma";

export const addAsset = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { name, symbol, amount, category } = req.body;
    if (!name || !symbol || amount === undefined || !category) {
      return res.status(400).json({ error: "Missing required asset fields" });
    }
    const newAsset = await assetService.createAsset(userId, {
      name,
      symbol,
      amount,
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

export const getAssetsByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const assets = await assetService.getUserAssets(userId);
    const STALE_TIME = 15 * 60 * 1000;

    const enhancedAssets = await Promise.all(
      assets.map(async (asset) => {
        const now = new Date().getTime();
        const lastUpdate = new Date(asset.updatedAt).getTime();
        const isStale = now - lastUpdate > STALE_TIME;

        let currentPrice = asset.lastPrice || 0;
        if (isStale || currentPrice === 0) {
          try {
            const freshPrice =
              asset.category.toLowerCase() === "crypto"
                ? await priceService.getCryptoPrice(asset.symbol)
                : (await priceService.getStockData(asset.symbol))?.price;
            if (freshPrice) {
              currentPrice = freshPrice;
              await assetService.updateAssetPrice(asset.id, freshPrice);
            }
          } catch (error) {
            console.error(
              `Failed to refresh price for ${asset.symbol}, using cache.`,
            );
          }
        }

        return {
          ...asset,
          currentPrice,
          totalValue: currentPrice * asset.amount,
        };
      }),
    );

    return res.status(200).json(enhancedAssets);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch assets" });
  }
};

export const removeAsset = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const assetId = parseInt(req.params.id as string);

    if (isNaN(assetId)) {
      return res.status(400).json({ error: "Invalid Asset ID format" });
    }
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const result = await assetService.deleteAsset(assetId, userId);
    if (result.count === 0) {
      return res.status(404).json({ error: "Asset not found or unauthorized" });
    }
    return res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete asset" });
  }
};

export const searchAssets = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query || query.length < 2) return res.status(200).json([]);
    const stockMatches = await priceService.searchSymbols(query);
    return res.status(200).json({
      stocks: stockMatches,
    });
  } catch (error) {
    return res.status(500).json({ error: "Search failed" });
  }
};

export const updateQuantity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const assetId = parseInt(req.params.id as string);
    const { amount } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (isNaN(assetId) || amount === undefined) {
      return res.status(400).json({ error: "Invalid ID or amount" });
    }
    const updated = await assetService.updateAssetQuantity(
      assetId,
      userId,
      amount,
    );
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update quantity" });
  }
};

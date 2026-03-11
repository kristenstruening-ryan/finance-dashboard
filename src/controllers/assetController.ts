import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as assetService from "../services/assetService";



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
    return res.status(200).json(assets);
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

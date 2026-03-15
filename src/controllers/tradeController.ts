import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as tradeService from "../services/tradeService";

export const rebalancePortfolio = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { trades } = req.body;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const result = await tradeService.executeRebalance(trades);
    res.status(200).json({
      success: true,
      message: "Portfolio rebalanced successfully",
      data: result,
    });
  } catch (error) {
    console.error("Rebalance Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to execute rebalance",
    });
  }
};

export const fetchTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const transactions = await tradeService.getRecentTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

export const clearHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await tradeService.clearUserTransactions(userId);
    res.status(200).json({ message: "Transaction history cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear history" });
  }
};
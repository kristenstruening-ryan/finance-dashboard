import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as priceService from "../services/priceService";

export const getQuote = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const symbol = req.params.symbol;

    if (!symbol || typeof symbol !== "string") {
      res.status(400).json({ error: "Symbol is required" });
      return;
    }
    const data = await priceService.getLivePrice(symbol);

    if (!data || !data.c) {
      res.status(404).json({ error: "Market data not found" });
      return;
    }
    res.json({
      price: data.c,
      change: data.d,
      percentChange: data.dp,
    });
  } catch (error: any) {
    console.error(
      `Error fetching quote for ${req.params.symbol}:`,
      error.message,
    );
    res.status(500).json({ error: "Failed to fetch market data" });
  }
};

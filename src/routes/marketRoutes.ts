import { Router } from "express";
import { getQuote } from "../controllers/marketController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

/**
 * @openapi
 * /api/market/quote/{symbol}:
 *   get:
 *     summary: Get live market data for a specific asset
 *     tags: [Market]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: The ticker symbol (e.g., AAPL, BTC)
 *     responses:
 *       200:
 *         description: Live market quote data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 c: { type: number, description: "Current price" }
 *                 d: { type: number, description: "Change" }
 *                 dp: { type: number, description: "Percent Change" }
 *                 pc: { type: number, description: "Previous close" }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Market data not found
 */

router.get("/quote/:symbol", authenticateToken, getQuote);

export default router;

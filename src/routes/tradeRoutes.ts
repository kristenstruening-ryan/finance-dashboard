import { Router } from "express";
import {
  rebalancePortfolio,
  fetchTransactions,
  clearHistory,
} from "../controllers/tradeController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Apply authentication to all routes defined below
router.use(authenticateToken);

/**
 * @openapi
 * /api/trades/rebalance:
 *   post:
 *     summary: Execute a batch portfolio rebalance
 *     tags:
 *       - Trades
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trades:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     action:
 *                       type: string
 *                       enum: [BUY, SELL]
 *                     amount:
 *                       type: number
 *                     shares:
 *                       type: number
 *     responses:
 *       200:
 *         description: Rebalance successful
 *       500:
 *         description: Server error
 * /api/trades:
 *   get:
 *     summary: Fetch recent transaction history
 *     tags:
 *       - Trades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of recent transactions
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Clear all transaction history
 *     tags:
 *       - Trades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: History wiped successfully
 */

router.post("/rebalance", rebalancePortfolio);
router.get("/", fetchTransactions);
router.delete("/", clearHistory);

export default router;

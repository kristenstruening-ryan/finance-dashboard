import { Router } from "express";
import {
  addAsset,
  getAssetsByUser,
  getHistory,
  removeAsset,
  searchAssets,
  updateQuantity,
  getTransactions
} from "../controllers/assetController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

/**
 * @openapi
 * /api/assets:
 *   post:
 *     summary: Add a new asset
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asset created successfully
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all assets for the logged-in user
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assets retrieved
 *       401:
 *         description: Unauthorized
 */
/**
 * @openapi
 * /api/assets/{id}:
 *   patch:
 *     summary: Update asset quantity
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the asset to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The new total quantity of the asset
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Asset not found
 *
 *   delete:
 *     summary: Remove an asset from portfolio
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the asset to delete
 *     responses:
 *       204:
 *         description: Asset deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Asset not found
 */

/**
 * @openapi
 * /api/assets/search:
 *  get:
 *    summary: Search for valid assets
 *    tags:
 *      - Assets
 *    parameters:
 *      - in: query
 *        name: q
 *        required: true
 *        schema:
 *          type: string
 *        description: Part of the name or symbol
 *    responses:
 *      200:
 *        description: List of matching assets
 */

router.get("/", getAssetsByUser);
router.post("/", addAsset);
router.patch("/:id", updateQuantity);
router.delete("/:id", removeAsset);
router.get("/search", searchAssets);
router.get("/history", getHistory);
router.get("/transactions", getTransactions);

export default router;

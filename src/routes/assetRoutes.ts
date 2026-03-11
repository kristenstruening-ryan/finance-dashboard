import { Router } from "express";
import { addAsset, getAssetsByUser, removeAsset } from "../controllers/assetController";
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
 *  delete:
 *    summary: Delete an asset
 *    tags:
 *      - Assets
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the asset to delete
 *    responses:
 *      200:
 *        description: Asset deleted
 *      401:
 *        description: Denied
 *      404:
 *        description: Asset not found
 */

router.delete("/:id", removeAsset);
router.post("/", addAsset);
router.get("/", getAssetsByUser);

export default router;

import { Router } from "express";
import { login, signup } from "../controllers/authController";

const router = Router();

/**
 * Spec for the route /auth/signup
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Signup as a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one umber and one letter
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 */

/**
 * Spec for the route /auth/login
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Sign in as a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one umber and one letter
 *     responses:
 *       200:
 *         description: Successful login, JWT returned
 *       401:
 *         description: Invalid login credentials
 *       500:
 *         description: Server Error
 */
router.post("/signup", signup);
router.post("/login", login);

export default router;

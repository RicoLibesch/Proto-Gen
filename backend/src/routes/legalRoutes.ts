import express from 'express';
export const router = express.Router();
import { getLegals, editLegal } from '../controllers/legalController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/").get(getLegals);
router.route("/:id").put(verifyAccessToken, isAdmin, editLegal);
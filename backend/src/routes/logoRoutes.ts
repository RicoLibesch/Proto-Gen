import express from 'express';
export const router = express.Router();
import { getLogo, editLogo } from '../controllers/logoController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/").get(getLogo);
router.route("/").put(verifyAccessToken, isAdmin, editLogo);
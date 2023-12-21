import express from 'express';
export const router = express.Router();
import { getReceiver, editReceiver } from '../controllers/mailReceiverController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/").get(verifyAccessToken, isAdmin, getReceiver);
router.route("/").put(verifyAccessToken, isAdmin, editReceiver);
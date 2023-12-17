import express from 'express';
export const router = express.Router();
import { getReceiver, editReceiver } from '../controllers/mailReceiverController';
import { verifyAccessToken } from '../middleware/authMiddleware';

router.route("/").get(verifyAccessToken, getReceiver);
router.route("/").put(verifyAccessToken, editReceiver);
import express from 'express';
export const router = express.Router();
import { getReceiver, editReceiver, getDispatchStatus, setDispatchStatus } from '../controllers/mailController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/receiver").get(verifyAccessToken, isAdmin, getReceiver);
router.route("/receiver").put(verifyAccessToken, isAdmin, editReceiver);

router.route("/dispatch").get(getDispatchStatus, isAdmin, getReceiver);
router.route("/dispatch").put(setDispatchStatus, isAdmin, editReceiver);
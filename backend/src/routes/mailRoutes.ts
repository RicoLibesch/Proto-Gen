import express from 'express';
export const router = express.Router();
import { getReceiver, editReceiver, getDispatchStatus, setDispatchStatus, getTemplates, setTemplate } from '../controllers/mailController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/receiver").get(verifyAccessToken, isAdmin, getReceiver);
router.route("/receiver").put(verifyAccessToken, isAdmin, editReceiver);

router.route("/dispatch").get(verifyAccessToken, isAdmin, getDispatchStatus);
router.route("/dispatch").put(verifyAccessToken, isAdmin, setDispatchStatus);

router.route("/templates").get(verifyAccessToken, isAdmin, getTemplates);
router.route("/templates").put(verifyAccessToken, isAdmin, setTemplate);
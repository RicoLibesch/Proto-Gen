import express from 'express';
export const router = express.Router();
import { getProtocols, createProtocol, getProtocol, getAllProtocols } from '../controllers/protocolController';
import { verifyAccessToken, isAdmin, isAdminOrRecorder } from '../middleware/authMiddleware';

router.route("/").get(getProtocols);
router.route("/").post(verifyAccessToken, isAdminOrRecorder, createProtocol);
router.route("/export").get(verifyAccessToken, isAdmin, getAllProtocols);
router.route("/:id").get(getProtocol);
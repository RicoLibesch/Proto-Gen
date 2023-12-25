import express from 'express';
export const router = express.Router();
import { getProtocols, createProtocol, getProtocol, getAllProtocols } from '../controllers/protocolController';
import { verifyAccessToken, isRecorder } from '../middleware/authMiddleware';

router.route("/").get(getProtocols);
router.route("/").post(verifyAccessToken, isRecorder, createProtocol);
router.route("/export").get(getAllProtocols);
router.route("/:id").get(getProtocol);
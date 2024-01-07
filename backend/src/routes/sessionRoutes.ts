import express = require("express");
export const router = express.Router();
import { getSessionStatus, postSession, deleteSession, getAttendees, postAttendee } from '../controllers/sessionController';
import { verifyAccessToken, isAdmin, isRecorder, isAdminOrRecorder } from '../middleware/authMiddleware';

router.route("/").get(getSessionStatus);
router.route("/").post(verifyAccessToken, isRecorder, postSession);
router.route("/").delete(verifyAccessToken, isAdminOrRecorder, deleteSession);

router.route("/attendees").get(verifyAccessToken, isRecorder, getAttendees);
router.route("/attendees").post(postAttendee);
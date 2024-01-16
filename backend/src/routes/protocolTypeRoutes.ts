import express = require("express");
export const router = express.Router();
import {getProtocolTypes, editProtocolTypes} from '../controllers/protocolTypeController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/").get(getProtocolTypes);
router.route("/").put(verifyAccessToken, isAdmin, editProtocolTypes);
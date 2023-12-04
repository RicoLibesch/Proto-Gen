import express = require("express");
export const router = express.Router();
import {getProtocolTypes, editProtocolTypes} from '../controllers/protocolTypeController';

router.route("/").get(getProtocolTypes);
router.route("/").put(editProtocolTypes);
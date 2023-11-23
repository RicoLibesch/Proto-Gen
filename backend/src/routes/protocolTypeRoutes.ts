import express = require("express");
export const router = express.Router();
import {getProtocolTypes, getProtocolType, createProtocolType, editProtocolType } from '../controllers/protocolTypeController';

router.route("/").get(getProtocolTypes);
router.route("/").post(createProtocolType);
router.route("/:id").get(getProtocolType);
router.route("/:id").put(editProtocolType);
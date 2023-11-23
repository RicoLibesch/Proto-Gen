import express from 'express';
export const router = express.Router();
import { getProtocols, createProtocol, getProtocol } from '../controllers/protocolController';

router.route("/").get(getProtocols);
router.route("/").post(createProtocol);
router.route("/:id").get(getProtocol);
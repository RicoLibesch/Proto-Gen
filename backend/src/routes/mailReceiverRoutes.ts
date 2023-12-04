import express from 'express';
export const router = express.Router();
import { getReceiver, editReceiver } from '../controllers/mailReceiverController';

router.route("/").get(getReceiver);
router.route("/").put(editReceiver);
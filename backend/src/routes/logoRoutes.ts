import express from 'express';
export const router = express.Router();
import { getLogo, editLogo } from '../controllers/logoController';

router.route("/").get(getLogo);
router.route("/").put(editLogo);
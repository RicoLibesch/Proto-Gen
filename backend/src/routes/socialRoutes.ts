import express from 'express';
export const router = express.Router();
import { getSocials, editSocial } from '../controllers/socialController';
import { verifyAccessToken } from '../middleware/authMiddleware';

router.route("/").get(getSocials);
router.route("/:id").put(verifyAccessToken, editSocial);
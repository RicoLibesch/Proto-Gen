import express from 'express';
export const router = express.Router();
import { getSocials, editSocial } from '../controllers/socialController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/").get(getSocials);
router.route("/:id").put(verifyAccessToken, isAdmin, editSocial);
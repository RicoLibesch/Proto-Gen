import express from 'express';
export const router = express.Router();
import { getCategories, editCategories } from '../controllers/attendanceCategoryController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/").get(getCategories);
router.route("/").put(verifyAccessToken, isAdmin, editCategories);
import express from 'express';
export const router = express.Router();
import { getCategories, editCategories } from '../controllers/attendanceCategoryController';
import { verifyAccessToken } from '../middleware/authMiddleware';

router.route("/").get(getCategories);
router.route("/").put(verifyAccessToken, editCategories);
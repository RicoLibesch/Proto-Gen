import express from 'express';
export const router = express.Router();
import { getCategories, editCategories } from '../controllers/attendanceCategoryController';

router.route("/").get(getCategories);
router.route("/").put(editCategories);
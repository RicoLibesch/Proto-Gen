import express from 'express';
export const router = express.Router();
import { getUsers } from '../controllers/userController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/").get(verifyAccessToken, isAdmin, getUsers);
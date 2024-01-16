import express from 'express';
export const router = express.Router();
import { getUsers, removePermission, addPermission } from '../controllers/userController';
import { verifyAccessToken, isAdmin } from '../middleware/authMiddleware';

router.route("/").get(verifyAccessToken, isAdmin, getUsers);
router.route("/:userId/roles/:roleId").delete(verifyAccessToken, isAdmin, removePermission);
router.route("/:userId/roles/:roleId").post(verifyAccessToken, isAdmin, addPermission);
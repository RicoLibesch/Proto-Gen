import express from 'express';
export const router = express.Router();
import { loginUser } from '../controllers/authController';

router.route("/login").post(loginUser);
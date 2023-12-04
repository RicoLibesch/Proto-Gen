import express from 'express';
export const router = express.Router();
import { getSocials, editSocial } from '../controllers/socialController';

router.route("/").get(getSocials);
router.route("/:id").put(editSocial);
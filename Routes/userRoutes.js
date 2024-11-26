import express from 'express';
const router = express.Router();

import { getAllUsers, forgotPassword, resetPassword } from "../Controllers/userController.js";

router.route('/')
    .get(getAllUsers);

router.route('/forgot-password')
    .post(forgotPassword);

router.route('/reset-password')
    .post(resetPassword);

export default router;
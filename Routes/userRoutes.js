import express from 'express';
const router = express.Router();

import { getAllUsers } from "../Controllers/userController.js";

router.route('/')
    .get(getAllUsers);

export default router;
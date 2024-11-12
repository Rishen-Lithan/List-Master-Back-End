import express from 'express';
import ROLES_LIST from '../Config/ROLES_LIST.js';
import verifyRoles from '../Middlewares/verifyRoles.js';
import { createOrder } from '../Controllers/orderController.js'; 

const router = express.Router();

router.route('/')
    .post(createOrder);

export default router;
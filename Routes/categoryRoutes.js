import express from 'express';
import ROLES_LIST from '../Config/ROLES_LIST.js';
import verifyRoles from '../Middlewares/verifyRoles.js';
import { getAllCategories, createCategory, changeCategoryStatus, deleteCategory } from '../Controllers/categoryController.js';

const router = express.Router();

router.route('/')
    .get(getAllCategories)
    .post(createCategory)
    .put(changeCategoryStatus)
    .delete(deleteCategory);

export default router;
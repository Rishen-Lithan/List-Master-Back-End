import express from 'express';
import { getAllVendors, getVendorByID, deleteVendorProfile, updatedVendorProfile, addComments } from '../Controllers/vendorController.js';
import ROLES_LIST from '../Config/ROLES_LIST.js';
import verifyRoles from '../Middlewares/verifyRoles.js';

const router = express.Router();

router.route('/')
    .get(getAllVendors)
    .delete(verifyRoles(ROLES_LIST.Vendor, ROLES_LIST.Admin),deleteVendorProfile)
    .put(verifyRoles(ROLES_LIST.Vendor),updatedVendorProfile);

router.route('/:id')
    .get(getVendorByID);

router.route('/add_comments')
    .post(addComments);

export default router;
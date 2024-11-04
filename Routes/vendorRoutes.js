import express from 'express';
import { getAllVendors, getVendorByID, deleteVendorProfile, updatedVendorProfile, addComments } from '../Controllers/vendorController.js';

const router = express.Router();

router.route('/')
    .get(getAllVendors)
    .delete(deleteVendorProfile)
    .put(updatedVendorProfile);

router.route('/:id')
    .get(getVendorByID);

router.route('/add_comments')
    .post(addComments);

export default router;
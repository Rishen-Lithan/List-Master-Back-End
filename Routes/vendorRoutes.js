import express from 'express';
import { getAllVendors, getVendorByID, deleteVendorProfile, updatedVendorProfile } from '../Controllers/vendorController.js';

const router = express.Router();

router.route('/')
    .get(getAllVendors)
    .delete(deleteVendorProfile)
    .put(updatedVendorProfile);

router.route('/:id')
    .get(getVendorByID)

export default router;
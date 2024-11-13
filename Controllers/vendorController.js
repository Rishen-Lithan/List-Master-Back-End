import Vendor from '../Models/vendorModel.js';
import User from '../Models/userModel.js';

export const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        if(!vendors) return res.status(404).json({ 'message' : 'No Vendors Found' });
        res.status(200).json(vendors)
    } catch (error) {
        console.error('Error getting vendors : ', error);
        res.status(500).json({ 'message': 'Internal Server Error ' });
    }    
}

export const getVendorByID = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(404).json({ 'message': 'Vendor ID is required' });
    }

    try {
        const getVendor = await Vendor.findById({ _id: req.params.id });

        if(!getVendor) return res.status(404).json({ 'message': 'No Vendor found with that ID' });
        return res.status(200).json(getVendor);
    } catch (error) {
        console.error('Error getting vendor : ', error);
        return res.status(500).json({ 'message': 'Internal Server Error ' });
    }
}

export const deleteVendorProfile = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: 'Vendor ID is required' });
    }

    try {
        const vendor = await Vendor.findById(req.body.id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        await vendor.deleteOne();

        const deletedUser = await User.findOneAndDelete({ email: vendor.email });
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'Associated user not found in User collection' });
        }

        res.status(200).json({ message: 'Vendor and associated user profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting vendor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updatedVendorProfile = async (req, res) => {
    const { id, vendorName, address, contact, company, email } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Vendor ID is required' });
    }
    
    try {
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Allowed properties to update
        if (vendorName) vendor.vendorName = vendorName;
        if (address) vendor.address = address;
        if (contact) vendor.contact = contact;
        if (company) vendor.company = company;

        const updatedVendor = await vendor.save();

        const user = await User.findOne({ email: vendor.email });
        if (user) {
            if (email) user.email = email;

            await user.save();
        }

        res.status(200).json({ message: 'Vendor and associated user profile updated successfully', vendor: updatedVendor });
    } catch (error) {
        console.error('Error updating vendor profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const addComments = async (req, res) => {
    const { vendorId, comment } = req.body;

    if (!vendorId) {
        return res.status(400).json({ 'message': 'Vendor ID is required' });
    } else if (!comment) {
        return res.status(400).json({ 'message': 'Please add a comment ' });
    }

    try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ 'message': 'No vendor found' });
        }

        vendor.comments.push(comment);

        await vendor.save();

        return res.status(201).json({ 
            message: 'Comment added successfully ',
            comments: vendor.comments
        })
    } catch (error) {
        console.error('Error adding comment : ', error);
        return res.status(500).json({ 'message': 'Failed to add comments for the vendor' });
    }
}

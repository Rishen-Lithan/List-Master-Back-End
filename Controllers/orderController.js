import Orders from "../Models/orderModel.js";
import Product from "../Models/productModel.js";

export const createOrder = async (req, res) => {
    const { quantity, deliveryNote, address, product: productId } = req.body;
    
    if (!quantity) {
        return res.status(400).json({ 'message': 'Please select a quantity' });  
    } else if (!address) {
        return res.status(400).json({ 'message': 'Please enter the address' });
    } else if (address.length > 250) {
        return res.status(400).json({ 'message': 'Address should be less than 250 Characters' });
    }

    try {
        const product = await Product.findById(productId).populate('vendor'); 

        if (!product) {
            return res.status(404).json({ 'message': 'Product not found' });
        }

        if (product.remainingQuantity < quantity) {
            return res.status(400).json({ 'message': 'Insufficient product quantity' });
        }

        product.remainingQuantity -= quantity;
        await product.save();

        if (!product.vendor || !product.vendor._id) {
            return res.status(400).json({ 'message': 'Product vendor is missing' });
        }

        const createdOrder = await Orders.create({
            quantity,
            deliveryNote,
            address,
            product: productId,
            vendor: product.vendor._id,
            orderStatus: 0
        });

        const populatedOrder = await Orders.findById(createdOrder._id).populate('product').populate('vendor', 'email vendorName contact address company');

        return res.status(201).json(populatedOrder);

    } catch (error) {
        console.error('Error creating order : ', error);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}
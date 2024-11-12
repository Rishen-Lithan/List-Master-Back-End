import Product from "../Models/productModel.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploading
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../Uploads/images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only images (jpeg, jpg, png, gif) are allowed!"));
        }
    }
}).single('image');

export const addProduct = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { name, description, category, price, remainingQuantity } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Please enter the product name' });
        } else if (!description) {
            return res.status(400).json({ message: 'Please enter the description' });
        } else if (description.length > 250) {
            return res.status(400).json({ message: 'Description length should be less than 250 character' });
        } else if (!category) {
            return res.status(400).json({ message: 'Please select a category' });
        } else if (!price) {
            return res.status(400).json({ message: 'Please enter the price' });
        } else if (!remainingQuantity) {
            return res.status(400).json({ message: 'Please enter the quantity' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please select an Image' });
        }

        const relativeImagePath = path.relative(process.cwd(), req.file.path);

        const newProduct = new Product({
            name,
            image: relativeImagePath,
            description,
            category,
            price: Number(price),
            remainingQuantity: Number(remainingQuantity),
        });

        newProduct.save()
            .then(product => {
                res.status(201).json({ message: 'Product added successfully', product });
            })
            .catch(error => {
                console.error("Error saving product:", error);
                res.status(500).json({ message: 'Error adding product' });
            });
    });
}

export const getProducts = async (req, res) => {
    const products = await Product.find();
    if (!products) {
        return res.status(404).json({ 'message': 'No Products Available' });
    }
    return res.json(products);
}

export const getProductById = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(404).json({ 'message': 'Product ID is required' });
    }

    try {
        const product = await Product.findById({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({ 'message': 'No product found with that ID ' });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error('Error getting product details : ', error);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

export const deleteProduct = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(404).json({ 'message': 'Product ID is required' });
    }

    try {
        const product = await Product.findById({ _id: req.body.id });
        if (!product) {
            return res.status(404).json({ 'message': 'No product found with that ID' });
        }

        const isProductDeleted = await product.deleteOne({ _id: req.body.id });
        res.status(200).json(isProductDeleted);
    } catch (error) {
        console.error('Error deleting product : ', error);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        const { name, description, category, price, remainingQuantity } = req.body;

        if (description && description.length > 250) {
            return res.status(400).json({ message: 'Description length should be less than 250 characters' });
        }

        const updatedData = {
            ...(name && { name }),
            ...(description && { description }),
            ...(category && { category }),
            ...(price && { price: Number(price) }),
            ...(remainingQuantity && { remainingQuantity: Number(remainingQuantity) }),
        };

        if (req.file) {
            updatedData.image = path.relative(process.cwd(), req.file.path);
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: error.message || 'Error updating product' });
    }
};

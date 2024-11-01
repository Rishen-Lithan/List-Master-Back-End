import User from "../Models/userModel.js";
import Vendor from '../Models/vendorModel.js';
import bcrypt from 'bcrypt';
import validator from "validator";

export const handleNewUser = async (req, res) => {
    const { email, pwd } = req.body;

    if(!email || !pwd) return res.status(400).json({ 'message': 'Email and Password are required' });

    if (!validator.isEmail(email)) {
        return res.status(400).json({ 'message': 'Please enter a valid email address '});
    }

    const passwordLength = 8;
    if (pwd.length < passwordLength) {
        return res.status(400).json({ 'message': `Password should have at least ${passwordLength} characters`});
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(pwd)) {
        return res.status(400).json({ 'message': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'})
    }

    const duplicate = await User.findOne({ email: email });
    if(duplicate) return res.status(409).json({ 'message': 'Email is already in use'});

    try {
        const hashPwd = await bcrypt.hash(pwd, 10);

        const result = await User.create({
            "email": email,
            "password": hashPwd
        });

        res.status(201).json({ 'success': 'User Registered Successfully' });
    } catch(error) {
        res.status(500).json({ 'message': error.message });
    }
}

export const handleNewVendor = async (req, res) => {
    const { email, pwd, vendorName, address, contact, company } = req.body;

    if (!email || !vendorName || !address || !contact || !company || !pwd) {
        return res.status(400).json({ 'message': 'Please Fill All the Required Fields ' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ 'message': 'Please enter a valid email address '});
    }

    const contactLength = 10;
    if (contact.length !== contactLength) {
        return res.status(400).json({ 'message': 'Contact Number should have only 10 digits' });
    }
    const addressLength = 10;
    if (contact.length !== addressLength) {
        return res.status(400).json({ 'message': 'Contact Number should have only 10 digits' });
    }

    const passwordLength = 8;
    if (pwd.length < passwordLength) {
        return res.status(400).json({ 'message': `Password should have at least ${passwordLength} characters`});
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(pwd)) {
        return res.status(400).json({ 'message': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'})
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(pwd, 10);

        const newVendor = new Vendor({
            email,
            vendorName,
            address,
            contact,
            company,
            password: hashedPassword
        });
        const savedVendor = await newVendor.save();

        const newUser = new User({
            email,
            password: hashedPassword,
            roles: { Vendor: 1984 }
        });
        await newUser.save();

        res.status(201).json({ message: 'Vendor created successfully', vendor: savedVendor });
    } catch (error) {
        console.error('Error creating vendor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
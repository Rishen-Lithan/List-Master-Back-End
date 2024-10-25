import User from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import validator from "validator";

const handleNewUser = async (req, res) => {
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

export default handleNewUser;
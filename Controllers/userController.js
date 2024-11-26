import User from '../Models/userModel.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'

export const getAllUsers = async (req, res) => {
    try {
        const Users = await User.find();
        
        if (!Users || Users.length === 0) {
            return res.status(404).json({ message: 'No Users Found' });
        } else {
            const filteredUsers = Users.map(user => ({
                _id: user._id,
                email: user.email
            }));

            res.status(200).json(filteredUsers);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            return res.status(404).json({ message: 'No user found with this email' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenExpiry = Date.now() + 10 * 60 * 1000;

        foundUser.passwordResetToken = hashedToken;
        foundUser.passwordResetExpires = tokenExpiry;

        await foundUser.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        const message = `You requested a password reset. Click here to reset your password: ${resetUrl}`;
        await transporter.sendMail({
            to: foundUser.email,
            subject: 'Password Reset Request',
            text: message,
        });

        res.status(200).json({ message: 'Password reset link has been sent to your email' });

    } catch (error) {
        console.error('Error sending password reset link', error);
        return res.status(500).json({ 'message': 'Internal Server Error' });        
    }
}

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const foundUser = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!foundUser) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        foundUser.password = await bcrypt.hash(newPassword, salt);
        foundUser.passwordResetToken = undefined;
        foundUser.passwordResetExpires = undefined;
        await foundUser.save();

        res.status(200).json({ message: 'Password has been successfully reset' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


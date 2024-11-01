import User from '../Models/userModel.js';

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

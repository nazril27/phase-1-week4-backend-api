const UserService = require('../service/user.service');

const getUsers = async (req, res) => {
    try {
        const users = await UserService.getUsers();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const user = await UserService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);

        if (!user) {
            return res.status(404).json({
                success: false,
                messsage: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await UserService.deleteUser(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                messsage: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getUsers, 
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
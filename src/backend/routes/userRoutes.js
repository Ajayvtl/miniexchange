const express = require('express');
const { User, Role } = require('../models');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verifyToken, checkPermission } = require('../middlewares/authMiddleware');
const { insertAuditLog } = require('../utils/logger');

// Get all users (Only Admins or higher)
router.get('/', verifyToken, checkPermission('manage_users'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Exclude password from the response
            include: Role,
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add a new user (Super Admin or Admin)
router.post('/', verifyToken, checkPermission('manage_users'), async (req, res) => {
    try {
        const { username, email, password, roleId } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with the hashed password
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role_id: roleId,
        });

        // Log the action
        await insertAuditLog(req.user.id, newUser.id, 'User Created');

        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a user (Super Admin or Admin)
router.put('/:id', verifyToken, checkPermission('manage_users'), async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, roleId } = req.body;

        // Update user information
        await User.update({ username, email, role_id: roleId }, { where: { id } });

        // Log the action
        await insertAuditLog(req.user.id, id, 'User Updated');

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a user (Super Admin only)
router.delete('/:id', verifyToken, checkPermission('manage_users'), async (req, res) => {
    try {
        const { id } = req.params;

        await User.destroy({ where: { id } });

        // Log the action
        await insertAuditLog(req.user.id, id, 'User Deleted');

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

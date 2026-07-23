const express = require('express');
const router = express.Router();
const User = require('../models/User');
const GradeRecord = require('../models/GradeRecord');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all users list (Students & Admins)
// @access  Private (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            status: 'success',
            data: users
        });
    } catch (err) {
        console.error('Fetch users error:', err);
        res.status(500).json({ message: 'Error retrieving user list from server.' });
    }
});

// @route   PUT /api/users/:id
// @desc    Update any user details, level, or role
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { fullName, email, regNumber, level, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User account not found.' });
        }

        // Check email uniqueness if email is changed
        if (email && email.toLowerCase() !== user.email) {
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json({ message: 'Email address is already in use by another account.' });
            }
            user.email = email.toLowerCase();
        }

        // Check regNumber uniqueness if regNumber is changed
        if (regNumber && regNumber.trim() !== user.regNumber) {
            const regExists = await User.findOne({
                regNumber: { $regex: new RegExp("^" + regNumber.trim() + "$", "i") }
            });
            if (regExists) {
                return res.status(400).json({ message: 'Registration number is already in use.' });
            }
            user.regNumber = regNumber.trim();
        }

        if (fullName) user.fullName = fullName;
        if (level) user.level = level;
        if (role && ['student', 'admin'].includes(role)) user.role = role;

        const updatedUser = await user.save();

        res.json({
            status: 'success',
            data: {
                id: updatedUser._id,
                regNumber: updatedUser.regNumber,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role,
                level: updatedUser.level
            }
        });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ message: 'Error updating user profile.' });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user account and associated grade records
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User account not found.' });
        }

        // Prevent active admin from deleting their own account
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own active administrator account.' });
        }

        // Clean up student grade records if deleting a student
        await GradeRecord.deleteMany({ student: user._id });

        // Delete the user
        await User.deleteOne({ _id: user._id });

        res.json({
            status: 'success',
            message: 'User account and associated records deleted successfully.'
        });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ message: 'Error deleting user account.' });
    }
});

module.exports = router;
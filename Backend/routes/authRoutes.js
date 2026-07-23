const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_token_key_123', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { regNumber, fullName, email, password, level, role } = req.body;

    if (!regNumber || !fullName || !email || !password || !level) {
      return res.status(400).json({ message: 'All required registration fields must be completed.' });
    }

    const trimmedReg = regNumber.trim();

    const regExists = await User.findOne({
      regNumber: { $regex: new RegExp("^" + trimmedReg + "$", "i") }
    });
    if (regExists) {
      return res.status(400).json({ message: 'A profile with this Registration Number already exists.' });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: 'A profile with this Email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      regNumber: trimmedReg,
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      level,
      role: role && ['student', 'admin'].includes(role) ? role : 'student',
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          regNumber: user.regNumber,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          level: user.level,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid profile data entered.' });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server registration error. Please try again.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user/admin and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { regNumber, password } = req.body;

    if (!regNumber || !password) {
      return res.status(400).json({ message: 'Registration number and password are required.' });
    }

    const user = await User.findOne({
      regNumber: { $regex: new RegExp("^" + regNumber.trim() + "$", "i") }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid registration number or password credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid registration number or password credentials.' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        regNumber: user.regNumber,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        level: user.level,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server login error. Please try again.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    regNumber: req.user.regNumber,
    fullName: req.user.fullName,
    email: req.user.email,
    role: req.user.role,
    level: req.user.level,
  });
});

module.exports = router;
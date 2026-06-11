const jwt = require('jsonwebtoken');
const { User, ActivityLog } = require('../models');

// Register user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      role: 'User', // Default role
      status: 'Active',
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Record login activity
    await ActivityLog.create({
      userId: user._id,
      action: 'Login',
      ipAddress: req.ip,
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  register,
  login,
};

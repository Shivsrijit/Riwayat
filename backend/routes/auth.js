const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'riwayat_secret_key_2026';

// Middleware to authenticate JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Register user in MongoDB database
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, userType, bio, region } = req.body;
    const assignedRole = role || userType || 'visitor';

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists with this email.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      bio: bio || 'RIWAYAT Heritage Explorer',
      region: region || 'India'
    });

    await user.save();
    console.log('[MONGODB REGISTER SUCCESS] Saved new registered user:', user.email, 'Role:', user.role);

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        region: user.region
      }
    });
  } catch (err) {
    console.error('[MONGODB REGISTER ERROR]', err.message);
    res.status(500).json({ error: 'Server error during registration: ' + err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });

    console.log('[MONGODB LOGIN SUCCESS] User logged in:', user.email);
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        region: user.region
      }
    });
  } catch (err) {
    console.error('[MONGODB LOGIN ERROR]', err.message);
    res.status(500).json({ error: 'Server error during login: ' + err.message });
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('savedStories enrolledWorkshops');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching user profile.' });
  }
});

module.exports = router;
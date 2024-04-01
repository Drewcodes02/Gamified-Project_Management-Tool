const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('Attempting to register user:', req.body.username);
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      console.error('Missing registration fields');
      return res.status(400).json({ message: 'Username, password, and email are required.' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.error('Username already exists:', username);
      return res.status(409).json({ message: 'Username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 12); // Hashing the password before saving
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    console.log('User registered successfully:', user._id);
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      console.error('User not found:', username);
      return res.status(404).json({ message: 'User not found.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Invalid credentials for user:', username);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('User logged in successfully:', user.username);
    res.status(200).cookie('token', token, { httpOnly: true }).json({ message: 'Login successful', token }); // Send token in cookie
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
});

// Apply the authMiddleware to all routes defined after this line
router.use(authMiddleware);

router.get('/me', async (req, res) => {
  try {
    console.log('Fetching user information for:', req.user.username);
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      console.error('User not found with ID:', req.user.userId);
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ userId: user._id, username: user.username, email: user.email });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ message: 'Error fetching user information', error: error.message });
  }
});

// Endpoint to get user points
router.get('/points', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching points for user:', req.user.username);
    const user = await User.findById(req.user.userId);
    res.status(200).json({ points: user.points });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ message: 'Error fetching user points', error: error.message });
  }
});

// Endpoint to get user badges
router.get('/badges', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching badges for user:', req.user.username);
    const user = await User.findById(req.user.userId);
    res.status(200).json({ badges: user.badges });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ message: 'Error fetching user badges', error: error.message });
  }
});

// New endpoint to get a list of all users for the assignee dropdown
router.get('/users', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching list of all users for the assignee dropdown');
    const users = await User.find().select('username _id'); // Exclude sensitive information
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching list of users:', error);
    res.status(500).json({ message: 'Error fetching list of users', error: error.message });
  }
});

// Route to get the leaderboard
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const leaderboard = await User.find({}, 'username points -_id').sort({ points: -1 }).limit(10);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

module.exports = router;
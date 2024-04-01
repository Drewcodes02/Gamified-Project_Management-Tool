const express = require('express');
const User = require('../models/User');
const Gamification = require('../models/gamificationModel'); // Import Gamification model
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // User model will automatically hash the password using bcrypt
    const newUser = await User.create({ username, password });
    // Create a gamification profile for the new user
    await Gamification.create({ userId: newUser._id, points: 0, achievements: [] });
    console.log(`User and gamification profile created for ${username}`);
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    console.error(error.stack); // Log the full error stack
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Login attempt failed: User not found');
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      console.log(`User ${username} logged in successfully`);
      return res.redirect('/');
    } else {
      console.log('Login attempt failed: Password is incorrect');
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error);
    console.error(error.stack); // Log the full error stack
    return res.status(500).send(error.message);
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      console.error(err.stack); // Log the full error stack
      return res.status(500).send('Error logging out');
    }
    console.log('User logged out successfully');
    res.redirect('/auth/login');
  });
});

module.exports = router;
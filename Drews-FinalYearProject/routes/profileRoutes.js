const express = require('express');
const User = require('../models/User');
const Gamification = require('../models/gamificationModel');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }
    const gamificationProfile = await Gamification.findOne({ userId: req.session.userId });
    if (!gamificationProfile) {
      console.log('Gamification profile not found');
      return res.status(404).send('Gamification profile not found');
    }
    res.render('profile', {
      username: user.username,
      points: gamificationProfile.points,
      achievements: gamificationProfile.achievements
    });
  } catch (error) {
    console.error(`Error fetching user profile: ${error.message}`, error.stack);
    res.status(500).send('Error fetching user profile');
  }
});

module.exports = router;
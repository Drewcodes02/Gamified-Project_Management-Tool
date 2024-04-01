const express = require('express');
const Gamification = require('../models/gamificationModel');
const User = require('../models/User'); // Import User model to fetch leaderboard data
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

router.get('/gamification', isAuthenticated, async (req, res) => {
  try {
    const gamificationData = await Gamification.findOne({ userId: req.session.userId });
    if (!gamificationData) {
      console.log(`No gamification data found for user ID: ${req.session.userId}`);
      return res.render('gamification', { points: 0, achievements: [], leaderboard: [] });
    }
    // Fetch leaderboard data
    const leaderboardData = await Gamification.find({}).sort({ points: -1 }).limit(10).populate('userId', 'username');
    const leaderboard = leaderboardData.map((entry, index) => ({
      rank: index + 1,
      username: entry.userId.username,
      points: entry.points
    }));
    console.log(`Fetched gamification data for user ID: ${req.session.userId}`);
    res.render('gamification', { points: gamificationData.points, achievements: gamificationData.achievements, leaderboard: leaderboard });
  } catch (error) {
    console.error(`Error fetching gamification data: ${error.message}`, error.stack);
    res.status(500).send('Error fetching gamification data');
  }
});

module.exports = router;
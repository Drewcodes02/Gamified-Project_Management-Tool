const express = require('express');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// Protected route to fetch user profile information
router.get('/', authMiddleware, (req, res) => {
  console.log('Fetching user profile information.');
  try {
    if (!req.user) {
      console.error('User information is not available in the request object.');
      return res.status(404).json({ message: 'User information is not available.' });
    }
    console.log(`User profile information retrieved successfully for user: ${req.user.username}`);
    res.status(200).json({ userId: req.user.userId, username: req.user.username });
  } catch (error) {
    console.error('Error fetching user profile information:', error.stack);
    res.status(500).json({ message: 'Error fetching user profile information', error: error.message });
  }
});

module.exports = router;
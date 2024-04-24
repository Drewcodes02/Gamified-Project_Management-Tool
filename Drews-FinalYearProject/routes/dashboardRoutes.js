const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const analyticsController = require('../controllers/analyticsController');
const gamificationController = require('../controllers/gamificationController'); // Added to use gamification controller
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/dashboard/data', isAuthenticated, async (req, res) => {
  try {
    // Fetching dashboard data
    const dashboardData = await dashboardController.getDashboardData(req);
    const totalTasksCompleted = await analyticsController.getTotalTasksCompleted();
    const tasksInProgress = await analyticsController.getTasksInProgress();
    const averageCompletionTime = await analyticsController.getAverageCompletionTime();
    const gamificationPoints = await gamificationController.getGamificationPoints(req.session.userId); // Fetch gamification points

    // Consolidating all data into one response object
    const responseData = {
      ...dashboardData.data,
      totalTasksCompleted: totalTasksCompleted,
      tasksInProgress: tasksInProgress,
      averageCompletionTime: averageCompletionTime,
      gamificationPoints: gamificationPoints // Include gamification points in the response
    };

    console.log('Dashboard data successfully fetched');
    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message, error.stack);
    res.status(500).send('An error occurred while fetching dashboard data.');
  }
});

// New route to fetch gamification points for the dashboard
router.get('/gamification/points', isAuthenticated, async (req, res) => {
  try {
    const points = await gamificationController.getGamificationPoints(req.session.userId); // Fetch gamification points
    console.log(`Gamification points fetched for user ID: ${req.session.userId}`);
    res.json({ points });
  } catch (error) {
    console.error(`Error fetching gamification points for user ID ${req.session.userId}:`, error.message, error.stack);
    res.status(500).json({ message: "Error fetching gamification points", error: error.message });
  }
});

module.exports = router;
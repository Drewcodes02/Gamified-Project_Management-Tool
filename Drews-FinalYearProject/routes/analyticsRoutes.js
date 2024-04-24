const express = require('express');
const { isAuthenticated } = require('./middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.get('/totalTasksCompleted', isAuthenticated, async (req, res) => {
  try {
    const totalTasksCompleted = await analyticsController.getTotalTasksCompleted();
    console.log('Total tasks completed fetched');
    res.json({ totalTasksCompleted });
  } catch (error) {
    console.error('Error fetching total tasks completed:', error.message, error.stack);
    res.status(500).send('Error fetching total tasks completed');
  }
});

router.get('/tasksInProgress', isAuthenticated, async (req, res) => {
  try {
    const tasksInProgress = await analyticsController.getTasksInProgress();
    console.log('Tasks in progress fetched');
    res.json({ tasksInProgress });
  } catch (error) {
    console.error('Error fetching tasks in progress:', error.message, error.stack);
    res.status(500).send('Error fetching tasks in progress');
  }
});

router.get('/averageCompletionTime', isAuthenticated, async (req, res) => {
  try {
    const averageCompletionTime = await analyticsController.getAverageCompletionTime();
    console.log('Average completion time fetched');
    res.json({ averageCompletionTime });
  } catch (error) {
    console.error('Error fetching average completion time:', error.message, error.stack);
    res.status(500).send('Error fetching average completion time');
  }
});

router.get('/userPerformance', isAuthenticated, async (req, res) => {
  try {
    const userPerformance = await analyticsController.getUserPerformance();
    console.log('User performance data fetched');
    res.json({ userPerformance });
  } catch (error) {
    console.error('Error fetching user performance:', error.message, error.stack);
    res.status(500).send('Error fetching user performance');
  }
});

module.exports = router;
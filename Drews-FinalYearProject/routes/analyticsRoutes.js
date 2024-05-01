const express = require('express');
const { isAuthenticated } = require('./middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');
const Task = require('../models/taskModel'); // Import Task model to fetch tasks with due dates

const router = express.Router();

router.get('/totalTasksCompleted', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId; // Corrected to use session userId
    const totalTasksCompleted = await analyticsController.getTotalTasksCompleted(userId);
    console.log('Total tasks completed fetched for user ID:', userId);
    res.json({ totalTasksCompleted });
  } catch (error) {
    console.error('Error fetching total tasks completed:', error.message, error.stack);
    res.status(500).send('Error fetching total tasks completed');
  }
});

router.get('/tasksInProgress', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId; // Corrected to use session userId
    const tasksInProgress = await analyticsController.getTasksInProgress(userId);
    console.log('Tasks in progress fetched for user ID:', userId);
    res.json({ tasksInProgress });
  } catch (error) {
    console.error('Error fetching tasks in progress:', error.message, error.stack);
    res.status(500).send('Error fetching tasks in progress');
  }
});

router.get('/averageCompletionTime', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId; // Corrected to use session userId
    const averageCompletionTime = await analyticsController.getAverageCompletionTime(userId);
    console.log('Average completion time fetched for user ID:', userId);
    res.json({ averageCompletionTime });
  } catch (error) {
    console.error('Error fetching average completion time:', error.message, error.stack);
    res.status(500).send('Error fetching average completion time');
  }
});

router.get('/userPerformance', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId; // Corrected to use session userId
    const userPerformance = await analyticsController.getUserPerformance(userId);
    console.log('User performance data fetched for user ID:', userId);
    res.json({ userPerformance });
  } catch (error) {
    console.error('Error fetching user performance:', error.message, error.stack);
    res.status(500).send('Error fetching user performance');
  }
});

// New route to fetch tasks with due dates for the deadlines section
router.get('/tasksWithDueDates', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId; // Corrected to use session userId
    const tasksWithDueDates = await Task.find({ assignedTo: userId, dueDate: { $exists: true } }).sort({ dueDate: 1 }).select('title dueDate -_id');
    console.log('Tasks with due dates fetched for user ID:', userId);
    res.json({ tasksWithDueDates });
  } catch (error) {
    console.error('Error fetching tasks with due dates:', error.message, error.stack);
    res.status(500).send('Error fetching tasks with due dates');
  }
});

module.exports = router;
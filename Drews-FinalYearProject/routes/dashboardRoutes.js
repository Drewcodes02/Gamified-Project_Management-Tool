const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const analyticsController = require('../controllers/analyticsController');
// Removed the gamificationController import as it will be implemented later
const { isAuthenticated } = require('./middleware/authMiddleware');
const Task = require('../models/taskModel'); // Ensure Task model is imported for querying tasks with due dates

router.get('/dashboard/data', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const dashboardData = await dashboardController.getDashboardData(req);
    const totalTasksCompleted = await analyticsController.getTotalTasksCompleted(userId);
    const tasksInProgress = await analyticsController.getTasksInProgress(userId);
    const averageCompletionTime = await analyticsController.getAverageCompletionTime(userId);
    // Placeholder value for gamification points until the actual logic is implemented
    const gamificationPoints = 0; // Placeholder for gamification points

    // Fetching tasks with due dates for the deadlines section
    const tasksWithDueDates = await Task.find({ assignedTo: userId }).sort({ dueDate: 1 }).select('title dueDate -_id');

    const responseData = {
      ...dashboardData.data,
      totalTasksCompleted: totalTasksCompleted,
      tasksInProgress: tasksInProgress,
      averageCompletionTime: averageCompletionTime,
      gamificationPoints: gamificationPoints,
      tasksWithDueDates: tasksWithDueDates // Adding tasks with due dates to the response
    };

    console.log('Dashboard data successfully fetched for user ID:', userId);
    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching dashboard data for user ID:', req.session.userId, error.message, error.stack);
    res.status(500).send('An error occurred while fetching dashboard data.');
  }
});

router.get('/gamification/points', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    // Placeholder response for gamification points until the actual logic is implemented
    const points = 0; // Placeholder for gamification points
    console.log(`Gamification points fetched for user ID: ${userId}`);
    res.json({ points });
  } catch (error) {
    console.error(`Error fetching gamification points for user ID ${req.session.userId}:`, error.message, error.stack);
    res.status(500).json({ message: "Error fetching gamification points", error: error.message });
  }
});

router.get('/api/dashboard/charts', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const totalTasksCompleted = await analyticsController.getTotalTasksCompleted(userId);
    const tasksInProgress = await analyticsController.getTasksInProgress(userId);

    const completedTasksCount = totalTasksCompleted;
    const inProgressTasksCount = tasksInProgress;

    const labels = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en-US', { month: 'long' }));
    const taskProgressData = {
      labels: labels,
      datasets: [{
        label: 'Task Progress',
        data: [], // Placeholder for actual monthly progress data
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
    const taskStatusData = {
      labels: ['Completed', 'In Progress'],
      datasets: [{
        label: 'Task Status',
        data: [completedTasksCount, inProgressTasksCount],
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ]
      }]
    };

    // Fetching monthly task progress data
    const months = Array.from({ length: 12 }, (_, i) => i);
    const monthlyCompletedTasks = await Promise.all(months.map(async (month) => {
      return await analyticsController.getTasksCompletedByMonth(userId, month);
    }));
    taskProgressData.datasets[0].data = monthlyCompletedTasks;

    console.log('Dashboard charts data successfully fetched for user ID:', userId);
    res.json({
      success: true,
      taskProgressData: taskProgressData,
      taskStatusData: taskStatusData
    });
  } catch (error) {
    console.error('Error fetching dashboard charts data for user ID:', req.session.userId, error.message, error.stack);
    res.status(500).send('An error occurred while fetching dashboard charts data.');
  }
});

module.exports = router;
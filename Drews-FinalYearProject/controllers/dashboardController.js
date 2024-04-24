const Task = require('../models/taskModel');
const Gamification = require('../models/gamificationModel');
const User = require('../models/User');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.session.userId; // Corrected to use session userId

    // Fetch total points from gamification profile
    const gamificationProfile = await Gamification.findOne({ userId: userId });
    const totalPoints = gamificationProfile ? gamificationProfile.points : 0;

    // Fetch total tasks completed
    const tasksCompleted = await Task.countDocuments({ assignedTo: userId, status: 'Completed' });

    // Fetch total tasks assigned to calculate progress
    const totalTasksAssigned = await Task.countDocuments({ assignedTo: userId });
    const taskProgress = totalTasksAssigned > 0 ? (tasksCompleted / totalTasksAssigned) * 100 : 0;

    // For messages, returning a fixed value as per current requirement
    const messagesCount = 3; // Placeholder for future implementation

    res.json({
      success: true,
      data: {
        totalPoints,
        tasksCompleted,
        taskProgress,
        messagesCount
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};
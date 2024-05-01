const Task = require('../models/taskModel');
const Gamification = require('../models/gamificationModel');
const User = require('../models/User');
const analyticsController = require('../controllers/analyticsController');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.session.userId; // Corrected to use session userId

    // Fetch total points from gamification profile
    const gamificationProfile = await Gamification.findOne({ userId: userId });
    const totalPoints = gamificationProfile ? gamificationProfile.points : 0;

    // Use analyticsController to fetch total tasks completed and in progress
    const tasksCompleted = await analyticsController.getTotalTasksCompleted(userId);
    const tasksInProgress = await analyticsController.getTasksInProgress(userId);

    // Fetch total tasks assigned to calculate progress
    const totalTasksAssigned = await Task.countDocuments({ assignedTo: userId });
    const taskProgress = totalTasksAssigned > 0 ? (tasksCompleted / totalTasksAssigned) * 100 : 0;

    // For messages, returning a fixed value as per current requirement
    const messagesCount = 3; // Placeholder for future implementation

    // Update the profile page data fetching logic to include tasks in progress
    const profileData = {
      username: (await User.findById(userId)).username,
      points: totalPoints,
      achievements: gamificationProfile ? gamificationProfile.achievements : [],
      tasksCompleted,
      tasksInProgress,
      averageCompletionTime: 0 // Placeholder for actual logic to calculate average completion time
    };

    // Calculate average completion time for tasks using analyticsController
    const averageCompletionTime = await analyticsController.getAverageCompletionTime(userId);
    profileData.averageCompletionTime = averageCompletionTime;

    res.json({
      success: true,
      data: {
        dashboard: {
          totalPoints,
          tasksCompleted,
          tasksInProgress,
          taskProgress,
          messagesCount
        },
        profile: profileData
      }
    });
    console.log("Dashboard and profile data fetched successfully for user ID:", userId);
  } catch (error) {
    console.error('Error fetching dashboard and profile data:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard and profile data',
      error: error.message
    });
  }
};
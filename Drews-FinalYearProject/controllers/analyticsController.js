const Task = require('../models/taskModel');
const User = require('../models/User');

// Function to calculate total tasks completed
const getTotalTasksCompleted = async () => {
  try {
    const completedTasksCount = await Task.countDocuments({ status: 'completed' });
    console.log(`Total tasks completed: ${completedTasksCount}`);
    return completedTasksCount;
  } catch (error) {
    console.error(`Error fetching total tasks completed: ${error.message}`, error.stack);
    throw error;
  }
};

// Function to calculate tasks in progress
const getTasksInProgress = async () => {
  try {
    const tasksInProgressCount = await Task.countDocuments({ status: 'inProgress' });
    console.log(`Tasks in progress: ${tasksInProgressCount}`);
    return tasksInProgressCount;
  } catch (error) {
    console.error(`Error fetching tasks in progress: ${error.message}`, error.stack);
    throw error;
  }
};

// Function to calculate average completion time of tasks
const getAverageCompletionTime = async () => {
  try {
    const tasks = await Task.find({ status: 'completed' });
    if (tasks.length === 0) return 0;

    let totalCompletionTime = 0;
    tasks.forEach(task => {
      const startTime = task.startDate.getTime();
      const endTime = task.dueDate.getTime();
      totalCompletionTime += (endTime - startTime);
    });

    const averageCompletionTime = totalCompletionTime / tasks.length;
    console.log(`Average completion time: ${averageCompletionTime}`);
    return averageCompletionTime;
  } catch (error) {
    console.error(`Error calculating average completion time: ${error.message}`, error.stack);
    throw error;
  }
};

// Function to calculate individual user performance based on tasks completed
const getUserPerformance = async () => {
  try {
    const users = await User.find({});
    const userPerformance = [];

    for (const user of users) {
      const completedTasksCount = await Task.countDocuments({ assignedTo: user.username, status: 'completed' });
      userPerformance.push({ username: user.username, tasksCompleted: completedTasksCount });
    }

    console.log(`User performance: ${JSON.stringify(userPerformance)}`);
    return userPerformance;
  } catch (error) {
    console.error(`Error fetching user performance: ${error.message}`, error.stack);
    throw error;
  }
};

// Function to calculate user-specific performance
const getUserSpecificPerformance = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return null;
    }
    const completedTasksCount = await Task.countDocuments({ assignedTo: user.username, status: 'completed' });
    console.log(`User-specific performance for ${user.username}: ${completedTasksCount} tasks completed`);
    return { username: user.username, tasksCompleted: completedTasksCount };
  } catch (error) {
    console.error(`Error fetching user-specific performance for user ID ${userId}: ${error.message}`, error.stack);
    throw error;
  }
};

module.exports = {
  getTotalTasksCompleted,
  getTasksInProgress,
  getAverageCompletionTime,
  getUserPerformance,
  getUserSpecificPerformance
};
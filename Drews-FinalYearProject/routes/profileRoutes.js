const express = require('express');
const User = require('../models/User');
const Gamification = require('../models/gamificationModel');
const UserSettings = require('../models/userSettingsModel'); // Import the UserSettings model
const Task = require('../models/taskModel'); // Import the Task model
const bcrypt = require('bcrypt');
const { isAuthenticated } = require('./middleware/authMiddleware'); // Updated path
const analyticsController = require('../controllers/analyticsController');
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
    const userSettings = await UserSettings.findOne({ userId: req.session.userId });
    const tasksInProgress = await Task.countDocuments({ assignedTo: req.session.userId, status: 'In Progress' });
    const userPerformance = await analyticsController.getUserSpecificPerformance(req.session.userId);
    if (!userPerformance) {
      console.log(`Performance data for user ${user.username} not found`);
      return res.status(404).send(`Performance data for user ${user.username} not found`);
    }
    res.render('profile', {
      username: user.username,
      points: gamificationProfile.points,
      achievements: gamificationProfile.achievements,
      tasksCompleted: userPerformance.tasksCompleted,
      tasksInProgress: tasksInProgress, // Updated to use the newly fetched tasks in progress count
      averageCompletionTime: userPerformance.averageCompletionTime,
      userSettings: userSettings || {}
    });
  } catch (error) {
    console.error(`Error fetching user profile: ${error.message}`, error.stack);
    res.status(500).send('Error fetching user profile');
  }
});

router.post('/updateProfile', isAuthenticated, async (req, res) => {
  const { username, dataSharingPreferences, activityVisibility, notificationPreferences } = req.body;
  try {
    await User.findByIdAndUpdate(req.session.userId, { username });
    await UserSettings.findOneAndUpdate(
      { userId: req.session.userId },
      {
        dataSharingPreferences,
        activityVisibility,
        notificationPreferences
      },
      { upsert: true }
    );
    console.log('Profile and settings updated successfully for user:', username);
    res.status(200).send('Profile and settings updated successfully.');
  } catch (error) {
    console.error(`Profile update error for user ${username}: ${error.message}`, error.stack);
    res.status(500).send('Error updating profile and settings.');
  }
});

router.post('/changePassword', isAuthenticated, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.session.userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.log('Current password is incorrect.');
      return res.status(400).send('Current password is incorrect.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    console.log('Password updated successfully for user:', user.username);
    res.status(200).send('Password updated successfully.');
  } catch (error) {
    console.error(`Password update error for user ${user ? user.username : 'unknown'}: ${error.message}`, error.stack);
    res.status(500).send('Error updating password.');
  }
});

router.post('/privacySettings', isAuthenticated, async (req, res) => {
  const { dataSharingPreferences, activityVisibility, notificationPreferences } = req.body;
  try {
    const settingsUpdate = await UserSettings.findOneAndUpdate(
      { userId: req.session.userId },
      {
        dataSharingPreferences,
        activityVisibility,
        notificationPreferences
      },
      { new: true, upsert: true }
    );
    console.log('Privacy settings updated successfully for user:', req.session.userId);
    res.status(200).json({ message: 'Privacy settings updated successfully.', settings: settingsUpdate });
  } catch (error) {
    console.error(`Privacy settings update error for user ${req.session.userId}: ${error.message}`, error.stack);
    res.status(500).send('Error updating privacy settings.');
  }
});

module.exports = router;
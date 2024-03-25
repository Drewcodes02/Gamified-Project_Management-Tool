const User = require('../models/user');

// Function to handle points and badges update
exports.awardPointsAndBadges = async (userId) => {
  try {
    // Example logic for awarding points
    await User.findByIdAndUpdate(userId, { $inc: { points: 10 } }); // Increment points by 10
    console.log(`Points awarded to user ${userId}`);

    // Example logic for adding a badge based on a condition, e.g., reaching 100 points
    const user = await User.findById(userId);
    if (user.points >= 100) {
      await User.findByIdAndUpdate(userId, { $push: { badges: '100 Points Achiever' } });
      console.log(`Badge awarded to user ${userId}`);
    }
  } catch (error) {
    console.error('Error updating points and badges:', error.stack);
    throw error; // Rethrow to handle in calling function
  }
};
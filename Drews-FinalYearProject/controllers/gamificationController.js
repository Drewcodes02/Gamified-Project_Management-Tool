const Gamification = require('../models/gamificationModel');

exports.getGamificationPoints = async (userId) => {
  try {
    const gamificationProfile = await Gamification.findOne({ userId: userId });
    if (!gamificationProfile) {
      console.log(`No gamification profile found for user ID: ${userId}`);
      return 0; // Return 0 points if no profile is found
    }
    console.log(`Gamification points fetched for user ID: ${userId}, Points: ${gamificationProfile.points}`);
    return gamificationProfile.points;
  } catch (error) {
    console.error('Error fetching gamification points:', error.message, error.stack);
    throw error; // Rethrow the error after logging
  }
};
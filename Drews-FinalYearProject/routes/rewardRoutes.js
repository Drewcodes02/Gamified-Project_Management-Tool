const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Reward = require('../models/rewardModel');
const Gamification = require('../models/gamificationModel');

// Endpoint to get the list of available rewards
router.get('/rewards', async (req, res) => {
  try {
    const rewards = await Reward.find({});
    console.log("Fetched rewards successfully.");
    res.json(rewards);
  } catch (error) {
    console.error(`Error fetching rewards: ${error.message}`, error.stack);
    res.status(500).send('Error fetching rewards');
  }
});

// Endpoint to redeem a reward
router.post('/rewards/redeem', async (req, res) => {
  const { rewardId } = req.body;
  const userId = req.session.userId; // Assuming the user ID is stored in the session upon login
  if (!rewardId || !userId) {
    return res.status(400).send('Reward ID and User ID are required');
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const reward = await Reward.findById(rewardId).session(session);
    if (!reward) {
      await session.abortTransaction();
      session.endSession();
      console.log("Reward not found with ID:", rewardId);
      return res.status(404).send('Reward not found');
    }

    const userGamification = await Gamification.findOne({ userId }).session(session);
    if (!userGamification || userGamification.points < reward.pointCost) {
      await session.abortTransaction();
      session.endSession();
      console.log("Not enough points or user gamification data not found for user ID:", userId);
      return res.status(400).send('Not enough points to redeem this reward');
    }

    userGamification.points -= reward.pointCost;
    await userGamification.save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log(`Reward redeemed successfully for user ID: ${userId}. Remaining points: ${userGamification.points}`);
    res.send(`Reward redeemed successfully. Remaining points: ${userGamification.points}`);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error redeeming reward: ${error.message}`, error.stack);
    res.status(500).send('Error redeeming reward');
  }
});

// Endpoint to serve the rewards page
router.get('/rewards/page', async (req, res) => {
  try {
    const rewards = await Reward.find({});
    console.log("Fetched rewards for page successfully.");
    res.render('rewards', { rewards });
  } catch (error) {
    console.error(`Error fetching rewards for page: ${error.message}`, error.stack);
    res.status(500).send('Error fetching rewards for page');
  }
});

module.exports = router;
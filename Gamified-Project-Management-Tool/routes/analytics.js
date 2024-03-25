const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.get('/', async (req, res) => {
  try {
    const taskAnalytics = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          totalTimeSpent: { $sum: "$timeSpent" },
          averageTimeSpent: { $avg: "$timeSpent" },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log("Analytics fetched successfully.");
    res.render('analytics', { analytics: taskAnalytics });
  } catch (error) {
    console.error('Error fetching analytics:', error.stack);
    res.status(500).send('Error fetching analytics');
  }
});

module.exports = router;
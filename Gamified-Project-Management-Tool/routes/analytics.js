const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.get('/', async (req, res) => {
  try {
    const taskAnalytics = await Task.aggregate([
      {
        $unwind: "$workSessions"
      },
      {
        $group: {
          _id: "$status",
          totalTimeSpent: {
            $sum: {
              $divide: [
                { $subtract: ["$workSessions.end", "$workSessions.start"] },
                3600000 // Convert milliseconds to hours
              ]
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          totalTimeSpent: 1,
          averageTimeSpent: { $divide: ["$totalTimeSpent", "$count"] },
          count: 1
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
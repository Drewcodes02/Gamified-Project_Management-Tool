const express = require('express');
const Task = require('../models/taskModel');
const Gamification = require('../models/gamificationModel');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

// Create a new task
router.post('/tasks', isAuthenticated, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    console.log(`Task created: ${task.title}`);
    res.status(201).send({ message: "Task successfully created", task });
  } catch (error) {
    console.error(`Error creating task: ${error.message}`, error.stack);
    res.status(400).send(error);
  }
});

// Get all tasks
router.get('/tasks', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({});
    console.log('Fetched all tasks');
    res.render('tasks', { tasks: tasks }); // Modified to render tasks view instead of sending JSON
  } catch (error) {
    console.error(`Error fetching tasks: ${error.message}`, error.stack);
    res.status(500).send(error);
  }
});

// Get a specific task by ID
router.get('/tasks/:id', isAuthenticated, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);

    if (!task) {
      console.log(`Task with ID ${_id} not found`);
      return res.status(404).send();
    }

    console.log(`Fetched task: ${task.title}`);
    res.send(task);
  } catch (error) {
    console.error(`Error fetching task with ID ${_id}: ${error.message}`, error.stack);
    res.status(500).send(error);
  }
});

// Update a task
router.put('/tasks/:id', isAuthenticated, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'assignedTo', 'startDate', 'dueDate', 'progress', 'status'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    console.log('Invalid updates attempted');
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      console.log(`Task with ID ${req.params.id} not found for update`);
      return res.status(404).send();
    }

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();

    console.log(`Task updated: ${task.title}`);

    // Award points if task is completed
    if (task.status === 'completed') {
      try {
        let gamification = await Gamification.findOne({ userId: req.session.userId });
        if (!gamification) {
          // If gamification profile does not exist, create a new one
          gamification = new Gamification({ userId: req.session.userId });
        }
        gamification.addPoints(10); // Award 10 points for task completion
        await gamification.save();
        console.log(`Points awarded to user ${req.session.userId}`);
        res.send({ message: "Task successfully updated and points awarded", task });
      } catch (error) {
        console.error(`Error in gamification process: ${error.message}`, error.stack);
        console.log("Task updated but gamification process encountered an error.");
        res.send({ message: "Task successfully updated, but unable to process gamification at this time.", task });
      }
    } else {
      res.send({ message: "Task successfully updated", task });
    }
  } catch (error) {
    console.error(`Error updating task with ID ${req.params.id}: ${error.message}`, error.stack);
    res.status(400).send(error);
  }
});

// Delete a task
router.delete('/tasks/:id', isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      console.log(`Task with ID ${req.params.id} not found for deletion`);
      return res.status(404).send();
    }

    console.log(`Task deleted: ${task.title}`);
    res.send({ message: "Task successfully deleted", task });
  } catch (error) {
    console.error(`Error deleting task with ID ${req.params.id}: ${error.message}`, error.stack);
    res.status(500).send(error);
  }
});

module.exports = router;
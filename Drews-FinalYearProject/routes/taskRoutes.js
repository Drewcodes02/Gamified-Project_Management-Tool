const express = require('express');
const Task = require('../models/taskModel');
const Gamification = require('../models/gamificationModel');
const Notification = require('../models/notificationModel');
const { isAuthenticated } = require('./middleware/authMiddleware'); // Updated path to reflect new location
const { ObjectId } = require('mongoose').Types; // Import ObjectId
const router = express.Router();

// Create a new task
router.post('/tasks', isAuthenticated, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    console.log(`Task created: ${task.title}`);

    // Notify assigned users
    let assignedUsers = [];
    if (Array.isArray(req.body.assignedTo)) {
      assignedUsers = req.body.assignedTo;
    } else {
      assignedUsers = [req.body.assignedTo]; // Ensure assignedUsers is always an array
    }

    const notificationPromises = assignedUsers.map(async (userId) => {
      if (!ObjectId.isValid(userId)) {
        console.error(`Invalid userId: ${userId}`);
        return Promise.resolve(); // Skip invalid userIds
      }
      const notification = new Notification({
        userId: new ObjectId(userId), // Ensure userId is cast to ObjectId
        message: `You have been assigned a new task: ${task.title}`,
        link: `/tasks/${task._id}`
      });
      await notification.save();
    });
    await Promise.all(notificationPromises);

    res.status(201).send({ message: "Task successfully created", task });
  } catch (error) {
    console.error(`Error creating task: ${error.message}`, error.stack);
    res.status(400).send(error);
  }
});

// Get all tasks
router.get('/tasks', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({}).exec();
    console.log('Fetched all tasks');
    res.render('tasks', { tasks: tasks }); // Changed from res.json to res.render to correctly return rendered view
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

// Add a new task to the To-do List
router.post('/tasks/addTodo', isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const newTask = new Task({
      title,
      description,
      assignedTo: req.session.userId, // Assign the task to the current user
      startDate: new Date(), // Set the start date to the current date
      dueDate,
      progress: 0, // Start progress at 0%
      status: 'inProgress' // Mark the task as in progress
    });
    await newTask.save();

    console.log(`New to-do added: ${newTask.title}`);
    res.status(201).send({ message: "To-do successfully added", task: newTask });
  } catch (error) {
    console.error(`Error adding new to-do: ${error.message}`, error.stack);
    res.status(400).send(error);
  }
});

// Route to mark a task as completed
router.post('/tasks/:id/complete', isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send({ message: "Task not found." });
    }

    // Update task status to 'completed'
    task.status = 'completed';
    task.progress = 100;
    await task.save();

    // Award points to each assigned user
    const updatePromises = task.assignedTo.map(async (userId) => {
      const gamification = await Gamification.findOne({ userId });
      if (gamification) {
        gamification.addPoints(10); // Award 10 points for task completion
        await gamification.save();
      }
    });

    await Promise.all(updatePromises);

    res.send({ message: "Task marked as completed and points awarded to all assigned users.", task });
  } catch (error) {
    console.error(`Error marking task as complete: ${error.message}`, error.stack);
    res.status(500).send({ message: "Error updating task status." });
  }
});

module.exports = router;
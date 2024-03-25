const Task = require('../models/task');
const gamificationController = require('./gamificationController');

exports.createTask = async (req, res) => {
  try {
    // Ensure a default status if not provided
    if (!req.body.status) {
      req.body.status = 'pending';
    }

    // Handling work sessions input
    if (req.body.workSessions && typeof req.body.workSessions === 'string') {
      try {
        req.body.workSessions = JSON.parse(req.body.workSessions);
      } catch (error) {
        console.error('Error parsing workSessions:', error);
        return res.status(400).json({ message: 'Invalid workSessions format' });
      }
    } else {
      req.body.workSessions = [];
    }

    const task = new Task(req.body);
    await task.save();
    console.log(`Task created successfully with ID: ${task._id}`);
    res.status(201).json({ message: 'Task created successfully', taskId: task._id });
  } catch (error) {
    console.error('Error creating task:', error.stack);
    res.status(500).json({ message: 'Error creating task', error: error.stack });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignee', 'username email');
    if (!task) {
      console.error(`Task not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Task not found' });
    }
    console.log(`Task fetched successfully with ID: ${req.params.id}`);
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error.stack);
    res.status(500).json({ message: 'Error fetching task', error: error.stack });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const update = req.body;

    // Handling work sessions update
    if (req.body.workSessionStart && req.body.workSessionEnd) {
      const workSession = {
        start: new Date(req.body.workSessionStart),
        end: new Date(req.body.workSessionEnd)
      };
      update.$push = { workSessions: workSession };
    }

    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true }).populate('assignee', 'username email');
    if (!task) {
      console.error(`Task not found for updating with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Task not found' });
    }
    console.log(`Task updated successfully with ID: ${req.params.id}`);

    // If task status is updated to 'completed', trigger gamification logic
    if (req.body.status === 'completed') {
      await gamificationController.awardPointsAndBadges(task.assignee).catch((error) => {
        console.error('Error updating points and badges for user:', error.stack);
        // Not throwing an error to not fail the main task operation
      });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error.stack);
    res.status(500).json({ message: 'Error updating task', error: error.stack });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      console.error(`Task not found for deletion with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Task not found' });
    }
    console.log(`Task deleted successfully with ID: ${req.params.id}`);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error.stack);
    res.status(500).json({ message: 'Error deleting task', error: error.stack });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignee', 'username email');
    console.log(`Fetched ${tasks.length} tasks successfully`);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching all tasks:', error.stack);
    res.status(500).json({ message: 'Error fetching all tasks', error: error.stack });
  }
};
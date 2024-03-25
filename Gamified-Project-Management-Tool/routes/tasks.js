const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// Define the route for fetching all tasks first
router.get('/all', tasksController.getAllTasks);

// Then define routes for specific tasks by ID
router.post('/create', tasksController.createTask);
router.get('/:id', tasksController.getTask);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;

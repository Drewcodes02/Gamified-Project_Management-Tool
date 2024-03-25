const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/task'); // Assuming Task model is defined in models/task.js
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/dashboard', (req, res) => {
  const token = req.cookies.token; // Assuming token is sent via cookies
  if (!token) {
    console.log('No token found, redirecting to login');
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded user from JWT: ${decoded.username}`);
    // Fetch all tasks for the user
    Task.find({ assignee: decoded.userId })
      .then(tasks => {
        res.render('dashboard', { user: { username: decoded.username }, tasks });
      })
      .catch(error => {
        console.error('Error fetching tasks for dashboard:', error);
        res.status(500).send('Error fetching tasks');
      });
  } catch (error) {
    console.error('Error verifying JWT:', error.stack);
    res.redirect('/login');
  }
});

router.get('/task', (req, res) => {
  const taskId = req.query.id; // Get task ID from query parameter
  if (!taskId) {
    console.log('Task ID not provided, redirecting to dashboard');
    return res.redirect('/dashboard');
  }

  Task.findById(taskId)
    .then(task => {
      if (!task) {
        console.log(`Task with ID ${taskId} not found`);
        return res.status(404).send('Task not found');
      }

      res.render('task', { task });
    })
    .catch(error => {
      console.error('Error fetching task details:', error);
      res.status(500).send('Error fetching task details');
    });
});

router.use((req, res) => {
  res.status(404).send('Page not found'); // Simplified handling for undefined routes
});

module.exports = router;
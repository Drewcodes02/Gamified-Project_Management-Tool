require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const taskRoutes = require('./routes/tasks');
const indexRoutes = require('./routes/index');
const analyticsRoutes = require('./routes/analytics');
const http = require('http');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.get('/ping', (req, res) => {
  console.log('Received request for /ping');
  res.json({ status: 'success', message: 'pong' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err.stack);
  });

app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/', indexRoutes);

app.use('*', (req, res) => {
  console.log(`Attempted to access undefined route: ${req.originalUrl}`);
  res.status(404).json({ status: 'error', message: 'Route does not exist.' });
});

const server = http.createServer(app);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:', err.stack);
  res.status(500).json({ status: 'error', message: 'An internal server error occurred.' });
});
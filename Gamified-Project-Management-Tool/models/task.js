const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true, enum: ['pending', 'in progress', 'completed'] },
  timeSpent: { type: Number, default: 0 } // Time spent in hours
});

module.exports = mongoose.model('Task', taskSchema);
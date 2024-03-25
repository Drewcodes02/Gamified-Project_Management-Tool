const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true, enum: ['pending', 'in progress', 'completed'] },
  workSessions: [{
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  }]
});

taskSchema.virtual('timeSpent').get(function() {
  return this.workSessions.reduce((total, session) => {
    const start = new Date(session.start);
    const end = new Date(session.end);
    return total + (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
  }, 0);
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
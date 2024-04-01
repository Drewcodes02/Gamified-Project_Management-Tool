const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: [{ type: String, ref: 'User', required: true }],
  startDate: { type: Date },
  dueDate: { type: Date },
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'inProgress', 'completed'], default: 'pending' }
});

taskSchema.pre('save', function(next) {
  console.log(`Saving task: ${this.title}`);
  next();
});

taskSchema.post('save', function(doc) {
  console.log(`Task saved: ${doc.title}`);
});

taskSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error(`Error saving task: ${error.message}`, error.stack);
    next(error);
  } else {
    next();
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  link: { type: String, default: '#' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.pre('save', function(next) {
  console.log(`Saving notification for user ${this.userId}`);
  next();
});

notificationSchema.post('save', function(doc, next) {
  console.log(`Notification saved for user ${doc.userId} with message: ${doc.message}`);
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
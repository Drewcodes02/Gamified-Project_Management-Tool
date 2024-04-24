const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dataSharingPreferences: { type: Boolean, default: false },
  activityVisibility: { type: String, enum: ['public', 'private', 'friends'], default: 'private' },
  notificationPreferences: { type: Boolean, default: false }
});

userSettingsSchema.pre('save', function(next) {
  console.log(`Saving settings for user ${this.userId}`);
  next();
});

userSettingsSchema.post('save', function(doc) {
  console.log(`Settings saved for user ${doc.userId}`);
});

userSettingsSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error(`Error saving settings for user ${doc.userId}: ${error.message}`, error.stack);
    next(error);
  } else {
    next();
  }
});

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

module.exports = UserSettings;
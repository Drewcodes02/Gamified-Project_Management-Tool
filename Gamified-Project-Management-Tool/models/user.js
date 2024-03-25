const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  points: { type: Number, default: 0 },
  badges: [{ type: String }]
});

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  if (this.isModified('password') || this.isNew) {
    try {
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      next();
    } catch (error) {
      console.error('Error hashing password:', error.message);
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);
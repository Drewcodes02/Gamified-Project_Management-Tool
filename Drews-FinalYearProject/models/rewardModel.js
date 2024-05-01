const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardSchema = new Schema({
  rewardName: { type: String, required: true },
  pointCost: { type: Number, required: true },
  description: { type: String }
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;
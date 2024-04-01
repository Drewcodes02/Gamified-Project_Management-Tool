const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gamificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  achievements: [{ type: String }],
});

// Method to add points
gamificationSchema.methods.addPoints = function(points) {
  this.points += points;
  this.checkMilestones();
};

// Method to check milestones and award achievements
gamificationSchema.methods.checkMilestones = function() {
  // Adding a milestone for completing the first task
  if (this.points === 10 && !this.achievements.includes("Completed first task")) {
    this.achievements.push("Completed first task");
    console.log("Awarded achievement for completing the first task.");
  }

  const milestones = [5000, 10000, 15000]; // Example milestones
  milestones.forEach(milestone => {
    if (this.points >= milestone && !this.achievements.includes(`Points: ${milestone}`)) {
      this.achievements.push(`Points: ${milestone}`);
      console.log(`Awarded achievement for reaching ${milestone} points.`);
    }
  });
};

const Gamification = mongoose.model('Gamification', gamificationSchema);

module.exports = Gamification;
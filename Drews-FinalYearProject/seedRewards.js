const mongoose = require('mongoose');
const Reward = require('./models/rewardModel');
const dotenv = require('dotenv');

dotenv.config();

const rewardsData = [
  { rewardName: 'Half Day Off', pointCost: 500, description: 'Redeem for half a day off work.' },
  { rewardName: 'Full Day Off', pointCost: 1000, description: 'Redeem for a full day off work.' },
  { rewardName: '£5 Gift Card', pointCost: 250, description: 'Redeem for a £5 Gift Card.' },
  { rewardName: '£10 Gift Card', pointCost: 500, description: 'Redeem for a £10 Gift Card.' },
  { rewardName: '£25 Gift Card', pointCost: 1250, description: 'Redeem for a £25 Gift Card.' },
  { rewardName: '£50 Gift Card', pointCost: 5000, description: 'Redeem for a £50 Gift Card.' },
  { rewardName: '£100 Gift Card', pointCost: 10000, description: 'Redeem for a £100 Gift Card.' }
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected');
  Reward.deleteMany({})
    .then(() => {
      console.log('Existing rewards cleared');
      Reward.insertMany(rewardsData)
        .then(() => {
          console.log('Rewards seeded successfully.');
          mongoose.disconnect();
        })
        .catch(err => {
          console.error('Error seeding rewards:', err);
          mongoose.disconnect();
        });
    })
    .catch(err => {
      console.error('Error clearing existing rewards:', err);
      mongoose.disconnect();
    });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
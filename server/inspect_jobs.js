const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Job = require('./models/Job');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const jobs = await Job.find({}).lean();
    console.log(JSON.stringify(jobs, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

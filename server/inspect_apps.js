const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Application = require('./models/Application');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const apps = await Application.find({});
    console.log('Applications in DB:');
    apps.forEach(a => {
      console.log(`- ID: ${a._id}, ApplicantID: ${a.applicant}, JobID: ${a.job}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();

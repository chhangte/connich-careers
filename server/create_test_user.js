const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

async function create() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if test recruiter exists and delete it to be sure
    await User.deleteOne({ email: 'test@test.com' });
    
    const user = new User({
      name: 'Test Recruiter',
      email: 'test@test.com',
      password: 'password123',
      role: 'RECRUITER'
    });
    
    await user.save();
    console.log('Created test recruiter: test@test.com / password123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

create();

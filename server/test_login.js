const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();
const User = require('./models/User');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: 'recruiter@connich.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    
    const isMatch = await bcrypt.compare('password123', user.password);
    console.log('Password "password123" match:', isMatch);
    console.log('Hash in DB:', user.password);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();

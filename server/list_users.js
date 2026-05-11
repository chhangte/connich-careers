const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}]`));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

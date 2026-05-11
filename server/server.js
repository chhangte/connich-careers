const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careers-kidsden')
    .then(async () => {
        console.log(`MongoDB Connected to: ${mongoose.connection.name}`);
        const User = require('./models/User');
        const count = await User.countDocuments();
        console.log(`Current users in database: ${count}`);
    })
    .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/company', require('./routes/company'));

// Stats Route
app.get('/api/stats', async (req, res) => {
    try {
        const Job = require('./models/Job');
        const User = require('./models/User');
        const jobsCount = await Job.countDocuments({ status: 'OPEN' });
        const companies = await Job.distinct('postedBy', { status: 'OPEN' });
        const companiesCount = companies.length || 1;
        const candidatesCount = await User.countDocuments({ role: 'APPLICANT' });
        res.json({ jobsCount, companiesCount, candidatesCount });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Basic Route
app.get('/', (req, res) => {
    res.send('Careers Portal API Running');
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

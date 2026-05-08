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
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careers-kidsden', {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    cachedDb = conn;
    console.log('MongoDB Connected');
    return conn;
}

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ message: 'Database connection failed' });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/company', require('./routes/company'));

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

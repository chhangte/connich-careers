const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const router = express.Router();

// Get public company profile + open jobs by recruiter userId
router.get('/:userId', async (req, res) => {
    try {
        const recruiter = await User.findById(req.params.userId).select('-password');
        if (!recruiter || recruiter.role !== 'RECRUITER') {
            return res.status(404).json({ message: 'Company not found' });
        }

        const jobs = await Job.find({ postedBy: recruiter._id, status: 'OPEN' })
            .sort({ createdAt: -1 });

        res.json({
            recruiter: {
                id: recruiter._id,
                name: recruiter.name,
                company: recruiter.company,
            },
            jobs,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

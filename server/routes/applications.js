const express = require('express');
const Application = require('../models/Application');
const router = express.Router();

// Apply for a job
router.post('/', async (req, res) => {
    try {
        const { job, applicant, details } = req.body;
        const application = new Application({
            job,
            applicant,
            details
        });
        await application.save();
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get my applications
router.get('/my/:userId', async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.params.userId })
            .populate('job', 'title location department salary')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all applications for a job (Recruiter/Admin)
router.get('/job/:jobId', async (req, res) => {
    try {
        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update application status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add message to application
router.post('/:id/message', async (req, res) => {
    try {
        const { message, sentBy } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { $push: { messages: { message, sentBy: sentBy || 'RECRUITER' } } },
            { new: true }
        );
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

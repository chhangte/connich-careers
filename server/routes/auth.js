const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, company } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const userData = { name, email, password, role };
        // Attach company profile for recruiters
        if (role === 'RECRUITER' && company) {
            userData.company = company;
        }

        user = new User(userData);
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                profile: user.profile,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                profile: user.profile,
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update company profile (recruiter)
router.patch('/company/:userId', async (req, res) => {
    try {
        const { company } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { company },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                profile: user.profile,
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile (applicant)
router.patch('/user/:userId', async (req, res) => {
    try {
        const { name, email, password, profile } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // triggers pre-save hook
        if (profile) user.profile = { ...user.profile, ...profile };

        await user.save();

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                profile: user.profile,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

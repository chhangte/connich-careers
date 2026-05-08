const mongoose = require('mongoose');

// Available application fields a recruiter can request
// Keys are canonical field names; the Apply page renders based on this list.
const KNOWN_APPLICATION_FIELDS = [
    'phone', 'dob', 'address', 'maritalStatus',
    'familyInfo', 'educationHistory', 'experience', 'reference',
];

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    location: { type: String, default: 'On-site' },
    department: String,
    salary: String,
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED'],
        default: 'OPEN'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Hiring timeline
    hiringMode: {
        type: String,
        enum: ['ROLLING', 'DEADLINE'],
        default: 'ROLLING'
    },
    lastDateToApply: { type: Date },
    interviewDate: { type: Date },
    interviewVenue: { type: String, default: '' },
    // Recruiter-selected application fields
    // Always includes 'name' and 'email' implicitly.
    applicationFields: {
        type: [String],
        default: ['phone', 'dob', 'address', 'maritalStatus', 'familyInfo', 'educationHistory', 'experience'],
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);

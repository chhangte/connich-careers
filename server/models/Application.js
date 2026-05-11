const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    details: {
        // Personal
        name: String,
        email: String,
        phone: String,
        address: String,
        houseNumber: String,
        area: String,
        city: String,
        state: String,
        country: String,
        pin: String,
        dob: String,
        maritalStatus: String,
        // Family
        fatherName: String,
        fatherPhone: String,
        motherName: String,
        motherPhone: String,
        // Education
        highestQualification: String,
        discipline: String,
        primarySchool: String,
        middleSchool: String,
        highSchool: String,
        higherSecondarySchool: String,
        hscStream: String,
        undergraduateInstitute: String,
        ugCourse: String,
        postgraduateInstitute: String,
        pgCourse: String,
        // Experience
        isFresher: { type: Boolean, default: false },
        experiences: [{
            jobTitle: String,
            description: String,
            fromMonth: String,
            fromYear: String,
            toMonth: String,
            toYear: String,
            referenceName: String,
            referencePhone: String
        }],
    },
    status: {
        type: String,
        enum: ['PENDING', 'SHORTLISTED', 'REJECTED', 'JOINED'],
        default: 'PENDING'
    },
    messages: [{
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        sentBy: { type: String, enum: ['RECRUITER', 'SYSTEM'], default: 'RECRUITER' }
    }],
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);

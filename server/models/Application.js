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
        required: false
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
        gender: String,
        nationality: String,
        ethnicity: String,
        religion: String,
        category: String,
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
        diplomaInstitute: String,
        diplomaCourse: String,
        postgraduateInstitute: String,
        pgCourse: String,
        postgraduates: [{
            institute: String,
            course: String
        }],
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
        // Skills & Extra
        languages: [{
            name: String,
            proficiency: String
        }],
        sports: { name: String, description: String },
        music: { name: String, description: String },
        arts: { name: String, description: String },
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

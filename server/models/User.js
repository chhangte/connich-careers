const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['APPLICANT', 'RECRUITER', 'ADMIN'],
        default: 'APPLICANT'
    },
    // Only populated for RECRUITER accounts
    company: {
        name: { type: String, default: '' },
        tagline: { type: String, default: '' },
        about: { type: String, default: '' },
        industry: { type: String, default: '' },
        website: { type: String, default: '' },
        logoUrl: { type: String, default: '' },
        location: { type: String, default: '' },
    },
    // Only populated for APPLICANT accounts for autofill
    profile: {
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
        dob: { type: String, default: '' },
        maritalStatus: { type: String, default: '' },
        fatherName: { type: String, default: '' },
        fatherPhone: { type: String, default: '' },
        motherName: { type: String, default: '' },
        motherPhone: { type: String, default: '' },
        highestQualification: { type: String, default: '' },
        discipline: { type: String, default: '' },
        primarySchool: { type: String, default: '' },
        middleSchool: { type: String, default: '' },
        highSchool: { type: String, default: '' },
        higherSecondarySchool: { type: String, default: '' },
        undergraduateInstitute: { type: String, default: '' },
        postgraduateInstitute: { type: String, default: '' },
        experience: { type: String, default: '' },
        referenceeName: { type: String, default: '' },
        referencePhone: { type: String, default: '' },
    },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
